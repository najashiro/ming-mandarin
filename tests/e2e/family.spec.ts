import { mkdirSync } from 'node:fs';
import { expect, test, type Locator, type Page } from '@playwright/test';

async function startReto(page: Page, random: number) {
  await page.addInitScript((value) => { Math.random = () => value; }, random);
  await page.goto('/study/l1-l2-l3/games');
  await page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' }).getByRole('button', { name: /Jugar/ }).click();
  await page.locator('.mixed-challenge.setup').getByRole('button', { name: 'Comenzar reto' }).click();
  return page.locator('.mixed-challenge.playing');
}

async function expectFamilyOptions(challenge: Locator, targets: string[]) {
  const options = challenge.locator('.mixed-image-options button');
  await expect(options).toHaveCount(4);
  const actual = await options.locator('[data-family-target]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-family-target')));
  expect(new Set(actual)).toEqual(new Set(targets));
  const sources = await options.locator('img').evaluateAll((nodes) => nodes.map((node) => (node as HTMLImageElement).currentSrc));
  expect(new Set(sources).size).toBe(1);
  await expect(options.locator('.mixed-family-ring')).toHaveCount(4);
  await expect(options.locator('.mixed-family-halo')).toHaveCount(4);
  const layout = await options.evaluateAll((nodes) => nodes.map((node) => {
    const box = node.getBoundingClientRect();
    return { width: box.width, height: box.height, left: box.left, right: box.right };
  }));
  const viewport = await options.first().evaluate(() => window.innerWidth);
  expect(layout.every((box) => box.width > 110 && Math.abs(box.width - box.height) < 2)).toBe(true);
  expect(layout.every((box) => box.left >= 0 && box.right <= viewport)).toBe(true);
}

test('abuelos paternos y maternos usan el mismo árbol y cuatro objetivos distintos', async ({ page }) => {
  const challenge = await startReto(page, 0.76);
  await expect(challenge.locator('.mixed-prompt-image [data-family-target]')).toHaveAttribute('data-family-target', 'nainai');
  await challenge.locator('.mixed-text-options button').filter({ hasText: '奶奶' }).click();
  await challenge.getByRole('button', { name: 'Continuar →' }).click();
  await expect(challenge.locator('.mixed-prompt-hanzi')).toHaveText('爷爷');
  await expectFamilyOptions(challenge, ['yeye', 'nainai', 'waigong', 'waipo']);
  if (process.env.CAPTURE_FAMILY === '1') {
    mkdirSync('tmp/family-proof', { recursive: true });
    const grid = challenge.locator('.mixed-image-options');
    await grid.screenshot({ path: 'tmp/family-proof/grandparents-grid-iphone.png' });
    for (const [filename, pair] of [
      ['yeye-vs-waigong-iphone.png', ['yeye', 'waigong']],
      ['nainai-vs-waipo-iphone.png', ['nainai', 'waipo']],
    ] as const) {
      await grid.evaluate((element, visibleTargets) => {
        const visible = new Set<string>(visibleTargets);
        for (const button of element.querySelectorAll('button')) {
          const target = button.querySelector('[data-family-target]')?.getAttribute('data-family-target');
          button.style.display = target && visible.has(target) ? '' : 'none';
        }
      }, pair);
      await grid.screenshot({ path: `tmp/family-proof/${filename}` });
    }
  }
});

test('hermanos se distinguen por objetivo y edad dentro de una sola familia', async ({ page }) => {
  const challenge = await startReto(page, 0.56);
  await expect(challenge.locator('.mixed-prompt-image [data-family-target]')).toHaveAttribute('data-family-target', 'gege');
  await challenge.locator('.mixed-text-options button').filter({ hasText: '哥哥' }).click();
  await challenge.getByRole('button', { name: 'Continuar →' }).click();
  await challenge.locator('.mixed-token-bank button').first().click();
  await challenge.getByRole('button', { name: 'Comprobar' }).click();
  await challenge.getByRole('button', { name: 'Continuar →' }).click();
  await expect(challenge.locator('.mixed-prompt-hanzi')).toHaveText('哥哥');
  await expectFamilyOptions(challenge, ['gege', 'jiejie', 'didi', 'meimei']);
  if (process.env.CAPTURE_FAMILY === '1') {
    mkdirSync('tmp/family-proof', { recursive: true });
    await challenge.locator('.mixed-image-options').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -160));
    await challenge.locator('.mixed-image-options').screenshot({ path: 'tmp/family-proof/siblings-grid-iphone.png' });
  }
});
