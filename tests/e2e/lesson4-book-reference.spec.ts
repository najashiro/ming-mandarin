import { test, expect } from '@playwright/test';

test('L4: tablas de horas, orden temporal y preguntas conservan sus ayudas de lectura', async ({ page }, info) => {
  await page.goto('/study/l4/grammar');
  await expect(page.locator('.grammar-source-table')).toHaveCount(7);
  await expect(page.locator('.grammar-row-aid')).toHaveCount(57);
  const time = page.locator('#GR-L4-BOOK-04-09-05');
  await expect(time.getByRole('table')).toBeVisible();
  await expect(time.locator('tbody tr:not(.grammar-row-aid)')).toHaveCount(8);
  await expect(time).toContainText('两点零（líng, cero）五分');
  await expect(time).toContainText('Las tres menos cinco.', { ignoreCase: true });
  const order = page.locator('#GR-L4-BOOK-04-10-03');
  await expect(order.getByRole('table')).toHaveCount(2);
  await expect(order.getByRole('table').first().locator('th').first()).toHaveText('Sujeto');
  await expect(order.getByRole('table').last().locator('th').first()).toHaveText('Complemento circunstancial de tiempo');
  await expect(page.locator('#GR-L4-BOOK-04-10-06')).toContainText('Por ejemplo');
  await expect(page.locator('#GR-L4-BOOK-04-11-01')).toHaveCount(0);
  const questions = page.locator('#GR-L4-BOOK-04-11-04');
  await expect(questions.getByRole('table')).toHaveCount(2);
  await expect(questions).toContainText('¿Tiene tiempo Song Hua?');
  await expect(page.locator('#GR-L4-BOOK-04-13-02 .grammar-clarification')).toContainText('No se añade otro 有 después de 没有');
  await expect(page.locator('#GR-L4-BOOK-04-14-03 .grammar-worked-example')).toHaveCount(3);
  await expect(page.locator('.book-key-phrases > li')).toHaveCount(10);
  await expect(page.locator('.book-key-phrases .pinyin-text')).toHaveCount(10);
  await expect(page.locator('.book-situations')).toContainText('cafetería');
  await expect(page.getByRole('link', { name: 'Leer diálogo 1 →', exact: true })).toHaveAttribute('href', '/study/l4/dialogues#turn-DLG-L4-BOOK-T1-1');
  await time.scrollIntoViewIfNeeded();
  await time.screenshot({ path: info.outputPath('book-time-table.png') });
  await page.getByRole('link', { name: 'Leer diálogo 1 →', exact: true }).click();
  await expect(page).toHaveURL(/\/study\/l4\/dialogues#turn-DLG-L4-BOOK-T1-1$/);
  await expect(page.locator('#turn-DLG-L4-BOOK-T1-1')).toBeVisible();
});

test('L4: radicales y escritura distinguen las lecturas primarias y la alternativa de 只', async ({ page }, info) => {
  await page.goto('/study/l4/grammar');
  await expect(page.locator('.book-radical-card')).toHaveCount(2);
  await expect(page.locator('.book-radical-card').first()).toContainText('立刀旁');
  await expect(page.locator('.book-radical-card').first()).toContainText('2 trazos');
  await expect(page.locator('.book-radical-card').last()).toContainText('日字旁');
  await expect(page.getByText('Lectura cultural del libro.', { exact: true })).toBeVisible();
  await page.goto('/study/l4/hanzi');
  await expect(page.locator('.book-character-card')).toHaveCount(25);
  const only = page.locator('.book-character-card').filter({ has: page.locator('h3').filter({ hasText: /^只$/ }) });
  await expect(only).toBeVisible();
  await expect(only.locator(':scope > .book-character-reading').first()).toContainText('Libro');
  await expect(only.locator(':scope > .book-character-reading').first().locator('.pinyin-text')).toHaveText('zhǐ');
  await expect(only.locator(':scope > .book-character-reading').first()).toContainText('solo');
  await expect(only.locator('.book-character-alternative .pinyin-text')).toHaveText('zhī');
  await expect(only.locator('.book-character-alternative')).toContainText('clasificador');
  const separate = page.locator('.book-character-card').filter({ has: page.locator('h3').filter({ hasText: /^别$/ }) });
  await expect(separate.locator('.book-character-components')).toContainText('口 + 力 + 刂');
  await expect(separate.locator('.book-character-components')).toContainText('另 + 刂');
  await only.scrollIntoViewIfNeeded();
  await only.screenshot({ path: info.outputPath('book-only-readings.png') });
});

test('L4: referencias del libro caben a 320 px y no aparecen en L3', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 320, height: 844 });
  for (const route of ['grammar', 'hanzi', 'radicals']) {
    await page.goto(`/study/l4/${route}`);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), route).toBe(true);
    await expect(page.locator('main')).not.toContainText(/source_id|authority_tier|pinyin_ming|Application error/);
  }
  await page.goto('/study/l3/grammar');
  await expect(page.locator('.book-reference')).toHaveCount(0);
});
