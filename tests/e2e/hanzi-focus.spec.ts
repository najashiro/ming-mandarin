import { expect, test, type Page } from '@playwright/test';

const characters = ['作', '家', '有', '几'] as const;
const firstQuestion = { '作': { seed: 1157, answer: '作' }, '家': { seed: 83, answer: '家' }, '有': { seed: 702, answer: '有' }, '几': { seed: 810, answer: '几' } } as const;

async function expectDetailFocused(page: Page, character: string) {
  await expect(page.getByRole('tab', { name: 'Aprender' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.hanzi-picker-card.selected').first()).toContainText(character);
  await expect(page.locator('#hanzi-glyph-focus .hanzi-writer-target')).toHaveAttribute('aria-label', `Área de escritura para ${character}`);
  await expect(page.locator('#hanzi-glyph-focus .hanzi-writer-target svg')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => {
    const visual = document.getElementById('hanzi-detail-start')!.getBoundingClientRect();
    const header = document.querySelector('.topbar')!.getBoundingClientRect();
    const gap = visual.top - header.bottom;
    return scrollY > 100 && gap >= 4 && gap <= 8;
  })).toBe(true);
  const position = await page.evaluate(() => {
    const visual = document.getElementById('hanzi-detail-start')!.getBoundingClientRect();
    const header = document.querySelector('.topbar')!.getBoundingClientRect();
    return { scrollY, gap: visual.top - header.bottom };
  });
  expect(position.scrollY).toBeGreaterThan(100);
  expect(position.gap).toBeGreaterThanOrEqual(4);
  expect(position.gap).toBeLessThanOrEqual(8);
}

test('focus=glyph muestra el glifo de 作, 家, 有 y 几 en Aprender', async ({ page }) => {
  for (const character of characters) {
    await page.goto(`/study/l1-l2-l3/hanzi?character=${encodeURIComponent(character)}&focus=glyph`);
    await expectDetailFocused(page, character);
  }
});

test('el enlace directo anterior con solo character también enfoca el glifo', async ({ page }) => {
  await page.goto(`/study/l1-l2-l3/hanzi?character=${encodeURIComponent('作')}`);
  await expectDetailFocused(page, '作');
});

test('las pestañas y el modo explícitos conservan su navegación sin foco automático', async ({ page }) => {
  for (const [query, tab] of [['tab=Componentes', 'Palabras y frases'], ['tab=Trazos', 'Trazos'], ['tab=Practicar', 'Practicar'], ['mode=practice', 'Practicar']] as const) {
    await page.goto(`/study/l1-l2-l3/hanzi?character=${encodeURIComponent('作')}&${query}`);
    await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.hanzi-picker-card.selected').first()).toContainText('作');
    await expect(page.locator('#hanzi-glyph-focus')).toHaveCount(0);
    expect(await page.evaluate(() => scrollY)).toBeLessThan(100);
  }
});

for (const character of characters) {
  for (const outcome of ['correct', 'incorrect'] as const) {
    test(`Reto Mixto: ${character} ${outcome} abre el glifo y conserva la partida`, async ({ page }) => {
      const { seed, answer } = firstQuestion[character];
      await page.goto('/study/l1-l2-l3/games');
      await page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' }).getByRole('button', { name: /Jugar/ }).click();
      await page.evaluate((initial) => {
        let state = initial;
        Math.random = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 2 ** 32; };
      }, seed);
      await page.locator('.mixed-challenge.setup').getByRole('button', { name: 'Comenzar reto' }).click();
      const challenge = page.locator('.mixed-challenge.playing');
      const options = challenge.locator('.mixed-text-options button');
      await expect(options).toHaveCount(4);
      const answers = (await options.allTextContents()).map((value) => value.trim());
      const selected = answers.findIndex((choice) => outcome === 'correct' ? choice === answer : choice !== answer);
      expect(selected).toBeGreaterThanOrEqual(0);
      await options.nth(selected).click();

      const feedback = challenge.locator(`.mixed-feedback.${outcome}`);
      await expect(feedback).toBeVisible();
      const link = feedback.getByRole('link', { name: 'Hanzi ↗' });
      await expect(link).toHaveAttribute('href', `/study/l1-l2-l3/hanzi?character=${encodeURIComponent(character)}&focus=glyph`);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      const round = await challenge.locator('.mixed-hud h2').textContent();
      const correct = await challenge.locator('.mixed-hud-correct').textContent();
      const incorrect = await challenge.locator('.mixed-hud-incorrect').textContent();
      const streak = await challenge.locator('.mixed-hud-streak').textContent();

      const popupPromise = page.waitForEvent('popup');
      await link.click();
      const popup = await popupPromise;
      await expect(popup).toHaveURL(new RegExp(`character=${encodeURIComponent(character)}&focus=glyph`));
      await expectDetailFocused(popup, character);
      await expect(challenge.locator('.mixed-hud h2')).toHaveText(round!);
      await expect(challenge.locator('.mixed-hud-correct')).toHaveText(correct!);
      await expect(challenge.locator('.mixed-hud-incorrect')).toHaveText(incorrect!);
      await expect(challenge.locator('.mixed-hud-streak')).toHaveText(streak!);
      await expect(feedback).toBeVisible();
      await popup.close();
    });
  }
}

test('buscar y reseleccionar encuadra la tarjeta superior sin esperar los trazos', async ({ page }) => {
  await page.goto('/study/l1-l2-l3/hanzi');
  const search = page.getByRole('combobox', { name: 'Busca por pinyin' });
  await search.fill('zuo');
  await page.getByRole('option', { name: /zuò.*作/ }).click();
  await expectDetailFocused(page, '作');
  await page.evaluate(() => window.scrollTo(0, 0));
  await search.fill('zuo');
  await page.getByRole('option', { name: /zuò.*作/ }).click();
  await expectDetailFocused(page, '作');
  await expect(search).not.toBeFocused();
});

test('dos selecciones rápidas conservan el último Hanzi y no saltan al terminar los trazos', async ({ page }) => {
  await page.goto('/study/l1-l2-l3/hanzi');
  const search = page.getByRole('combobox', { name: 'Busca por pinyin' });
  await search.fill('jia'); await page.getByRole('option', { name: /jiā.*家/ }).click();
  await search.fill('you'); await page.getByRole('option', { name: /yǒu.*有/ }).click();
  await expectDetailFocused(page, '有');
  const initial = await page.evaluate(() => scrollY);
  await expect(page.locator('#hanzi-glyph-focus .hanzi-writer-target svg')).toHaveCount(1);
  expect(Math.abs((await page.evaluate(() => scrollY)) - initial)).toBeLessThanOrEqual(2);
});
