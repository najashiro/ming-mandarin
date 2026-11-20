import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { emptyVocabularyState, vocabularyStorageKey } from '../../lib/vocabulary-storage';
import type { MixPresentation, MixSession } from '../../lib/vocabulary-review';
import type { VocabularyMediaEntry } from '../../lib/vocabulary-media';

const scope = 'l1-l2-l3-l4-l5-l6';
const path = `/study/${scope}/games/vocabulary-mix`;
const storageKey = vocabularyStorageKey('guest');
const imageFixtures = [...new Map(['vocabulary-media', 'corpus-completion-media'].flatMap(name =>
  JSON.parse(readFileSync(new URL(`../../data/${name}.json`, import.meta.url), 'utf8')) as VocabularyMediaEntry[])
  .map(entry => [entry.wordId, entry])).values()]
  .filter(entry => entry.status === 'approved' && ['v-猫', 'v-我'].includes(entry.wordId));

async function ready(page: Page) {
  await page.goto(path);
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
}

async function savedSession(page: Page): Promise<MixSession> {
  return page.evaluate(({ key, content }) => JSON.parse(localStorage.getItem(key)!).sessions[content], { key: storageKey, content: scope });
}

async function installRound(page: Page, deck: string[], presentation: MixPresentation = 'image') {
  // Isolate publication decisions from the local server's unavailable review DB.
  // Image bytes still load from the real static assets, including in the failure test.
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: imageFixtures }));
  const session: MixSession = {
    formatVersion: 2, id: 'mix-levels-image-round', userId: 'guest', scope,
    difficulty: 'hard', presentation, requestedSize: 10, actualSize: deck.length,
    deck, index: 0, revealed: false, paused: false, kind: 'normal', startedAt: 100, answers: [],
  };
  await page.addInitScript(({ key, value }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, value);
  }, { key: storageKey, value: JSON.stringify({ ...emptyVocabularyState(), sessions: { [scope]: session } }) });
}

test('starts on Medium and Sin imagen with a keyboard-accessible three-point selector', async ({ page }, info) => {
  await ready(page);
  const medium = page.getByRole('radio', { name: 'Medium', exact: true });
  await expect(medium).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Sin imagen', exact: true })).toBeChecked();
  await medium.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Hard', exact: true })).toBeChecked();
  await page.keyboard.press('ArrowLeft');
  await expect(medium).toBeChecked();
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const label of await page.locator('.vocabulary-mix-level-track label, .vocabulary-mix-presentation-options label').all()) {
      const box = await label.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }
    if (width === 390) await page.screenshot({ path: info.outputPath('mix-levels-mobile-setup.png'), fullPage: true });
  }
});

for (const difficulty of ['easy', 'medium', 'hard'] as const) {
  for (const presentation of ['image', 'hanzi'] as const) {
    test(`${difficulty} works with ${presentation} and survives pause and reload`, async ({ page }) => {
      await ready(page);
      await page.getByRole('radio', { name: difficulty[0].toUpperCase() + difficulty.slice(1), exact: true }).check();
      await page.getByRole('radio', { name: presentation === 'image' ? 'Con imagen' : 'Sin imagen', exact: true }).check();
      await page.getByRole('button', { name: 'Empezar', exact: true }).click();
      const question = page.locator('.vocabulary-mix-question');
      await expect(question).toHaveAttribute('data-presentation', presentation);
      await expect(question.locator('.word-pinyin, .pinyin-text, .vocabulary-translation')).toHaveCount(0);
      if (presentation === 'hanzi') await expect(question.locator('img')).toHaveCount(0);
      const original = await savedSession(page);
      expect(original).toMatchObject({ difficulty, presentation, actualSize: 10 });
      expect(new Set(original.deck).size).toBe(10);
      await page.getByRole('button', { name: 'Pausar', exact: true }).click();
      await page.reload();
      await expect(page.getByRole('heading', { name: 'Partida en pausa' })).toBeVisible();
      await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
      await expect(question).toHaveAttribute('data-presentation', presentation);
      expect((await savedSession(page)).deck).toEqual(original.deck);
    });
  }
}

test('image prompts show a safe cue without pinyin or translation; labeled images wait for reveal', async ({ page }, info) => {
  await installRound(page, ['v-猫', 'v-我']);
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const question = page.locator('.vocabulary-mix-question');
  const image = question.getByRole('img', { name: 'Pista visual', exact: true });
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  await expect(question.locator('.vocabulary-mix-prompt')).toHaveText('猫');
  await expect(question.locator('.word-pinyin, .pinyin-text, .vocabulary-translation')).toHaveCount(0);
  await question.screenshot({ path: info.outputPath('mix-safe-image-question.png') });
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect(page.locator('.vocabulary-card .word-pinyin')).toBeVisible();
  await expect(page.locator('.vocabulary-card .vocabulary-translation')).toBeVisible();
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  await expect(question.locator('.vocabulary-mix-prompt')).toHaveText('我');
  await expect(question.locator('img')).toHaveCount(0);
  await expect(question.getByText('Practica esta palabra sin imagen.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect(page.locator('.vocabulary-card img')).toBeVisible();
});

test('a failed safe image keeps the word playable without exposing the answer', async ({ page }) => {
  await installRound(page, ['v-猫']);
  let attemptedImageRequests = 0;
  await page.route('**/images/vocabulary/**', route => {
    attemptedImageRequests += 1;
    return route.abort();
  });
  await ready(page);
  await expect.poll(() => attemptedImageRequests).toBeGreaterThan(0);
  const question = page.locator('.vocabulary-mix-question');
  await expect(question.getByText('Practica esta palabra sin imagen.', { exact: true })).toBeVisible();
  await expect(question.locator('img')).toHaveCount(0);
  await expect(question.locator('.vocabulary-mix-prompt')).toHaveText('猫');
  await expect(page.getByRole('button', { name: 'Ver respuesta', exact: true })).toBeEnabled();
});

test('an unpublished image remains absent while its word is playable', async ({ page }) => {
  await installRound(page, ['v-猫']);
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: [] }));
  await ready(page);
  // Trigger the same refresh used when an administrator withdraws an image.
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  const question = page.locator('.vocabulary-mix-question');
  await expect(question.getByText('Practica esta palabra sin imagen.', { exact: true })).toBeVisible();
  await expect(question.locator('img')).toHaveCount(0);
  await expect(question.locator('.vocabulary-mix-prompt')).toHaveText('猫');
  await expect(page.getByRole('button', { name: 'Ver respuesta', exact: true })).toBeEnabled();
});

test('incorrect-word review retains the played settings while new rounds use the selected settings', async ({ page }) => {
  await installRound(page, ['v-猫']);
  await ready(page);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await page.getByRole('button', { name: 'No lo sabía', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Partida terminada' })).toBeVisible();
  await page.getByRole('radio', { name: 'Easy', exact: true }).check();
  await page.getByRole('radio', { name: 'Sin imagen', exact: true }).check();
  await page.getByRole('button', { name: 'Repasar incorrectas (1)', exact: true }).click();
  const review = await savedSession(page);
  expect(review).toMatchObject({ difficulty: 'hard', presentation: 'image', kind: 'review', deck: ['v-猫'] });
  expect(review.originResult).toMatchObject({ difficulty: 'hard', presentation: 'image' });
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  await page.getByRole('button', { name: 'Nueva partida', exact: true }).click();
  expect(await savedSession(page)).toMatchObject({ difficulty: 'easy', presentation: 'hanzi', kind: 'normal', actualSize: 10 });
});
