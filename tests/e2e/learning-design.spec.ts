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

test('práctica y curso ofrecen cuatro lecciones y un único repaso general', async ({ page }) => {
  await page.goto('/practice');
  await expect(page.getByRole('radio')).toHaveCount(5);
  await page.getByRole('radio', { name: 'Repaso general', exact: true }).check();
  await expect(page.getByRole('link', { name: /Escucha una conversación/ })).toHaveAttribute('href', '/study/l1-l2-l3-l4/dialogues');
  await expect(page.getByRole('link', { name: /Lee un poco más/ })).toBeVisible();
  await page.goto('/course');
  await expect(page.locator('.review-links a')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Repaso general', exact: true })).toHaveAttribute('href', '/study/l1-l2-l3-l4');
});

test('los enlaces de repaso anteriores conservan su contenido y permiten salir al repaso general', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [scope, lesson] of [['l1-l2', 2], ['l1-l2-l3', 3]] as const) {
    await page.goto(`/study/${scope}`);
    await expect(page.getByRole('heading', { name: `Repaso hasta la lección ${lesson}`, exact: true })).toBeVisible();
    const selector = page.getByRole('combobox', { name: 'Cambiar lección de estudio' });
    await expect(selector).toHaveValue(scope);
    await expect(selector.locator('option:checked')).toHaveText(`Repaso hasta la lección ${lesson}`);
    await expect(selector.locator('option:not([disabled])')).toHaveCount(5);
    await expect(page.locator('.curriculum-links a')).toHaveCount(5);
    await expect(page.locator('.curriculum-links')).not.toContainText('+');
    await page.getByRole('link', { name: /Escucha los diálogos/ }).click();
    await expect(page).toHaveURL(new RegExp(`/study/${scope}/dialogues$`));
    await expect(selector).toHaveValue(scope);
    await selector.selectOption('l1-l2-l3-l4');
    await expect(page).toHaveURL(/\/study\/l1-l2-l3-l4\/dialogues$/);
    await expect(selector.locator('option:checked')).toHaveText('Repaso general');
  }
});

test('el catálogo conserva búsquedas históricas y limpia la selección al cambiar de lección', async ({ page }) => {
  await page.goto('/study/l1-l2-l3/vocabulary?q=%E5%8C%BB%E7%94%9F');
  const selector = page.getByRole('combobox', { name: 'Lección', exact: true });
  await expect(page.locator('.active-vocabulary')).toHaveAttribute('data-ready', 'true');
  await expect(selector).toHaveValue('l1-l2-l3');
  await expect(selector.locator('option:checked')).toHaveText('Repaso hasta la lección 3');
  await expect(selector.locator('option:not([disabled])')).toHaveText(['Lección 1', 'Lección 2', 'Lección 3', 'Lección 4', 'Repaso general']);
  await expect(page.locator('.vocabulary-count').first()).toHaveText('1 palabra');
  await selector.selectOption('l4');
  await expect(page).toHaveURL(/\/study\/l4\/vocabulary\??$/);
  await expect(page.getByRole('combobox', { name: 'Buscar', exact: true })).toHaveValue('');
  await expect(selector.locator('option')).toHaveCount(5);
  await expect(page.locator('.vocabulary-count').first()).toHaveText('73 palabras');
});
