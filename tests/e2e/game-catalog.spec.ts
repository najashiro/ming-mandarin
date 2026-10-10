import { expect, test } from '@playwright/test';

const labels = ['Lección 1', 'Lección 2', 'Lección 3', 'Lección 4', 'Repaso general'];

test('el catálogo explica las habilidades y se adapta sin desbordes', async ({ page }, info) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/study/l1-l2-l3-l4/games');
    await expect(page.locator('.game-grid article')).toHaveCount(7);
    await expect(page.locator('.arcade-catalog')).toBeVisible();
    await expect(page.locator('#arena')).toBeHidden();
    await expect(page.locator('.game-catalog-heading')).toContainText('Repaso general');
    await expect(page.locator('[data-game="conversacion"]')).toContainText('completa el diálogo');
    await expect(page.locator('[data-game="conversacion"]')).not.toContainText('Habla con personajes');
    await expect(page.locator('.curriculum-nav')).not.toContainText(/1\s*\+/);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: info.outputPath('games-' + width + '.png'), fullPage: true });
    await page.screenshot({ path: info.outputPath('games-' + width + '-viewport.png') });
  }
});

test('abrir un juego aparta el catálogo, enfoca la actividad y devuelve el foco al salir', async ({ page }) => {
  await page.goto('/study/l3/games');
  for (const id of ['reto-mixto', 'escena-viva', 'hora']) {
    const launcher = page.locator('[data-game="' + id + '"]').getByRole('button', { name: /Jugar/ });
    await launcher.click();
    await expect(page.locator('.arcade-catalog')).toBeHidden();
    await expect(page.locator('#arena')).toBeFocused();
    await page.locator('#arena').getByRole('button', { name: 'Cerrar', exact: true }).click();
    await expect(page.locator('.arcade-catalog')).toBeVisible();
    await expect(launcher).toBeFocused();
  }
});

test('los dos juegos configurables usan las cinco opciones de estudio', async ({ page }) => {
  await page.goto('/study/l1-l2-l3-l4/games?game=reto-mixto');
  const content = page.locator('.mixed-challenge').getByRole('group', { name: 'Contenido', exact: true });
  await expect(content.getByRole('button')).toHaveText(labels);
  await expect(content.getByRole('button', { name: 'Repaso general' })).toHaveAttribute('aria-pressed', 'true');
  await content.getByRole('button', { name: 'Lección 4' }).click();
  await expect(content.locator('.mixed-selected-scope')).toHaveText('Lección 4');
  await page.goto('/study/l1-l2-l3-l4/games/vocabulary-mix');
  await expect(page.getByRole('combobox', { name: 'Contenido' }).locator('option')).toHaveText(labels);
});

test('los enlaces antiguos conservan su contenido sin ofrecer combinaciones como filtros', async ({ page }) => {
  await page.goto('/study/l1-l2-l3/games?game=reto-mixto');
  await expect(page.locator('.mixed-selected-scope')).toHaveText('Repaso hasta la lección 3');
  await expect(page.locator('.mixed-challenge').getByRole('group', { name: 'Contenido', exact: true }).getByRole('button')).toHaveText(labels.slice(0, 3));
  await page.goto('/study/l1-l2/games/vocabulary-mix');
  const selector = page.getByRole('combobox', { name: 'Contenido' });
  await expect(selector).toHaveValue('l1-l2');
  await expect(selector.locator('option:not([disabled])')).toHaveText(labels);
  await selector.selectOption('l4');
  await expect(page).toHaveURL(/\/study\/l4\/games\/vocabulary-mix$/);
});
