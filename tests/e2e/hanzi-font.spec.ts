import { expect, test, type Page } from '@playwright/test';

async function expectHostedHanzi(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(() => {
    const normalizeFamily = (value: string) => value.split(',')[0].trim().replace(/^["']|["']$/g, '');
    const family = normalizeFamily(getComputedStyle(document.documentElement).getPropertyValue('--font-hanzi'));
    const missed: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let count = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || parent.closest('script,style,svg') || !parent.getClientRects().length || !/\p{Script=Han}/u.test(node.textContent ?? '')) continue;
      count += 1;
      if (!parent.closest('.font-hanzi') || normalizeFamily(getComputedStyle(parent).fontFamily) !== family) missed.push(node.textContent ?? '');
    }
    return { family, count, missed, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  expect(result.family).toBeTruthy();
  expect(result.count).toBeGreaterThan(0);
  expect(result.missed).toEqual([]);
  expect(result.overflow).toBe(false);
}

test('Hanzi usa la fuente del proyecto en contenido, laboratorio y textos mixtos', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of ['/', '/study/l1-l2-l3/vocabulary', '/study/l1-l2-l3/dialogues', '/lesson/1/pinyin', '/study/l1-l2-l3/grammar']) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await expectHostedHanzi(page);
    const pinyin = page.locator('.pinyin-text');
    for (const element of await pinyin.all()) await expect(element).not.toHaveCSS('font-family', /Noto.?Serif/i);
  }
  await page.goto('/study/l1-l2-l3/hanzi?character=饺');
  await page.waitForLoadState('networkidle');
  for (const tab of ['Aprender', 'Componentes', 'Trazos', 'Practicar']) {
    await page.getByRole('tab', { name: tab, exact: true }).click();
    await expect(page.locator('.hanzi-tab-panel')).toBeVisible();
    await expectHostedHanzi(page);
  }
  expect(errors).toEqual([]);
});

test('la fuente cubre los glifos del examen sin recurrir a fuentes instaladas', async ({ page, browserName }) => {
  const fontRequests: string[] = [];
  page.on('request', (request) => { if (request.resourceType() === 'font') fontRequests.push(request.url()); });
  await page.goto('/');
  const sample = '饺饭识海哪妈语什们姐汉老那都工作一共照片家饣交讠只';
  const loadedFaces = await page.evaluate(async (text) => {
    const sample = document.createElement('span');
    sample.id = 'font-coverage-sample';
    sample.className = 'font-hanzi';
    sample.textContent = text;
    document.body.append(sample);
    const faces = await document.fonts.load(`48px ${getComputedStyle(sample).fontFamily.split(',')[0]}`, text);
    await document.fonts.ready;
    return faces.filter((face) => face.status === 'loaded').length;
  }, sample);
  expect(loadedFaces).toBeGreaterThan(0);
  expect(fontRequests.length).toBeGreaterThan(0);
  expect(fontRequests.every((url) => new URL(url).origin === new URL(page.url()).origin && new URL(url).pathname.startsWith('/_next/static/'))).toBe(true);
  if (browserName === 'chromium') {
    const session = await page.context().newCDPSession(page);
    await session.send('DOM.enable');
    await session.send('CSS.enable');
    const { root } = await session.send('DOM.getDocument');
    const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#font-coverage-sample' });
    const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId });
    expect(fonts.length).toBeGreaterThan(0);
    expect(fonts.every((font) => font.isCustomFont && /Noto Serif SC/.test(font.familyName))).toBe(true);
    expect(fonts.reduce((sum, font) => sum + font.glyphCount, 0)).toBeGreaterThanOrEqual(sample.length);
    await session.detach();
  }
});

test('el examen conserva español y pinyin al presentar y escribir chino', async ({ page }) => {
  await page.route('**/api/exam/start', (route) => route.fulfill({ json: {
    sessionId: 'font-review', questions: [{ id: 'font-question', section: 'hanzi', points: 5, prompt: 'Escribe 饺子 · jiǎozi · ravioles chinos · 123.' }],
  } }));
  await page.goto('/study/l1-l2-l3/exam');
  await page.getByRole('button', { name: 'Comenzar examen' }).click();
  const question = page.locator('.exam-question > p');
  await expect(question).toHaveText('Escribe 饺子 · jiǎozi · ravioles chinos · 123.');
  await expect(question.locator('.font-hanzi')).toHaveText('饺子');
  await expectHostedHanzi(page);
  const input = page.getByPlaceholder('Escribe tu respuesta');
  await input.fill('饺子');
  await expect(input).toHaveClass('font-hanzi');
  await input.fill('jiǎozi');
  await expect(input).not.toHaveClass('font-hanzi');
  await expect(input).toHaveValue('jiǎozi');
});
