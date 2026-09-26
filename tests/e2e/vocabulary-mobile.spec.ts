import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test('touch search opens gaoxing in its own lesson even when the input blurs', async ({ page }) => {
  await page.goto('/study/l3/vocabulary?favorites=1');
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
  const search = page.getByRole('combobox', { name: 'Buscar', exact: true });
  await search.fill('gaoxing');
  const option = page.getByRole('option').filter({ hasText: '高兴' });
  await expect(option).toBeVisible();
  // Mobile keyboards may blur the input between touching and releasing a result.
  await option.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 1, clientX: 30, clientY: 30 });
  await search.evaluate(input => (input as HTMLInputElement).blur());
  await option.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 1, clientX: 30, clientY: 30 });
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue('l1');
  await expect(page.getByRole('article', { name: 'Ficha de 高兴', exact: true })).toBeInViewport();
  await expect(search).toHaveValue('高兴');
  await expect(page.locator('.vocabulary-card')).toHaveCount(1);
  await expect(page).not.toHaveURL(/favorites=/);
  await page.reload();
  await expect(page.getByRole('article', { name: 'Ficha de 高兴', exact: true })).toBeInViewport();
  await expect(page.locator('.vocabulary-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.vocabulary-card')).toHaveCount(24);
});

test('a mobile tap selects a global suggestion', async ({ page }) => {
  await page.goto('/study/l3/vocabulary');
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
  await page.getByRole('combobox', { name: 'Buscar', exact: true }).fill('gaoxing');
  const box = await page.getByRole('option').filter({ hasText: '高兴' }).boundingBox();
  await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue('l1');
  await expect(page.getByRole('article', { name: 'Ficha de 高兴', exact: true })).toBeInViewport();
});

for (const width of [320, 390]) test(`long reverse examples grow and keep the next button inside at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/study/l3/vocabulary?q=猫');
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
  const card = page.getByRole('article', { name: 'Ficha de 猫', exact: true });
  await card.getByRole('button', { name: 'Ver ejemplo: 猫', exact: true }).click();
  const short = await card.boundingBox();
  const next = card.getByRole('button', { name: 'Otro ejemplo', exact: true });
  await next.click();
  await next.click();
  await expect(card.locator('.vocabulary-example-text')).toContainText('我有两只小猫');
  const long = await card.boundingBox();
  const button = await next.boundingBox();
  expect(long!.height).toBeGreaterThan(short!.height);
  expect(button!.y + button!.height).toBeLessThanOrEqual(long!.y + long!.height - 8);
  await next.click();
  await expect(card.locator('.vocabulary-example-text')).toHaveText('一只猫');
  await page.addStyleTag({ content: 'html { font-size:32px!important }' });
  await next.click();
  await next.click();
  const enlarged = await card.boundingBox();
  const enlargedButton = await next.boundingBox();
  expect(enlargedButton!.y + enlargedButton!.height).toBeLessThanOrEqual(enlarged!.y + enlarged!.height - 8);
});
