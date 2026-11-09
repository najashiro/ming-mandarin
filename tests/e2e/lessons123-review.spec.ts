import { expect, test } from '@playwright/test';
import context from '../../data/lessons123-context-media.json' with { type: 'json' };
import generated from '../../data/lessons123-generated-media.json' with { type: 'json' };
import pedagogy from '../../data/lessons123-pedagogy-media.json' with { type: 'json' };
import geography from '../../data/lessons123-geography-media.json' with { type: 'json' };
import counts from '../../data/lessons123-media.json' with { type: 'json' };

const media = [...context, ...generated, ...pedagogy, ...geography, ...counts];
for (const hanzi of ['进', '法国', '后年', '二十五']) {
  test(`annotated ${hanzi} loads and flips to a complete example`, async ({ page }) => {
    const asset = media.find(row => row.wordId === `v-${hanzi}`)!;
    await page.route('**/api/vocabulary/images', route => route.fulfill({ json: [asset] }));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/study/l1-l2-l3/vocabulary?card=${encodeURIComponent(asset.wordId)}`);
    const card = page.getByRole('article', { name: `Ficha de ${hanzi}`, exact: true });
    await expect(card).toBeVisible();
    await expect(card.locator('.vocabulary-word')).toContainText(hanzi);
    await expect(card.locator('.word-pinyin')).not.toBeEmpty();
    await expect(card.locator('.vocabulary-translation')).not.toBeEmpty();
    await expect.poll(() => card.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await card.getByRole('button', { name: `Ver ejemplo: ${hanzi}`, exact: true }).click();
    await expect(card.locator('.vocabulary-example-text')).not.toBeEmpty();
    await expect(card.locator('.word-pinyin')).not.toBeEmpty();
    await expect(card.locator('.vocabulary-example-translation')).not.toBeEmpty();
  });
}
