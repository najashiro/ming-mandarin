import { expect, test, type Page } from '@playwright/test';

async function openGame(page: Page, id: string) {
  await page.goto('/study/l3/games');
  await page.locator(`[data-game="${id}"]`).getByRole('button', { name: /Jugar/ }).click();
  return page.locator('.new-game-shell');
}

test('Conversación permite producir sin mostrar bloques ni la respuesta modelo', async ({ page }) => {
  const game = await openGame(page, 'conversacion');
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  await expect(game.locator('.answer-blocks')).toHaveCount(0);
  await expect(game.locator('.dialogue-stage')).not.toContainText('我家有四口人');
  await expect(game.getByRole('checkbox')).toHaveCount(0);
  await game.getByRole('textbox', { name: 'Tu respuesta', exact: true }).fill('我 家有四口人。');
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  await expect(game.locator('.game-feedback.correct')).toBeVisible();
  await expect(game.getByRole('button', { name: 'Producir', exact: true })).toBeDisabled();
});

test('Los bloques se conservan al retirar piezas y evalúan el orden construido', async ({ page }) => {
  const game = await openGame(page, 'conversacion');
  await game.getByRole('button', { name: 'Construir', exact: true }).click();
  const tray = game.locator('.answer-blocks .blocks-tray');
  const before = await tray.locator('button').allTextContents();
  const blocks = ['我家', '有', '四口人'];
  expect(before.join('')).not.toBe(blocks.join(''));
  await tray.getByRole('button', { name: blocks[0], exact: true }).first().click();
  await game.locator('.blocks-target').getByRole('button', { name: blocks[0], exact: true }).click();
  expect(await tray.locator('button').allTextContents()).toEqual(before);
  for (const block of blocks) await tray.getByRole('button', { name: block, exact: true }).and(tray.locator('button:enabled')).first().click();
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  await expect(game.locator('.game-feedback.correct')).toBeVisible();
});

test('La misión mantiene los turnos y distingue primer intento de recuperación', async ({ page }) => {
  const game = await openGame(page, 'conversacion');
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  await expect(game.locator('.dialogue-stage')).toContainText('你家有几口人');
  await game.getByRole('textbox', { name: 'Tu respuesta' }).fill('你好');
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  await expect(game.locator('.game-feedback.incorrect')).toBeVisible();
  await game.getByRole('button', { name: 'Continuar conversación' }).click();
  await expect(game.locator('.dialogue-stage')).toContainText('你爸爸做什么工作');
  await game.getByRole('textbox', { name: 'Tu respuesta' }).fill('我爸爸是医生');
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  await game.getByRole('button', { name: 'Continuar conversación' }).click();
  await expect(game.locator('.dialogue-stage')).toContainText('你家有几口人');
  await game.getByRole('textbox', { name: 'Tu respuesta' }).fill('我家有四口人');
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  await game.getByRole('button', { name: 'Continuar conversación' }).click();
  await expect(game.locator('.game-result')).toContainText('1 de 2 al primer intento');
  await expect(game.locator('.game-result')).toContainText('2 aciertos en 3 intentos');
});

test('Una sesión finita informa pendientes y reinicia sin respuestas residuales', async ({ page }) => {
  const game = await openGame(page, 'conversacion');
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  let attempts = 0;
  while (await game.getByRole('textbox', { name: 'Tu respuesta' }).count()) {
    expect(attempts++).toBeLessThan(7);
    await game.getByRole('textbox', { name: 'Tu respuesta' }).fill('你好');
    await game.getByRole('button', { name: 'Responder', exact: true }).click();
    await expect(game.locator('.game-feedback.incorrect')).toBeVisible();
    await game.getByRole('button', { name: 'Continuar conversación' }).click();
  }
  await expect(game.locator('.game-result')).toContainText('2 elementos necesitan más práctica');
  await game.getByRole('button', { name: 'Volver a practicar' }).click();
  await expect(game.locator('.game-feedback')).toHaveCount(0);
  await expect(game.getByRole('textbox', { name: 'Tu respuesta' })).toHaveValue('');
  await expect(game.locator('.game-progress')).toContainText('1 / 2');
});

test('Cambiar de lección inicia una misión con su propio contenido', async ({ page, isMobile }) => {
  const game = await openGame(page, 'conversacion');
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  await game.getByRole('textbox', { name: 'Tu respuesta' }).fill('我家有四口人');
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  const scopes = page.getByRole('navigation', { name: 'Alcance de estudio' });
  if (isMobile) await scopes.getByRole('combobox', { name: 'Cambiar lección de estudio' }).selectOption('l1');
  else await scopes.getByRole('link', { name: 'Lección 1', exact: true }).click();
  await expect(page).toHaveURL(/\/study\/l1\/games$/);
  if (!(await page.locator('.new-game-shell').isVisible())) await page.locator('[data-game="conversacion"]').getByRole('button', { name: /Jugar/ }).click();
  const nextGame = page.locator('.new-game-shell');
  await expect(nextGame.locator('.game-feedback')).toHaveCount(0);
  await expect(nextGame.locator('.game-progress')).toContainText('1 / 3');
  await expect(nextGame.getByRole('button', { name: 'Reconocer', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(nextGame.locator('.dialogue-stage')).toContainText('你好');
});

test('Hanzi conserva modalidades claras y retira las que revelaban la solución', async ({ page }) => {
  const game = await openGame(page, 'hanzi-lab');
  await expect(game.getByRole('button', { name: 'Revelado', exact: true })).toHaveCount(0);
  await expect(game.getByRole('button', { name: 'Componentes', exact: true })).toHaveCount(0);
  for (const mode of ['Audio', 'Significado']) {
    await game.getByRole('button', { name: mode, exact: true }).click();
    const choices = game.getByRole('navigation', { name: 'Forma de practicar' });
    await expect(choices.getByRole('button')).toHaveCount(2);
    await choices.getByRole('button', { name: 'Escribir de memoria', exact: true }).click();
    await expect(game.getByRole('button', { name: 'Escribir con dedo o ratón' })).toBeEnabled();
    await expect(game.locator('.hanzi-writer-target')).toHaveAttribute('aria-label', 'Área para escribir el carácter');
  }
});

test('El dictado permite escribir Hanzi y acepta pinyin numérico con tonos correctos', async ({ page }) => {
  let game = await openGame(page, 'hanzi-lab');
  await game.getByRole('button', { name: 'Palabras', exact: true }).click();
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  await expect(game.locator('.answer-blocks')).toHaveCount(0);
  await game.getByRole('textbox', { name: 'Dictado en Hanzi' }).fill('家');
  await game.getByRole('button', { name: 'Comprobar dictado' }).click();
  await expect(game.locator('.game-feedback.correct')).toBeVisible();
  game = await openGame(page, 'hanzi-lab');
  await game.getByRole('button', { name: 'Palabras', exact: true }).click();
  await game.getByRole('checkbox', { name: 'Dictar pinyin con tonos' }).check();
  await game.getByRole('textbox', { name: 'Dictado de pinyin' }).fill('JIA1');
  await game.getByRole('button', { name: 'Comprobar dictado' }).click();
  await expect(game.locator('.game-feedback.correct')).toBeVisible();
});

test('El audio oculto no filtra el Hanzi por tooltip ni al reproducir o fallar', async ({ page }) => {
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked', 'NotAllowedError')); });
  const game = await openGame(page, 'hanzi-lab');
  await game.getByRole('button', { name: 'Palabras', exact: true }).click();
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  const audio = game.locator('.hanzi-focal button').first();
  await expect(audio).not.toHaveAttribute('title', /家/);
  await expect(audio).not.toHaveAttribute('aria-label', /家/);
  await audio.click();
  await expect(game.locator('.hanzi-focal')).toContainText(/Reintentar|reintentar/);
  await expect(audio).not.toHaveAttribute('title', /家/);
  await expect(audio).not.toHaveAttribute('aria-label', /家/);
});

test('La ayuda cuenta aunque se cambie de nivel y otra misión empieza limpia', async ({ page }) => {
  const game = await openGame(page, 'conversacion');
  await game.getByRole('button', { name: 'Ver ayuda en español' }).click();
  await game.getByRole('button', { name: 'Producir', exact: true }).click();
  await expect(game.locator('.conversation-help')).toContainText('Este intento se registra con ayuda');
  await game.getByRole('textbox', { name: 'Tu respuesta' }).fill('我家有四口人');
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  await game.getByRole('button', { name: 'Continuar conversación' }).click();
  await expect(game.getByRole('button', { name: 'Ver ayuda en español' })).toBeEnabled();
  await game.getByRole('textbox', { name: 'Tu respuesta' }).fill('我爸爸是医生');
  await game.getByRole('button', { name: 'Responder', exact: true }).click();
  await game.getByRole('button', { name: 'Continuar conversación' }).click();
  await expect(game.locator('.game-result')).toContainText('1 acierto con ayuda');
  await game.getByRole('combobox', { name: 'Misión de conversación' }).selectOption('hermanas');
  await expect(game.locator('.game-result')).toHaveCount(0);
  await expect(game.locator('.game-feedback')).toHaveCount(0);
  await expect(game.locator('.game-progress')).toContainText('1 / 1');
  await expect(game.getByRole('button', { name: 'Ver ayuda en español' })).toBeEnabled();
});
