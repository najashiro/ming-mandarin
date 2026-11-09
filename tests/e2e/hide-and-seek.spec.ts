import { test, expect, type Page } from '@playwright/test';

const wordToSpot: Record<string, string> = { 上边: 'above', 下边: 'below', 左边: 'left', 右边: 'right', 后边: 'behind', 前边: 'front' };
test('Escondites: voz real, texto chino pulsable y ayudas generales', async ({ page }) => {
  await page.goto('/study/l6/games?game=escondites');
  const recording = page.waitForResponse(response => response.url().includes('/audio/hide-and-seek/') && response.status() < 400);
  await page.getByRole('button', { name: /Vamos a buscar/ }).click();
  const response = await recording;
  expect((await (await page.request.get(response.url())).body()).length).toBeGreaterThan(1024);
  await expect(page.locator('.hide-clue-text .audio-button.playing')).toBeVisible();
  await expect(page.locator('.hide-chinese-pinyin')).toHaveCount(0);
  await expect(page.locator('.hide-chinese-spanish')).toHaveCount(0);
  await page.getByRole('button', { name: /Pinyin y traducción/ }).click();
  const chineseBlocks = await page.locator('.hide-chinese').count();
  await expect(page.locator('.hide-chinese-pinyin')).toHaveCount(chineseBlocks);
  await expect(page.locator('.hide-chinese-spanish')).toHaveCount(chineseBlocks);
  expect(await page.locator('.hide-game .font-hanzi').evaluateAll(elements => elements.every(el => el.closest('button.inline-text')))).toBe(true);
  const word = page.locator('.hide-location-options .audio-button').first();
  await word.click();
  await expect(word).toHaveClass(/playing/);
  await expect(page.locator('.hide-game .audio-button.playing')).toHaveCount(1);
  await expect(page.getByTestId('hide-score')).toHaveText('0 / 100');
  await expect(page.locator('.hide-spot:disabled')).toHaveCount(0);
  await page.getByRole('button', { name: /Pinyin y traducción/ }).click();
  await expect(page.locator('.hide-chinese-pinyin, .hide-chinese-spanish')).toHaveCount(0);
});
async function answer(page: Page) {
  const clue = await page.getByTestId('hide-clue').innerText();
  const word = clue.match(/它在桌子(上边|下边|左边|右边|后边|前边)。/)?.[1];
  expect(word).toBeTruthy();
  return wordToSpot[word!];
}
test('Escondites: catálogo, dos intentos, niveles, victoria y nueva aventura', async ({ page }, info) => {
  test.setTimeout(120_000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/study/l6/games');
  const card = page.locator('[data-game="escondites"]');
  await expect(card).toContainText('¿Dónde se escondió?');
  await card.getByRole('button', { name: /Jugar/ }).click();
  await expect(page.locator('.hide-intro')).toBeVisible();
  await page.getByRole('button', { name: /Vamos a buscar/ }).click();
  await expect(page.locator('.hide-spot')).toHaveCount(2);
  const target = await answer(page);
  const wrong = page.locator(`.hide-spot:not([data-spot="${target}"])`).first();
  await wrong.click();
  await expect(wrong).toBeDisabled();
  await expect(page.getByRole('status').filter({ hasText: 'Te queda un intento' })).toBeVisible();
  await page.locator(`[data-spot="${target}"]`).click();
  await expect(page.getByTestId('hide-score')).toHaveText('5 / 100');
  await expect(page.locator('.hide-found-animal')).toHaveCount(1);
  await page.getByRole('button', { name: /Siguiente escondite/ }).click();
  let missed = false;
  for (let round = 0; round < 22; round++) {
    if (await page.locator('.hide-victory').count()) break;
    const right = await answer(page);
    const choices = page.locator('.hide-spot');
    if (!missed && await choices.count() >= 4) {
      const previousScore = await page.getByTestId('hide-score').innerText();
      const wrongs = page.locator(`.hide-spot:not([data-spot="${right}"])`);
      await wrongs.nth(0).click(); await wrongs.nth(1).click();
      await expect(page.getByTestId('hide-score')).toHaveText(previousScore);
      await expect(page.locator('.hide-feedback')).toContainText('Un escondite muy astuto');
      await expect(page.locator(`[data-spot="${right}"] .hide-found-animal`)).toBeVisible();
      missed = true;
    } else await page.locator(`[data-spot="${right}"]`).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (!await page.locator('.hide-victory').count()) await page.locator('.hide-clue-panel > .hide-primary').click();
  }
  expect(missed).toBe(true);
  await expect(page.getByTestId('hide-score')).toHaveText('100 / 100');
  await expect(page.getByRole('heading', { name: '¡Maestro del escondite!' })).toBeVisible();
  await expect(page.locator('.hide-collection .is-unlocked')).toHaveCount(4);
  await page.screenshot({ path: info.outputPath('hide-victory.png'), fullPage: true });
  await page.getByRole('button', { name: /Jugar otra aventura/ }).click();
  await expect(page.getByTestId('hide-score')).toHaveText('0 / 100');
  await page.locator('#arena').getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(card.getByRole('button', { name: /Jugar/ })).toBeFocused();
  expect(errors).toEqual([]);
});

test('Escondites: enlace directo, teclado, ayudas y móvil sin desbordes', async ({ page }, info) => {
  await page.goto('/study/l6/games?game=escondites');
  await page.getByRole('button', { name: /Vamos a buscar/ }).click();
  const target = await answer(page);
  const spot = page.locator(`[data-spot="${target}"]`);
  await spot.focus(); await page.keyboard.press('Enter');
  await expect(page.getByTestId('hide-score')).toHaveText('10 / 100');
  await page.getByRole('button', { name: /Siguiente escondite/ }).click();
  await expect(page.locator('.hide-chinese-pinyin')).toHaveCount(0);
  await page.getByRole('button', { name: /Pinyin y traducción/ }).click();
  await expect(page.locator('.hide-clue-text .hide-chinese-pinyin')).toBeVisible();
  await expect(page.locator('.hide-clue-text .hide-chinese-spanish')).toBeVisible();
  await expect(page.locator('.hide-location-options .hide-chinese-pinyin')).toHaveCount(2);
  await page.getByRole('button', { name: /Abrir cuaderno/ }).click();
  await expect(page.locator('.hide-guide > .hide-chinese')).toHaveCount(6);
  await page.getByRole('button', { name: /Cerrar cuaderno/ }).click();
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    for (const button of await page.locator('.hide-spot').all()) {
      const rect = await button.boundingBox();
      expect(rect!.width).toBeGreaterThanOrEqual(44);
      expect(rect!.height).toBeGreaterThanOrEqual(44);
    }
    await page.screenshot({ path: info.outputPath(`hide-garden-${width}.png`), fullPage: true });
  }
  await page.getByRole('button', { name: 'Reiniciar', exact: true }).click();
  await page.getByRole('button', { name: 'Seguir jugando', exact: true }).click();
  await expect(page.getByTestId('hide-score')).toHaveText('10 / 100');
  await page.getByRole('button', { name: 'Reiniciar', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, empezar de nuevo' }).click();
  await expect(page.getByTestId('hide-score')).toHaveText('0 / 100');
  await page.goto('/study/l5/games?game=escondites');
  await expect(page.locator('.arcade-catalog')).toBeVisible();
  await expect(page.locator('[data-game="escondites"]')).toHaveCount(0);
});
