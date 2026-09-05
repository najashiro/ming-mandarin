import { expect, test } from '@playwright/test';

test('la portada navega a las secciones públicas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '从认识到家庭' })).toBeVisible();
  await page.getByRole('link', { name: /Ver ruta completa/ }).click();
  await expect(page).toHaveURL(/\/lesson\/1$/);
  await page.getByRole('link', { name: /Nombre y apellido/ }).click();
  await expect(page.getByRole('heading', { name: 'Nombre y apellido' })).toBeVisible();
  await expect(page.getByText('Vocabulario auditable')).toHaveCount(0);
  await expect(page.getByText(/Fuente|PDF p\./)).toHaveCount(0);
});

test('el arcade y el audio estático están disponibles sin cuenta', async ({ page }) => {
  await page.goto('/lesson/1/games');
  await expect(page.getByRole('heading', { name: '30 formas de practicar' })).toBeVisible();
  await expect(page.locator('.mobile-nav a[href="/study/l1-l2-l3/games"]')).toContainText('Juegos');
  await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('.game-grid article').nth(0).getByRole('heading')).toHaveText('Flashcards');
  await expect(page.locator('.game-grid article').nth(1).getByRole('heading')).toHaveText('Dictado');
  await expect(page.locator('.game-grid article').nth(2).getByRole('heading')).toHaveText('Escucha y reconoce');
  await page.getByRole('button', { name: /Jugar/ }).first().click();
  await expect(page.locator('#arena')).toContainText('Flashcards');
  await page.goto('/lesson/1/name');
  await expect(page.getByRole('button', { name: /Escuchar/ }).first()).toBeVisible();
});

test('L2, L3 y los repasos acumulativos conservan el alcance', async ({ page }) => {
  for (const [scope, heading, word] of [
    ['l2', '你是哪国人？', '美国'],
    ['l3', '你家有几口人？', '照片'],
    ['l1-l2', 'Repaso acumulativo L1 + L2', '饺子'],
    ['l1-l2-l3', 'Repaso acumulativo L1 + L2 + L3', '医生'],
  ] as const) {
    await page.goto(`/study/${scope}`);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await page.goto(`/study/${scope}/vocabulary`);
    await expect(page.getByText(word, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/Fuente|PDF p\./)).toHaveCount(0);
  }
});

test('Hanzi L2 usa audio estático y Dictado Hanzi está disponible', async ({ page }) => {
  await page.goto('/study/l2/hanzi');
  await expect(page.getByRole('heading', { name: 'Hanzi: forma, sonido y trazos' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Escuchar pronunciación de 早' })).toBeVisible();
  await expect(page.getByText(/voz IA|audio IA|voz china local|sin voz china/i)).toHaveCount(0);
  await page.goto('/study/l2/games');
  const card = page.locator('.game-grid article').filter({ hasText: 'Dictado Hanzi' });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: /Jugar/ }).click();
  await expect(page.getByRole('heading', { name: '¿Qué has escuchado?' })).toBeVisible();
});

test('las rutas acumulativas no desbordan en móvil', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Comprobación específica móvil.');
  await page.goto('/study/l1-l2-l3/hanzi');
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test('Escucha y reconoce no revela pistas antes de acertar', async ({ page }) => {
  await page.goto('/lesson/1/games');
  await page.locator('.game-grid article').nth(2).getByRole('button', { name: /Jugar/ }).click();
  await expect(page.getByRole('heading', { name: '¿Qué has escuchado?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Escuchar de nuevo' })).toBeVisible();
  await expect(page.locator('.listen-options button')).toHaveCount(4);
  await expect(page.locator('.listen-answer')).toHaveCount(0);
});

test('el repaso fonético distingue escritura, sandhi y aspiración', async ({ page }) => {
  await page.goto('/lesson/1/pinyin');
  await expect(page.getByText('nǐ hǎo', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('ní hǎo', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Oír habla natural/ })).toBeVisible();
  await expect(page.getByText('El papel debe moverse.')).toBeVisible();
  await expect(page.getByText('TECLADO TONAL')).toHaveCount(0);
  await expect(page.getByText(/voz china local|sin voz china|voz IA/i)).toHaveCount(0);
});

test('el constructor order de L2 muestra bloques pedagógicos y permite borrarlos', async ({ page }) => {
  await page.route('**/api/practice', (route) => route.abort('internetdisconnected'));
  await page.goto('/study/l2/grammar');
  const practice = page.locator('.practice-card');
  await expect(practice.getByText('Escribe en chino: ¡Profesor Chen, buenos días!')).toBeVisible();
  await expect(practice.locator('.token-bank button')).toHaveText(['早上好', '陈老师']);
  await practice.getByRole('button', { name: '陈老师', exact: true }).click();
  await practice.getByRole('button', { name: '早上好', exact: true }).click();
  await expect(practice.locator('.answer-line span')).toHaveText(['陈老师', '早上好']);
  await practice.getByRole('button', { name: 'Borrar' }).click();
  await expect(practice.getByText('Toca los bloques en el orden correcto')).toBeVisible();
  await practice.getByRole('button', { name: '陈老师', exact: true }).click();
  await practice.getByRole('button', { name: '早上好', exact: true }).click();
  await practice.getByRole('button', { name: 'Comprobar' }).click();
  await expect(practice.getByRole('heading', { name: /正确/ })).toBeVisible();
  await practice.getByRole('button', { name: /Siguiente/ }).click();
  await expect(practice.getByText('Escribe en chino: Disculpe, ¿cuál es su apellido?')).toBeVisible();
});

test('el pinyin de L1–L3 usa NFC y tipografía global sin diacríticos separados', async ({ page }) => {
  for (const route of [
    '/lesson/1',
    '/lesson/1/pinyin',
    '/lesson/1/dialogues',
    '/study/l2/dialogues',
    '/study/l2/vocabulary',
    '/study/l3/dialogues',
    '/study/l3/hanzi',
  ]) {
    await page.goto(route);
    const pinyin = page.locator('[lang="zh-Latn-pinyin"]');
    await expect(pinyin.first()).toBeVisible();
    const audit = await pinyin.evaluateAll((nodes) => nodes.map((node) => {
      const text = node.textContent ?? '';
      const style = getComputedStyle(node);
      return {
        isNfc: text === text.normalize('NFC'),
        hasCombiningMark: /[\u0300-\u036f]/u.test(text),
        fontFamily: style.fontFamily,
        fontStyle: style.fontStyle,
        letterSpacing: style.letterSpacing,
      };
    }));
    expect(audit.every((item) => item.isNfc && !item.hasCombiningMark)).toBe(true);
    expect(audit.every((item) => item.fontStyle === 'normal' && item.letterSpacing === 'normal')).toBe(true);
    expect(audit.every((item) => /system-ui|Segoe UI|Noto Sans|Arial/i.test(item.fontFamily))).toBe(true);
  }

  await page.goto('/study/l2/dialogues');
  await expect(page.getByText('Zhè shì wǒ péngyou, tā gāng dào Běijīng.', { exact: true })).toBeVisible();
  await expect(page.getByText('Nǐ shì nǎ guó rén?', { exact: true })).toBeVisible();
  await page.goto('/study/l3/dialogues');
  await expect(page.getByText('Nǐ jiā yǒu jǐ kǒu rén?', { exact: true })).toBeVisible();
});

test('el laboratorio Hanzi usa trazos reales, cuatro pestañas y práctica interactiva', async ({ page, isMobile }) => {
  await page.goto('/lesson/1/hanzi');
  await expect(page.getByRole('heading', { name: 'Hanzi: forma, trazos y práctica' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '0 / 52 estudiados' })).toBeVisible();
  await expect(page.getByRole('button', { name: '好, hǎo, bueno; bien, estado nuevo' })).toHaveAttribute('aria-pressed', 'true');
  const pronunciation = page.getByRole('button', { name: 'Escuchar pronunciación de 好' });
  await expect(pronunciation).toBeVisible();
  await expect(pronunciation).toHaveAttribute('title', 'Escuchar 好');
  await page.getByRole('button', { name: '你, nǐ, tú, estado nuevo' }).click();
  await expect(page.getByRole('button', { name: 'Escuchar pronunciación de 你' })).toBeVisible();
  await expect(page.locator('.hanzi-pronunciation-row .audio-button')).not.toHaveClass(/playing/);
  await page.getByRole('button', { name: '好, hǎo, bueno; bien, estado nuevo' }).click();
  await expect(page.getByText('6 trazos verificados')).toBeVisible();
  for (const tab of ['Aprender', 'Componentes', 'Trazos', 'Practicar']) await expect(page.getByRole('tab', { name: tab })).toBeVisible();
  await expect(page.getByTestId('hanzi-writer')).toBeVisible();
  const replay = page.getByRole('button', { name: /Ver de nuevo/ });
  await expect(replay).toBeVisible();
  await expect(replay).toBeEnabled();
  const panelBefore = await page.locator('.hanzi-learn-panel').boundingBox();
  const buttonBefore = await replay.boundingBox();
  await replay.click();
  await page.waitForTimeout(100);
  await expect(replay).toBeVisible();
  await replay.click();
  await replay.click();
  await expect(page.getByTestId('hanzi-writer').locator('svg')).toHaveCount(1);
  const panelDuring = await page.locator('.hanzi-learn-panel').boundingBox();
  const buttonDuring = await replay.boundingBox();
  expect(Math.abs((panelDuring?.height ?? 0) - (panelBefore?.height ?? 0))).toBeLessThanOrEqual(1);
  const relativeButtonBefore = (buttonBefore?.y ?? 0) - (panelBefore?.y ?? 0);
  const relativeButtonDuring = (buttonDuring?.y ?? 0) - (panelDuring?.y ?? 0);
  expect(Math.abs(relativeButtonDuring - relativeButtonBefore)).toBeLessThanOrEqual(1);
  if (isMobile) {
    const frame = await page.locator('.hanzi-learn-panel .hanzi-writer-frame').boundingBox();
    const eyebrow = await page.locator('.hanzi-learn-panel .eyebrow').boundingBox();
    expect((frame?.y ?? 0) + (frame?.height ?? 0)).toBeLessThan(buttonDuring?.y ?? 0);
    expect((buttonDuring?.y ?? 0) + (buttonDuring?.height ?? 0)).toBeLessThan(eyebrow?.y ?? 0);
  }
  await expect(page.getByRole('button', { name: 'Ocultar carácter' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Animar' })).toHaveCount(0);

  await page.getByRole('tab', { name: 'Trazos' }).click();
  await expect(page.getByTestId('stroke-direction')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Respuesta' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Paso a paso' })).toHaveCount(0);
  await expect(page.getByText('1 · 撇点 · piědiǎn')).toBeVisible();

  await page.getByRole('tab', { name: 'Practicar' }).click();
  await expect(page.getByRole('button', { name: 'Con guía' })).toHaveClass(/selected/);
  await expect(page.getByRole('button', { name: 'Sin guía' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Examen' })).toHaveCount(0);
  await expect(page.getByTestId('hanzi-writer')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Comenzar' })).toBeEnabled();
});

test('los filtros Hanzi siguen las seis etapas curriculares y se pueden combinar', async ({ page, isMobile }) => {
  await page.addInitScript(() => localStorage.setItem('ming-hanzi-progress-v1', JSON.stringify({
    'c-好:writing': { attempts: 1, completed: 1, mistakes: 1, lastPracticedAt: '2026-08-27T12:00:00.000Z' },
  })));
  await page.goto('/lesson/1/hanzi');
  const grid = page.locator('.hanzi-picker-grid > button');
  for (const [stage, label, count] of [[1, '1 Fundamentos', 12], [2, '2 Saludos', 14], [3, '3 Presentarse', 13], [4, '4 Cortesía', 5], [5, '5 Estados', 4], [6, '6 ¿Cómo has estado?', 4]] as const) {
    if (isMobile) await page.locator('.stage-filter-mobile select').selectOption(String(stage));
    else await page.getByRole('button', { name: label, exact: true }).click();
    await expect(grid).toHaveCount(count);
  }
  if (isMobile) await page.locator('.stage-filter-mobile select').selectOption('2');
  else await page.getByRole('button', { name: '2 Saludos', exact: true }).click();
  await page.getByRole('button', { name: 'Repasar', exact: true }).click();
  await expect(grid).toHaveCount(1);
  await expect(page.getByRole('button', { name: '好, hǎo, bueno; bien, estado repasar' })).toBeVisible();
});

test('una evidencia de reconocimiento local persiste después de recargar', async ({ page }) => {
  await page.goto('/lesson/1/hanzi?character=一');
  await page.getByRole('button', { name: 'Lo reconozco' }).click();
  await expect(page.getByText(/guardado en este dispositivo/)).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Aprendiendo', exact: true }).click();
  await expect(page.locator('.hanzi-picker-grid > button')).toHaveCount(1);
  await expect(page.getByRole('button', { name: '一, yī, uno, estado aprendiendo' })).toBeVisible();
});

test('las microtarjetas Hanzi muestran significado y estado sutil en cinco columnas móviles', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('ming-hanzi-progress-v1', JSON.stringify({
    'c-早:recognition': { attempts: 1, completed: 1, mistakes: 0, lastPracticedAt: '2026-09-04T10:00:00.000Z' },
    'c-上:writing': { attempts: 1, completed: 1, mistakes: 1, lastPracticedAt: '2026-09-04T10:00:00.000Z' },
  })));
  await page.goto('/study/l2/hanzi');
  const early = page.getByRole('button', { name: '早, zǎo, temprano, estado aprendiendo' });
  const above = page.getByRole('button', { name: '上, shàng, arriba; mañana, estado repasar' });
  const recent = page.getByRole('button', { name: '刚, gāng, recién, estado nuevo' });
  await expect(early.locator('small')).toHaveText('zǎo');
  await expect(early.locator('em')).toHaveText('temprano');
  await expect(page.getByText('Nuevo', { exact: true })).toHaveCount(0);
  await expect(early).toHaveAttribute('data-learning-state', 'learning');
  await expect(above).toHaveAttribute('data-learning-state', 'review');
  await expect(recent).toHaveAttribute('data-learning-state', 'new');
  await recent.click();
  const audit = await page.locator('.hanzi-picker-grid').evaluate((grid) => {
    const cards = [...grid.querySelectorAll<HTMLButtonElement>('.hanzi-picker-card')];
    const byState = (state: string) => cards.find((card) => card.dataset.learningState === state && !card.classList.contains('selected'));
    const color = (state: string) => {
      const card = byState(state);
      return card ? getComputedStyle(card).backgroundColor : '';
    };
    const longMeaning = cards.find((card) => card.textContent?.includes('amigo (en 朋友)'))?.querySelector('em');
    return {
      columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      newColor: color('new'),
      learningColor: color('learning'),
      reviewColor: color('review'),
      masteredToken: getComputedStyle(document.documentElement).getPropertyValue('--hanzi-mastered-bg').trim(),
      meaningClamped: longMeaning ? getComputedStyle(longMeaning).webkitLineClamp : '',
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  expect(audit.columns).toBe(5);
  expect(new Set([audit.newColor, audit.learningColor, audit.reviewColor]).size).toBe(3);
  expect(audit.masteredToken).not.toBe('');
  expect(audit.meaningClamped).toBe('2');
  expect(audit.overflow).toBeLessThanOrEqual(1);
});

test('el laboratorio Hanzi no desborda en un teléfono', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Comprobación específica del proyecto móvil.');
  await page.goto('/lesson/1/hanzi?tab=Trazos');
  await expect(page.getByRole('tab', { name: 'Trazos' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test('las funciones persistentes solicitan un nombre', async ({ page, request }) => {
  await page.goto('/login?returnTo=/progress');
  await expect(page.getByRole('heading', { name: '¿Cómo quieres que te llamemos?' })).toBeVisible();
  await expect(page.getByLabel('Tu nombre')).toBeVisible();
  await expect(page.getByLabel('Correo')).toHaveCount(0);
  await expect(page.getByLabel('Contraseña')).toHaveCount(0);
  const progress = await request.get('/api/progress');
  expect(progress.status()).toBe(401);
  const start = await request.post('/api/exam/start');
  expect(start.status()).toBe(401);
});
