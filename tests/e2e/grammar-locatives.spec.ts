import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route('**/api/**', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method())
    ? route.continue()
    : route.fulfill({ status: 204, body: '' }));
});

for (const scope of ['l6', 'l1-l2-l3-l4-l5-l6']) {
  test(`${scope}: paso 01 solo muestra el orden y paso 02 conserva ejemplos y audio`, async ({ page }, info) => {
    const route = `/study/${scope}/grammar`;
    await page.goto(`${route}#g-l6-locatives`);
    const topic = page.getByTestId('grammar-topic');
    await expect(topic).toHaveAttribute('id', 'g-l6-locatives');
    const order = topic.locator('.grammar-pattern-guide');
    await expect(order.getByTestId('grammar-example')).toHaveCount(0);
    await expect(order.locator('.audio-control, .audio-button, .grammar-pattern-note')).toHaveCount(0);
    await expect(order.getByRole('button')).toHaveCount(0);
    const variants = topic.getByTestId('grammar-pattern-variant');
    await expect(variants).toHaveCount(2);
    const place = variants.nth(0);
    const object = variants.nth(1);
    await expect(place.getByRole('heading', { name: 'Ubicar respecto a un lugar', exact: true })).toBeVisible();
    await expect(object.getByRole('heading', { name: 'Identificar algo por su posición', exact: true })).toBeVisible();
    await expect(place.locator('.grammar-pattern-part')).toHaveCount(2);
    await expect(place.locator('.grammar-pattern-part')).toHaveText(['Lugar de referencia', 'Palabra de posición']);
    await expect(object.locator('.grammar-pattern-part')).toHaveCount(3);
    await expect(object.locator('.grammar-pattern-part').first()).toHaveText('Palabra de posición');
    await expect(object.locator('.grammar-pattern-part').last()).toHaveText('Objeto');
    for (const variant of [place, object]) await expect(variant.locator('.grammar-pattern-parts')).not.toContainText(/方位词/);

    const examples = topic.locator('.grammar-examples-guide').getByTestId('grammar-example');
    const originalExamples = ['银行在图书馆东边。', '右边的楼是新同学的宿舍楼。'];
    await expect(examples).toHaveCount(2);
    for (const [index, chinese] of originalExamples.entries()) {
      const example = examples.nth(index);
      await expect(example.locator('.grammar-example-hanzi')).toHaveText(chinese);
      await expect(example.locator('.grammar-reading-pinyin')).toHaveText(/\S/);
      await expect(example.locator('.grammar-reading-pinyin')).toBeVisible();
      await expect(example.locator('.grammar-reading-spanish')).toHaveText(/\S/);
      await expect(example.locator('.grammar-reading-spanish')).toBeVisible();
      await expect(example.getByRole('button', { name: /Escuchar/ }).first()).toBeVisible();
    }

    await page.getByRole('button', { name: 'Ocultar pinyin y español', exact: true }).click();
    await expect(variants.locator('.grammar-reading-pinyin, .grammar-reading-spanish')).toHaveCount(0);
    await expect(examples.locator('.grammar-reading-pinyin, .grammar-reading-spanish')).toHaveCount(0);
    await expect(object.locator('.grammar-pattern-part')).toHaveText(['Palabra de posición', '的', 'Objeto']);
    await expect(examples.locator('.grammar-example-hanzi')).toHaveText(originalExamples);
    await page.getByRole('button', { name: 'Pinyin', exact: true }).click();
    await expect(object.locator('.grammar-pattern-part').nth(1).locator('.pinyin-text')).toHaveText('de');
    for (let index = 0; index < originalExamples.length; index++) await expect(examples.nth(index).locator('.grammar-reading-pinyin')).toBeVisible();
    await expect(variants.locator('.grammar-reading-spanish')).toHaveCount(0);
    await expect(examples.locator('.grammar-reading-spanish')).toHaveCount(0);
    await page.getByRole('button', { name: 'Español', exact: true }).click();
    await expect(object.locator('.grammar-pattern-part').nth(1).locator('.grammar-reading-spanish')).toBeVisible();
    for (let index = 0; index < originalExamples.length; index++) await expect(examples.nth(index).locator('.grammar-reading-spanish')).toBeVisible();

    const link = object.locator('.grammar-pattern-part').nth(1).getByRole('link', { name: 'Abrir ficha de 的 (pestaña nueva)', exact: true });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const destination = new URL((await link.getAttribute('href'))!, page.url());
    expect(destination.searchParams.get('character')).toBe('的');
    expect(destination.searchParams.get('focus')).toBe('glyph');
    expect(destination.searchParams.get('returnTo')).toBe(`${route}#g-l6-locatives`);
    const popupPromise = page.waitForEvent('popup');
    await link.click();
    const popup = await popupPromise;
    await expect(popup.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '的');
    await popup.close();
    await expect(topic).toHaveAttribute('id', 'g-l6-locatives');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath('locative-models.png'), fullPage: true });
  });
}
