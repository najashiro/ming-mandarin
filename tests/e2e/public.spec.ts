import { expect, test } from '@playwright/test';

test('la portada navega a las secciones públicas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '从认识到家庭' })).toBeVisible();
  await page.getByRole('link', { name: /Ver ruta completa/ }).click();
  await expect(page).toHaveURL(/\/lesson\/1$/);
  await page.getByRole('link', { name: /Nombre y apellido/ }).click();
  await expect(page.getByRole('heading', { name: 'Nombre y apellido' })).toBeVisible();
  await expect(page.getByText('Vocabulario auditable')).toHaveCount(0);
  await expect(page.getByText(/Fuente|PDF p\./)).toHaveCount(0);
});

test('el arcade y el audio estático están disponibles sin cuenta', async ({ page }) => {
  await page.goto('/lesson/1/games');
  await expect(page.getByRole('heading', { name: '30 formas de practicar' })).toBeVisible();
  await expect(page.locator('.mobile-nav a[href="/study/l1-l2-l3/games"]')).toContainText('Juegos');
  await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('.game-grid article').nth(0).getByRole('heading')).toHaveText('Flashcards');
  await expect(page.locator('.game-grid article').nth(1).getByRole('heading')).toHaveText('Dictado');
  await expect(page.locator('.game-grid article').nth(2).getByRole('heading')).toHaveText('Escucha y reconoce');
  await page.getByRole('button', { name: /Jugar/ }).first().click();
  await expect(page.locator('#arena')).toContainText('Flashcards');
  await page.goto('/lesson/1/name');
  await expect(page.getByRole('button', { name: /Escuchar/ }).first()).toBeVisible();
});

test('L2, L3 y los repasos acumulativos conservan el alcance', async ({ page }) => {
  for (const [scope, heading, word] of [
    ['l2', '你是哪国人？', '美国'],
    ['l3', '你家有几口人？', '照片'],
    ['l1-l2', 'Repaso acumulativo L1 + L2', '饺子'],
    ['l1-l2-l3', 'Repaso acumulativo L1 + L2 + L3', '医生'],
  ] as const) {
    await page.goto(`/study/${scope}`);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await page.goto(`/study/${scope}/vocabulary`);
    await expect(page.getByText(word, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/Fuente|PDF p\./)).toHaveCount(0);
  }
});

test('Hanzi L2 usa audio estático y Dictado Hanzi está disponible', async ({ page }) => {
  await page.goto('/study/l2/hanzi');
  await expect(page.getByRole('heading', { name: 'Hanzi: forma, sonido y trazos' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Escuchar pronunciación de 早' })).toBeVisible();
  await expect(page.getByText(/voz IA|audio IA|voz china local|sin voz china/i)).toHaveCount(0);
  await page.goto('/study/l2/games');
  const card = page.locator('.game-grid article').filter({ hasText: 'Dictado Hanzi' });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: /Jugar/ }).click();
  await expect(page.getByRole('heading', { name: '¿Qué has escuchado?' })).toBeVisible();
});

test('las rutas acumulativas no desbordan en móvil', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Comprobación específica móvil.');
  await page.goto('/study/l1-l2-l3/hanzi');
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test('Escucha y reconoce no revela pistas antes de acertar', async ({ page }) => {
  await page.goto('/lesson/1/games');
  await page.locator('.game-grid article').nth(2).getByRole('button', { name: /Jugar/ }).click();
  await expect(page.getByRole('heading', { name: '¿Qué has escuchado?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Escuchar de nuevo' })).toBeVisible();
  await expect(page.locator('.listen-options button')).toHaveCount(4);
  await expect(page.locator('.listen-answer')).toHaveCount(0);
});

test('el repaso fonético distingue escritura, sandhi y aspiración', async ({ page }) => {
  await page.goto('/lesson/1/pinyin');
  await expect(page.getByText('nǐ hǎo', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('ní hǎo', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Oír habla natural/ })).toBeVisible();
  await expect(page.getByText('El papel debe moverse.')).toBeVisible();
  await expect(page.getByText('TECLADO TONAL')).toHaveCount(0);
  await expect(page.getByText(/voz china local|sin voz china|voz IA/i)).toHaveCount(0);
});

test('el laboratorio Hanzi usa trazos reales, cuatro pestañas y práctica interactiva', async ({ page }) => {
  await page.goto('/lesson/1/hanzi');
  await expect(page.getByRole('heading', { name: 'Hanzi: forma, trazos y práctica' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '0 / 52 estudiados' })).toBeVisible();
  await expect(page.getByRole('button', { name: /好 hǎo/ })).toHaveAttribute('aria-pressed', 'true');
  const pronunciation = page.getByRole('button', { name: 'Escuchar pronunciación de 好' });
  await expect(pronunciation).toBeVisible();
  await expect(pronunciation).toHaveAttribute('title', 'Escuchar 好');
  await page.getByRole('button', { name: /你 nǐ/ }).click();
  await expect(page.getByRole('button', { name: 'Escuchar pronunciación de 你' })).toBeVisible();
  await expect(page.locator('.hanzi-pronunciation-row .audio-button')).not.toHaveClass(/playing/);
  await page.getByRole('button', { name: /好 hǎo/ }).click();
  await expect(page.getByText('6 trazos verificados')).toBeVisible();
  for (const tab of ['Aprender', 'Componentes', 'Trazos', 'Practicar']) await expect(page.getByRole('tab', { name: tab })).toBeVisible();
  await expect(page.getByTestId('hanzi-writer')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ocultar carácter' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Animar' })).toHaveCount(0);

  await page.getByRole('tab', { name: 'Trazos' }).click();
  await expect(page.getByTestId('stroke-direction')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Respuesta' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Paso a paso' })).toHaveCount(0);
  await expect(page.getByText('1 · 撇点 · piědiǎn')).toBeVisible();

  await page.getByRole('tab', { name: 'Practicar' }).click();
  await expect(page.getByRole('button', { name: 'Con guía' })).toHaveClass(/selected/);
  await expect(page.getByRole('button', { name: 'Sin guía' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Examen' })).toHaveCount(0);
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
