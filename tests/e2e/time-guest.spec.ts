import { expect, test } from '@playwright/test';

test('visitor can start the time challenge and choose to save the ranking after it ends', async ({ page }) => {
  await page.clock.install();
  await page.route('**/api/games/time', async route => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'signed-test-token' }) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rank: 1, ranking: [{ rank: 1, player_name: 'Ana', score: 0 }] }) });
    }
  });
  await page.route('**/api/auth/guest', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await page.goto('/study/l1/games?game=hora');
  await page.getByRole('button', { name: /Reto · 4 min/ }).click();
  await page.getByRole('button', { name: /Comenzar/ }).click();
  await expect(page.getByText('7:00')).toBeVisible();
  await page.clock.fastForward(420_000);
  await expect(page.getByRole('heading', { name: 'Tu resultado' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('¿Quieres guardar tu resultado en el ranking? Completa tu nombre.')).toBeVisible();
  await page.getByLabel('Nombre').fill('Ana');
  await page.getByRole('button', { name: 'Guardar en el ranking' }).click();
  await expect(page.getByText('Ranking guardado · Puesto #1')).toBeVisible();
});
