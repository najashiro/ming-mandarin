import { expect, test } from '@playwright/test';

const directPath = '/study/l1-l2-l3/games?game=reto-mixto';

test('el icono comparte el enlace directo y la URL abre Reto Mixto', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (url: string) => { (window as typeof window & { __sharedRetoUrl?: string }).__sharedRetoUrl = url; },
    } });
  });
  await page.goto('/study/l1-l2-l3/games');
  await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
  const card = page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' });
  const share = card.getByRole('button', { name: 'Compartir Reto Mixto' });
  await expect(share).toHaveAttribute('data-share-path', directPath);
  await share.click();
  await expect(card.getByRole('status')).toHaveText('Enlace copiado');
  expect(await page.evaluate(() => (window as typeof window & { __sharedRetoUrl?: string }).__sharedRetoUrl)).toBe(new URL(directPath, page.url()).toString());

  await page.goto(directPath);
  await expect(page.locator('.mixed-challenge.setup')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Configura tu sesión' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
});

test('el icono usa la hoja nativa de compartir cuando está disponible', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => {
      (window as typeof window & { __sharedRetoData?: ShareData }).__sharedRetoData = data;
    } });
  });
  await page.goto('/study/l1-l2-l3/games');
  await page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' }).getByRole('button', { name: 'Compartir Reto Mixto' }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __sharedRetoData?: ShareData }).__sharedRetoData?.url)).toBe(new URL(directPath, page.url()).toString());
});

const games = [
  { id: 'direcciones', scope: 'l6', name: 'Una llamada, mil vueltas', path: '/directions', screen: '.directions-game' },
  { id: 'reto-mixto', scope: 'l3', name: 'Reto Mixto', path: '?game=reto-mixto', screen: '.mixed-challenge.setup' },
  { id: 'vocabulario-mix', scope: 'l3', name: 'Vocabulario Mix', path: '/vocabulary-mix', screen: '.active-vocabulary' },
  { id: 'hora', scope: 'l3', name: '¿Qué hora es?', path: '?game=hora', screen: '.time-start' },
  { id: 'conversacion', scope: 'l3', name: 'Conversación', path: '?game=conversacion', screen: '.conversation-missions' },
  { id: 'hanzi-lab', scope: 'l3', name: 'Hanzi Lab', path: '?game=hanzi-lab', screen: '.hanzi-game' },
  { id: 'cumpleanos', scope: 'l5', name: 'Organiza el cumpleaños', path: '?game=cumpleanos', screen: '.birthday-game' },
  { id: 'escondites', scope: 'l6', name: '¿Dónde se escondió?', path: '?game=escondites', screen: '.hide-welcome' },
];

for (const game of games) {
  test(`compartir ${game.name} conserva la lección y abre el juego`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async (url: string) => { (window as typeof window & { sharedUrl?: string }).sharedUrl = url; },
      } });
    });
    const catalogPath = `/study/${game.scope}/games`;
    const destination = catalogPath + game.path;
    await page.goto(catalogPath);
    await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
    const card = page.locator(`[data-game="${game.id}"]`);
    const share = card.getByRole('button', { name: `Compartir ${game.name}`, exact: true });
    await expect(share).toHaveAttribute('data-share-path', destination);
    const box = await share.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await share.click();
    await expect(card.getByRole('status')).toHaveText('Enlace copiado');
    await expect(page).toHaveURL(catalogPath);
    const copied = await page.evaluate(() => (window as typeof window & { sharedUrl?: string }).sharedUrl);
    expect(copied).toBe(new URL(destination, page.url()).toString());
    await page.goto(copied!);
    await expect(page.locator(game.screen)).toBeVisible();
    if (game.path.startsWith('?')) {
      await expect(page.locator('.arcade-catalog')).toBeHidden();
      await page.locator('#arena').getByRole('button', { name: 'Cerrar', exact: true }).click();
      await expect(page.locator('.arcade-catalog')).toBeVisible();
      await expect(page.locator('.game-catalog-heading')).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}

for (const activity of [
  { mode: 'order', title: 'Constructor de frases' },
  { mode: 'complete', title: 'El carácter que falta' },
  { mode: 'dialogue', title: 'Conecta la conversación' },
]) {
  test(`compartir ${activity.title} abre el modo del cuaderno`, async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => {
        (window as typeof window & { sharedGame?: ShareData }).sharedGame = data;
      } });
    });
    await page.goto('/study/l6/games');
    await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
    const card = page.locator(`[data-workbook-game="${activity.mode}"]`);
    await card.getByRole('button', { name: `Compartir ${activity.title}` }).click();
    const data = await page.evaluate(() => (window as typeof window & { sharedGame?: ShareData }).sharedGame);
    expect(data).toEqual({ title: `${activity.title} · Míng`, url: new URL(`/study/l6/games/workbook?mode=${activity.mode}`, page.url()).toString() });
    await expect(page).toHaveURL('/study/l6/games');
    await page.goto(data!.url!);
    await expect(page.locator('.workbook-mode[aria-pressed="true"]')).toContainText(activity.title);
    await expect(page.locator('.workbook-games')).toHaveAttribute('data-workbook-scope', 'l6');
    await page.getByRole('button', { name: 'Empezar a jugar' }).click();
    await expect(page.locator('.workbook-round')).toBeVisible();
  });
}

test('todos los juegos visibles tienen compartir, sin desbordes en móvil', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const scope of ['l4', 'l5', 'l6', 'l1-l2-l3-l4-l5-l6']) {
    await page.goto(`/study/${scope}/games`);
    const cards = page.locator('[data-game], [data-workbook-game]');
    await expect(page.getByRole('button', { name: /^Compartir / })).toHaveCount(await cards.count());
    for (const card of await cards.all()) await expect(card.getByRole('button', { name: /^Compartir / })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  await page.screenshot({ path: info.outputPath('all-games-share-mobile.png'), fullPage: true });
});

test('los enlaces inválidos o de otra lección muestran el catálogo', async ({ page }) => {
  for (const [scope, game] of [['l3', 'escondites'], ['l3', 'direcciones'], ['l3', 'cumpleanos'], ['l4', 'conversacion'], ['l6', 'desconocido']]) {
    await page.goto(`/study/${scope}/games?game=${game}`);
    await expect(page.locator('.arcade-catalog')).toBeVisible();
    await expect(page.locator('#arena')).toBeHidden();
  }
});

test('las URLs por identificador también abren los juegos con página propia', async ({ page }) => {
  await page.goto('/study/l6/games?game=direcciones');
  await expect(page).toHaveURL('/study/l6/games/directions');
  await expect(page.locator('.directions-game')).toBeVisible();
  await page.goto('/study/l3/games?game=vocabulario-mix');
  await expect(page).toHaveURL('/study/l3/games/vocabulary-mix');
  await expect(page.locator('.active-vocabulary')).toBeVisible();
});

test('cancelar compartir no copia, y un fallo permite copiar el enlace', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Cancelado', 'AbortError'); } });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (url: string) => { (window as typeof window & { sharedUrl?: string }).sharedUrl = url; },
    } });
  });
  await page.goto('/study/l6/games');
  const card = page.locator('[data-game="direcciones"]');
  const button = card.getByRole('button', { name: 'Compartir Una llamada, mil vueltas' });
  await button.click();
  await expect(card.getByRole('status')).toBeEmpty();
  expect(await page.evaluate(() => (window as typeof window & { sharedUrl?: string }).sharedUrl)).toBeUndefined();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('No disponible', 'NotAllowedError'); } });
  });
  await button.click();
  await expect(card.getByRole('status')).toHaveText('Enlace copiado');
  expect(await page.evaluate(() => (window as typeof window & { sharedUrl?: string }).sharedUrl)).toBe(new URL('/study/l6/games/directions', page.url()).toString());
});

test('si tampoco se puede copiar, muestra el enlace para copiarlo manualmente', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  });
  await page.goto('/study/l6/games');
  const dialogPromise = page.waitForEvent('dialog');
  const click = page.getByRole('button', { name: 'Compartir ¿Dónde se escondió?' }).click();
  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('prompt');
  expect(dialog.defaultValue()).toBe(new URL('/study/l6/games?game=escondites', page.url()).toString());
  await dialog.dismiss();
  await click;
});
