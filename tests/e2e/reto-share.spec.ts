import { expect, test } from '@playwright/test';

const sharedGames = [
  { id: 'reto-mixto', name: 'Reto Mixto', title: 'Reto Mixto · Míng', scope: 'l1-l2-l3', entry: '.mixed-challenge.setup' },
  { id: 'hora', name: '¿Qué hora es?', title: '现在几点？ · Míng', scope: 'l2', entry: '.time-start' },
  { id: 'panda-quest', name: 'Panda Quest', title: 'Panda Quest · Míng', scope: 'l4', entry: '.pq-menu' },
] as const;

test('los iconos copian enlaces directos y abren Reto Mixto, la hora y Panda Quest', async ({ page }) => {
  test.setTimeout(60_000);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (url: string) => { (window as typeof window & { __sharedGameUrl?: string }).__sharedGameUrl = url; },
    } });
  });
  for (const game of sharedGames) {
    const directPath = `/study/${game.scope}/games?game=${game.id}`;
    await page.goto(`/study/${game.scope}/games`);
    await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
    const expectedUrl = new URL(directPath, page.url()).toString();
    const card = page.locator(`[data-game="${game.id}"]`);
    const share = card.getByRole('button', { name: `Compartir ${game.name}`, exact: true });
    await expect(share).toHaveAttribute('data-share-path', directPath);
    await share.click();
    await expect(card.getByRole('status')).toHaveText('Enlace copiado');
    const copiedUrl = await page.evaluate(() => (window as typeof window & { __sharedGameUrl?: string }).__sharedGameUrl);
    expect(copiedUrl).toBe(expectedUrl);
    await expect(page.locator('.arcade-catalog')).toBeVisible();

    await page.goto(copiedUrl!);
    await expect(page).toHaveURL(expectedUrl);
    await expect(page.locator(game.entry)).toBeVisible();
    await expect(page.locator('.arcade-catalog')).toBeHidden();
    await expect(page.locator('#arena')).toBeFocused();
    if (game.id === 'panda-quest') await expect(page.locator('.pq-world')).toHaveCount(4);
  }
});

test('los iconos comparten el título y scope correctos con la hoja nativa', async ({ page }) => {
  test.setTimeout(60_000);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => {
      (window as typeof window & { __sharedGameData?: ShareData }).__sharedGameData = data;
    } });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { (window as typeof window & { __clipboardUsed?: boolean }).__clipboardUsed = true; },
    } });
  });
  for (const game of sharedGames) {
    await page.goto(`/study/${game.scope}/games`);
    await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
    const expectedUrl = new URL(`/study/${game.scope}/games?game=${game.id}`, page.url()).toString();
    await page.locator(`[data-game="${game.id}"]`).getByRole('button', { name: `Compartir ${game.name}`, exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __sharedGameData?: ShareData }).__sharedGameData))
      .toEqual({ title: game.title, url: expectedUrl });
    expect(await page.evaluate(() => (window as typeof window & { __clipboardUsed?: boolean }).__clipboardUsed)).toBeUndefined();
  }
});
