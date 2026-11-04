import { expect, test } from '@playwright/test';
import media from '../../data/lesson4-media.json' with { type: 'json' };
import sizes from '../../data/vocabulary-image-sizes.json' with { type: 'json' };
import vocabularyMedia from '../../data/vocabulary-media.json' with { type: 'json' };

test('loads a small static image first and still withdraws hidden approvals', async ({ page, request }) => {
  const image = media.find(entry => entry.wordId === 'v-电视')!;
  const responsive = sizes.entries[image.src as keyof typeof sizes.entries];
  let published = true;
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: published ? [image] : [] }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/study/l4/vocabulary?card=${encodeURIComponent(image.wordId)}`);
  const card = page.getByRole('article', { name: 'Ficha de 电视', exact: true });
  const photo = card.locator('img');
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute('loading', 'eager');
  await expect(photo).toHaveAttribute('fetchpriority', 'high');
  await expect.poll(() => photo.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  const currentSrc = await photo.evaluate((element: HTMLImageElement) => element.currentSrc);
  const variant = responsive.variants.find(entry => currentSrc.endsWith(entry.src));
  expect(variant).toBeDefined();
  const response = await request.get(currentSrc);
  expect(response.ok()).toBe(true);
  expect(response.headers()['cache-control']).toContain('immutable');
  expect((await response.body()).byteLength).toBe(variant!.bytes);
  expect(variant!.width).toBeLessThan(responsive.width);
  published = false;
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(photo).toHaveCount(0);
  await expect(card).toContainText('电视');
});

test('recovers the approved original when its small derivative cannot load', async ({ page }) => {
  const image = vocabularyMedia.find(entry => entry.wordId === 'v-老师')!;
  const responsive = sizes.entries[image.src as keyof typeof sizes.entries];
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: [image] }));
  for (const variant of responsive.variants) {
    await page.route(`**${variant.src}`, route => route.fulfill({ status: 404, body: '' }));
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/study/l1/vocabulary?card=${encodeURIComponent(image.wordId)}`);
  const card = page.getByRole('article', { name: 'Ficha de 老师', exact: true });
  const photo = card.locator('img');
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await expect.poll(() => photo.evaluate((element: HTMLImageElement) => new URL(element.currentSrc).pathname)).toBe(image.src);
  await expect(card.locator('source')).toHaveCount(0);
  await expect(card.locator('.word-pinyin')).toContainText('lǎoshī');
  await expect(card.locator('.vocabulary-translation')).not.toBeEmpty();
  await card.getByRole('button', { name: 'Ver ejemplo: 老师', exact: true }).click();
  await expect(card.locator('.vocabulary-example-text')).not.toBeEmpty();
  await expect(card.locator('.word-pinyin')).not.toBeEmpty();
  await expect(card.locator('.vocabulary-example-translation')).not.toBeEmpty();
});

test('keeps the word when both sources fail and retries after a fresh publication check', async ({ page }) => {
  const image = vocabularyMedia.find(entry => entry.wordId === 'v-老师')!;
  const responsive = sizes.entries[image.src as keyof typeof sizes.entries];
  await page.route('**/api/vocabulary/images', route => route.fulfill({ json: [image] }));
  for (const variant of responsive.variants) {
    await page.route(`**${variant.src}`, route => route.fulfill({ status: 404, body: '' }));
  }
  await page.route(`**${image.src}*`, route => route.fulfill({ status: 404, body: '' }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/study/l1/vocabulary?card=${encodeURIComponent(image.wordId)}`);
  const card = page.getByRole('article', { name: 'Ficha de 老师', exact: true });
  await expect(card).toBeVisible();
  await expect(card.locator('img')).toHaveCount(0);
  await expect(card.locator('.vocabulary-word')).toContainText('老师');
  await expect(card.locator('.word-pinyin')).toContainText('lǎoshī');
  await expect(card.locator('.vocabulary-translation')).not.toBeEmpty();
  for (const variant of responsive.variants) await page.unroute(`**${variant.src}`);
  await page.unroute(`**${image.src}*`);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(card.locator('img')).toBeVisible();
  await expect.poll(() => card.locator('img').evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
});

test('recovers publication checks after a stalled request without retaining hidden photos', async ({ page }) => {
  const image = vocabularyMedia.find(entry => entry.wordId === 'v-老师')!;
  let stalled = true;
  let requests = 0;
  // Install before navigation: an empty SSR list starts its first request
  // during hydration, so its abort timer must use this same clock.
  await page.clock.install();
  await page.route('**/api/vocabulary/images', route => {
    requests += 1;
    if (!stalled) return route.fulfill({ json: [image] });
    // Leave the request open to exercise the client's abort and subsequent retry.
  });
  await page.goto(`/study/l1/vocabulary?card=${encodeURIComponent(image.wordId)}`);
  const card = page.getByRole('article', { name: 'Ficha de 老师', exact: true });
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect.poll(() => requests).toBe(1);
  await page.clock.runFor(7100);
  await expect(card.locator('img')).toHaveCount(0);
  stalled = false;
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect.poll(() => requests).toBe(2);
  await expect(card.locator('img')).toBeVisible();
  await expect.poll(() => card.locator('img').evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
});
