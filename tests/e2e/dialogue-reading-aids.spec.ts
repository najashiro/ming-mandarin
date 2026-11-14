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

test('el cursor y el teclado revelan el tono de cada aparición de 谢', async ({ page, hasTouch }) => {
  test.skip(hasTouch, 'La interacción con el cursor se comprueba en escritorio.');
  await page.goto('/study/l1/dialogues');
  await page.getByRole('checkbox', { name: 'Mostrar pinyin', exact: true }).uncheck();
  const turn = page.locator('.dialogue-turn-text').filter({ hasText: '谢谢。你最近怎么样？' });
  const thanks = turn.getByRole('link', { name: 'Abrir ficha de 谢', exact: true });
  const tooltip = page.getByRole('tooltip');

  await thanks.first().hover();
  await expect(tooltip).toHaveText(/^xiè$/i);
  await thanks.nth(1).hover();
  await expect(tooltip).toHaveText(/^xie$/i);
  await turn.getByText('。', { exact: true }).hover();
  await expect(tooltip).toBeHidden();

  await thanks.first().focus();
  await page.keyboard.press('Tab');
  await expect(thanks.nth(1)).toBeFocused();
  await expect(tooltip).toHaveText(/^xie$/i);
  await page.keyboard.press('Shift+Tab');
  await expect(thanks.first()).toBeFocused();
  await expect(tooltip).toHaveText(/^xiè$/i);
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  await expect(thanks.first()).toBeFocused();
});

test('las frases para practicar y la lección original permiten consultar un carácter', async ({ page, hasTouch }) => {
  test.skip(hasTouch, 'Comprueba el cursor en ambas vistas.');
  for (const route of ['/study/l1/dialogues', '/lesson/1/dialogues']) {
    await page.goto(route);
    await page.getByRole('checkbox', { name: 'Mostrar pinyin', exact: true }).uncheck();
    const greeting = page.locator('.dialogue-text article').first();
    await greeting.getByText('好', { exact: true }).hover();
    await expect(page.getByRole('tooltip')).toHaveText(/^hǎo$/i);
    await expect(greeting.locator('.dialogue-pinyin')).toBeHidden();
  }
});

test('en pantalla táctil se puede consultar un carácter y luego abrir su ficha', async ({ page, hasTouch, browserName }) => {
  test.skip(!hasTouch, 'Requiere pantalla táctil.');
  await page.goto('/study/l1/dialogues');
  await page.getByRole('checkbox', { name: 'Mostrar pinyin', exact: true }).uncheck();
  const glyph = page.locator('.dialogue-turn-text').first().getByRole('link', { name: 'Abrir ficha de 好', exact: true });
  await glyph.scrollIntoViewIfNeeded();
  const bounds = await glyph.boundingBox();
  if (!bounds) throw new Error('El carácter no está visible');
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  const tooltip = page.getByRole('tooltip');

  if (browserName === 'chromium') {
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await expect(tooltip).toHaveText(/^hǎo$/i);
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await session.detach();
  } else {
    // Playwright solo expone el toque corto nativo en WebKit.
    const touch = { pointerType: 'touch', pointerId: 4, isPrimary: true, clientX: x, clientY: y };
    await glyph.dispatchEvent('pointerdown', { ...touch, button: 0, buttons: 1 });
    // WebKit puede enviar movimientos del ratón mientras el dedo sigue pulsando.
    await glyph.dispatchEvent('pointermove', { pointerType: 'mouse', pointerId: 1, clientX: x - 20, clientY: y });
    await expect(tooltip).toHaveText(/^hǎo$/i);
    await glyph.dispatchEvent('pointerup', { ...touch, button: 0, buttons: 0 });
    await glyph.dispatchEvent('click', { detail: 1, button: 0 });
  }
  await expect(page).toHaveURL(/\/study\/l1\/dialogues$/);
  await glyph.tap();
  await expect(page.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '好');
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
