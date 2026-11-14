import { expect, test } from '@playwright/test';

for (const scope of ['l1', 'l2', 'l3', 'l4', 'l1-l2-l3-l4']) {
  test(`independent reading controls: ${scope}`, async ({ page }) => {
    await page.goto(`/study/${scope}/dialogues`);
    const pinyin = page.getByRole('checkbox', { name: 'Mostrar pinyin', exact: true });
    const spanish = page.getByRole('checkbox', { name: 'Mostrar traducción al español', exact: true });
    const turns = page.locator('.dialogue-turn');
    const chinese = turns.first().locator('.dialogue-turn-text');
    const romanization = turns.first().locator('p.dialogue-pinyin');
    const translation = turns.first().locator('.dialogue-spanish');
    await expect(pinyin).toBeChecked();
    await expect(spanish).not.toBeChecked();
    await expect(chinese).toBeVisible();
    await expect(romanization).toBeVisible();
    await expect(translation).toBeHidden();
    if (scope === 'l4') {
      await expect(turns).toHaveCount(27);
      await expect(translation).toHaveText('Lin Na, ¿qué vas a hacer mañana?');
    }
    await spanish.check();
    await expect(translation).toBeVisible();
    await expect(romanization).toBeVisible();
    await pinyin.uncheck();
    await expect(page.locator('.dialogue-reading-aids .pinyin-text:visible')).toHaveCount(0);
    await expect(translation).toBeVisible();
    await expect(chinese).toBeVisible();
    await spanish.uncheck();
    await expect(translation).toBeHidden();
    await expect(chinese).toBeVisible();
    await pinyin.check();
    await expect(romanization).toBeVisible();
    await expect(page.locator('.dialogue-text .dialogue-pinyin').first()).toBeVisible();
    await expect(page.locator('.dialogue-text .dialogue-spanish').first()).toBeHidden();
    await spanish.check();
    await expect(page.locator('.dialogue-text .dialogue-spanish').first()).toBeVisible();
  });
}

test('legacy lesson 1 has the same defaults', async ({ page }) => {
  await page.goto('/lesson/1/dialogues');
  await expect(page.getByRole('checkbox', { name: 'Mostrar pinyin', exact: true })).toBeChecked();
  await expect(page.locator('.dialogue-spanish').first()).toBeHidden();
  await page.getByRole('checkbox', { name: 'Mostrar traducción al español' }).check();
  await expect(page.locator('.dialogue-spanish').first()).toBeVisible();
});

test('Atrás desde Hanzi recupera el turno o la frase y sus ayudas de lectura', async ({ page }) => {
  const dialogues = '/study/l4/dialogues';
  await page.goto(dialogues);
  const pinyin = page.getByRole('checkbox', { name: 'Mostrar pinyin', exact: true });
  const spanish = page.getByRole('checkbox', { name: 'Mostrar traducción al español' });
  await pinyin.uncheck();
  await spanish.check();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));

  for (const row of [page.locator('.dialogue-turn').nth(16), page.locator('.dialogue-text article').first()]) {
    const glyph = row.getByRole('link', { name: /Abrir ficha de/ }).first();
    await glyph.evaluate(element => {
      window.scrollBy({ top: element.getBoundingClientRect().top - 220, behavior: 'instant' });
    });
    await expect(glyph).toBeInViewport();
    const initialTop = await glyph.evaluate(element => element.getBoundingClientRect().top);
    const character = await glyph.innerText();
    await glyph.click();
    await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', character);
    await expect(page.locator('#hanzi-detail-start')).toBeInViewport();
    await page.goBack();
    await expect(page).toHaveURL(url => url.pathname === dialogues);
    await expect.poll(async () => {
      const currentTop = await glyph.evaluate(element => element.getBoundingClientRect().top);
      return Math.abs(currentTop - initialTop);
    }).toBeLessThanOrEqual(3);
    await expect(pinyin).not.toBeChecked();
    await expect(spanish).toBeChecked();
  }

  const practiceGlyph = page.locator('.dialogue-text article').first().getByRole('link').first();
  const practiceTop = await practiceGlyph.evaluate(element => element.getBoundingClientRect().top);
  await page.goForward();
  await expect(page.locator('#hanzi-detail-start')).toBeInViewport();
  await page.goBack();
  await expect(spanish).toBeChecked();
  await expect.poll(() => practiceGlyph.evaluate((element, top) =>
    Math.abs(element.getBoundingClientRect().top - top), practiceTop)).toBeLessThanOrEqual(3);

  await page.goForward();
  await expect(page.locator('#hanzi-detail-start')).toBeInViewport();
  await page.goto(dialogues);
  await expect(pinyin).toBeChecked();
  await expect(spanish).not.toBeChecked();
  await expect(page.getByRole('heading', { name: 'Diálogos completos' })).toBeInViewport();
});
