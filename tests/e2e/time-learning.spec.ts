import { expect, test, type Page } from '@playwright/test';

async function openTimeGame(page: Page) {
  await page.clock.install();
  await page.addInitScript(() => {
    Math.random = () => 0;
    HTMLMediaElement.prototype.play = function () {
      window.setTimeout(() => this.dispatchEvent(new Event('ended')), 20);
      return Promise.resolve();
    };
  });
  await page.route('**/api/games/time', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ token: 'time-learning-test-token' }),
  }));
  await page.goto('/study/l4/games?game=hora');
  await expect(page.locator('.time-start')).toBeVisible();
}

async function addAnswer(page: Page, tokens: string[]) {
  for (const token of tokens) await page.getByRole('button', { name: `Añadir ${token}`, exact: true }).click();
}

test('la ayuda enseña un ejemplo fijo sin revelar el ejercicio actual', async ({ page }) => {
  await openTimeGame(page);
  await expect(page.getByRole('button', { name: /Practicar/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Comenzar/ }).click();
  await expect(page.locator('.time-clock')).toHaveAttribute('aria-label', 'Reloj 1:00');
  await page.getByRole('button', { name: 'Abrir ayuda del juego de la hora' }).click();
  const help = page.getByRole('dialog', { name: '帮助' });
  await expect(help.locator('.time-help-answer')).toContainText('Ejemplo · 9:30');
  await expect(help.locator('.time-help-answer')).toContainText('现在九点半');
  await expect(help.locator('.time-help-answer')).not.toContainText('现在一点');
  await help.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(page.locator('.time-timer')).toHaveText('∞');
  await expect(page.getByRole('button', { name: 'Abrir ayuda del juego de la hora' })).toBeFocused();
});

test('en el reto la ayuda informa del tiempo y no detiene el reloj', async ({ page }) => {
  await openTimeGame(page);
  await page.getByRole('button', { name: /Reto · 4 min/ }).click();
  await page.getByRole('button', { name: /Comenzar/ }).click();
  await page.getByRole('button', { name: 'Abrir ayuda del juego de la hora' }).click();
  const help = page.getByRole('dialog', { name: '帮助' });
  await expect(help).toContainText('El tiempo sigue corriendo mientras consultas la ayuda.');
  await page.clock.fastForward(30_000);
  await expect(page.locator('.time-timer')).toHaveText(/3:[0-3]\d/);
  await help.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await page.clock.fastForward(211_000);
  await expect(page.getByRole('heading', { name: 'Tu resultado', exact: true })).toBeVisible();
});

test('el reto conserva la corrección hasta Continuar, incluso al terminar el tiempo', async ({ page }) => {
  await openTimeGame(page);
  await page.getByRole('button', { name: /Reto · 4 min/ }).click();
  await page.getByRole('button', { name: /Comenzar/ }).click();
  await addAnswer(page, ['差']);
  await page.getByRole('button', { name: /Confirmar/ }).click();
  const correction = page.locator('.time-correction');
  await expect(correction).toContainText('Respuestas correctas');
  await expect(correction).toContainText('一点');
  await expect(correction.getByRole('button', { name: 'Escuchar 一点', exact: true })).toBeVisible();
  await page.clock.fastForward(2_000);
  await expect(correction).toBeVisible();
  await page.getByRole('button', { name: /Continuar/ }).click();
  await expect(correction).toHaveCount(0);
  await expect(page.locator('.time-answer')).toHaveAttribute('aria-label', 'Forma 1: vacía');
  await addAnswer(page, ['差']);
  await page.getByRole('button', { name: /Confirmar/ }).click();
  await page.clock.fastForward(241_000);
  await expect(correction).toContainText('Puedes revisar la respuesta antes de continuar a tu resultado.');
  await expect(page.locator('.time-timer')).toHaveText('0:00');
  await expect(page.locator('.time-result')).toHaveCount(0);
  await page.getByRole('button', { name: /Continuar/ }).click();
  await expect(page.getByRole('heading', { name: 'Tu resultado', exact: true })).toBeVisible();
  await expect(page.locator('.time-result')).toContainText('0 puntos');
});

test('Avanzado explica por qué dos variantes numéricas no son dos construcciones', async ({ page }) => {
  await openTimeGame(page);
  await page.getByRole('switch', { name: 'Modo avanzado' }).click();
  await page.getByRole('button', { name: /Comenzar/ }).click();
  await addAnswer(page, ['一', '点', '十', '五', '分']);
  await page.locator('.time-answer').nth(1).click();
  await addAnswer(page, ['一', '点', '十', '五']);
  await page.getByRole('button', { name: /Confirmar/ }).click();
  await expect(page.locator('.time-correction')).toContainText('Las dos respuestas son correctas, pero usan la misma forma.');
  await expect(page.locator('.time-correction')).toContainText('En el modo avanzado necesitas dos construcciones diferentes.');
  await expect(page.locator('.time-correction')).toContainText('一点一刻');
  await expect(page.locator('.time-game')).not.toContainText('HARD');
});
