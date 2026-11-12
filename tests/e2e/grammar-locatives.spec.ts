import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route('**/api/**', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method())
    ? route.continue()
    : route.fulfill({ status: 204, body: '' }));
});

for (const scope of ['l6', 'l1-l2-l3-l4-l5-l6']) {
  test(`${scope}: los locativos muestran dos modelos separados y comprensibles`, async ({ page }, info) => {
    const route = `/study/${scope}/grammar`;
    await page.goto(`${route}#g-l6-locatives`);
    const topic = page.getByTestId('grammar-topic');
    await expect(topic).toHaveAttribute('id', 'g-l6-locatives');
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

    for (const [variant, chinese] of [[place, '学校里边'], [object, '右边的楼']] as const) {
      const example = variant.getByTestId('grammar-example');
      await expect(example).toHaveCount(1);
      await expect(example.locator('.grammar-example-hanzi')).toHaveText(chinese);
      await expect(example.locator('.grammar-reading-pinyin')).toHaveText(/\S/);
      await expect(example.locator('.grammar-reading-pinyin')).toBeVisible();
      await expect(example.locator('.grammar-reading-spanish')).toHaveText(/\S/);
      await expect(example.locator('.grammar-reading-spanish')).toBeVisible();
      await expect(example.getByRole('button', { name: /Escuchar/ }).first()).toBeVisible();
    }

    await page.getByRole('button', { name: 'Ocultar pinyin y español', exact: true }).click();
    await expect(variants.locator('.grammar-reading-pinyin, .grammar-reading-spanish')).toHaveCount(0);
    await expect(object.locator('.grammar-pattern-part')).toHaveText(['Palabra de posición', '的', 'Objeto']);
    await expect(place.getByTestId('grammar-example').locator('.grammar-example-hanzi')).toHaveText('学校里边');
    await page.getByRole('button', { name: 'Pinyin', exact: true }).click();
    await expect(place.getByTestId('grammar-example').locator('.grammar-reading-pinyin')).toBeVisible();
    await expect(object.getByTestId('grammar-example').locator('.grammar-reading-pinyin')).toBeVisible();
    await expect(variants.locator('.grammar-reading-spanish')).toHaveCount(0);
    await page.getByRole('button', { name: 'Español', exact: true }).click();
    await expect(place.getByTestId('grammar-example').locator('.grammar-reading-spanish')).toBeVisible();
    await expect(object.getByTestId('grammar-example').locator('.grammar-reading-spanish')).toBeVisible();

    const link = place.getByTestId('grammar-example').getByRole('link', { name: 'Abrir ficha de 学 (pestaña nueva)', exact: true });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const destination = new URL((await link.getAttribute('href'))!, page.url());
    expect(destination.searchParams.get('character')).toBe('学');
    expect(destination.searchParams.get('focus')).toBe('glyph');
    expect(destination.searchParams.get('returnTo')).toBe(`${route}#g-l6-locatives`);
    const popupPromise = page.waitForEvent('popup');
    await link.click();
    const popup = await popupPromise;
    await expect(popup.locator('#hanzi-detail-start')).toHaveAttribute('data-character', '学');
    await popup.close();
    await expect(topic).toHaveAttribute('id', 'g-l6-locatives');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath('locative-models.png'), fullPage: true });
  });
}
