import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('data/hide-and-seek-audio.json', 'utf8')) as { clips: { input: string; file: string }[] };

const wordToSpot: Record<string, string> = { 上边: 'above', 下边: 'below', 左边: 'left', 右边: 'right', 后边: 'behind', 前边: 'front' };
type AudioEvent = { type: 'play' | 'playing' | 'ended' | 'pause'; src: string };
type ObservedWindow = typeof window & { hideAudioEvents: AudioEvent[]; hideAudioElements: HTMLMediaElement[] };

function recordingFor(text: string) {
  const clip = manifest.clips.find(item => item.input === text);
  expect(clip, `Grabación de ${text}`).toBeTruthy();
  return `/audio/hide-and-seek/${clip!.file}`;
}

// Observe the browser's real media player; never replace playback with a mock.
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

async function waitForClip(page: Page, text: string) {
  const src = recordingFor(text);
  await expect.poll(async () => (await audioSources(page, 'playing')).at(-1)).toBe(src);
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

test('Escondites: pregunta y pista automáticas en orden, voz real y ayudas sin repetir audio', async ({ page }) => {
  await observeAudio(page);
  await page.goto('/study/l6/games?game=escondites');
  const recording = page.waitForResponse(response => response.url().includes('/audio/hide-and-seek/') && response.status() < 400);
  await page.getByRole('button', { name: /Vamos a buscar/ }).click();
  const response = await recording;
  expect((await (await page.request.get(response.url())).body()).length).toBeGreaterThan(1024);
  const question = await questionText(page);
  expect(question).not.toBe('它在哪儿？');
  expect(question).toContain('兔');
  const sequence = [recordingFor(question), ...(await clueTexts(page)).map(recordingFor)];
  await expect.poll(() => audioSources(page), { timeout: 15_000 }).toEqual(sequence);
  await expect.poll(() => audioSources(page, 'ended'), { timeout: 15_000 }).toEqual(sequence);
  await expect(page.locator('.hide-chinese-pinyin, .hide-chinese-spanish')).toHaveCount(0);
  await page.getByRole('button', { name: /Pinyin y traducción/ }).click();
  const chineseBlocks = await page.locator('.hide-chinese').count();
  await expect(page.locator('.hide-chinese-pinyin')).toHaveCount(chineseBlocks);
  await expect(page.locator('.hide-chinese-spanish')).toHaveCount(chineseBlocks);
  expect(await page.locator('.hide-game .font-hanzi').evaluateAll(elements => elements.every(el => el.closest('button.inline-text')))).toBe(true);
  expect(await audioSources(page)).toEqual(sequence);
  const word = page.locator('.hide-location-options .audio-button').first();
  const wordText = (await word.locator('.audio-chinese').innerText()).trim();
  await word.click();
  await waitForClip(page, wordText);
  await expect.poll(() => page.evaluate(() => (window as ObservedWindow).hideAudioElements.filter(audio => !audio.paused && !audio.ended).length)).toBe(1);
  await expect(page.getByTestId('hide-score')).toHaveText('0 / 100');
  await expect(page.locator('.hide-spot:disabled')).toHaveCount(0);
  await page.getByRole('button', { name: /Pinyin y traducción/ }).click();
  await expect(page.locator('.hide-chinese-pinyin, .hide-chinese-spanish')).toHaveCount(0);
  expect(await audioSources(page)).toEqual([...sequence, recordingFor(wordText)]);
});

test('Escondites: una sola voz, cancelación al avanzar y silencio al cerrar', async ({ page }) => {
  await observeAudio(page);
  await page.goto('/study/l6/games?game=escondites');
  await page.getByRole('button', { name: /Vamos a buscar/ }).click();
  const firstQuestion = await questionText(page);
  await waitForClip(page, firstQuestion);
  const word = page.locator('.hide-location-options .audio-button').first();
  const wordText = (await word.locator('.audio-chinese').innerText()).trim();
  await word.click();
  await waitForClip(page, wordText);
  await expect.poll(() => audioSources(page, 'ended')).toContain(recordingFor(wordText));
  expect(await audioSources(page)).toEqual([recordingFor(firstQuestion), recordingFor(wordText)]);

  await page.locator(`[data-spot="${await answer(page)}"]`).click();
  await waitForClip(page, '答对了！');
  await page.getByRole('button', { name: /Siguiente escondite/ }).click();
  const nextQuestion = await questionText(page);
  await waitForClip(page, nextQuestion);
  await expect.poll(() => page.evaluate(() => (window as ObservedWindow).hideAudioElements.filter(audio => !audio.paused && !audio.ended).length)).toBe(1);
  await page.locator('#arena').getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(page.locator('.hide-active')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => (window as ObservedWindow).hideAudioElements.every(audio => audio.paused || audio.ended))).toBe(true);
  const playsAtClose = await audioSources(page);
  await expect(page.locator('.arcade-catalog')).toBeVisible();
  expect(await audioSources(page)).toEqual(playsAtClose);
});

test('Escondites: feedback hablado, dos intentos, animales, victoria y nueva aventura', async ({ page }, info) => {
  test.setTimeout(120_000);
  await observeAudio(page);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/study/l6/games');
  const card = page.locator('[data-game="escondites"]');
  await expect(card).toContainText('¿Dónde se escondió?');
  await card.getByRole('button', { name: /Jugar/ }).click();
  await expect(page.locator('.hide-intro')).toBeVisible();
  await page.getByRole('button', { name: /Vamos a buscar/ }).click();
  await expect(page.locator('.hide-spot')).toHaveCount(2);
  const target = await answer(page);
  const wrong = page.locator(`.hide-spot:not([data-spot="${target}"])`).first();
  await wrong.click();
  await waitForClip(page, '答错了，再试试！');
  await expect(wrong).toBeDisabled();
  await expect(page.locator('.hide-feedback')).toContainText('Te queda un intento');
  await page.locator(`[data-spot="${target}"]`).click();
  await waitForClip(page, '答对了！');
  await expect(page.getByTestId('hide-score')).toHaveText('5 / 100');
  await expect(page.locator('.hide-found-animal')).toHaveCount(1);
  await page.getByRole('button', { name: /Siguiente escondite/ }).click();
  let missed = false;
  const questions = new Set([await questionText(page)]);
  for (let round = 0; round < 22; round++) {
    if (await page.locator('.hide-victory').count()) break;
    const question = await questionText(page);
    questions.add(question);
    await waitForClip(page, question);
    if (question.includes('龟')) {
      const clips = (await clueTexts(page)).map(recordingFor);
      expect(clips).toHaveLength(2);
      await expect.poll(async () => (await audioSources(page)).slice(-3), { timeout: 15_000 }).toEqual([recordingFor(question), ...clips]);
    }
    const right = await answer(page);
    const choices = page.locator('.hide-spot');
    if (!missed && await choices.count() >= 4) {
      const previousScore = await page.getByTestId('hide-score').innerText();
      const wrongs = page.locator(`.hide-spot:not([data-spot="${right}"])`);
      await wrongs.nth(0).click();
      await waitForClip(page, '答错了，再试试！');
      await wrongs.nth(1).click();
      await waitForClip(page, '答错了。');
      await expect(page.getByTestId('hide-score')).toHaveText(previousScore);
      await expect(page.locator(`[data-spot="${right}"] .hide-found-animal`)).toBeVisible();
      missed = true;
    } else {
      await page.locator(`[data-spot="${right}"]`).click();
      await waitForClip(page, '答对了！');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (!await page.locator('.hide-victory').count()) await page.locator('.hide-clue-panel > .hide-primary').click();
  }
  expect(missed).toBe(true);
  expect(questions.size).toBe(4);
  expect([...questions].some(question => question.includes('猫'))).toBe(true);
  await expect(page.getByTestId('hide-score')).toHaveText('100 / 100');
  await expect(page.getByRole('heading', { name: '¡Maestro del escondite!' })).toBeVisible();
  await expect(page.locator('.hide-collection .is-unlocked')).toHaveCount(4);
  await page.locator('.hide-active').screenshot({ path: info.outputPath('hide-victory.png'), animations: 'disabled' });
  await page.getByRole('button', { name: /Jugar otra aventura/ }).click();
  await expect(page.getByTestId('hide-score')).toHaveText('0 / 100');
  await waitForClip(page, await questionText(page));
  await page.locator('#arena').getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(card.getByRole('button', { name: /Jugar/ })).toBeFocused();
  expect(errors).toEqual([]);
});

test('Escondites: pantalla compacta, sin controles redundantes, teclado y ayudas', async ({ page }, info) => {
  test.setTimeout(60_000);
  await page.goto('/study/l6/games?game=escondites');
  await page.getByRole('button', { name: /Vamos a buscar/ }).click();
  await expect(page.locator('.hide-game')).not.toContainText('Pulsa la oración para volver a escucharla');
  await expect(page.locator('.hide-guide, .hide-guide-toggle, .hide-tools, .hide-audio-settings')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Reiniciar', exact: true })).toHaveCount(0);
  await expect(page.getByText('Voz automática', { exact: true })).toHaveCount(0);
  const disclosure = page.getByText('Voz en mandarín generada por IA.', { exact: true });
  await expect(disclosure).toHaveCount(1);
  await expect(page.locator('.hide-footer')).toContainText('Voz en mandarín generada por IA.');
  await expect(page.locator('.hide-question')).toBeFocused();
  const target = await answer(page);
  let reachedWrongSpot = false;
  for (let tab = 0; tab < 6; tab++) {
    // macOS WebKit uses Option+Tab to include buttons in keyboard navigation.
    await page.keyboard.press(info.project.name === 'webkit-iphone' ? 'Alt+Tab' : 'Tab');
    const focusedSpot = page.locator('.hide-spot:focus');
    if (await focusedSpot.count() && await focusedSpot.getAttribute('data-spot') !== target) {
      reachedWrongSpot = true;
      break;
    }
  }
  expect(reachedWrongSpot, 'Tab desde la pregunta llega al jardín en orden de lectura').toBe(true);
  await page.keyboard.press('Enter');
  await expect(page.locator('.hide-feedback')).toContainText('Te queda un intento');
  await expect(page.locator(`[data-spot="${target}"]`)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('hide-score')).toHaveText('5 / 100');
  await page.getByRole('button', { name: /Siguiente escondite/ }).click();
  await expect(page.locator('.hide-chinese-pinyin')).toHaveCount(0);
  await page.getByRole('button', { name: /Pinyin y traducción/ }).click();
  await expect(page.locator('.hide-clue-text .hide-chinese-pinyin')).toBeVisible();
  await expect(page.locator('.hide-clue-text .hide-chinese-spanish')).toBeVisible();
  await expect(page.locator('.hide-location-options .hide-chinese-pinyin')).toHaveCount(2);
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    for (const button of await page.locator('.hide-spot').all()) {
      const rect = await button.boundingBox();
      expect(rect!.width).toBeGreaterThanOrEqual(44);
      expect(rect!.height).toBeGreaterThanOrEqual(44);
    }
    if (width < 760) {
      const question = (await page.locator('.hide-question').boundingBox())!;
      const clue = (await page.locator('.hide-clue-text').boundingBox())!;
      expect(clue.y - question.y - question.height).toBeLessThanOrEqual(20);
      expect(clue.y + clue.height - question.y).toBeLessThanOrEqual(250);
    }
    await page.locator('.hide-active').screenshot({ path: info.outputPath(`hide-garden-${width}.png`), animations: 'disabled' });
  }
  await page.goto('/study/l5/games?game=escondites', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.arcade-catalog')).toBeVisible();
  await expect(page.locator('[data-game="escondites"]')).toHaveCount(0);
});
