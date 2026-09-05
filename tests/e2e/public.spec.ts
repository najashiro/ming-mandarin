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

test('el laboratorio Hanzi usa una ficha compacta, replay estable y cuatro pestañas', async ({ page }) => {
  const practiceRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/hanzi/practice') practiceRequests.push(request.postData() ?? '');
  });
  await page.goto('/lesson/1/hanzi');
  await expect(page.getByRole('heading', { name: 'Hanzi: forma, trazos y práctica' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '0 / 52 estudiados' })).toBeVisible();
  await expect(page.getByRole('button', { name: '好, hǎo, bueno; bien, estado nuevo' })).toHaveAttribute('aria-pressed', 'true');
  const hero = page.locator('.hanzi-character-hero');
  await expect(hero.getByText('Datos locales listos', { exact: true })).toHaveCount(0);
  await expect(hero.getByText('Datos no disponibles', { exact: true })).toHaveCount(0);
  await expect(hero.locator('.hanzi-mastery')).toHaveCount(0);
  await expect(hero).toContainText('6 trazos');
  await expect(hero).not.toContainText('verificados');
  const stageLabel = (await hero.locator('.eyebrow').innerText()).trim();
  const stageParts = /^ETAPA\s+(\d+)(?:\s*·\s*(.+))?$/i.exec(stageLabel);
  expect(stageParts, `Etiqueta de etapa inesperada: ${stageLabel}`).not.toBeNull();
  if (stageParts?.[2]) expect(stageParts[2].toLocaleLowerCase('es')).not.toBe(`etapa ${stageParts[1]}`);
  const pronunciation = page.getByRole('button', { name: 'Escuchar pronunciación de 好' });
  await expect(pronunciation).toBeVisible();
  await expect(pronunciation).toHaveAttribute('title', 'Escuchar 好');
  const audioBox = await pronunciation.boundingBox();
  expect(audioBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(audioBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  const audioRequest = page.waitForRequest((request) => /\/audio\/(?:mandarin|pinyin)\/.+\.mp3$/i.test(new URL(request.url()).pathname));
  await pronunciation.click();
  expect(new URL((await audioRequest).url()).pathname).toMatch(/\/audio\/(?:mandarin|pinyin)\/.+\.mp3$/i);
  await page.getByRole('button', { name: '你, nǐ, tú, estado nuevo' }).click();
  await expect(page.getByRole('button', { name: 'Escuchar pronunciación de 你' })).toBeVisible();
  await expect(page.locator('.hanzi-pronunciation-row .audio-button')).not.toHaveClass(/playing/);
  await page.getByRole('button', { name: '好, hǎo, bueno; bien, estado nuevo' }).click();
  for (const tab of ['Aprender', 'Componentes', 'Trazos', 'Practicar']) await expect(page.getByRole('tab', { name: tab })).toBeVisible();
  await expect(page.getByTestId('hanzi-writer')).toBeVisible();
  await expect(page.getByTestId('hanzi-writer').locator('svg')).toHaveCount(1);
  await expect(page.locator('.hanzi-learn-panel .hanzi-stage-status')).toHaveCount(0);
  const replay = page.getByRole('button', { name: 'Ver animación de nuevo', exact: true });
  await expect(replay).toBeVisible();
  await expect(replay).toBeEnabled();
  await replay.focus();
  await expect(replay).toBeFocused();
  await expect(replay).toHaveAttribute('title', 'Ver de nuevo');
  await expect(page.getByText('Ver de nuevo', { exact: true })).toHaveCount(0);
  const localBefore = await page.evaluate(() => localStorage.getItem('ming-hanzi-progress-v1'));
  const replayGeometry = async () => {
    const [frame, button, panel] = await Promise.all([
      page.locator('.hanzi-learn-panel .hanzi-writer-frame').boundingBox(),
      replay.boundingBox(),
      page.locator('.hanzi-learn-panel').boundingBox(),
    ]);
    if (!frame || !button || !panel) throw new Error('No se pudo medir la geometría del replay Hanzi.');
    return {
      width: button.width,
      height: button.height,
      top: button.y - frame.y,
      right: frame.x + frame.width - button.x - button.width,
      left: button.x - frame.x,
      bottom: frame.y + frame.height - button.y - button.height,
      panelHeight: panel.height,
    };
  };
  const before = await replayGeometry();
  expect(before.width).toBeGreaterThanOrEqual(44);
  expect(before.height).toBeGreaterThanOrEqual(44);
  expect(before.top).toBeGreaterThanOrEqual(-1);
  expect(before.right).toBeGreaterThanOrEqual(-1);
  expect(before.left).toBeGreaterThanOrEqual(-1);
  expect(before.bottom).toBeGreaterThanOrEqual(-1);
  expect(before.top).toBeLessThanOrEqual(20);
  expect(before.right).toBeLessThanOrEqual(20);
  await replay.click();
  await page.waitForTimeout(100);
  await expect(replay).toBeVisible();
  const during = await replayGeometry();
  await replay.click();
  await replay.click();
  await expect(page.getByTestId('hanzi-writer').locator('svg')).toHaveCount(1);
  await page.waitForTimeout(6500);
  await expect(replay).toBeVisible();
  const after = await replayGeometry();
  for (const sample of [during, after]) {
    expect(Math.abs(sample.top - before.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(sample.right - before.right)).toBeLessThanOrEqual(1);
    expect(Math.abs(sample.panelHeight - before.panelHeight)).toBeLessThanOrEqual(1);
  }
  expect(practiceRequests).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('ming-hanzi-progress-v1'))).toBe(localBefore);
  await expect(page.getByRole('button', { name: 'Ocultar carácter' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Animar' })).toHaveCount(0);

  await page.getByRole('tab', { name: 'Componentes' }).click();
  await expect(page.getByRole('tab', { name: 'Componentes' })).toHaveAttribute('aria-selected', 'true');
  await expect(replay).toHaveCount(0);
  await page.getByRole('tab', { name: 'Trazos' }).click();
  await expect(replay).toHaveCount(0);
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
  await expect(replay).toHaveCount(0);

  await page.getByRole('tab', { name: 'Aprender' }).click();
  await expect(replay).toBeVisible();
  await expect(page.getByTestId('hanzi-writer').locator('svg')).toHaveCount(1);
  expect(practiceRequests).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('ming-hanzi-progress-v1'))).toBe(localBefore);
});

test('la ficha Hanzi conserva su jerarquía mobile-first en los anchos objetivo y desktop', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'La matriz evita duplicar los mismos anchos en el proyecto móvil.');
  const viewports = [
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 393, height: 852 },
    { width: 430, height: 932 },
    { width: 1280, height: 800 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/study/l2/hanzi?character=友');
    const hero = page.locator('.hanzi-character-hero');
    const audio = page.getByRole('button', { name: 'Escuchar pronunciación de 友' });
    const replay = page.getByRole('button', { name: 'Ver animación de nuevo', exact: true });
    await expect(page.getByTestId('hanzi-writer').locator('svg')).toHaveCount(1);
    await expect(hero).toContainText('4 trazos');
    await expect(hero).not.toContainText('verificados');
    await expect(hero.getByText('Datos locales listos', { exact: true })).toHaveCount(0);
    await expect(hero.getByText('Datos no disponibles', { exact: true })).toHaveCount(0);
    await expect(hero.locator('.hanzi-mastery')).toHaveCount(0);
    await expect(audio).toBeVisible();
    await expect(replay).toBeVisible();

    const stageLabel = (await hero.locator('.eyebrow').innerText()).trim();
    const stageParts = /^ETAPA\s+(\d+)(?:\s*·\s*(.+))?$/i.exec(stageLabel);
    expect(stageParts, `${viewport.width}px: etiqueta inesperada ${stageLabel}`).not.toBeNull();
    if (stageParts?.[2]) expect(stageParts[2].toLocaleLowerCase('es')).not.toBe(`etapa ${stageParts[1]}`);

    const [heroBox, glyphBox, audioBox, frameBox, replayBox] = await Promise.all([
      hero.boundingBox(),
      hero.locator('.hanzi-glyph').boundingBox(),
      audio.boundingBox(),
      page.locator('.hanzi-learn-panel .hanzi-writer-frame').boundingBox(),
      replay.boundingBox(),
    ]);
    if (!heroBox || !glyphBox || !audioBox || !frameBox || !replayBox) throw new Error(`${viewport.width}px: no se pudo medir la ficha Hanzi.`);
    expect(heroBox.height, `${viewport.width}px: cabecera demasiado alta`).toBeLessThanOrEqual(viewport.width <= 430 ? 150 : 180);
    expect(heroBox.height).toBeLessThanOrEqual(glyphBox.height + 68);
    expect(audioBox.width).toBeGreaterThanOrEqual(44);
    expect(audioBox.height).toBeGreaterThanOrEqual(44);
    expect(replayBox.width).toBeGreaterThanOrEqual(44);
    expect(replayBox.height).toBeGreaterThanOrEqual(44);
    expect(replayBox.x).toBeGreaterThanOrEqual(frameBox.x - 1);
    expect(replayBox.y).toBeGreaterThanOrEqual(frameBox.y - 1);
    expect(replayBox.x + replayBox.width).toBeLessThanOrEqual(frameBox.x + frameBox.width + 1);
    expect(replayBox.y + replayBox.height).toBeLessThanOrEqual(frameBox.y + frameBox.height + 1);

    const layout = await page.evaluate(() => {
      const tabs = [...document.querySelectorAll<HTMLElement>('.hanzi-tabs [role="tab"]')].map((tab) => {
        const box = tab.getBoundingClientRect();
        return { left: box.left, right: box.right, height: box.height, fontSize: Number.parseFloat(getComputedStyle(tab).fontSize) };
      });
      const nav = document.querySelector<HTMLElement>('.mobile-nav');
      const footer = document.querySelector<HTMLElement>('.site-footer');
      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        tabs,
        navHeight: nav && getComputedStyle(nav).display !== 'none' ? nav.getBoundingClientRect().height : 0,
        footerPaddingBottom: footer ? Number.parseFloat(getComputedStyle(footer).paddingBottom) : 0,
      };
    });
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.tabs).toHaveLength(4);
    expect(layout.tabs.every((tab) => tab.left >= -1 && tab.right <= layout.viewportWidth + 1)).toBe(true);
    expect(layout.tabs.every((tab) => tab.height >= 44 && tab.fontSize >= 11)).toBe(true);
    if (viewport.width <= 430) expect(layout.footerPaddingBottom).toBeGreaterThanOrEqual(layout.navHeight);
  }
});

test('los filtros Hanzi siguen las seis etapas curriculares y se pueden combinar', async ({ page, isMobile }) => {
  await page.addInitScript(() => localStorage.setItem('ming-hanzi-progress-v1', JSON.stringify({
    'c-好:writing': { attempts: 1, completed: 1, mistakes: 1, lastPracticedAt: '2026-08-27T12:00:00.000Z' },
  })));
  await page.goto('/lesson/1/hanzi');
  const stateFilters = page.getByRole('group', { name: 'Estado de aprendizaje' });
  await expect(stateFilters.getByRole('button', { name: 'Por aprender', exact: true })).toBeVisible();
  await expect(stateFilters.getByRole('button', { name: 'Nuevos', exact: true })).toHaveCount(0);
  await expect(stateFilters.getByRole('button', { name: 'Aprendiendo', exact: true })).toHaveCount(0);
  const grid = page.locator('.hanzi-picker-grid > button');
  for (const [stage, label, count] of [[1, '1 Fundamentos', 12], [2, '2 Saludos', 14], [3, '3 Presentarse', 13], [4, '4 Cortesía', 5], [5, '5 Estados', 4], [6, '6 ¿Cómo has estado?', 4]] as const) {
    if (isMobile) await page.locator('.stage-filter-mobile select').selectOption(String(stage));
    else await page.getByRole('button', { name: label, exact: true }).click();
    await expect(grid).toHaveCount(count);
  }
  if (isMobile) await page.locator('.stage-filter-mobile select').selectOption('2');
  else await page.getByRole('button', { name: '2 Saludos', exact: true }).click();
  await page.getByRole('button', { name: 'Por aprender', exact: true }).click();
  await expect(grid).toHaveCount(13);
  await page.getByRole('button', { name: 'Repasar', exact: true }).click();
  await expect(grid).toHaveCount(1);
  await expect(page.getByRole('button', { name: '好, hǎo, bueno; bien, estado repasar' })).toBeVisible();
});

test('una evidencia de reconocimiento local persiste después de recargar', async ({ page }) => {
  await page.goto('/lesson/1/hanzi?character=一');
  const studyRequest = page.waitForRequest((request) => new URL(request.url()).pathname === '/api/hanzi/practice' && request.method() === 'POST');
  await page.getByRole('button', { name: 'Lo reconozco' }).click();
  expect((await studyRequest).postDataJSON()).toEqual({ action: 'study', characterId: 'c-一' });
  await expect(page.getByText(/guardado en este dispositivo/)).toBeVisible();
  const exposure = await page.evaluate(() => {
    const local = JSON.parse(localStorage.getItem('ming-hanzi-progress-v1') || '{}') as Record<string, Record<string, unknown>>;
    return local['c-一:recognition'];
  });
  expect(exposure).toMatchObject({ attempts: 0, completed: 0, mistakes: 0, studyExposures: 1 });
  expect(exposure).not.toHaveProperty('mastery');
  expect(exposure).not.toHaveProperty('stability');
  expect(exposure).not.toHaveProperty('correctCount');
  expect(exposure).not.toHaveProperty('xp');
  await page.reload();
  await page.getByRole('button', { name: 'Por aprender', exact: true }).click();
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
