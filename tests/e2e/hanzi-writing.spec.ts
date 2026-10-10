import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const audioTargets = new Map<string, string>([
  ['mandarin-audio.json', '/audio/mandarin'],
  ['lesson4-audio.json', '/audio/mandarin'],
  ['pronunciation.json', '/audio/pinyin'],
].flatMap(([file, prefix]) => {
  const manifest = JSON.parse(readFileSync(new URL(`../../data/${file}`, import.meta.url), 'utf8')) as { clips: Array<{ file: string; input: string }> };
  return manifest.clips.map(clip => [`${prefix}/${clip.file}`, clip.input] as [string, string]);
}));

async function startAdvanced(page: Page, random = 0.5) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript((value) => {
    Math.random = () => value;
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      (window as Window & { __writingAudio?: string }).__writingAudio = this.src;
      return play.call(this);
    };
  }, random);
  await page.goto('/study/l1-l2-l3/games');
  await page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' }).getByRole('button', { name: /Jugar/ }).click();
  const setup = page.locator('.mixed-challenge.setup');
  await setup.getByRole('button', { name: /Avanzado/ }).click();
  await setup.getByRole('button', { name: 'Comenzar reto' }).click();
  const challenge = page.locator('.mixed-challenge.playing');
  // Follow the actual audio cue through its published manifest. Fixed RNG values
  // choose repeatable sessions, but corpus changes must not change our answer.
  await challenge.getByRole('button', { name: 'Escuchar audio de la pregunta' }).click();
  const source = await page.evaluate(() => (window as Window & { __writingAudio?: string }).__writingAudio);
  expect(source).toBeTruthy();
  const answer = audioTargets.get(new URL(source!).pathname)?.replace(/[^\p{Script=Han}]/gu, '');
  expect(answer, `Audio de pregunta publicado: ${source}`).toMatch(/^[\p{Script=Han}]{1,8}$/u);
  return { challenge, answer: answer! };
}

for (const [description, random, size] of [['un carácter', 0.765, 1], ['una palabra de dos caracteres', 0.338, 2], ['un carácter de varios componentes', 0.326, 1]] as const) {
  test(`Avanzado escribe ${description} a partir del audio real`, async ({ page }) => {
    const { challenge, answer } = await startAdvanced(page, random);
    const characters = [...answer];
    expect(characters).toHaveLength(size);
    await expect(challenge.locator('.hanzi-writing-count')).toHaveText(`Carácter 1 de ${characters.length}`);
    await expect(challenge.getByText(answer, { exact: true })).toHaveCount(0);
    for (const [index, character] of characters.entries()) {
      await drawReference(page, character);
      await challenge.getByRole('button', { name: /Comprobar/ }).click();
      if (index + 1 < characters.length) {
        await expect(challenge.locator('.hanzi-writing-count')).toHaveText(`Carácter ${index + 2} de ${characters.length}`);
        await expect(challenge.locator('.hanzi-writing-slots span').nth(index)).toHaveText(character);
      }
    }
    await expect(challenge.locator('.mixed-feedback.correct > strong')).toHaveText(answer);
  });
}

async function drawReference(page: Page, character: string) {
  const response = await page.request.get(`/hanzi-data/${encodeURIComponent(character)}.json`);
  expect(response.ok()).toBe(true);
  const data = await response.json() as { medians: Array<Array<[number, number]>> };
  const canvas = page.locator('.hanzi-writing-canvas');
  await canvas.scrollIntoViewIfNeeded();
  await canvas.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  for (const stroke of data.medians) {
    for (let index = 0; index < stroke.length; index += 1) {
      const [x, y] = stroke[index];
      const px = box!.x + Math.max(3, Math.min(box!.width - 3, x / 1024 * box!.width));
      const py = box!.y + Math.max(3, Math.min(box!.height - 3, (1 - y / 1024) * box!.height));
      await page.mouse.move(px, py);
      if (index === 0) await page.mouse.down();
    }
    await page.mouse.up();
  }
}

test('Avanzado escribe de memoria y avanza a una frase larga sin scroll horizontal', async ({ page }) => {
  const { challenge, answer } = await startAdvanced(page);
  expect([...answer]).toHaveLength(1);
  await expect(challenge.locator('.hanzi-writing-count')).toHaveText('Carácter 1 de 1');
  await expect(challenge.locator('.mixed-prompt')).toHaveText('Escucha y escribe la palabra en Hanzi.');
  await expect(challenge.getByText(answer, { exact: true })).toHaveCount(0);
  await expect(challenge.locator('.hanzi-writing-canvas')).toHaveCSS('touch-action', 'none');
  await drawReference(page, answer);
  await challenge.getByRole('button', { name: /Comprobar/ }).click();
  await expect(challenge.locator('.mixed-feedback.correct')).toBeVisible();
  await expect(challenge.locator('.mixed-feedback.correct > strong')).toHaveText(answer);
  await expect(challenge.locator('.mixed-hud-correct')).toContainText('1');
  await challenge.getByRole('button', { name: 'Continuar →' }).click();
  await expect(challenge.locator('.hanzi-writing-count')).toHaveText('Carácter 1 de 7');
  await expect(challenge.locator('.hanzi-writing-slots span')).toHaveCount(7);
  const layout = await page.evaluate(() => {
    const slots = [...document.querySelectorAll<HTMLElement>('.hanzi-writing-slots span')];
    return { rows: new Set(slots.map((slot) => Math.round(slot.getBoundingClientRect().top))).size, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  if (await page.evaluate(() => innerWidth < 650)) expect(layout.rows).toBeGreaterThan(1);
  expect(layout.overflow).toBe(false);
});

test('Avanzado conserva el dibujo fallido y el reintento asistido no cuenta como acierto independiente', async ({ page }) => {
  const { challenge, answer } = await startAdvanced(page);
  expect([...answer]).toHaveLength(1);
  const canvas = challenge.locator('.hanzi-writing-canvas');
  await canvas.scrollIntoViewIfNeeded();
  await canvas.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const box = await canvas.boundingBox();
  await page.mouse.move(box!.x + 15, box!.y + 35);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width - 15, box!.y + 35);
  await page.mouse.up();
  const image = await canvas.evaluate((element) => (element as HTMLCanvasElement).toDataURL());
  await challenge.getByRole('button', { name: /Comprobar/ }).click();
  await expect(challenge.getByText('❌ Revisa este carácter')).toBeVisible();
  await expect(challenge.locator('.hanzi-writing-correction strong')).toHaveText(answer);
  expect(await canvas.evaluate((element) => (element as HTMLCanvasElement).toDataURL())).toBe(image);
  const link = challenge.getByRole('link', { name: 'Ver Hanzi →' });
  const target = new URL((await link.getAttribute('href'))!, 'http://127.0.0.1:3000');
  expect(target.pathname).toMatch(/^\/study\/[^/]+\/hanzi$/);
  expect(target.searchParams.get('character')).toBe(answer);
  expect(target.searchParams.get('focus')).toBe('glyph');
  await expect(link).toHaveAttribute('target', '_blank');
  const popupPromise = page.waitForEvent('popup');
  await link.click();
  const popup = await popupPromise;
  await expect(popup.locator('#hanzi-glyph-focus .hanzi-writer-target svg')).toHaveCount(1);
  await expect(challenge.locator('.mixed-hud h2')).toHaveText('Ronda 1 / 10');
  await popup.close();
  await challenge.getByRole('button', { name: /Intentar nuevamente/ }).click();
  await expect(challenge.locator('.hanzi-writing-correction')).toHaveCount(0);
  await expect(challenge.getByRole('button', { name: /Comprobar/ })).toBeDisabled();
  await drawReference(page, answer);
  await challenge.getByRole('button', { name: /Comprobar/ }).click();
  await expect(challenge.locator('.mixed-feedback.incorrect > strong')).toHaveText(answer);
  await expect(challenge.locator('.mixed-hud-correct')).toContainText('0');
  await expect(challenge.locator('.mixed-hud-incorrect')).toContainText('1');
});
