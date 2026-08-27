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
  await expect(page.getByRole('heading', { name: '0 / 52 estudiados' })).toBeVisible();
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

test('los filtros Hanzi siguen las seis etapas curriculares y se pueden combinar', async ({ page, isMobile }) => {
  await page.addInitScript(() => localStorage.setItem('ming-hanzi-progress-v1', JSON.stringify({
    'c-好:writing': { attempts: 1, completed: 1, mistakes: 1, lastPracticedAt: '2026-08-27T12:00:00.000Z' },
  })));
  await page.goto('/lesson/1/hanzi');
  const grid = page.locator('.hanzi-picker-grid > button');
  for (const [stage, label, count] of [[1, '1 Fundamentos', 12], [2, '2 Saludos', 14], [3, '3 Presentarse', 13], [4, '4 Cortesía', 5], [5, '5 Estados', 4], [6, '6 ¿Cómo has estado?', 4]] as const) {
    if (isMobile) await page.locator('.stage-filter-mobile select').selectOption(String(stage));
    else await page.getByRole('button', { name: label, exact: true }).click();
    await expect(grid).toHaveCount(count);
  }
  if (isMobile) await page.locator('.stage-filter-mobile select').selectOption('2');
  else await page.getByRole('button', { name: '2 Saludos', exact: true }).click();
  await page.getByRole('button', { name: 'Repasar', exact: true }).click();
  await expect(grid).toHaveCount(1);
  await expect(page.getByRole('button', { name: /好 hǎo Repasar/ })).toBeVisible();
});

test('una evidencia de reconocimiento local persiste después de recargar', async ({ page }) => {
  await page.goto('/lesson/1/hanzi?character=一');
  await page.getByRole('button', { name: 'Lo reconozco' }).click();
  await expect(page.getByText(/guardado en este dispositivo/)).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Aprendiendo', exact: true }).click();
  await expect(page.locator('.hanzi-picker-grid > button')).toHaveCount(1);
  await expect(page.getByRole('button', { name: /一 yī Aprendiendo/ })).toBeVisible();
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
