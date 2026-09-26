import { test, expect } from '@playwright/test';

test('previously missing words and piano sentence load real audio', async ({ page }) => {
  for (const word of ['有意思', '小狗', '弹钢琴']) {
    await page.goto(`/study/l3/vocabulary?q=${encodeURIComponent(word)}`);
    const card = page.getByRole('article', { name: `Ficha de ${word}`, exact: true });
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/audio/') && response.status() < 400),
      card.getByRole('button', { name: `Escuchar: ${word}`, exact: true }).click(),
    ]);
    const recording = await page.request.get(response.url());
    expect(recording.ok()).toBe(true);
    expect((await recording.body()).length).toBeGreaterThan(1024);
    if (word === '弹钢琴') {
      await card.getByRole('button', { name: `Ver ejemplo: ${word}`, exact: true }).click();
      await card.getByRole('button', { name: 'Otro ejemplo', exact: true }).click();
      await expect(card.locator('.vocabulary-example-text')).toHaveText('你会弹钢琴吗？');
      const [sentence] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/audio/') && response.status() < 400),
        card.locator('.vocabulary-example-text .audio-button').click(),
      ]);
      const recording = await page.request.get(sentence.url());
      expect(recording.ok()).toBe(true);
      expect((await recording.body()).length).toBeGreaterThan(1024);
    }
  }
});

test('real load failure and simulated recovery never flip the card', async ({ page }) => {
  await page.route('**/audio/**', route => route.abort());
  await page.goto('/study/l2/vocabulary?q=米饭');
  const card = page.getByRole('article', { name: 'Ficha de 米饭', exact: true });
  await card.getByRole('button', { name: 'Escuchar: 米饭', exact: true }).click();
  await expect(card.getByRole('button', { name: /No se pudo reproducir. Reintentar/ })).toBeVisible();
  await expect(card.getByRole('heading', { level: 2 })).toBeVisible();
  await page.unroute('**/audio/**');
  // Simulate successful playback for state-machine coverage independently of
  // the host's WebKit audio codec/device support. Real clips are decoded separately.
  await page.evaluate(() => {
    window.Audio = function () {
      const audio = document.createElement('audio');
      audio.play = () => { queueMicrotask(() => audio.dispatchEvent(new Event('playing'))); return Promise.resolve(); };
      audio.pause = () => audio.dispatchEvent(new Event('pause'));
      return audio;
    } as unknown as typeof Audio;
  });
  await card.getByRole('button', { name: /No se pudo reproducir. Reintentar/ }).click();
  await expect(card.getByRole('button', { name: /Detener/ })).toBeVisible();
  await card.getByRole('button', { name: /Detener/ }).click();
  await expect(card.getByRole('button', { name: 'Escuchar: 米饭', exact: true })).toBeVisible();
});
test('unavailable storage leaves a working session and truthful status', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }); });
  await page.goto('/study/l3/vocabulary?q=mascota&mode=mix');
  await expect(page.getByText(/Almacenamiento no disponible/)).toBeVisible();
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.getByRole('button', { name: 'Ver respuesta', exact: true }).click();
  await page.getByRole('button', { name: 'Lo sé', exact: true }).click();
  await expect(page.getByText(/1 palabras únicas/)).toBeVisible();
});

test('only one audio plays and changing cards stops it', async ({ page }) => {
  await page.addInitScript(() => {
    window.Audio = function () {
      const audio = document.createElement('audio');
      audio.play = () => { queueMicrotask(() => audio.dispatchEvent(new Event('playing'))); return Promise.resolve(); };
      audio.pause = () => audio.dispatchEvent(new Event('pause'));
      return audio;
    } as unknown as typeof Audio;
  });
  await page.goto('/study/l2/vocabulary');
  const buttons = page.locator('.vocabulary-word-row .audio-button:not([disabled])');
  await buttons.nth(0).click();
  await expect(buttons.nth(0)).toHaveAttribute('aria-label', /Detener/);
  await buttons.nth(1).click();
  await expect(buttons.nth(0)).toHaveAttribute('aria-label', /Escuchar/);
  await expect(buttons.nth(1)).toHaveAttribute('aria-label', /Detener/);
  await expect(page.getByRole('button', { name: /Detener/ })).toHaveCount(1);
  await page.getByRole('combobox', { name: 'Buscar', exact: true }).fill('mascota');
  await expect(page.getByRole('button', { name: /Detener/ })).toHaveCount(0);
});
