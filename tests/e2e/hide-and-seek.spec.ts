import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('data/hide-and-seek-audio.json', 'utf8')) as { clips: { input: string; file: string; audioSrc?: string }[] };
const language = JSON.parse(readFileSync('data/hide-and-seek-language.json', 'utf8')) as {
  animals: Record<string, { hanzi: string; audioSrc: string }>;
  feedback: Record<string, { hanzi: string; audioSrc?: string }>;
};
const corpusRecordings = new Map([...Object.values(language.animals), ...Object.values(language.feedback)]
  .filter(item => 'audioSrc' in item && item.audioSrc)
  .map(item => [item.hanzi, item.audioSrc!]));
const wordToSpot: Record<string, string> = { 上边: 'above', 下边: 'below', 左边: 'left', 右边: 'right', 后边: 'behind', 前边: 'front' };
type AudioEvent = { type: 'play' | 'playing' | 'ended' | 'pause'; src: string };
type ObservedWindow = typeof window & { hideAudioEvents: AudioEvent[]; hideAudioElements: HTMLMediaElement[] };

function recordingFor(text: string) {
  if (corpusRecordings.has(text)) return corpusRecordings.get(text)!;
  const clip = manifest.clips.find(item => item.input === text);
  expect(clip, `Grabación de ${text}`).toBeTruthy();
  return clip!.audioSrc ?? `/audio/hide-and-seek/${clip!.file}`;
}

// Observe the browser's real player, including Safari autoplay and cancellation.
async function observeAudio(page: Page) {
  await page.addInitScript(() => {
    const observed = window as ObservedWindow;
    observed.hideAudioEvents = [];
    observed.hideAudioElements = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!observed.hideAudioElements.includes(this)) {
        observed.hideAudioElements.push(this);
        for (const type of ['playing', 'ended', 'pause'] as const) {
          this.addEventListener(type, () => observed.hideAudioEvents.push({ type, src: new URL(this.currentSrc || this.src, location.href).pathname }), { capture: true });
        }
      }
      observed.hideAudioEvents.push({ type: 'play', src: new URL(this.src, location.href).pathname });
      return original.call(this);
    };
  });
}

async function audioSources(page: Page, type: AudioEvent['type'] = 'play') {
  return page.evaluate(eventType => (window as ObservedWindow).hideAudioEvents.filter(event => event.type === eventType).map(event => event.src), type);
}

async function waitForClip(page: Page, text: string, after = 0) {
  await expect.poll(async () => (await audioSources(page, 'playing')).slice(after), { timeout: 15_000 }).toContain(recordingFor(text));
}

async function questionText(page: Page) {
  return (await page.locator('.hide-question .audio-chinese').innerText()).trim();
}

async function clueTexts(page: Page) {
  return (await page.getByTestId('hide-clue').locator('.audio-chinese').innerText()).match(/它(?:不)?在桌子[^。]+。/g)!;
}

async function answer(page: Page) {
  const clue = await page.getByTestId('hide-clue').innerText();
  const word = clue.match(/它在桌子(上边|下边|左边|右边|后边|前边)。/)?.[1];
  expect(word).toBeTruthy();
  return wordToSpot[word!];
}

async function start(page: Page) {
  await page.goto('/study/l6/games?game=escondites', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Vamos a buscar/ }).click();
}

async function correct(page: Page) {
  const audioCount = (await audioSources(page, 'playing')).length;
  await page.locator(`[data-spot="${await answer(page)}"]`).click();
  await waitForClip(page, '对！', audioCount);
}

async function advance(page: Page) {
  const audioCount = (await audioSources(page, 'playing')).length;
  await page.getByRole('button', { name: /Siguiente escondite/ }).click();
  await waitForClip(page, await questionText(page), audioCount);
}

test.beforeEach(async ({ page }) => {
  // These tests verify play, without adding synthetic production analytics.
  await page.route('**/api/analytics/collect', route => route.fulfill({ status: 204, body: '' }));
});

test('Escondites: pregunta y pista automáticas, Help y ayudas globales sin repetir audio', async ({ page }) => {
  await observeAudio(page);
  await start(page);
  const question = await questionText(page);
  expect(question).toBe('兔在哪儿？');
  const sequence = [recordingFor(question), ...(await clueTexts(page)).map(recordingFor)];
  await expect.poll(() => audioSources(page), { timeout: 15_000 }).toEqual(sequence);
  await expect.poll(() => audioSources(page, 'ended'), { timeout: 15_000 }).toEqual(sequence);
  const response = await page.request.get(sequence[0]);
  expect(response.ok()).toBe(true);
  expect((await response.body()).length).toBeGreaterThan(1024);
  await expect(page.locator('.hide-location-options')).not.toBeVisible();
  await expect(page.locator('.hide-chinese-pinyin, .hide-chinese-spanish')).toHaveCount(0);
  await expect(page.locator('.hide-collection .audio-chinese')).toHaveText(['兔', '狗', '猫', '老鼠']);

  await page.getByRole('button', { name: 'Help', exact: true }).click();
  await expect(page.locator('.hide-location-options')).toBeVisible();
  await page.getByRole('button', { name: /Pinyin y Esp\./ }).click();
  const chineseBlocks = await page.locator('.hide-chinese').count();
  await expect(page.locator('.hide-chinese-pinyin')).toHaveCount(chineseBlocks);
  await expect(page.locator('.hide-chinese-spanish')).toHaveCount(chineseBlocks);
  await expect(page.locator('.hide-collection .hide-chinese-spanish')).toHaveText(['conejo', 'perro', 'gato', 'ratón']);
  expect(await audioSources(page)).toEqual(sequence);

  const word = page.locator('.hide-location-options .audio-button').first();
  const wordText = (await word.locator('.audio-chinese').innerText()).trim();
  const audioCount = (await audioSources(page, 'playing')).length;
  await word.click();
  await waitForClip(page, wordText, audioCount);
  await expect.poll(() => page.evaluate(() => (window as ObservedWindow).hideAudioElements.filter(audio => !audio.paused && !audio.ended).length)).toBe(1);
  await expect(page.getByTestId('hide-score')).toHaveText(/0\s*\/\s*100/);
  await expect(page.locator('.hide-spot:disabled')).toHaveCount(0);
  await page.getByRole('button', { name: /Pinyin y Esp\./ }).click();
  await expect(page.locator('.hide-chinese-pinyin, .hide-chinese-spanish')).toHaveCount(0);
  expect(await audioSources(page)).toEqual([...sequence, recordingFor(wordText)]);
  await page.getByRole('button', { name: 'Help', exact: true }).click();
  await expect(page.locator('.hide-location-options')).not.toBeVisible();
});

test('Escondites: nombres con audio, una sola voz, cancelación al avanzar y silencio al cerrar', async ({ page }) => {
  await observeAudio(page);
  await start(page);
  const firstQuestion = await questionText(page);
  await waitForClip(page, firstQuestion);
  for (const name of ['兔', '狗', '猫', '老鼠']) {
    const before = (await audioSources(page, 'playing')).length;
    await page.locator('.hide-collection .audio-button').filter({ has: page.locator('.audio-chinese', { hasText: new RegExp(`^${name}$`) }) }).click();
    await waitForClip(page, name, before);
    await expect.poll(() => page.evaluate(() => (window as ObservedWindow).hideAudioElements.filter(audio => !audio.paused && !audio.ended).length)).toBe(1);
  }
  await correct(page);
  await advance(page);
  await expect.poll(() => page.evaluate(() => (window as ObservedWindow).hideAudioElements.filter(audio => !audio.paused && !audio.ended).length)).toBe(1);
  await page.locator('#arena').getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(page.locator('.hide-active')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => (window as ObservedWindow).hideAudioElements.every(audio => audio.paused || audio.ended))).toBe(true);
  const playsAtClose = await audioSources(page);
  await expect(page.locator('.arcade-catalog')).toBeVisible();
  expect(await audioSources(page)).toEqual(playsAtClose);
});

test('Escondites: dos fallos terminan la aventura, muestran y pronuncian la solución; reinicio completo', async ({ page }, info) => {
  test.setTimeout(90_000);
  await observeAudio(page);
  await start(page);
  for (let round = 0; round < 3; round++) { await correct(page); await advance(page); }
  await expect(page.getByTestId('hide-score')).toHaveText(/30\s*\/\s*100/);
  await expect(page.locator('.hide-spot')).toHaveCount(4);
  const target = await answer(page);
  const positiveClue = (await clueTexts(page)).at(-1)!;
  await page.getByRole('button', { name: 'Help', exact: true }).click();
  const wrongs = page.locator(`.hide-spot:not([data-spot="${target}"])`);
  let before = (await audioSources(page, 'playing')).length;
  await wrongs.nth(0).click();
  await waitForClip(page, '不对。', before);
  await expect(wrongs.nth(0)).toBeDisabled();
  await expect(page.locator('.hide-lives')).toHaveAccessibleName(/1 .*restante/);
  await expect(page.getByRole('button', { name: 'Volver a intentarlo', exact: true })).toHaveCount(0);
  before = (await audioSources(page, 'playing')).length;
  const playsBeforeLoss = (await audioSources(page)).length;
  await wrongs.nth(1).click();
  await waitForClip(page, '不对。', before);
  await expect(page.locator('.hide-lives')).toHaveAccessibleName(/0 .*restantes/);
  await expect(page.locator(`[data-spot="${target}"] .hide-found-animal`)).toBeVisible();
  await expect(page.locator('.hide-spot:not(:disabled)')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Siguiente escondite/ })).toHaveCount(0);
  await expect(page.getByTestId('hide-score')).toHaveText(/30\s*\/\s*100/);
  await expect.poll(async () => (await audioSources(page)).slice(playsBeforeLoss), { timeout: 15_000 }).toEqual([recordingFor('不对。'), recordingFor(positiveClue)]);
  await page.locator('.hide-active').screenshot({ path: info.outputPath('hide-adventure-ended.png'), animations: 'disabled', style: '.topbar, .mobile-nav { visibility: hidden !important; }' });
  before = (await audioSources(page, 'playing')).length;
  await page.getByRole('button', { name: 'Volver a intentarlo', exact: true }).click();
  await waitForClip(page, '兔在哪儿？', before);
  await expect(page.getByTestId('hide-score')).toHaveText(/0\s*\/\s*100/);
  await expect(page.locator('.hide-scene-heading')).toContainText('Ronda 1');
  await expect(page.locator('.hide-lives')).toHaveAccessibleName(/2 .*restantes/);
  await expect(page.locator('.hide-spot')).toHaveCount(2);
  await expect(page.locator('.hide-spot:disabled, .hide-found-animal')).toHaveCount(0);
  await expect(page.locator('.hide-collection .is-unlocked')).toHaveCount(1);
  await expect(page.locator('.hide-collection')).not.toContainText('encontrado');
  await expect(page.locator('.hide-location-options')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Help', exact: true })).toHaveAttribute('aria-expanded', 'false');
});

test('Escondites: segundo intento suma cinco, cuatro animales del corpus y victoria', async ({ page }, info) => {
  test.setTimeout(120_000);
  await observeAudio(page);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await start(page);
  const target = await answer(page);
  const wrong = page.locator(`.hide-spot:not([data-spot="${target}"])`).first();
  await wrong.click();
  await waitForClip(page, '不对。');
  await expect(page.locator('.hide-lives')).toHaveAccessibleName(/1 .*restante/);
  await correct(page);
  await expect(page.getByTestId('hide-score')).toHaveText(/5\s*\/\s*100/);
  await expect(page.locator('.hide-found-animal')).toHaveCount(1);
  await advance(page);
  const questions = new Set([await questionText(page)]);
  let checkedMouse = false;
  for (let round = 0; round < 22; round++) {
    if (await page.locator('.hide-victory').count()) break;
    const question = await questionText(page);
    questions.add(question);
    if (question.includes('老鼠') && !checkedMouse) {
      const clips = (await clueTexts(page)).map(recordingFor);
      expect(clips).toHaveLength(2);
      await expect.poll(async () => (await audioSources(page)).slice(-3), { timeout: 15_000 }).toEqual([recordingFor(question), ...clips]);
      checkedMouse = true;
    }
    await correct(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (!await page.locator('.hide-victory').count()) await advance(page);
  }
  expect([...questions].sort()).toEqual(['兔在哪儿？', '狗在哪儿？', '猫在哪儿？', '老鼠在哪儿？'].sort());
  expect(checkedMouse).toBe(true);
  await expect(page.getByTestId('hide-score')).toHaveText(/100\s*\/\s*100/);
  await expect(page.getByRole('heading', { name: '¡Maestro del escondite!' })).toBeVisible();
  await expect(page.locator('.hide-collection .is-unlocked')).toHaveCount(4);
  await page.locator('.hide-active').screenshot({ path: info.outputPath('hide-victory.png'), animations: 'disabled', style: '.topbar, .mobile-nav { visibility: hidden !important; }' });
  await page.getByRole('button', { name: /Jugar otra aventura/ }).click();
  await expect(page.getByTestId('hide-score')).toHaveText(/0\s*\/\s*100/);
  await expect(page.locator('.hide-location-options')).not.toBeVisible();
  expect(errors).toEqual([]);
});

test('Escondites: HUD compacto, cartel de mesa, controles accesibles y teclado', async ({ page }, info) => {
  test.setTimeout(60_000);
  await start(page);
  await expect(page.locator('.hide-game')).not.toContainText('Pulsa la oración para volver a escucharla');
  await expect(page.locator('.hide-guide, .hide-guide-toggle, .hide-tools, .hide-audio-settings, .hide-level-label, .hide-clue-top, .hide-result-badge')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Reiniciar', exact: true })).toHaveCount(0);
  await expect(page.getByText('Voz automática', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Voz en mandarín generada por IA.', { exact: true })).toHaveCount(1);
  await expect(page.locator('.hide-footer')).toContainText('Voz en mandarín generada por IA.');
  await expect(page.locator('.hide-question')).toBeFocused();
  const target = await answer(page);
  let reachedWrongSpot = false;
  for (let tab = 0; tab < 10; tab++) {
    // macOS WebKit uses Option+Tab to include buttons in keyboard navigation.
    await page.keyboard.press(info.project.name === 'webkit-iphone' ? 'Alt+Tab' : 'Tab');
    const focusedSpot = page.locator('.hide-spot:focus');
    if (await focusedSpot.count() && await focusedSpot.getAttribute('data-spot') !== target) { reachedWrongSpot = true; break; }
  }
  expect(reachedWrongSpot, 'Tab desde la pregunta llega al jardín en orden de lectura').toBe(true);
  await page.keyboard.press('Enter');
  await expect(page.locator('.hide-lives')).toHaveAccessibleName(/1 .*restante/);
  await expect(page.locator(`[data-spot="${target}"]`)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('hide-score')).toHaveText(/5\s*\/\s*100/);
  await page.getByRole('button', { name: /Siguiente escondite/ }).click();
  // Test the dense six-place garden: the earlier two-place rounds cannot reveal
  // overlap between the attached table sign and the front/below hiding places.
  for (let round = 0; round < 5; round++) {
    await page.locator(`[data-spot="${await answer(page)}"]`).click();
    await page.getByRole('button', { name: /Siguiente escondite/ }).click();
  }
  await expect(page.locator('.hide-spot')).toHaveCount(6);
  for (const aids of [false, true]) {
    if (aids) await page.getByRole('button', { name: /Pinyin y Esp\./ }).click();
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const dashboard = (await page.locator('.hide-dashboard').boundingBox())!;
      expect(dashboard.height, 'Una sola línea de controles superiores').toBeLessThanOrEqual(65);
      const scene = (await page.locator('.hide-scene').boundingBox())!;
      const heading = (await page.locator('.hide-scene-heading').boundingBox())!;
      const help = (await page.getByRole('button', { name: 'Help', exact: true }).boundingBox())!;
      const sign = (await page.locator('.hide-scene-table-label').boundingBox())!;
      for (const rect of [heading, help, sign]) {
        expect(rect.x).toBeGreaterThanOrEqual(scene.x);
        expect(rect.x + rect.width).toBeLessThanOrEqual(scene.x + scene.width + 1);
        expect(rect.y).toBeGreaterThanOrEqual(scene.y);
        expect(rect.y + rect.height).toBeLessThanOrEqual(scene.y + scene.height + 1);
      }
      expect(sign.y - scene.y, 'El cartel nombra la mesa, no el cielo').toBeGreaterThan(scene.height * .45);
      expect(sign.y - scene.y).toBeLessThan(scene.height * .68);
      for (const button of await page.locator('.hide-spot, .hide-help-toggle, .hide-aids-toggle').all()) {
        const rect = (await button.boundingBox())!;
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      }
      for (const card of await page.locator('.hide-collection>div').all()) {
        const bounds = (await card.boundingBox())!;
        const audio = (await card.locator('.audio-button').boundingBox())!;
        expect(audio.x, 'Nombre y audio dentro de su tarjeta').toBeGreaterThanOrEqual(bounds.x);
        expect(audio.x + audio.width, 'Nombre y audio dentro de su tarjeta').toBeLessThanOrEqual(bounds.x + bounds.width + 1);
      }
      await page.locator('.hide-scene').scrollIntoViewIfNeeded();
      expect(await page.locator('.hide-spot:not(:disabled)').evaluateAll(elements => elements.every(element => {
        const rect = element.getBoundingClientRect();
        const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return top === null || element.contains(top);
      })), 'Ninguna etiqueta bloquea los escondites').toBe(true);
      expect(await page.locator('.hide-spot:not(:disabled) .hide-spot-pin').evaluateAll(pins => pins.every(pin => {
        const rect = pin.getBoundingClientRect();
        const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return top !== null && pin.closest('.hide-spot')!.contains(top);
      })), 'Los seis números del jardín se pueden pulsar sin obstáculos').toBe(true);
      if (width < 760) {
        const question = (await page.locator('.hide-question').boundingBox())!;
        const clue = (await page.locator('.hide-clue-text').boundingBox())!;
        expect(clue.y - question.y - question.height).toBeLessThanOrEqual(20);
        expect(clue.y + clue.height - question.y).toBeLessThanOrEqual(250);
      }
      await page.locator('.hide-active').screenshot({ path: info.outputPath(`hide-garden-${width}-${aids ? 'aids' : 'hanzi'}.png`), animations: 'disabled', style: '.topbar, .mobile-nav { visibility: hidden !important; }' });
    }
  }
  await page.goto('/study/l5/games?game=escondites', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.arcade-catalog')).toBeVisible();
  await expect(page.locator('[data-game="escondites"]')).toHaveCount(0);
});
