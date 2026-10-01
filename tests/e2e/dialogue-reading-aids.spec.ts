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
