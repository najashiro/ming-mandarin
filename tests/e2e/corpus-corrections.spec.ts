import { expect, test } from '@playwright/test';

 test('diálogos muestran solo libros, hablantes estables y tipografía Hanzi uniforme', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/study/l1/dialogues');
  await expect(page.locator('.corpus-dialogue')).toHaveCount(2);
  await expect(page.getByText(/Principal|Variante/)).toHaveCount(0);
  await expect(page.locator('.dialogue-turn').first()).toContainText('马大为 · Mǎ Dàwéi:');
  const sameSpeaker = page.locator('.dialogue-turn[data-speaker="speaker-ma-dawei"]');
  await expect(sameSpeaker).toHaveCount(3);
  expect(await sameSpeaker.evaluateAll((nodes) => new Set(nodes.map((node) => node.className)).size)).toBe(1);
  const backgrounds = await page.locator('.dialogue-turn').evaluateAll((nodes) => Object.fromEntries(nodes.map((node) => [node.getAttribute('data-speaker'), getComputedStyle(node).backgroundColor])));
  expect(backgrounds['speaker-ma-dawei']).toBe('rgb(231, 242, 233)');
  expect(backgrounds['speaker-song-hua']).toBe('rgb(231, 239, 250)');
  expect(backgrounds['speaker-ma-dawei']).not.toBe(backgrounds['speaker-song-hua']);
  const accents = await page.locator('.dialogue-turn').evaluateAll((nodes) => Object.fromEntries(nodes.map((node) => [node.getAttribute('data-speaker'), getComputedStyle(node).borderLeftColor])));
  expect(accents['speaker-ma-dawei']).toBe('rgb(43, 102, 80)');
  expect(accents['speaker-song-hua']).toBe('rgb(60, 101, 152)');
  const audioButtons = page.locator('.dialogue-turn .audio-button.compact');
  expect(await audioButtons.count()).toBeGreaterThan(0);
  const audioBox = await audioButtons.first().boundingBox();
  expect(audioBox?.height).toBeGreaterThanOrEqual(40);
  expect(audioBox?.height).toBeLessThanOrEqual(44);
  await expect(page.locator('.dialogue-audio-pending')).toHaveCount(0);
  const fonts = await page.locator('.dialogue-turn-text').first().evaluate((node) => {
    const linked = node.querySelector('.linked-hanzi .font-hanzi')!;
    const plain = node.querySelector('.font-hanzi')!;
    return [getComputedStyle(linked).fontFamily, getComputedStyle(plain).fontFamily];
  });
  expect(fonts[0]).toBe(fonts[1]);
});

 test('radicales se filtran por lección y colocan pinyin bajo cada ejemplo', async ({ page }) => {
  await page.goto('/study/l1/radicals');
  await expect(page.getByRole('heading', { name: 'Lección 1' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lección 2' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Explorar|Aprender|Practicar/ })).toHaveCount(0);
  const examples = page.locator('.radical-example');
  expect(await examples.count()).toBeGreaterThan(0);
  await expect(examples.first().locator('.linked-chinese-text')).toBeVisible();
  await expect(examples.first().locator('.pinyin-text')).toBeVisible();
  await expect(page.getByText(/examen|candidato|respuesta/i)).toHaveCount(0);
});
