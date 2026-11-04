import { test, expect } from '@playwright/test';

test('L4: las actividades contienen tablas, lecturas, opciones e imágenes accesibles', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/study/l4/exercises');
  await expect(page.locator('.documentary-activity')).toHaveCount(62);

  const interview = page.locator('#L4-WB-04-02-03');
  await interview.locator(':scope > summary').click();
  await expect(interview.getByRole('table')).toBeVisible();
  await expect(interview.locator('tbody tr')).toHaveCount(10);
  await expect(interview).toContainText('起床');
  await interview.screenshot({ path: info.outputPath('workbook-interview-320.png') });

  const wordSearch = page.locator('#L4-WB-04-06-03');
  await wordSearch.locator(':scope > summary').click();
  await expect(wordSearch.locator('td')).toHaveCount(20);

  const reading = page.locator('#L4-WB-04-10-01');
  await reading.locator(':scope > summary').click();
  await expect(reading.locator('.documentary-passage')).toBeVisible();
  await expect(reading.locator('.documentary-passage .documentary-pinyin')).not.toBeEmpty();
  await reading.locator('.documentary-translation > summary').click();
  await expect(reading.locator('.documentary-translation > p')).toBeVisible();

  const listening = page.locator('#L4-WB-04-02-02');
  await listening.locator(':scope > summary').click();
  await expect(listening.getByRole('status')).toContainText('grabación original');
  await expect(listening.locator('.documentary-choices li')).toHaveCount(18);

  const illustrated = page.locator('#L4-WB-04-10-02');
  await illustrated.locator(':scope > summary').click();
  await expect(illustrated.getByRole('table')).toBeVisible();
  await expect(illustrated.getByRole('img', { name: /我们班: 19/ })).toBeVisible();
  await expect(illustrated.getByRole('img', { name: /他们班: 1/ })).toBeVisible();
  await illustrated.screenshot({ path: info.outputPath('workbook-premises-320.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('L4: conserva modelos y subrayados; la lección 5 mantiene sus actividades', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/study/l4/exercises');
  const model = page.locator('#L4-WB-04-05-02');
  await model.locator(':scope > summary').click();
  await expect(model.locator('.documentary-model-item')).toContainText('Ejemplo');
  await expect(model.locator('u').first()).toHaveText('很忙');
  const clocks = page.locator('#L4-BOOK-04-01-03');
  await clocks.locator(':scope > summary').click();
  await expect(clocks.getByRole('img')).toHaveCount(4);
  await clocks.screenshot({ path: info.outputPath('textbook-clocks.png') });
  const scene = page.locator('#L4-BOOK-04-18-01');
  await scene.locator(':scope > summary').click();
  await expect(scene.locator('.documentary-scene').nth(1)).toContainText('un bocadillo');
  await page.goto('/study/l5/exercises');
  const firstActivity = page.locator('.documentary-activity').first();
  await firstActivity.locator(':scope > summary').click();
  await expect(firstActivity.locator('.documentary-chinese').first()).toBeVisible();
  expect(errors).toEqual([]);
});
