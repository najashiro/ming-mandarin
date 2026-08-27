import { expect, test } from '@playwright/test';

test('la portada navega a las secciones públicas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '你最近怎么样？' })).toBeVisible();
  await page.getByRole('link', { name: /Ver ruta completa/ }).click();
  await expect(page).toHaveURL(/\/lesson\/1$/);
  await page.getByRole('link', { name: /Nombre y apellido/ }).click();
  await expect(page.getByRole('heading', { name: 'Vocabulario auditable' })).toBeVisible();
});

test('el arcade y el audio sintético están disponibles sin cuenta', async ({ page }) => {
  await page.goto('/lesson/1/games');
  await expect(page.getByRole('heading', { name: '28 formas de practicar' })).toBeVisible();
  await expect(page.locator('.mobile-nav a[href="/lesson/1/games"]')).toContainText('Juegos');
  await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
  await page.getByRole('button', { name: /Jugar/ }).first().click();
  await expect(page.locator('#arena')).toContainText('Flashcards');
  await page.goto('/lesson/1/vocabulary');
  await expect(page.getByRole('button', { name: /Escuchar/ }).first()).toBeVisible();
});

test('el repaso fonético distingue escritura, sandhi y aspiración', async ({ page }) => {
  await page.goto('/lesson/1/pinyin');
  await expect(page.getByText('nǐ hǎo', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('ní hǎo', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Oír habla natural/ })).toBeVisible();
  await expect(page.getByText('El papel debe moverse.')).toBeVisible();
  await expect(page.getByText(/nunca una voz inglesa/)).toBeVisible();
});

test('el laboratorio Hanzi usa trazos reales, cuatro pestañas y práctica interactiva', async ({ page }) => {
  await page.goto('/lesson/1/hanzi');
  await expect(page.getByRole('heading', { name: 'Hanzi: forma, trazos y práctica' })).toBeVisible();
  await expect(page.getByRole('button', { name: /好 hǎo/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('6 trazos verificados')).toBeVisible();
  for (const tab of ['Aprender', 'Componentes', 'Trazos', 'Practicar']) await expect(page.getByRole('tab', { name: tab })).toBeVisible();
  await expect(page.getByTestId('hanzi-writer')).toBeVisible();

  await page.getByRole('tab', { name: 'Trazos' }).click();
  await expect(page.getByTestId('stroke-direction')).toHaveCount(6);
  await page.getByRole('button', { name: 'Paso a paso' }).click();
  await expect(page.getByText('Avance actual:')).toContainText('0 / 6');
  await page.getByRole('button', { name: 'Mostrar siguiente' }).click();
  await expect(page.getByText('Avance actual:')).toContainText('1 / 6');

  await page.getByRole('tab', { name: 'Practicar' }).click();
  await expect(page.getByRole('button', { name: 'Con guía' })).toHaveClass(/selected/);
  await expect(page.getByTestId('hanzi-writer')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Comenzar' })).toBeEnabled();
});

test('el laboratorio Hanzi no desborda en un teléfono', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Comprobación específica del proyecto móvil.');
  await page.goto('/lesson/1/hanzi?tab=Trazos');
  await expect(page.getByRole('tab', { name: 'Trazos' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test('las funciones persistentes solicitan un nombre', async ({ page, request }) => {
  await page.goto('/login?returnTo=/progress');
  await expect(page.getByRole('heading', { name: '¿Cómo quieres que te llamemos?' })).toBeVisible();
  await expect(page.getByLabel('Tu nombre')).toBeVisible();
  await expect(page.getByLabel('Correo')).toHaveCount(0);
  await expect(page.getByLabel('Contraseña')).toHaveCount(0);
  const progress = await request.get('/api/progress');
  expect(progress.status()).toBe(401);
  const start = await request.post('/api/exam/start');
  expect(start.status()).toBe(401);
});
