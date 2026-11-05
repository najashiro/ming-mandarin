import { expect, test } from '@playwright/test';

test('Hanzi: filtro local conserva la vista, la ficha y la búsqueda universal', async ({ page }) => {
  await page.goto('/study/l1/hanzi?character=好&tab=Trazos');
  const search = page.getByRole('combobox', { name: 'Busca por pinyin' });
  await expect(search).toBeEnabled();
  await search.fill('xian4');
  const result = page.getByRole('option').filter({ hasText: '现' });
  await expect(result).toHaveCount(1);
  const matches = await page.getByRole('option').allTextContents();
  const selector = page.getByRole('combobox', { name: 'Lección', exact: true });
  await expect(page.locator('.hanzi-picker-card').filter({ hasText: '现' })).toHaveCount(0);
  await selector.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({ y: scrollY, top: document.querySelector('.hanzi-character-picker')!.getBoundingClientRect().top }));
  await selector.selectOption('l4');
  await expect(page.locator('.hanzi-picker-card')).toHaveCount(54);
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '好');
  await expect(page.getByRole('tab', { name: 'Trazos', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(search).toHaveValue('xian4');
  expect(await page.getByRole('option').allTextContents()).toEqual(matches);
  await expect(page).toHaveURL(/\/study\/l1\/hanzi\?character=.*&tab=Trazos/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(before.y, 0);
  expect(await page.locator('.hanzi-character-picker').evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(before.top, 0);
  await result.click();
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '现');
  await expect(page.getByRole('tab', { name: 'Aprender', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(selector).toHaveValue('l4');
  await page.reload();
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '现');
});

test('Hanzi: ficha antes del selector y búsqueda sin títulos repetidos', async ({ page }, info) => {
  await page.goto('/study/l4/hanzi');
  await expect(page.getByRole('combobox', { name: 'Busca por pinyin' })).toBeVisible();
  await expect(page.getByText('BUSCADOR HANZI', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Busca por pinyin' })).toHaveCount(0);
  await expect(page.getByRole('group', { name: 'Unidad curricular' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Lo reconozco' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Aparece en' })).toHaveCount(0);
  await expect(page.locator('.hanzi-learn-panel')).toBeVisible();
  expect(await page.locator('#hanzi-lesson-scope option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))).toEqual(['l1', 'l2', 'l3', 'l4']);
  await expect(page.locator('.hanzi-picker-card').filter({ hasText: '分' }).locator('em')).toHaveText('minuto');
  expect(await page.locator('.hanzi-workspace').evaluate(element =>
    element.lastElementChild?.classList.contains('hanzi-character-picker'))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: info.outputPath('hanzi-learn.png'), fullPage: true });
});

test('Hanzi: caracteres de palabras y frases abren Aprender y enfocan la ficha', async ({ page }) => {
  await page.goto('/study/l4/hanzi?character=现&tab=Palabras%20y%20frases');
  const link = page.getByRole('link', { name: 'Abrir ficha Hanzi de 在', exact: true }).first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole('tab', { name: 'Aprender', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '在');
  await expect(page.locator('#hanzi-glyph-focus .hanzi-writer-target svg')).toHaveCount(1);
  await expect(page).toHaveURL(/focus=glyph/);
});

test('Hanzi: práctica conserva controles bajo la escritura en ambos modos', async ({ page }, info) => {
  await page.goto('/study/l4/hanzi?character=现&tab=Practicar');
  const stage = page.locator('.practice-panel .hanzi-writer-target');
  const controls = page.locator('.practice-panel .hanzi-controls');
  for (const mode of ['Con guía', 'Sin guía']) {
    await page.getByRole('button', { name: mode, exact: true }).click();
    const start = page.getByRole('button', { name: 'Comenzar', exact: true });
    await expect(start).toBeEnabled();
    await start.click();
    await expect(controls.getByRole('button', { name: 'Mantén para ver respuesta' })).toBeEnabled();
    const stageBox = await stage.boundingBox();
    const controlsBox = await controls.boundingBox();
    expect(controlsBox!.y).toBeGreaterThanOrEqual(stageBox!.y + stageBox!.height);
    await page.locator('.practice-panel').screenshot({ path: info.outputPath(`hanzi-practice-${mode}.png`) });
    await controls.getByRole('button', { name: 'Cancelar', exact: true }).click();
    await expect(controls.getByRole('button', { name: 'Cancelar', exact: true })).toBeDisabled();
  }
  await expect(page.getByText('Guía visible y pistas progresivas', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Cuadrícula sin contorno', { exact: true })).toHaveCount(0);
});

test('Hanzi: lecciones 1 y 4 conservan nombres chinos y la misma estructura de trazos', async ({ page }) => {
  for (const [scope, character] of [['l1', '好'], ['l4', '现']]) {
    await page.goto(`/study/${scope}/hanzi?character=${character}&tab=Trazos`);
    const strokes = page.locator('.stroke-name-list li');
    await expect(strokes.first()).toBeVisible();
    for (const stroke of await strokes.all()) {
      expect(await stroke.locator('b').textContent()).toMatch(/\p{Script=Han}/u);
      expect(await stroke.locator('span').last().textContent()).toMatch(/向/);
    }
    await expect(page.locator('.stroke-answer-layout > svg, .stroke-answer-layout svg').first()).toBeVisible();
  }
});


test('Hanzi: búsqueda compacta cambia carácter y lección sin saltos ni navegación', async ({ page }) => {
  await page.goto('/study/l1/hanzi?character=好&focus=glyph');
  const search = page.getByRole('combobox', { name: 'Busca por pinyin' });
  await expect(search).toBeEnabled();
  await expect(page.locator('.hanzi-learn-panel canvas, .hanzi-learn-panel svg').first()).toBeVisible();
  await expect(search).toHaveAttribute('placeholder', 'Busca por pinyin · Ej.: hao, hǎo o hao3');
  await expect(page.locator('.hanzi-summary-panel .hanzi-character-hero')).toHaveCount(1);
  await expect(page.locator('.hanzi-character-hero .eyebrow, .hanzi-character-hero .hanzi-character-meta')).toHaveCount(0);
  await search.fill('xian4');
  const result = page.getByRole('option').filter({ hasText: '现' });
  await expect(result).toBeVisible();
  await page.evaluate(() => {
    const state = window as typeof window & { scrollSamples: number[] };
    state.scrollSamples = [scrollY];
    const until = performance.now() + 1200;
    const sample = () => { state.scrollSamples.push(scrollY); if (performance.now() < until) requestAnimationFrame(sample); };
    requestAnimationFrame(sample);
  });
  const navigations: string[] = [];
  page.on('request', request => { if (request.isNavigationRequest()) navigations.push(request.url()); });
  await result.click();
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '现');
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue('l4');
  await expect(page.locator('.hanzi-picker-card.selected')).toContainText('现');
  await expect(page.locator('.hanzi-learn-panel')).toBeVisible();
  await page.waitForTimeout(1250);
  const movement = await page.evaluate(() => {
    const samples = (window as typeof window & { scrollSamples: number[] }).scrollSamples;
    return Math.max(...samples) - Math.min(...samples);
  });
  expect(movement).toBeLessThanOrEqual(1);
  expect(navigations).toEqual([]);
  await page.getByRole('tab', { name: 'Trazos', exact: true }).click();
  await expect(page.locator('.strokes-panel .hanzi-character-meta')).toContainText('trazos');
});
