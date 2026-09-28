import { test, expect } from '@playwright/test';

async function installAudioMock(page: import('@playwright/test').Page, blocked = false) {
  await page.addInitScript((deny) => {
    (window as typeof window & { mixAudioPlays?: number }).mixAudioPlays = 0;
    Math.random = () => 0;
    window.Audio = function () {
      const audio = document.createElement('audio');
      audio.play = () => {
        (window as typeof window & { mixAudioPlays?: number }).mixAudioPlays = ((window as typeof window & { mixAudioPlays?: number }).mixAudioPlays ?? 0) + 1;
        if (deny) return Promise.reject(new DOMException('blocked', 'NotAllowedError'));
        queueMicrotask(() => audio.dispatchEvent(new Event('playing')));
        return Promise.resolve();
      };
      audio.pause = () => audio.dispatchEvent(new Event('pause'));
      return audio;
    } as unknown as typeof Audio;
  }, blocked);
}

async function ready(page: import('@playwright/test').Page, path = '/study/l3/games/vocabulary-mix') {
  await page.goto(path);
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
}

test('fixed deck survives reload, completes, reviews misses and starts a new sequence', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await installAudioMock(page);
  await ready(page, '/study/l3/games/vocabulary-mix?q=mascota&favorites=1&page=4&level=basic&mode=image');
  await expect(page).toHaveURL('/study/l3/games/vocabulary-mix');
  await expect(page.getByRole('heading', { level: 1, name: 'Vocabulario Mix' })).toHaveCount(1);
  await expect(page.getByRole('combobox', { name: 'Buscar' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Solo favoritos' })).toHaveCount(0);
  await expect(page.getByText(/palabras disponibles/)).toHaveCount(1);
  await page.screenshot({ path: info.outputPath('mix-setup.png'), fullPage: true });
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 0/10');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Correctas: 0');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Incorrectas: 0');
  await expect(page.locator('.vocabulary-mix-prompt')).toBeVisible();
  await expect(page.locator('.word-pinyin')).toHaveCount(0);
  await expect(page.locator('.vocabulary-translation')).toHaveCount(0);
  const original = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(original.deck).toHaveLength(10);
  expect(new Set(original.deck).size).toBe(10);
  await page.screenshot({ path: info.outputPath('mix-question.png'), fullPage: true });
  await expect.poll(() => page.evaluate(() => (window as typeof window & { mixAudioPlays?: number }).mixAudioPlays ?? 0)).toBe(1);

  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  const card = page.getByRole('article', { name: /Ficha de/ });
  await expect(card).toBeVisible();
  await page.screenshot({ path: info.outputPath('mix-answer.png'), fullPage: true });
  await expect(card.getByRole('button', { name: /Favorito:/ })).toHaveCount(0);
  const flip = card.getByRole('button', { name: /Ver ejemplo:/ });
  if (await flip.count()) {
    await flip.click();
    await expect(card).toHaveClass(/is-reversed/);
    await page.screenshot({ path: info.outputPath('mix-reverse.png'), fullPage: true });
  }
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 1/10');
  await expect(page.locator('.word-pinyin')).toHaveCount(0);

  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Partida en pausa' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Reanudar', exact: true }).click();
  const resumed = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(resumed.deck).toEqual(original.deck);
  expect(resumed.index).toBe(1);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await page.getByRole('button', { name: 'No lo sabía', exact: true }).dblclick();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 2/10');
  const afterDouble = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(afterDouble.answers).toHaveLength(2);
  expect(afterDouble.deck).toEqual(original.deck);

  for (let index = 2; index < 10; index += 1) {
    await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
    await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Partida terminada' })).toBeVisible();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 10/10');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Correctas: 9');
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Incorrectas: 1');
  await page.screenshot({ path: info.outputPath('mix-results.png'), fullPage: true });

  await page.getByRole('button', { name: 'Repasar incorrectas (1)' }).click();
  const review = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(review.kind).toBe('review');
  expect(review.deck).toHaveLength(1);
  expect(review.originResult.sessionId).toBe(original.id);
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await page.getByRole('button', { name: 'Lo sabía', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Partida terminada' })).toBeVisible();
  await page.getByRole('button', { name: 'Nueva partida' }).click();
  const next = await page.evaluate(() => JSON.parse(localStorage.getItem('ming-vocabulary-v1:guest')!).sessions.l3);
  expect(next.id).not.toBe(original.id);
  expect(next.deck).toHaveLength(10);
  expect(next.deck).not.toEqual(original.deck);
  expect(next.kind).toBe('normal');
  expect(errors).toEqual([]);
});

test('blocked autoplay keeps manual audio and score untouched', async ({ page }) => {
  await installAudioMock(page, true);
  await ready(page);
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await expect(page.getByText('Pulsa el audio para escuchar.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Escuchar/ })).toBeVisible();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 0/10');
  await page.getByRole('button', { name: /Escuchar/ }).click();
  await expect(page.locator('.vocabulary-mix-score')).toContainText('Respondidas: 0/10');
});

test('mobile Mix keeps controls reachable without horizontal overflow', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await installAudioMock(page);
  await ready(page, '/study/l1-l2/games/vocabulary-mix');
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  const actions = page.locator('.vocabulary-evaluation button');
  await expect(actions).toHaveCount(2);
  await expect(actions.nth(0)).toContainText('知道');
  await expect(actions.nth(0)).toContainText('Lo sabía');
  await expect(actions.nth(1)).toContainText('不知道');
  await expect(actions.nth(1)).toContainText('No lo sabía');
  for (const button of await actions.all()) {
    const box = await button.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('mix-mobile-revealed.png'), fullPage: true });
});
