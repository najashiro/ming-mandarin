import { test, expect } from '@playwright/test';
const root = '/study/l3/vocabulary';
async function ready(page: import('@playwright/test').Page, url = root) { await page.goto(url); await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true'); }
test('search variants, filters, IME, favorites and reverse survive reload', async ({ page }) => {
  await ready(page);
  const search = page.getByRole('combobox', { name: 'Buscar' });
  for (const query of ['宠物', 'chǒngwù', 'chongwu', 'chong wu', 'chong3wu4', 'mascota']) {
    await search.fill(query);
    await expect(page.getByRole('option', { name: /宠物/ })).toBeVisible();
  }
  await search.dispatchEvent('compositionstart');
  await search.press('Enter');
  await expect(search).toBeFocused();
  await search.dispatchEvent('compositionend');
  await search.press('ArrowDown');
  await search.press('Enter');
  const card = page.getByRole('article', { name: 'Ficha de 宠物', exact: true });
  await expect(card).toBeFocused();
  await card.getByRole('button', { name: 'Favorito: 宠物' }).click();
  await expect(card.getByRole('button', { name: 'Ver palabra: 宠物' })).toHaveCount(0);
  await card.getByRole('button', { name: 'Ver ejemplo: 宠物', exact: true }).click();
  await expect(card.getByText('你们家有宠物吗？')).toBeVisible();
  await page.reload();
  await expect(card.getByRole('button', { name: 'Favorito: 宠物' })).toHaveAttribute('aria-pressed', 'true');
  await expect(card.getByText('你们家有宠物吗？')).toBeVisible();
  await expect(card).toHaveClass(/is-reversed/);
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true }).locator('option')).toHaveText(['Lección 1', 'Lección 2', 'Lección 3']);
  await page.getByRole('button', { name: 'Solo favoritos', exact: true }).click();
  await expect(card).toBeVisible();
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l1');
  await expect(page.getByText('Sin resultados. Ajusta')).toBeVisible();
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l3');
  await expect(card).toBeVisible();

});
test('Mix keeps reveal, prevents leaks, saves one evaluation and finite retries', async ({ page }) => {
  await ready(page, `${root}?q=mascota&mode=mix&level=basic`);
  await page.getByRole('combobox', { name: 'Tipo de pista' }).selectOption('context');
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  const mix = page.getByRole('region', { name: 'Vocabulario Mix', exact: true });
  await expect(mix.getByRole('button', { name: 'Lo sé', exact: true })).toHaveCount(0);
  await expect(mix.getByText('chǒngwù', { exact: true })).toHaveCount(0);
  await expect(mix.getByRole('link')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect(mix.getByText('chǒngwù', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Lo sé', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  await page.getByRole('button', { name: 'No lo sé', exact: true }).dblclick();
  await expect(page.getByText(/1 palabras únicas · 1 respuestas autoevaluadas/)).toBeVisible();
  await expect(page.getByText(/1 palabras pendientes/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/1 palabras únicas · 1 respuestas autoevaluadas/)).toBeVisible();
});
test('Hanzi opens supported character in a new tab and keeps original state', async ({ page, context }) => {
  await ready(page, `${root}?q=mascota`);
  const link = page.locator('.vocabulary-word').getByRole('link', { name: 'Abrir ficha de 宠 (pestaña nueva)', exact: true });
  const [tab] = await Promise.all([context.waitForEvent('page'), link.click()]);
  await tab.waitForLoadState('domcontentloaded');
  await expect(tab).toHaveURL(/character=%E5%AE%A0/);
  await expect(tab.locator('.hanzi-workspace')).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Buscar' })).toHaveValue('mascota');
  await tab.close();
});
test('games registry links to the same Mix with scope', async ({ page }) => {
  await page.goto('/study/l2/games');
  await page.locator('[data-game="vocabulario-mix"]').getByRole('link', { name: 'Jugar' }).click();
  await expect(page).toHaveURL(/\/study\/l2\/vocabulary\?mode=mix/);
  await expect(page.getByRole('button', { name: 'Empezar', exact: true })).toBeVisible();
});
for (const width of [320, 375, 390, 430, 1280]) test(`layout and real screenshots at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, '/study/l2/vocabulary?q=米饭');
  await expect(page.locator('.vocabulary-card')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `docs/vocabulary-captures/${info.project.name}-${width}-catalog.png`, fullPage: true });
  await page.locator('.vocabulary-card-tools').getByRole('button', { name: /Ver ejemplo/ }).click();
  await page.screenshot({ path: `docs/vocabulary-captures/${info.project.name}-${width}-reverse.png`, fullPage: true });
  await page.getByRole('button', { name: 'Vocabulario Mix', exact: true }).click();
  await page.getByRole('combobox', { name: 'Tipo de pista' }).selectOption('image');
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.screenshot({ path: `docs/vocabulary-captures/${info.project.name}-${width}-mix.png`, fullPage: true });
  await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('compact controls ignore obsolete filters and keep audio beside Chinese', async ({ page }) => {
  await ready(page, '/study/l2/vocabulary?q=米饭&source=class_presentation&selection=new&level=basic');
  const card = page.getByRole('article', { name: 'Ficha de 米饭', exact: true });
  await expect(card).toBeVisible();
  await expect(page.getByText(/^(Alcance|Selección curricular|Contenido|Más filtros y preferencias|Procedencia|Escritura)$/)).toHaveCount(0);
  await expect(card.locator('.vocabulary-word-row .audio-button')).toHaveCount(1);
  const front = await card.evaluate(el => getComputedStyle(el).backgroundColor);
  await card.locator('.vocabulary-card-tools').getByRole('button', { name: /Ver ejemplo/ }).click();
  expect(await card.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(front);
  await expect(card.locator('.vocabulary-example-text .audio-button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Solo favoritos', exact: true }).click();
  await expect(page).not.toHaveURL(/source=|selection=|level=/);
});
