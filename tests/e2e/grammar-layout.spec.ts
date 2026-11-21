import { expect, test, type Page } from '@playwright/test';

async function expectNoPageOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

for (const width of [320, 390]) {
  test(`L7: la regla de números mantiene una lectura continua a ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/study/l7/grammar#g-l7-numbers');
    const topic = page.getByTestId('grammar-topic');
    await expect(topic).toHaveAttribute('id', 'g-l7-numbers');
    await expect(topic.getByRole('heading', { name: 'Números de 100 a 9999', exact: true })).toBeVisible();
    await expect(topic.locator('.grammar-rule-detail')).toHaveCount(0);

    const prose = topic.locator('.grammar-topic-explanation > p');
    await expect(prose.first()).toBeVisible();
    await expect(prose.locator('.grammar-inline-reading, .grammar-reading-pinyin, .grammar-reading-spanish')).toHaveCount(0);
    const glossary = topic.locator('.grammar-topic-explanation .grammar-rule-vocabulary');
    await expect(glossary).toBeVisible();
    const terms = glossary.locator('.grammar-rule-term');
    const expectedTerms = ['零', '一百零五', '一千零一', '两', '千'];
    await expect(terms).toHaveCount(expectedTerms.length);
    expect(await terms.locator('.linked-chinese-text').allTextContents()).toEqual(expectedTerms);
    for (const term of await terms.all()) {
      await expect(term.locator('.grammar-reading-pinyin')).toBeVisible();
      await expect(term.locator('.grammar-reading-spanish')).toBeVisible();
    }
    await page.evaluate(() => document.fonts.ready);
    const layout = await topic.locator('.grammar-topic-explanation').evaluate(element => {
      const paragraphs = element.querySelectorAll(':scope > p');
      const paragraph = paragraphs.item(paragraphs.length - 1);
      const vocabulary = element.querySelector('.grammar-rule-vocabulary');
      if (!paragraph || !vocabulary) return null;
      return {
        paragraphBottom: paragraph.getBoundingClientRect().bottom,
        glossaryTop: vocabulary.getBoundingClientRect().top,
      };
    });
    expect(layout).not.toBeNull();
    expect(layout!.glossaryTop).toBeGreaterThanOrEqual(layout!.paragraphBottom);
    const paragraphHeights = await prose.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
    await expectNoPageOverflow(page);

    const pinyin = page.getByRole('button', { name: 'Pinyin', exact: true });
    const spanish = page.getByRole('button', { name: 'Español', exact: true });
    await pinyin.click();
    await expect(glossary.locator('.grammar-reading-pinyin')).toHaveCount(0);
    await expect(glossary.locator('.grammar-reading-spanish')).toHaveCount(expectedTerms.length);
    await pinyin.click();
    await spanish.click();
    await expect(glossary.locator('.grammar-reading-pinyin')).toHaveCount(expectedTerms.length);
    await expect(glossary.locator('.grammar-reading-spanish')).toHaveCount(0);
    await spanish.click();
    await page.getByRole('button', { name: 'Ocultar pinyin y español', exact: true }).click();
    await expect(topic.locator('.grammar-reading-pinyin, .grammar-reading-spanish')).toHaveCount(0);
    expect(await prose.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height))).toEqual(paragraphHeights);
    await expectNoPageOverflow(page);
    await page.reload();
    await expect(pinyin).toHaveAttribute('aria-pressed', 'false');
    await expect(spanish).toHaveAttribute('aria-pressed', 'false');
    await expect(topic.locator('.grammar-reading-pinyin, .grammar-reading-spanish')).toHaveCount(0);

    await page.getByRole('button', { name: 'Mostrar pinyin y español', exact: true }).click();
    await expect(terms).toHaveCount(expectedTerms.length);
    await expectNoPageOverflow(page);
    await topic.screenshot({ path: info.outputPath(`grammar-numbers-${width}px.png`) });
  });
}
