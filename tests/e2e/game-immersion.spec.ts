import { expect, test, type Page, type Locator } from '@playwright/test';
import { getWorkbookQuestions } from '../../lib/workbook-games';
import { readFileSync } from 'node:fs';
const read = (name: string) => JSON.parse(readFileSync(`data/${name}.json`, 'utf8'));
const audioPaths = new Map<string, string[]>();
const normalize = (text: string) => text.replace(/[^\u3400-\u9fff]/g, '');
for (const name of ['pronunciation', 'mandarin-audio', 'lesson4-audio', 'lesson5-audio', 'game-audio', 'time-audio']) {
  for (const clip of read(name).clips) {
    const key = normalize(clip.input);
    audioPaths.set(key, [...audioPaths.get(key) ?? [], `/audio/${name === 'pronunciation' ? 'pinyin' : 'mandarin'}/${clip.file}`]);
  }
}
const birthdayModels: Record<string, string> = {
  'La fiesta de Lin Qiang': '十月二十五号。', 'Tu fecha de cumpleaños': '我的生日是八月二十三号。', 'Prepara la agenda': '明天十月三十一号。', 'El regalo de Lin Na': '我送他一个生日蛋糕。',
  'Llega el momento de felicitar': '祝你生日快乐！', 'La comida de cumpleaños': '一会儿大家吃寿面。', 'Termina con un brindis': '来，咱们干杯！', 'Descubre quién cumple años': '他就是我哥哥！',
};

const bank = new Map(getWorkbookQuestions('l1-l2-l3-l4-l5-l6').map(q => [q.id, q]));
const audioMatches = (text: string, paths: string[]) => paths.some(path => audioPaths.get(normalize(text))?.includes(path));
async function observeAudio(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    const state = { requested: [] as string[], played: [] as string[], active: [] as HTMLMediaElement[], maxActive: 0 };
    Object.assign(window, { gameAudioTest: state });
    HTMLMediaElement.prototype.play = function () {
      state.requested.push(new URL(this.src).pathname);
      this.addEventListener('playing', () => {
        state.played.push(new URL(this.src).pathname);
        state.active = state.active.filter(el => !el.paused && !el.ended);
        if (!state.active.includes(this)) state.active.push(this);
        state.maxActive = Math.max(state.maxActive, state.active.length);
      });
      return original.call(this);
    };
  });
}
async function expectPlayed(page: Page, text: string) {
  await expect.poll(async () => audioMatches(text, await page.evaluate(() => (window as unknown as { gameAudioTest: { played: string[] } }).gameAudioTest.played))).toBe(true);
}
async function support(feedback: Locator) {
  await expect(feedback.locator('.reinforcement-pinyin')).toBeHidden();
  await expect(feedback.locator('.reinforcement-translation')).toBeHidden();
  await feedback.getByRole('button', { name: 'Mostrar pinyin', exact: true }).click();
  await feedback.getByRole('button', { name: 'Mostrar traducción', exact: true }).click();
  await expect(feedback.locator('.reinforcement-pinyin')).toBeVisible();
  await expect(feedback.locator('.reinforcement-translation')).toBeVisible();
  const sizes = await feedback.evaluate(el => ['.feedback-hanzi', '.reinforcement-pinyin', '.reinforcement-translation'].map(selector => parseFloat(getComputedStyle(el.querySelector(selector)!).fontSize)));
  expect(sizes[0]).toBeGreaterThan(sizes[1]);
  expect(sizes[1]).toBeGreaterThan(sizes[2]);
}
async function workbook(page: Page, mode: string, lesson = 'l6') {
  await page.goto(`/study/${lesson}/games/workbook?mode=${mode}`);
  await page.getByRole('button', { name: 'Empezar a jugar' }).click();
  const id = await page.locator('.workbook-round').getAttribute('data-question-id');
  return bank.get(id!)!;
}

test.beforeEach(async ({ page }) => { await observeAudio(page); });

test('constructor: each tile speaks, the correct whole sentence plays, and support is optional', async ({ page }) => {
  const q = await workbook(page, 'order');
  for (const token of q.tokens!) {
    await page.locator('.workbook-token-tray button:enabled').filter({ hasText: new RegExp(`^${token}$`) }).first().click();
    await expectPlayed(page, token);
  }
  await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect(page.locator('.workbook-feedback.correct')).toBeVisible();
  await expectPlayed(page, q.answer);
  await support(page.locator('.workbook-feedback'));
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.locator('.workbook-feedback')).toHaveCount(0);
});

for (const correct of [true, false]) test(`complete: ${correct ? 'success' : 'error'} reinforces the complete sentence`, async ({ page }) => {
  const q = await workbook(page, 'complete');
  const chosen = correct ? q.answer : q.options!.find(x => x !== q.answer)!;
  await page.locator('.workbook-options button').filter({ has: page.getByText(chosen, { exact: true }) }).click();
  await expectPlayed(page, chosen);
  await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
  const feedback = page.locator(`.workbook-feedback.${correct ? 'correct' : 'incorrect'}`);
  await expect(feedback).toContainText(q.modelHanzi!);
  await expectPlayed(page, q.modelHanzi!);
  await support(feedback);
  await expect(feedback.locator('.reinforcement-pinyin')).toContainText(q.pinyin!);
  await expect(feedback.locator('.reinforcement-translation')).toHaveText(q.translation!);
});

test('connect: initial audio has a replay icon, chosen answers speak, wrong answers get feedback', async ({ page }) => {
  const q = await workbook(page, 'dialogue', 'l5');
  await expect.poll(async () => audioMatches(q.context!, await page.evaluate(() => (window as unknown as { gameAudioTest: { requested: string[] } }).gameAudioTest.requested))).toBe(true);
  const initial = page.locator('.workbook-context .audio-button');
  await expect(initial).toBeVisible();
  // Replay remains available even on browsers that block automatic sound.
  if (!(await initial.getAttribute('class'))?.includes('idle')) await initial.click();
  await initial.click();
  await expectPlayed(page, q.context!);
  const wrong = q.options!.find(x => x !== q.answer)!;
  await page.locator('.workbook-options button').filter({ has: page.getByText(wrong, { exact: true }) }).click();
  await expectPlayed(page, wrong);
  await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect(page.locator('.workbook-feedback.incorrect')).toContainText(q.answer);
  await expectPlayed(page, q.answer);
  await support(page.locator('.workbook-feedback'));
  expect(await page.evaluate(() => (window as unknown as { gameAudioTest: { maxActive: number } }).gameAudioTest.maxActive)).toBe(1);
});

for (const level of ['Reconocer', 'Construir', 'Producir']) test(`birthday: ${level} ends with spoken feedback and optional support`, async ({ page }) => {
  await page.goto('/study/l5/games');
  await page.locator('[data-game="cumpleanos"]').getByRole('button', { name: /Jugar/ }).click();
  const game = page.locator('.birthday-game');
  await game.getByRole('button', { name: level, exact: true }).click();
  const title = await game.locator('h3').innerText();
  const hanzi = birthdayModels[title];
  const row = { hanzi, tokens: read('lesson5-public').sentences.find((s: { hanzi: string }) => s.hanzi === hanzi)?.tokens ?? [hanzi.replace(/[。！]/g, '')] };
  if (level === 'Reconocer') {
    await game.locator('.dialogue-replies').getByRole('button', { name: row.hanzi, exact: true }).click();
    await expectPlayed(page, row.hanzi);
  } else if (level === 'Construir') {
    for (const token of row.tokens) {
      await game.locator('.blocks-tray button:enabled').filter({ hasText: new RegExp(`^${token}$`) }).first().click();
      await expectPlayed(page, token);
    }
  } else await game.getByRole('textbox', { name: 'Tu respuesta', exact: true }).fill(row.hanzi);
  const requestsBefore = await page.evaluate(() => (window as unknown as { gameAudioTest: { requested: string[] } }).gameAudioTest.requested.length);
  await game.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { gameAudioTest: { requested: string[] } }).gameAudioTest.requested.length)).toBeGreaterThan(requestsBefore);
  await expect(game.getByRole('status')).toContainText('¡Correcto!');
  await expectPlayed(page, row.hanzi);
  await support(game.getByRole('status'));
  if (level === 'Construir') await game.getByRole('status').screenshot({ path: test.info().outputPath('birthday-reinforcement.png') });
});

test('conversation: initial prompt, selected response and feedback audio work on L6', async ({ page }) => {
  await page.goto('/study/l6/games');
  await page.locator('[data-game="conversacion"]').getByRole('button', { name: /Jugar/ }).click();
  const game = page.locator('.conversation-game');
  const prompt = '你好，请问食堂在哪儿？';
  await expect.poll(async () => audioMatches(prompt, await page.evaluate(() => (window as unknown as { gameAudioTest: { requested: string[] } }).gameAudioTest.requested))).toBe(true);
  const target = '食堂在校门右边。你是新同学吗？';
  await game.locator('.dialogue-replies').getByRole('button', { name: target, exact: true }).click();
  await expectPlayed(page, target);
  const requestsBefore = await page.evaluate(() => (window as unknown as { gameAudioTest: { requested: string[] } }).gameAudioTest.requested.length);
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { gameAudioTest: { requested: string[] } }).gameAudioTest.requested.length)).toBeGreaterThan(requestsBefore);
  await expect(game.locator('.game-feedback.correct')).toBeVisible();
  await support(game.locator('.game-feedback'));
  await game.getByRole('button', { name: 'Continuar conversación' }).click();
  await expect(game.locator('.game-feedback')).toHaveCount(0);
});

test('failed tile audio can be retried without losing the constructed answer', async ({ page }) => {
  const q = await workbook(page, 'order', 'l1');
  await page.route('**/audio/**', route => route.abort());
  await page.getByRole('button', { name: `Añadir ${q.tokens![0]}`, exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reintentar audio', exact: true })).toBeVisible();
  await page.unrouteAll();
  await page.getByRole('button', { name: 'Reintentar audio', exact: true }).click();
  await expectPlayed(page, q.tokens![0]);
  await expect(page.locator('.workbook-target button')).toHaveCount(1);
});
