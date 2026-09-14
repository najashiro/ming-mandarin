import { expect, test } from '@playwright/test';

const directPath = '/study/l1-l2-l3/games?game=reto-mixto';

test('el icono comparte el enlace directo y la URL abre Reto Mixto', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (url: string) => { (window as typeof window & { __sharedRetoUrl?: string }).__sharedRetoUrl = url; },
    } });
  });
  await page.goto('/study/l1-l2-l3/games');
  await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
  const card = page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' });
  const share = card.getByRole('button', { name: 'Compartir Reto Mixto' });
  await expect(share).toHaveAttribute('data-share-path', directPath);
  await share.click();
  await expect(card.getByRole('status')).toHaveText('Enlace copiado');
  expect(await page.evaluate(() => (window as typeof window & { __sharedRetoUrl?: string }).__sharedRetoUrl)).toBe(`http://localhost:3000${directPath}`);

  await page.goto(directPath);
  await expect(page.locator('.mixed-challenge.setup')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Configura tu sesión' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
});

test('el icono usa la hoja nativa de compartir cuando está disponible', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => {
      (window as typeof window & { __sharedRetoData?: ShareData }).__sharedRetoData = data;
    } });
  });
  await page.goto('/study/l1-l2-l3/games');
  await page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' }).getByRole('button', { name: 'Compartir Reto Mixto' }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __sharedRetoData?: ShareData }).__sharedRetoData?.url)).toBe(`http://localhost:3000${directPath}`);
});
