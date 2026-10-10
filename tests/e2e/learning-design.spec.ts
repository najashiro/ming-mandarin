import { expect, test } from '@playwright/test';

test('inicio, lecciones y práctica son accesibles en laptop y móvil', async ({ page }, info) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/course', '/practice', '/study/l4']) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${route} at ${width}px`).toBeLessThanOrEqual(1);
      if (route === '/') {
        await expect(page.locator('.lesson-tile')).toHaveCount(4);
        await expect.poll(() => page.locator('.welcome-art > img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        await page.screenshot({ path: info.outputPath('home-' + width + '.png'), fullPage: true });
      }
      if (width <= 800) {
        const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
        await expect(nav).toBeVisible();
        expect(await nav.getByRole('link').evaluateAll(links => links.every(link => link.getBoundingClientRect().height >= 44))).toBe(true);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('la práctica respeta la lección elegida y permite regresar a la ruta', async ({ page }) => {
  await page.goto('/practice');
  await page.getByRole('radio', { name: 'Lección 4', exact: true }).check();
  await page.getByRole('link', { name: /Escucha una conversación/ }).click();
  await expect(page).toHaveURL(/\/study\/l4\/dialogues$/);
  await expect(page.locator('.dialogue-turn')).toHaveCount(27);
  await page.getByRole('link', { name: 'Volver a la ruta de esta lección' }).click();
  await expect(page).toHaveURL(/\/study\/l4$/);
  await page.getByRole('link', { name: /Lee y comprende/ }).click();
  await expect(page.locator('.corpus-dialogue')).toHaveCount(6);
  await expect(page.locator('.curriculum-nav a[href="/study/l1/readings"]')).toHaveCount(0);
});

test('retomar vuelve a la última sección válida y no acepta destinos externos', async ({ page }) => {
  await page.goto('/study/l4/grammar');
  await page.getByRole('link', { name: 'Míng, inicio' }).click();
  await expect(page.getByRole('link', { name: 'Retomar mi estudio' })).toHaveAttribute('href', '/study/l4/grammar');
  await page.reload();
  await expect(page.getByRole('link', { name: 'Retomar mi estudio' })).toHaveAttribute('href', '/study/l4/grammar');
  await page.evaluate(() => localStorage.setItem('ming-last-study-v1', 'https://example.com'));
  await page.reload();
  await expect(page.getByRole('link', { name: 'Empezar a aprender' })).toHaveAttribute('href', '/study/l1');
});

test('el inicio funciona sin almacenamiento y el salto de teclado llega al contenido', async ({ page, browserName }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
  });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Empezar a aprender' })).toBeVisible();
  const skipLink = page.getByRole('link', { name: 'Saltar al contenido' });
  // iOS WebKit does not enable desktop Tab-to-links navigation by default.
  // Check keyboard activation there; Chromium also checks first-Tab discovery.
  if (browserName === 'webkit') await skipLink.focus();
  else await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#learning-content')).toBeFocused();
});

test('en celular se puede cambiar de lección manteniendo la actividad', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/study/l4/dialogues');
  const selector = page.getByRole('combobox', { name: 'Cambiar lección de estudio' });
  await expect(selector).toHaveValue('l4');
  await selector.selectOption('l2');
  await expect(page).toHaveURL(/\/study\/l2\/dialogues$/);
  await expect(selector).toHaveValue('l2');
});
