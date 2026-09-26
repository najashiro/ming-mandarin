import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const publicCorpus = JSON.parse(readFileSync('data/corpus-v21-public.json', 'utf8')) as {
  vocabulary: { id: string; examplePhraseIds: string[] }[];
  phrases: { id: string; hanzi: string; pinyin: string; spanish: string }[];
};
function firstExample(hanzi: string) {
  const word = publicCorpus.vocabulary.find(word => word.id === `v-${hanzi}`)!;
  return publicCorpus.phrases.find(phrase => phrase.id === word.examplePhraseIds[0])!;
}
const root = '/study/l3/vocabulary';
async function ready(page: import('@playwright/test').Page, url = root) { await page.goto(url); await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true'); }
test('search variants, filters, IME and favorites survive reload', async ({ page }) => {
  await ready(page);
  const search = page.getByRole('combobox', { name: 'Buscar' });
  for (const query of ['宠物', 'chǒngwù', 'chongwu', 'chong wu', 'chong3wu4', 'mascota']) {
    await search.fill(query);
    await expect(page.getByRole('option', { name: /宠物/ })).toBeVisible();
  }
  await search.dispatchEvent('compositionstart');
  await search.press('Enter');
  await expect(search).toBeFocused();
  await search.dispatchEvent('compositionend');
  await search.press('ArrowDown');
  await search.press('Enter');
  const card = page.getByRole('article', { name: 'Ficha de 宠物', exact: true });
  await expect(card).toBeFocused();
  await card.getByRole('button', { name: 'Favorito: 宠物' }).click();
  await expect(card.getByRole('button', { name: 'Ver palabra: 宠物' })).toHaveCount(0);
  await expect(card.getByRole('button', { name: 'Ver ejemplo: 宠物', exact: true })).toHaveCount(1);
  await page.reload();
  await expect(card.getByRole('button', { name: 'Favorito: 宠物' })).toHaveAttribute('aria-pressed', 'true');

  await expect(page.getByRole('combobox', { name: 'Lección', exact: true }).locator('option')).toHaveText(['Lección 1', 'Lección 2', 'Lección 3', 'Acumulado']);
  await page.getByRole('button', { name: 'Solo favoritos', exact: true }).click();
  await expect(card).toBeVisible();
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l1');
  await expect(page.getByText('Sin resultados. Ajusta')).toBeVisible();
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l3');
  await expect(card).toBeVisible();

});
test('Mix keeps reveal, prevents leaks, saves one evaluation and finite retries', async ({ page }) => {
  await ready(page, `${root}?q=mascota&mode=mix&level=basic`);
  await expect(page).toHaveURL(/\/games\/vocabulary-mix\?q=mascota$/);
  await page.getByRole('combobox', { name: 'Tipo de pista' }).selectOption('context');
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  const mix = page.getByRole('region', { name: 'Vocabulario Mix', exact: true });
  await expect(mix.getByRole('button', { name: 'Lo sé', exact: true })).toHaveCount(0);
  await expect(mix.getByText('chǒngwù', { exact: true })).toHaveCount(0);
  await expect(mix.getByRole('link')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect(mix.getByText('chǒngwù', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Lo sé', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  await page.getByRole('button', { name: 'No lo sé', exact: true }).dblclick();
  await expect(page.getByText(/1 palabras únicas · 1 respuestas autoevaluadas/)).toBeVisible();
  await expect(page.getByText(/1 palabras pendientes/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/1 palabras únicas · 1 respuestas autoevaluadas/)).toBeVisible();
});
test('Hanzi opens supported character in a new tab and keeps original state', async ({ page, context }) => {
  await ready(page, `${root}?q=mascota`);
  const link = page.locator('.vocabulary-word').getByRole('link', { name: 'Abrir ficha de 宠 (pestaña nueva)', exact: true });
  const [tab] = await Promise.all([context.waitForEvent('page'), link.click()]);
  await tab.waitForLoadState('domcontentloaded');
  await expect(tab).toHaveURL(/character=%E5%AE%A0/);
  await expect(tab.locator('.hanzi-workspace')).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Buscar' })).toHaveValue('mascota');
  await tab.close();
});
test('games registry links to the same Mix with scope', async ({ page }) => {
  await page.goto('/study/l2/games');
  await page.locator('[data-game="vocabulario-mix"]').getByRole('link', { name: 'Jugar' }).click();
  await expect(page).toHaveURL(/\/study\/l2\/games\/vocabulary-mix/);
  await expect(page.getByRole('heading', { level: 1, name: 'Vocabulario Mix' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Empezar', exact: true })).toBeVisible();
  await page.getByRole('link', { name: '← Volver a Juegos' }).click();
  await expect(page).toHaveURL(/\/study\/l2\/games$/);
});
for (const width of [320, 375, 390, 430, 1280]) test(`layout and real screenshots at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, '/study/l2/vocabulary?q=米饭');
  await expect(page.locator('.vocabulary-card')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `docs/vocabulary-captures/${info.project.name}-${width}-catalog.png`, fullPage: true });
  await page.locator('.vocabulary-card-tools').getByRole('button', { name: /Ver ejemplo/ }).click();
  await page.screenshot({ path: `docs/vocabulary-captures/${info.project.name}-${width}-reverse.png`, fullPage: true });
  await ready(page, '/study/l2/games/vocabulary-mix?q=米饭');
  await page.getByRole('combobox', { name: 'Tipo de pista' }).selectOption('image');
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.screenshot({ path: `docs/vocabulary-captures/${info.project.name}-${width}-mix.png`, fullPage: true });
  await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('compact controls ignore obsolete filters and keep audio beside Chinese', async ({ page }) => {
  await ready(page, '/study/l2/vocabulary?q=米饭&source=class_presentation&selection=new&level=basic');
  const card = page.getByRole('article', { name: 'Ficha de 米饭', exact: true });
  await expect(card).toBeVisible();
  await expect(page.getByRole('button', { name: /^(Explorar|Vocabulario Mix)$/ })).toHaveCount(0);
  await expect(page.getByText(/^(Alcance|Selección curricular|Contenido|Más filtros y preferencias|Procedencia|Escritura)$/)).toHaveCount(0);
  await expect(card.locator('.vocabulary-word-row .audio-button')).toHaveCount(1);
  const front = await card.evaluate(el => getComputedStyle(el).backgroundColor);
  await card.locator('.vocabulary-card-tools').getByRole('button', { name: /Ver ejemplo/ }).click();
  expect(await card.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(front);
  await expect(card.locator('.vocabulary-example-text')).toHaveText(firstExample('米饭').hanzi);
  await expect(card.locator('.vocabulary-example-text .audio-button[disabled]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Solo favoritos', exact: true }).click();
  await expect(page).not.toHaveURL(/source=|selection=|level=/);
});

test('audited words and essential/extended Mix stay curricular', async ({ page }) => {
  for (const [scope, hanzi, pinyin] of [['l1', '马马虎虎', 'mǎmǎhūhū'], ['l2', '中国', 'Zhōngguó'], ['l1', '太', 'tài'], ['l3', '宠物', 'chǒngwù'], ['l3', '约翰', 'Yuēhàn']]) {
    await ready(page, `/study/${scope}/vocabulary?q=${encodeURIComponent(hanzi)}`);
    const card = page.getByRole('article', { name: `Ficha de ${hanzi}`, exact: true });
    await expect(card.getByText(pinyin, { exact: true })).toBeVisible();
    const flip = card.locator('.vocabulary-card-tools').getByRole('button', { name: /Ver ejemplo/ });
    if (await flip.count()) await flip.click();
    await expect(card).not.toContainText(/pendiente|SRC-|PDF|revisión|fuente/i);
  }
  await ready(page, '/study/l1/vocabulary?q=马马虎虎&mode=mix');
  await page.getByRole('combobox', { name: 'Nivel', exact: true }).selectOption('basic');
  await expect(page.getByRole('button', { name: 'Empezar', exact: true })).toBeDisabled();
  await page.getByRole('combobox', { name: 'Nivel', exact: true }).selectOption('hard');
  await expect(page.getByRole('button', { name: 'Empezar', exact: true })).toBeEnabled();
});

test('legacy session survives corpus sync and revealed Mix fits 390 × 844', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem('ming-vocabulary-v1:guest', JSON.stringify({ version: 1, favorites: ['v-约翰'], faces: {}, progress: { 'v-约翰:hanzi': { due: 100, streak: 2, attempts: 3, lastEvent: 'old:0' } }, sessions: { l3: { id: 'before-corpus-sync', scope: 'l3', level: 'hard', queue: [{ wordId: 'v-约翰', type: 'hanzi' }], index: 0, revealed: true, paused: false, events: [] } } }));
  });
  await ready(page, '/study/l3/vocabulary?mode=mix');
  const mix = page.getByRole('region', { name: 'Vocabulario Mix', exact: true });
  await expect(mix.getByText('Yuēhàn', { exact: true })).toBeVisible();
  await expect(mix.getByText('John', { exact: true })).toBeVisible();
  await expect(mix).not.toContainText(/pendiente|SRC-|PDF|revisión|Compara también/i);
  const action = mix.getByRole('button', { name: 'Lo sé', exact: true });
  const bounds = await action.boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThan(774);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({ path: `docs/vocabulary-captures/${info.project.name}-390-audited-mix.png`, fullPage: true });
  await mix.getByText('Ejemplo', { exact: true }).click();
  await expect(mix.locator('.vocabulary-example .pinyin-text')).toBeVisible();
  await expect(mix).not.toContainText(/pendiente|SRC-|PDF|revisión/i);
  await action.click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  expect(saved.progress['v-约翰:hanzi'].attempts).toBe(4);
  expect(saved.favorites).toEqual(['v-约翰']);
});

for (const [from, query, hanzi, target] of [['l1', '中国', '中国', 'l2'], ['l1', 'mascota', '宠物', 'l3'], ['l3', '你', '你', 'l1'], ['l2', 'mamahuhu', '马马虎虎', 'l1'], ['l1-l2-l3', 'mamahuhu', '马马虎虎', 'l1']]) test(`global search ${from}: ${query} navigates to ${target}`, async ({ page }) => {
  await ready(page, `/study/${from}/vocabulary`);
  const search = page.getByRole('combobox', { name: 'Buscar', exact: true });
  await search.fill(query);
  const option = page.getByRole('option').filter({ has: page.locator('strong', { hasText: new RegExp(`^${hanzi}$`) }) });
  await expect(option).toContainText(target.toUpperCase());
  await option.click();
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue(target);
  await expect(search).toHaveValue('');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  const card = page.getByRole('article', { name: `Ficha de ${hanzi}`, exact: true });
  await expect(card).toBeFocused();
  await expect(card).toHaveClass(/is-search-target/);
  await expect(card).toBeInViewport();
  expect(await page.locator('.vocabulary-card').count()).toBeGreaterThan(1);
  await expect(page).toHaveURL(new RegExp(`/study/${target}/vocabulary\\?page=.+&card=`));
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue(target);
});

test('global examples keep canonical lesson, favorites, progress and card position', async ({ page }) => {
  await ready(page, '/study/l2/vocabulary?q=zhen');
  const card = page.getByRole('article', { name: 'Ficha de 真', exact: true });
  await card.getByRole('button', { name: 'Favorito: 真' }).click();
  await card.getByRole('button', { name: 'Ver ejemplo: 真', exact: true }).click();
  await expect(card.locator('.vocabulary-example-text')).toHaveText(firstExample('真').hanzi);
  const initial = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  const before = await card.boundingBox();
  let foundPhoto = false;
  let foundLihai = false;
  for (let i = 0; i < 15; i++) {
    await card.getByRole('button', { name: 'Otro ejemplo', exact: true }).click();
    const current = (await card.locator('.vocabulary-example-text').innerText()).trim();
    if (current === '真厉害！') foundLihai = true;
    if (current === '这张照片真漂亮！') foundPhoto = true;
    if (foundPhoto && foundLihai) break;
  }
  expect(foundPhoto).toBe(true);
  expect(foundLihai).toBe(true);
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue('l2');
  await expect(card.getByRole('button', { name: 'Favorito: 真' })).toHaveAttribute('aria-pressed', 'true');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  expect(saved.progress).toEqual(initial.progress);
  expect(saved.favorites).toEqual(initial.favorites);
  expect((await card.boundingBox())!.y).toBeCloseTo(before!.y, 0);
  await expect(card).not.toContainText(/pendiente|SRC-|PDF/);
});

test('Mix removes pending cards from earlier lessons and accumulated keeps all', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ming-vocabulary-v1:guest', JSON.stringify({ version: 1, favorites: [], faces: {}, progress: { 'v-你:hanzi': { due: 1, streak: 1, attempts: 2, lastEvent: 'history:0' } }, sessions: { l2: { id: 'old-partition', scope: 'l2', level: 'hard', queue: [{ wordId: 'v-你', type: 'hanzi' }, { wordId: 'v-中国', type: 'hanzi' }], index: 0, revealed: true, paused: false, events: [] } } })));
  await ready(page, '/study/l2/vocabulary?mode=mix');
  await expect(page.getByRole('button', { name: 'Ver respuesta', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-hanzi')).toHaveText('中国');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  expect(saved.sessions.l2.queue.map((card: { wordId: string }) => card.wordId)).toEqual(['v-中国']);
  expect(saved.progress['v-你:hanzi'].attempts).toBe(2);
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l1-l2-l3');
  await expect(page.getByRole('button', { name: 'Empezar', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/study\/l1-l2-l3\/games\/vocabulary-mix/);
  await ready(page, '/study/l1-l2-l3/vocabulary');
  await expect(page.getByRole('article', { name: 'Ficha de 你', exact: true })).toBeVisible();
});

test('filters and search reset faces; reverse emphasizes the target in context', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, '/study/l1/vocabulary?q=你');
  const card = page.getByRole('article', { name: 'Ficha de 你', exact: true });
  const search = page.getByRole('combobox', { name: 'Buscar', exact: true });
  await card.getByRole('button', { name: 'Favorito: 你', exact: true }).click();
  await card.locator('.vocabulary-card-tools').getByRole('button', { name: 'Ver ejemplo: 你', exact: true }).click();
  await expect(card.locator('.vocabulary-example-target').first()).toHaveText('你');
  await expect(card.locator('.vocabulary-word-row .audio-button')).toHaveCount(0);
  await expect(card.locator('.vocabulary-example-text')).toHaveText(firstExample('你').hanzi);
  await expect(card.locator('.vocabulary-example-text .audio-button[disabled]')).toHaveCount(0);
  const styles = await card.evaluate(el => ({
    titleWeight: getComputedStyle(el.querySelector('.vocabulary-word')!).fontWeight,
    targetWeight: getComputedStyle(el.querySelector('.vocabulary-example-target')!).fontWeight,
    targetColor: getComputedStyle(el.querySelector('.vocabulary-example-target')!).color,
    pinyinSize: parseFloat(getComputedStyle(el.querySelector('.vocabulary-example .pinyin-text')!).fontSize),
    translationSize: parseFloat(getComputedStyle(el.querySelector('.vocabulary-example-translation')!).fontSize),
    buttonHeight: el.querySelector('.vocabulary-next-example')!.getBoundingClientRect().height,
  }));
  expect(styles.titleWeight).toBe('400');
  expect(styles.targetWeight).toBe('700');
  expect(styles.targetColor).toBe('rgb(179, 68, 36)');
  expect(styles.translationSize).toBeLessThan(styles.pinyinSize);
  expect(styles.buttonHeight).toBeGreaterThanOrEqual(44);
  await card.screenshot({ path: `docs/vocabulary-captures/${info.project.name}-reverse-emphasis.png` });
  await page.reload();
  await expect(card).not.toHaveClass(/is-reversed/);
  await expect(card.locator('.vocabulary-word-row .audio-button')).toHaveCount(1);
  await card.locator('.vocabulary-card-tools').getByRole('button', { name: 'Ver ejemplo: 你', exact: true }).click();
  await search.focus();
  await expect(card).not.toHaveClass(/is-reversed/);
  await search.fill('你');
  await search.press('Escape');
  await card.locator('.vocabulary-card-tools').getByRole('button', { name: 'Ver ejemplo: 你', exact: true }).click();
  await page.getByRole('button', { name: 'Solo favoritos', exact: true }).click();
  await expect(card).not.toHaveClass(/is-reversed/);
  await card.locator('.vocabulary-card-tools').getByRole('button', { name: 'Ver ejemplo: 你', exact: true }).click();
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l2');
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l1');
  await expect(card).not.toHaveClass(/is-reversed/);
  await expect(card.getByRole('button', { name: 'Favorito: 你', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

for (const width of [390, 1280]) test(`new corpus cat cycles three examples in catalog and Mix at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await ready(page, '/study/l3/vocabulary?q=猫');
  const cat = page.getByRole('article', { name: 'Ficha de 猫', exact: true });
  await expect(cat.locator('.word-pinyin')).toHaveText('māo');
  await expect(cat.locator('.vocabulary-translation')).toHaveText('gato');
  await cat.getByRole('button', { name: 'Favorito: 猫', exact: true }).click();
  await cat.getByRole('button', { name: 'Consultar ejemplo: 猫', exact: true }).click();
  const reverseBounds = await cat.boundingBox();
  expect(Math.abs(reverseBounds!.width / reverseBounds!.height - 1.61803398875)).toBeLessThan(.01);
  const expected = [
    ['一只猫', 'Yì zhī māo', 'Un gato.'],
    ['你有小猫吗？', 'Nǐ yǒu xiǎomāo ma?', '¿Tienes un gatito?'],
    ['我有两只小猫，他们很可爱。', "Wǒ yǒu liǎng zhī xiǎomāo, tāmen hěn kě’ài.", 'Tengo dos gatitos; son muy tiernos.'],
  ];
  for (const [chinese, pinyin, spanish] of expected) {
    await expect(cat.locator('.vocabulary-example-text')).toHaveText(chinese);
    expect((await cat.locator('.vocabulary-example .pinyin-text').innerText()).replaceAll("'", '’')).toBe(pinyin);
    await expect(cat.locator('.vocabulary-example-translation')).toHaveText(spanish);
    await expect(cat.locator('.vocabulary-example-target')).toHaveText('猫');
    await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue('l3');
    await expect(cat).not.toContainText(/pendiente|revisión|Pinyin Míng|Traducción Míng|SRC-|PDF|procedencia/i);
    await cat.getByRole('button', { name: 'Otro ejemplo', exact: true }).click();
  }
  await expect(cat.locator('.vocabulary-example-text')).toHaveText(expected[0][0]);
  await cat.screenshot({ path: `docs/vocabulary-captures/pr12/${info.project.name}-cat-reverse-${width}.png` });
  await page.reload();
  await expect(cat).not.toHaveClass(/is-reversed/);
  await expect(cat.getByRole('button', { name: 'Favorito: 猫', exact: true })).toHaveAttribute('aria-pressed', 'true');

  // A persisted single-word session exercises exactly the same public examples.
  await page.evaluate(() => {
    const key = 'ming-vocabulary-v1:guest';
    const state = JSON.parse(localStorage.getItem(key)!);
    state.sessions.l3 = { id: 'cat-corpus', scope: 'l3', level: 'hard', queue: [{ wordId: 'v-猫', type: 'hanzi' }], index: 0, revealed: true, paused: false, events: [] };
    localStorage.setItem(key, JSON.stringify(state));
  });
  await ready(page, '/study/l3/vocabulary?mode=mix');
  const mix = page.getByRole('region', { name: 'Vocabulario Mix', exact: true });
  await mix.getByText('Ejemplo', { exact: true }).click();
  for (const [chinese] of expected) {
    await expect(mix.locator('.vocabulary-example-text')).toHaveText(chinese);
    await mix.getByRole('button', { name: 'Otro ejemplo', exact: true }).click();
  }
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  expect(saved.sessions.l3.events).toEqual([]);
  expect(saved.favorites).toContain('v-猫');
});

for (const width of [320, 390, 768, 1280]) test(`PR12 whole-card geometry and readable fallback at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [word, scope, slug] of [['狗', 'l3', 'dog'], ['钢琴', 'l3', 'piano'], ['包子', 'l2', 'baozi'], ['真', 'l2', 'zhen']]) {
    await ready(page, `/study/${scope}/vocabulary?q=${encodeURIComponent(word)}`);
    await page.evaluate(() => document.fonts.ready);
    const card = page.getByRole('article', { name: `Ficha de ${word}`, exact: true });
    const styles = await card.evaluate(el => {
      const bounds = el.getBoundingClientRect();
      const image = el.querySelector('img');
      const audio = el.querySelector('.audio-button');
      return { width: bounds.width, ratio: bounds.width / bounds.height, overflow: el.scrollHeight > el.clientHeight + 1,
        translation: parseFloat(getComputedStyle(el.querySelector('.vocabulary-translation')!).fontSize),
        pinyin: parseFloat(getComputedStyle(el.querySelector('.word-pinyin')!).fontSize),
        imageRatio: image ? image.getBoundingClientRect().width / image.getBoundingClientRect().height : null,
        audioRadius: audio ? getComputedStyle(audio).borderRadius : null,
        controls: [...el.querySelectorAll('button')].map(button => ({ width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height })),
      };
    });
    expect(Math.abs(styles.ratio - (1 + Math.sqrt(5)) / 2)).toBeLessThan(.01);
    expect(styles.width).toBeLessThanOrEqual(400);
    expect(styles.overflow).toBe(false);
    expect(styles.translation).toBeCloseTo(11.52, 1);
    expect(styles.translation).toBeLessThan(styles.pinyin);
    for (const control of styles.controls) { expect(control.width).toBeGreaterThanOrEqual(44); expect(control.height).toBeGreaterThanOrEqual(44); }
    if (styles.imageRatio !== null) expect(styles.imageRatio).toBeCloseTo(1, 2);
    if (styles.audioRadius !== null) expect(styles.audioRadius).toBe('50%');
    await card.screenshot({ path: `docs/vocabulary-captures/pr12/${info.project.name}-${slug}-${width}.png` });
  }
  // Accessibility takes priority over fixed height: retain all text at 200%.
  await page.addStyleTag({ content: 'html { font-size:32px!important }' });
  const card = page.getByRole('article', { name: 'Ficha de 真', exact: true });
  await card.getByRole('button', { name: 'Ver ejemplo: 真', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await card.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
  await expect(card.locator('.vocabulary-example-translation')).toBeVisible();
});

test('missing photograph falls back to the same readable golden card', async ({ page }) => {
  await page.route('**/images/games/reto-mixto/cat.webp', route => route.abort());
  await ready(page, '/study/l3/vocabulary?q=猫');
  const card = page.getByRole('article', { name: 'Ficha de 猫', exact: true });
  await expect(card).not.toHaveClass(/has-image/);
  await expect(card.locator('.vocabulary-translation')).toHaveText('gato');
  await expect(card.locator('img')).toHaveCount(0);
  const bounds = await card.boundingBox();
  expect(Math.abs(bounds!.width / bounds!.height - 1.61803398875)).toBeLessThan(.01);
  await card.getByRole('button', { name: 'Ver ejemplo: 猫', exact: true }).click();
  await expect(card.locator('.vocabulary-example-text')).toHaveText('一只猫');
});
