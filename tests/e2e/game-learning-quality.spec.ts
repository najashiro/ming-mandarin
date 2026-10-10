import { expect, test, type Page } from '@playwright/test';

async function openGame(page: Page, id: string) {
  await page.goto('/study/l3/games');
  await page.locator(`[data-game="${id}"]`).getByRole('button', { name: /Jugar/ }).click();
  return page.locator('.new-game-shell');
}

test('Escena viva y Conversación permiten producir sin mostrar bloques de la solución', async ({ page }) => {
  for (const id of ['escena-viva', 'conversacion']) {
    const game = await openGame(page, id);
    await game.getByRole('button', { name: 'Producir', exact: true }).click();
    await expect(game.locator('.answer-blocks')).toHaveCount(0);
    await game.getByRole('textbox', { name: 'Tu respuesta', exact: true }).fill('我 家有四口人。');
    await game.getByRole('button', { name: id === 'escena-viva' ? 'Comprobar' : 'Responder', exact: true }).click();
    await expect(game.locator('.game-feedback.correct')).toBeVisible();
    await expect(game.getByRole('button', { name: 'Producir', exact: true })).toBeDisabled();
  }
});

test('Lectura y dictado piden escribir la respuesta en Producir', async ({ page }) => {
  let game = await openGame(page, 'historia-detective');
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  await expect(game.locator('.answer-blocks')).toHaveCount(0);
  await game.locator('.story-panels button').filter({ hasText: '我家有四口人' }).click();
  await game.getByRole('textbox', { name: 'Escribe la frase que lo demuestra' }).fill('我家有四口人。');
  await game.getByRole('button', { name: 'Presentar evidencia y respuesta' }).click();
  await expect(game.locator('.game-feedback.correct')).toBeVisible();

  game = await openGame(page, 'hanzi-lab');
  await game.getByRole('button', { name: 'Palabras', exact: true }).click();
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  await expect(game.locator('.answer-blocks')).toHaveCount(0);
  // First recommended L3 listening word in the existing curriculum.
  await game.getByRole('textbox', { name: 'Dictado en Hanzi' }).fill('家');
  await game.getByRole('button', { name: 'Comprobar dictado' }).click();
  await expect(game.locator('.game-feedback.correct')).toBeVisible();
});

test('Los bloques se conservan al seleccionar y retirar piezas, y evalúan el orden construido', async ({ page }) => {
  const game = await openGame(page, 'escena-viva');
  await game.getByRole('button', { name: 'Construir', exact: true }).click();
  const tray = game.locator('.answer-blocks .blocks-tray');
  const before = await tray.locator('button').allTextContents();
  const blocks = ['我家', '有', '四口人'];
  expect(before.join('')).not.toBe(blocks.join(''));
  await tray.getByRole('button', { name: blocks[0], exact: true }).first().click();
  await game.locator('.blocks-target').getByRole('button', { name: blocks[0], exact: true }).click();
  expect(await tray.locator('button').allTextContents()).toEqual(before);
  for (const block of blocks) await tray.getByRole('button', { name: block, exact: true }).and(tray.locator('button:enabled')).first().click();
  await game.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect(game.locator('.game-feedback.correct')).toBeVisible();
});

test('Hanzi muestra solo modalidades que cambian la tarea', async ({ page }) => {
  const game = await openGame(page, 'hanzi-lab');
  for (const mode of ['Audio', 'Significado']) {
    await game.getByRole('button', { name: mode, exact: true }).click();
    const choices = game.getByRole('navigation', { name: 'Forma de practicar' });
    await expect(choices.getByRole('button')).toHaveCount(2);
    await expect(choices.getByRole('button', { name: 'Reconocer', exact: true })).toBeVisible();
    await choices.getByRole('button', { name: 'Escribir de memoria', exact: true }).click();
    await expect(game.getByRole('button', { name: 'Escribir con dedo o ratón' })).toBeEnabled();
  }
  for (const mode of ['Radical', 'Componentes', 'Revelado', 'Escritura']) {
    await game.getByRole('button', { name: mode, exact: true }).click();
    await expect(game.getByRole('navigation', { name: 'Forma de practicar' })).toHaveCount(0);
  }
  await game.getByRole('button', { name: 'Palabras', exact: true }).click();
  await expect(game.getByRole('navigation', { name: 'Forma de practicar' }).getByRole('button')).toHaveCount(3);
});

test('Una sesión finita informa pendientes y permite volver a practicar sin respuestas residuales', async ({ page }) => {
  const game = await openGame(page, 'historia-detective');
  let attempts = 0;
  while (await game.locator('.story-game').count()) {
    expect(attempts++).toBeLessThan(8);
    await expect(game.getByRole('button', { name: 'Reconocer', exact: true })).toHaveAttribute('aria-pressed', 'true');
    // This introductory sentence is not evidence for any of the three questions
    // about family size, the father's profession and the absent sibling.
    await game.locator('.story-panels').getByRole('button', { name: '这是我家的照片。', exact: true }).click();
    await expect(game.locator('.game-feedback.incorrect')).toBeVisible();
    await game.getByRole('button', { name: 'Siguiente pista' }).click();
  }
  await expect(game.locator('.game-result')).toContainText('necesitan más práctica');
  await expect(game.locator('.game-result')).not.toContainText('consolidar');
  await game.getByRole('button', { name: 'Volver a practicar' }).click();
  await expect(game.locator('.game-feedback')).toHaveCount(0);
  await expect(game.locator('.story-panels button[aria-pressed="true"]')).toHaveCount(0);
  await expect(game.locator('.game-progress')).toContainText('1 / 3');
});

test('Cambiar de lección inicia una sesión con su propio contenido', async ({ page, isMobile }) => {
  const game = await openGame(page, 'escena-viva');
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  await game.getByRole('textbox', { name: 'Tu respuesta', exact: true }).fill('我家有四口人');
  await game.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect(game.locator('.game-feedback.correct')).toBeVisible();
  const scopes = page.getByRole('navigation', { name: 'Alcance de estudio' });
  if (isMobile) await scopes.getByRole('combobox', { name: 'Cambiar lección de estudio' }).selectOption('l1');
  else await scopes.getByRole('link', { name: 'Lección 1', exact: true }).click();
  await expect(page).toHaveURL(/\/study\/l1\/games$/);
  // Next may remount the whole page or retain Arcade; both must start fresh.
  if (!(await page.locator('.new-game-shell').isVisible())) await page.locator('[data-game="escena-viva"]').getByRole('button', { name: /Jugar/ }).click();
  const nextGame = page.locator('.new-game-shell');
  await expect(nextGame.locator('.game-feedback')).toHaveCount(0);
  await expect(nextGame.locator('.game-progress')).toContainText('1 / 3');
  await expect(nextGame.getByRole('button', { name: 'Reconocer', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(nextGame.locator('h3')).toHaveText('Preséntate como Ma Dawei.');
});
