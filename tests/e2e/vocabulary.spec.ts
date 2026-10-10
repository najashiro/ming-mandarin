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
  await expect(page.locator('.vocabulary-card')).toHaveCount(1);
  await card.getByRole('button', { name: 'Favorito: 宠物' }).click();
  await expect(card.getByRole('button', { name: 'Ver palabra: 宠物' })).toHaveCount(0);
  await expect(card.getByRole('button', { name: 'Ver ejemplo: 宠物', exact: true })).toHaveCount(1);
  await page.reload();
  await expect(card.getByRole('button', { name: 'Favorito: 宠物' })).toHaveAttribute('aria-pressed', 'true');

  await expect(page.getByRole('combobox', { name: 'Lección', exact: true }).locator('option')).toHaveText(['Lección 1', 'Lección 2', 'Lección 3', 'Lección 4', 'Repaso general']);
  await page.getByRole('button', { name: 'Solo favoritos', exact: true }).click();
  await expect(card).toBeVisible();
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l1');
  await expect(page.getByText('Sin resultados. Ajusta')).toBeVisible();
  await page.getByRole('combobox', { name: 'Lección', exact: true }).selectOption('l3');
  await expect(card).toBeVisible();

});
test('catalog pagination returns to the top for the next reading pass', async ({ page }) => {
  await ready(page, '/study/l1-l2-l3/vocabulary');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(8);
});
test('Mix ignores obsolete catalog filters, reveals the shared card and saves one evaluation', async ({ page }) => {
  await ready(page, `${root}?q=mascota&mode=mix&level=basic`);
  await expect(page).toHaveURL(/\/games\/vocabulary-mix$/);
  await expect(page.getByRole('combobox', { name: 'Buscar' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Solo favoritos' })).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: 'Contenido' }).locator('option')).toHaveText(['Lección 1', 'Lección 2', 'Lección 3', 'Lección 4', 'Repaso general']);
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  const mix = page.getByRole('region', { name: 'Vocabulario Mix', exact: true });
  await expect(mix.getByRole('button', { name: 'Lo sabía', exact: true })).toHaveCount(0);
  await expect(mix.locator('.word-pinyin')).toHaveCount(0);
  await expect(mix.getByRole('link')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await expect(mix.getByRole('article', { name: /Ficha de/ })).toBeVisible();
  await expect(mix.getByRole('button', { name: /Favorito:/ })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Lo sabía', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  await page.getByRole('button', { name: 'No lo sabía', exact: true }).dblclick();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/10');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  expect(saved.sessions.l3.answers).toHaveLength(1);
  expect(saved.sessions.l3.deck).toHaveLength(10);
  await page.reload();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/10');
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
for (const width of [320, 375, 390, 430, 768, 1280]) test(`layout and real screenshots at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, '/study/l2/vocabulary?q=米饭');
  await expect(page.locator('.vocabulary-card')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath(`${width}-catalog.png`), fullPage: true });
  await page.locator('.vocabulary-card-tools').getByRole('button', { name: /Ver ejemplo/ }).click();
  await page.screenshot({ path: info.outputPath(`${width}-reverse.png`), fullPage: true });
  await ready(page, '/study/l2/games/vocabulary-mix?q=米饭');
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.screenshot({ path: info.outputPath(`${width}-mix.png`), fullPage: true });
  await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });
  const overflow = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('body *')].filter(element => {
    const box = element.getBoundingClientRect();
    return box.right > innerWidth + 1 || box.left < -1;
  }).map(element => ({ tag: element.tagName, className: element.className, text: element.innerText?.slice(0, 40), box: element.getBoundingClientRect().toJSON() })).slice(0, 10));
  expect(overflow).toEqual([]);
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
  await expect.poll(() => card.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(front);
  await expect(card.locator('.vocabulary-example-text')).toHaveText(firstExample('米饭').hanzi);
  await expect(card.locator('.vocabulary-example-text .audio-button[disabled]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Solo favoritos', exact: true }).click();
  await expect(page).not.toHaveURL(/source=|selection=|level=/);
});

test('audited words stay curricular and Mix exposes only approved setup controls', async ({ page }) => {
  for (const [scope, hanzi, pinyin] of [['l1', '马马虎虎', 'mǎmǎhūhū'], ['l2', '中国', 'Zhōngguó'], ['l1', '太', 'tài'], ['l3', '宠物', 'chǒngwù'], ['l3', '约翰', 'Yuēhàn']]) {
    await ready(page, `/study/${scope}/vocabulary?q=${encodeURIComponent(hanzi)}`);
    const card = page.getByRole('article', { name: `Ficha de ${hanzi}`, exact: true });
    await expect(card.getByText(pinyin, { exact: true })).toBeVisible();
    const flip = card.locator('.vocabulary-card-tools').getByRole('button', { name: /Ver ejemplo/ });
    if (await flip.count()) await flip.click();
    await expect(card).not.toContainText(/pendiente|SRC-|PDF|revisión|fuente/i);
  }
  await ready(page, '/study/l1/vocabulary?q=马马虎虎&mode=mix');
  await expect(page.getByRole('button', { name: 'Empezar', exact: true })).toBeEnabled();
  await expect(page.getByRole('combobox', { name: 'Nivel' })).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: 'Tipo de pista' })).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: 'Palabras' }).locator('option')).toHaveText(['10', '20', '30', '50']);
});

test('legacy Mix is retired once while favorites and progress survive', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem('ming-vocabulary-v1:guest', JSON.stringify({ version: 1, favorites: ['v-约翰'], faces: {}, progress: { 'v-约翰:hanzi': { due: 100, streak: 2, attempts: 3, lastEvent: 'old:0' } }, sessions: { l3: { id: 'before-corpus-sync', scope: 'l3', level: 'hard', queue: [{ wordId: 'v-约翰', type: 'hanzi' }], index: 0, revealed: true, paused: false, events: [] } } }));
  });
  await ready(page, '/study/l3/vocabulary?mode=mix');
  await expect(page.getByText('El juego se actualizó. Tu progreso anterior se conserva; empieza una nueva partida.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Empezar', exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('390-migrated-mix.png'), fullPage: true });
  await page.getByRole('button', { name: 'Cerrar aviso' }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  expect(saved.progress['v-约翰:hanzi'].attempts).toBe(3);
  expect(saved.favorites).toEqual(['v-约翰']);
  expect(saved.sessions).toEqual({});
});

for (const [from, query, hanzi, target] of [['l1', '中国', '中国', 'l2'], ['l1', 'mascota', '宠物', 'l3'], ['l3', '你', '你', 'l1'], ['l2', 'mamahuhu', '马马虎虎', 'l1'], ['l1-l2-l3', 'mamahuhu', '马马虎虎', 'l1']]) test(`global search ${from}: ${query} navigates to ${target}`, async ({ page }) => {
  await ready(page, `/study/${from}/vocabulary`);
  const search = page.getByRole('combobox', { name: 'Buscar', exact: true });
  await search.fill(query);
  const option = page.getByRole('option').filter({ has: page.locator('strong', { hasText: new RegExp(`^${hanzi}$`) }) });
  await expect(option).toContainText(target.toUpperCase());
  await option.click();
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue(target);
  await expect(search).toHaveValue(hanzi);
  await expect(page.getByRole('listbox')).toHaveCount(0);
  const card = page.getByRole('article', { name: `Ficha de ${hanzi}`, exact: true });
  await expect(card).not.toBeFocused();
  await expect(card).toBeInViewport();
  await expect(page.locator('.vocabulary-card')).toHaveCount(1);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page.getByRole('button', { name: 'Limpiar búsqueda' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Lección', exact: true })).toHaveValue(target);
  await expect(page.locator('.vocabulary-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.vocabulary-card')).toHaveCount(24);
});

test('legacy card links filter one word regardless of old page', async ({ page }) => {
  await ready(page, '/study/l1/vocabulary?page=4&card=v-%E9%AB%98%E5%85%B4');
  await expect(page.locator('.vocabulary-card')).toHaveCount(1);
  await expect(page.getByRole('combobox', { name: 'Buscar', exact: true })).toHaveValue('高兴');
  await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();
  await expect(page.locator('.vocabulary-card')).toHaveCount(24);
  await expect(page).not.toHaveURL(/card=|page=/);
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

test('incompatible old Mix is not rewritten and l1-l2 remains directly accessible', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ming-vocabulary-v1:guest', JSON.stringify({ version: 1, favorites: [], faces: {}, progress: { 'v-你:hanzi': { due: 1, streak: 1, attempts: 2, lastEvent: 'history:0' } }, sessions: { l2: { id: 'old-partition', scope: 'l2', level: 'hard', queue: [{ wordId: 'v-你', type: 'hanzi' }, { wordId: 'v-中国', type: 'hanzi' }], index: 0, revealed: true, paused: false, events: [] } } })));
  await ready(page, '/study/l2/vocabulary?mode=mix');
  await expect(page.getByText(/El juego se actualizó/)).toBeVisible();
  await page.goto('/study/l1-l2/games/vocabulary-mix');
  await expect(page).toHaveURL(/\/study\/l1-l2\/games\/vocabulary-mix$/);
  await expect(page.getByRole('combobox', { name: 'Contenido' })).toHaveValue('l1-l2');
  await expect(page.getByText(/palabras disponibles/)).toBeVisible();
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
  await card.screenshot({ path: info.outputPath('reverse-emphasis.png') });
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
  await cat.locator('.vocabulary-card-tools').getByRole('button', { name: 'Ver ejemplo: 猫', exact: true }).click();
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
  await cat.screenshot({ path: info.outputPath(`cat-reverse-${width}.png`) });
  await page.reload();
  await expect(cat).not.toHaveClass(/is-reversed/);
  await expect(cat.getByRole('button', { name: 'Favorito: 猫', exact: true })).toHaveAttribute('aria-pressed', 'true');

  // A persisted single-word session exercises exactly the same public examples.
  await page.evaluate(() => {
    const key = 'ming-vocabulary-v1:guest';
    const state = JSON.parse(localStorage.getItem(key)!);
    state.sessions.l3 = { formatVersion: 2, id: 'cat-corpus', userId: 'guest', scope: 'l3', requestedSize: 10, actualSize: 1, deck: ['v-猫'], index: 0, revealed: true, paused: false, kind: 'normal', startedAt: 1, answers: [] };
    localStorage.setItem(key, JSON.stringify(state));
  });
  await ready(page, '/study/l3/vocabulary?mode=mix');
  const mix = page.getByRole('region', { name: 'Vocabulario Mix', exact: true });
  await mix.getByRole('button', { name: 'Ver ejemplo: 猫', exact: true }).click();
  for (const [chinese] of expected) {
    await expect(mix.locator('.vocabulary-example-text')).toHaveText(chinese);
    await mix.getByRole('button', { name: 'Otro ejemplo', exact: true }).click();
  }
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!));
  expect(saved.sessions.l3.answers).toEqual([]);
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
    if (styles.imageRatio !== null) {
      expect(styles.imageRatio).toBeCloseTo((1 + Math.sqrt(5)) / 2, 2);
    }
    if (styles.audioRadius !== null) expect(styles.audioRadius).toBe('50%');
    await card.screenshot({ path: info.outputPath(`${slug}-${width}.png`) });
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
  await page.route('**/images/vocabulary/*.webp', route => route.abort());
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
