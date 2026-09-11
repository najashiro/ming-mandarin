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
  await expect(page.getByText(/Visitantes hoy|Estudiantes activos hoy|Tiempo de estudio hoy|Actividad diaria/)).toHaveCount(0);
});

test('el arcade y el audio estático están disponibles sin cuenta', async ({ page }) => {
  await page.goto('/lesson/1/games');
  await expect(page.getByRole('heading', { name: '31 formas de practicar' })).toBeVisible();
  await expect(page.locator('.mobile-nav a[href="/study/l1-l2-l3/games"]')).toContainText('Juegos');
  await expect(page.locator('.arcade-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('.game-grid article').nth(0).getByRole('heading')).toHaveText('Reto Mixto');
  await expect(page.locator('.game-grid article').nth(1).getByRole('heading')).toHaveText('Flashcards');
  await expect(page.locator('.game-grid article').nth(2).getByRole('heading')).toHaveText('Dictado');
  await expect(page.locator('.game-grid article').nth(3).getByRole('heading')).toHaveText('Escucha y reconoce');
  await page.locator('.game-grid article').filter({ hasText: 'Flashcards' }).getByRole('button', { name: /Jugar/ }).click();
  await expect(page.locator('#arena')).toContainText('Flashcards');
  await page.goto('/lesson/1/name');
  await expect(page.getByRole('button', { name: /Escuchar/ }).first()).toBeVisible();
});

test('Reto Mixto integra imagen, audio, corrección y alcance acumulativo', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.999;
    const plays: string[] = [];
    (window as typeof window & { __retoMainPlays: string[] }).__retoMainPlays = plays;
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement) {
      plays.push(this.currentSrc || this.getAttribute('src') || '');
      return originalPlay.call(this);
    };
  });
  await page.goto('/study/l1-l2-l3/games');
  const card = page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: /Jugar/ }).click();

  const setup = page.locator('.mixed-challenge.setup');
  await expect(setup.getByRole('heading', { name: 'Configura tu sesión' })).toBeVisible();
  await expect(setup.getByRole('button', { name: 'L1 + L2 + L3', exact: true })).toHaveClass(/selected/);
  await expect(setup.getByRole('button', { name: '10', exact: true })).toHaveClass(/selected/);
  await setup.getByRole('button', { name: 'Comenzar reto' }).click();

  const challenge = page.locator('.mixed-challenge.playing');
  await expect(challenge.getByRole('heading', { name: 'Ronda 1 / 10' })).toBeVisible();
  await expect(challenge.locator('.mixed-hud-correct')).toContainText('0');
  await expect(challenge.locator('.mixed-hud-incorrect')).toContainText('0');
  await expect(challenge.locator('.mixed-hud-streak')).toContainText('0');
  await expect(challenge.locator('.mixed-prompt-image img')).toBeVisible();
  await expect(challenge.locator('.mixed-text-options button')).toHaveCount(4);
  await expect(challenge.locator('[lang="zh-Latn-pinyin"]')).toHaveCount(0);

  const imageSrc = await challenge.locator('.mixed-prompt-image img').getAttribute('src');
  const expectedByAsset: Record<string, string> = {
    'happy.webp': '高兴', 'busy.webp': '忙', 'sleepy.webp': '困', 'tired.webp': '累',
    'jiaozi.webp': '饺子', 'baozi.webp': '包子', 'rice.webp': '米饭', 'noodles.webp': '面条',
    'dim-sum.webp': '点心', 'bread.webp': '面包',
    'coffee.webp': '咖啡', 'tea.webp': '茶', 'water.webp': '水', 'cola.webp': '可乐', 'milk.webp': '牛奶', 'juice.webp': '果汁',
    'father.webp': '爸爸', 'mother.webp': '妈妈', 'grandfather.webp': '爷爷', 'grandmother.webp': '奶奶',
    'maternal-grandfather.webp': '外公', 'maternal-grandmother.webp': '外婆',
    'older-brother.webp': '哥哥', 'younger-brother.webp': '弟弟', 'older-sister.webp': '姐姐', 'younger-sister.webp': '妹妹',
    'daughter.webp': '女儿', 'family.webp': '家人', 'home.webp': '家', 'photo.webp': '照片', 'doctor.webp': '医生', 'piano.webp': '钢琴',
    'dog.webp': '狗', 'cat.webp': '猫', 'cow.webp': '牛', 'sheep.webp': '羊',
  };
  const asset = Object.keys(expectedByAsset).find((file) => imageSrc?.includes(file));
  expect(asset).toBeTruthy();
  const expected = expectedByAsset[asset!];
  const choices = challenge.locator('.mixed-text-options button');
  const choiceTexts = await choices.allTextContents();
  const wrong = choiceTexts.find((choice) => choice.trim() !== expected);
  expect(wrong).toBeTruthy();
  const wrongChoice = choices.filter({ hasText: wrong! }).first();
  const correctChoice = choices.filter({ hasText: expected }).first();
  await wrongChoice.click();

  await expect(wrongChoice).toHaveAttribute('data-answer-state', 'incorrect');
  await expect(wrongChoice.getByLabel('Respuesta elegida incorrecta')).toContainText('✕');
  await expect(correctChoice).toHaveAttribute('data-answer-state', 'correct');
  await expect(correctChoice.getByLabel('Respuesta correcta')).toContainText('✓');
  await expect(challenge.locator('.mixed-hud-incorrect')).toContainText('1');
  await expect(challenge.locator('.mixed-hud-streak')).toContainText('0');
  await expect(challenge.getByText('CORRECCIÓN', { exact: true })).toHaveCount(0);
  await page.waitForTimeout(700);
  await expect(challenge.getByRole('heading', { name: 'Ronda 1 / 11' })).toBeVisible();
  await expect(challenge.getByText(expected, { exact: true }).last()).toBeVisible();
  await expect(challenge.locator('[lang="zh-Latn-pinyin"]')).toBeVisible();
  await expect(challenge.locator('.mixed-correction-actions a')).toHaveCount(1);
  await expect(challenge.locator('.mixed-correction-actions a').first()).toHaveAttribute('target', '_blank');
  await expect(challenge.locator('.mixed-correction-actions a').first()).toHaveAttribute('rel', 'noopener noreferrer');
  const playsBeforeCorrection = await page.evaluate(() => (window as typeof window & { __retoMainPlays: string[] }).__retoMainPlays.length);
  await challenge.getByRole('button', { name: /Escuchar pronunciación de/ }).click();
  await expect.poll(async () => page.evaluate(() => (window as typeof window & { __retoMainPlays: string[] }).__retoMainPlays.length)).toBeGreaterThan(playsBeforeCorrection);
  await challenge.getByRole('button', { name: /Continuar/ }).click();
  await expect(challenge.getByRole('heading', { name: 'Ronda 2 / 11' })).toBeVisible();

  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);

  await challenge.getByRole('button', { name: 'Cerrar' }).click();
  await card.getByRole('button', { name: /Jugar/ }).click();
  await page.locator('.mixed-challenge.setup').getByRole('button', { name: 'Comenzar reto' }).click();
  const correctChallenge = page.locator('.mixed-challenge.playing');
  await expect(correctChallenge.getByRole('heading', { name: 'Ronda 1 / 10' })).toBeVisible();
  const correctAnswer = correctChallenge.locator('.mixed-text-options button').filter({ hasText: expected });
  await correctAnswer.click();
  await expect(correctAnswer).toHaveAttribute('data-answer-state', 'correct');
  await expect(correctAnswer.getByLabel('Respuesta correcta')).toContainText('✓');
  await expect(correctChallenge.locator('.mixed-hud-correct')).toContainText('1');
  await expect(correctChallenge.locator('.mixed-hud-streak')).toContainText('1');
  await expect(correctChallenge.getByText('✓ Correcto', { exact: true })).toBeVisible();
  await page.waitForTimeout(250);
  await expect(correctChallenge.getByText('✓ Correcto', { exact: true })).toBeVisible();
  await expect(correctChallenge.getByRole('heading', { name: 'Ronda 2 / 10' })).toBeVisible({ timeout: 7_000 });
});

test('Reto Mixto mantiene contraste móvil y una corrección compacta para Hanzi individual', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.09; });
  await page.goto('/study/l1-l2-l3/games');
  const card = page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' });
  await card.getByRole('button', { name: /Jugar/ }).click();
  await page.locator('.mixed-challenge.setup').getByRole('button', { name: 'Comenzar reto' }).click();
  const challenge = page.locator('.mixed-challenge.playing');
  const hanzi = challenge.locator('.mixed-prompt-hanzi');
  await expect(hanzi).toHaveText('累');

  const visual = await hanzi.evaluate((element) => {
    const parse = (color: string) => (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const luminance = ([red, green, blue]: number[]) => {
      const channels = [red, green, blue].map((value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const style = getComputedStyle(element);
    const arena = element.closest('.arcade-arena')!;
    const foreground = luminance(parse(style.color));
    const background = luminance(parse(getComputedStyle(arena).backgroundColor));
    const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    const hanziBox = element.getBoundingClientRect();
    const optionsBox = arena.querySelector('.mixed-image-options')!.getBoundingClientRect();
    return { ratio, fontSize: Number.parseFloat(style.fontSize), gapToOptions: optionsBox.top - hanziBox.bottom };
  });
  expect(visual.ratio).toBeGreaterThan(7);
  expect(visual.fontSize).toBeGreaterThan(60);
  expect(visual.gapToOptions).toBeLessThan(45);

  const imageChoices = challenge.locator('.mixed-image-options button');
  const correctChoice = challenge.locator('.mixed-image-options button:has(img[src*="tired.webp"])');
  let wrongIndex = 0;
  for (let index = 0; index < await imageChoices.count(); index += 1) {
    if (!(await imageChoices.nth(index).locator('img').getAttribute('src'))?.includes('tired.webp')) { wrongIndex = index; break; }
  }
  const wrongChoice = imageChoices.nth(wrongIndex);
  await wrongChoice.click();
  await expect(wrongChoice).toHaveAttribute('data-answer-state', 'incorrect');
  await expect(correctChoice).toHaveAttribute('data-answer-state', 'correct');
  const correction = challenge.locator('.mixed-feedback.incorrect');
  await expect(correction.getByText('累', { exact: true })).toBeVisible();
  await expect(correction.getByText('lèi', { exact: true })).toBeVisible();
  await expect(correction.getByText('cansado/a', { exact: true })).toBeVisible();
  await expect(correction.getByText('他很累。', { exact: true })).toBeVisible();
  await expect(correction.getByText('Tā hěn lèi.', { exact: true })).toBeVisible();
  await expect(correction.getByRole('button', { name: 'Escuchar ejemplo: 他很累。' })).toBeVisible();
  await expect(correction.locator('.mixed-correction-actions a')).toHaveCount(1);
  const correctionLayout = await correction.evaluate((element) => {
    const actions = [...element.querySelectorAll<HTMLElement>('.mixed-correction-actions > *')].map((item) => item.getBoundingClientRect());
    return {
      actionRowSpread: Math.max(...actions.map((item) => item.top)) - Math.min(...actions.map((item) => item.top)),
    };
  });
  expect(correctionLayout.actionRowSpread).toBeLessThan(12);
  await expect.poll(async () => correction.evaluate((element) => {
    const mobileNav = document.querySelector<HTMLElement>('.mobile-nav');
    if (!mobileNav || getComputedStyle(mobileNav).display === 'none') return true;
    return element.getBoundingClientRect().bottom <= mobileNav.getBoundingClientRect().top + 1;
  })).toBe(true);
});

test('Reto Mixto ofrece audio repetible en la pregunta de conversación', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.2;
    const plays: string[] = [];
    (window as typeof window & { __retoQuestionPlays: string[] }).__retoQuestionPlays = plays;
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement) {
      plays.push(this.currentSrc || this.getAttribute('src') || '');
      return originalPlay.call(this);
    };
  });
  await page.goto('/study/l1-l2-l3/games');
  const card = page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' });
  await card.getByRole('button', { name: /Jugar/ }).click();
  await page.locator('.mixed-challenge.setup').getByRole('button', { name: 'Comenzar reto' }).click();
  const challenge = page.locator('.mixed-challenge.playing');
  await expect(challenge.getByText('Conversación', { exact: true })).toBeVisible();
  const questionAudio = challenge.getByRole('button', { name: /^Escuchar pregunta:/ });
  await expect(questionAudio).toBeVisible();
  await questionAudio.click();
  await questionAudio.click();
  const plays = await page.evaluate(() => (window as typeof window & { __retoQuestionPlays: string[] }).__retoQuestionPlays);
  expect(plays).toHaveLength(2);
  expect(plays.every((src) => /\/audio\/mandarin\/.+\.mp3$/i.test(src))).toBe(true);
  await expect(challenge.getByRole('heading', { name: 'Ronda 1 / 10' })).toBeVisible();
  await expect(challenge.locator('.mixed-text-options button[data-answer-state]')).toHaveCount(0);
  await expect(challenge.locator('[lang="zh-Latn-pinyin"]')).toHaveCount(0);
});

test('Reto Mixto pronuncia fichas sin superposición y consolida la frase construida', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.17;
    const tracker = { active: 0, maxActive: 0, plays: [] as string[], pauses: 0 };
    (window as typeof window & { __retoAudioTracker: typeof tracker }).__retoAudioTracker = tracker;
    const active = new WeakSet<HTMLMediaElement>();
    const originalPlay = HTMLMediaElement.prototype.play;
    const originalPause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement) {
      if (!active.has(this)) {
        active.add(this);
        tracker.active += 1;
        tracker.maxActive = Math.max(tracker.maxActive, tracker.active);
        tracker.plays.push(this.currentSrc || this.getAttribute('src') || '');
        this.addEventListener('ended', () => {
          if (active.delete(this)) tracker.active -= 1;
        }, { once: true });
      }
      return originalPlay.call(this);
    };
    HTMLMediaElement.prototype.pause = function pause(this: HTMLMediaElement) {
      if (active.delete(this)) tracker.active -= 1;
      tracker.pauses += 1;
      return originalPause.call(this);
    };
  });
  await page.goto('/study/l1-l2-l3/games');
  const card = page.locator('.game-grid article').filter({ hasText: 'Reto Mixto' });
  await card.getByRole('button', { name: /Jugar/ }).click();
  await page.locator('.mixed-challenge.setup').getByRole('button', { name: 'Comenzar reto' }).click();
  const challenge = page.locator('.mixed-challenge.playing');
  await expect(challenge.getByText('Construir respuesta', { exact: true })).toBeVisible();
  const questionAudio = challenge.getByRole('button', { name: /^Escuchar pregunta:/ });
  await questionAudio.click();
  await questionAudio.click();
  await expect(challenge.getByRole('heading', { name: 'Ronda 1 / 10' })).toBeVisible();

  await page.evaluate(() => {
    const tracker = (window as typeof window & { __retoAudioTracker: { active: number; maxActive: number; plays: string[]; pauses: number } }).__retoAudioTracker;
    tracker.maxActive = tracker.active;
    tracker.plays = [];
    tracker.pauses = 0;
  });
  const bank = challenge.locator('.mixed-token-bank');
  const firstToken = bank.getByRole('button').first();
  const firstText = (await firstToken.textContent())!;
  await firstToken.click();
  await expect(challenge.locator('.mixed-built').getByRole('button', { name: firstText, exact: true })).toBeVisible();
  const secondToken = bank.getByRole('button').first();
  const secondText = (await secondToken.textContent())!;
  await secondToken.click();
  await expect(challenge.locator('.mixed-built').getByRole('button', { name: secondText, exact: true })).toBeVisible();
  const interaction = await page.evaluate(() => (window as typeof window & { __retoAudioTracker: { active: number; maxActive: number; plays: string[]; pauses: number } }).__retoAudioTracker);
  expect(interaction.plays).toHaveLength(2);
  expect(interaction.maxActive).toBeLessThanOrEqual(1);
  expect(interaction.pauses).toBeGreaterThanOrEqual(1);

  while (await challenge.locator('.mixed-built').getByRole('button').count()) {
    await challenge.locator('.mixed-built').getByRole('button').first().click();
  }
  for (const token of ['我', '叫', '马大为']) {
    await bank.getByRole('button', { name: token, exact: true }).click();
  }
  await page.evaluate(() => {
    (window as typeof window & { __retoAudioTracker: { plays: string[] } }).__retoAudioTracker.plays = [];
  });
  await challenge.getByRole('button', { name: 'Comprobar' }).click();
  await expect(challenge.locator('.mixed-built')).toHaveAttribute('data-answer-state', 'correct');
  await expect(challenge.locator('.mixed-hud-correct')).toContainText('1');
  await expect(challenge.locator('.mixed-hud-streak')).toContainText('1');
  await expect(challenge.getByText('✓ Correcto', { exact: true })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => (window as typeof window & { __retoAudioTracker: { plays: string[] } }).__retoAudioTracker.plays.some((src) => src.includes('l1-s-wojiao-madawei.mp3')))).toBe(true);
  await expect(challenge.getByRole('heading', { name: 'Ronda 2 / 10' })).toBeVisible({ timeout: 7_000 });
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
  await page.goto('/study/l2/hanzi?character=早');
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
  await page.locator('.game-grid article').filter({ hasText: 'Escucha y reconoce' }).getByRole('button', { name: /Jugar/ }).click();
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
  await expect(page.getByRole('heading', { name: '0 / 192 estudiados' })).toBeVisible();
  await expect(page.getByRole('button', { name: '好, hǎo, bueno; bien, estado nuevo' })).toHaveAttribute('aria-pressed', 'true');
  const hero = page.locator('.hanzi-character-hero');
  await expect(hero.getByText('Datos locales listos', { exact: true })).toHaveCount(0);
  await expect(hero.getByText('Datos no disponibles', { exact: true })).toHaveCount(0);
  await expect(hero.locator('.hanzi-mastery')).toHaveCount(0);
  await expect(hero).toContainText('6 trazos');
  await expect(hero).not.toContainText('verificados');
  const stageLabel = (await hero.locator('.eyebrow').innerText()).trim();
  expect(stageLabel).toMatch(/^[123]\.[12]\s*·\s*Texto [12]$/i);
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
    return page.locator('.hanzi-learn-panel').evaluate((panel) => {
      const frame = panel.querySelector<HTMLElement>('.hanzi-writer-frame')?.getBoundingClientRect();
      const button = panel.querySelector<HTMLElement>('.hanzi-replay-control')?.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      if (!frame || !button) throw new Error('No se pudo medir la geometría del replay Hanzi.');
      return {
        width: button.width,
        height: button.height,
        top: button.y - frame.y,
        right: frame.x + frame.width - button.x - button.width,
        left: button.x - frame.x,
        bottom: frame.y + frame.height - button.y - button.height,
        panelHeight: panelBox.height,
      };
    });
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
  const practiceControls = page.getByRole('group', { name: 'Modo e inicio de práctica' });
  const guided = practiceControls.getByRole('button', { name: 'Con guía', exact: true });
  const independent = practiceControls.getByRole('button', { name: 'Sin guía', exact: true });
  const startPractice = practiceControls.locator('.practice-start-button');
  await expect(practiceControls.getByRole('button')).toHaveCount(3);
  await expect(practiceControls.getByRole('button')).toHaveText(['Con guía', 'Sin guía', 'Comenzar']);
  await expect(page.getByRole('button', { name: 'Comenzar', exact: true })).toHaveCount(1);
  await expect(guided).toHaveClass(/selected/);
  await expect(guided).toHaveAttribute('aria-pressed', 'true');
  await expect(independent).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'Examen' })).toHaveCount(0);
  await expect(page.getByTestId('hanzi-writer')).toBeVisible();
  await expect(startPractice).toBeEnabled();
  await startPractice.click();
  await expect(startPractice).toHaveText('Práctica activa');
  await expect(startPractice).toBeDisabled();
  await expect(page.getByText('Empieza en el punto correcto y sigue la dirección del trazo.')).toBeVisible();
  await independent.click();
  await expect(independent).toHaveAttribute('aria-pressed', 'true');
  await expect(guided).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('heading', { name: 'Cuadrícula sin contorno' })).toBeVisible();
  await expect(startPractice).toHaveText('Comenzar');
  await expect(startPractice).toBeEnabled();
  await startPractice.click();
  await expect(startPractice).toHaveText('Práctica activa');
  await guided.click();
  await independent.click();
  await guided.click();
  await expect(guided).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Guía visible y pistas progresivas' })).toBeVisible();
  await expect(startPractice).toBeEnabled();
  await startPractice.click();
  await expect(startPractice).toHaveText('Práctica activa');
  await expect(replay).toHaveCount(0);

  await page.getByRole('tab', { name: 'Aprender' }).click();
  await expect(replay).toBeVisible();
  await expect(page.getByTestId('hanzi-writer').locator('svg')).toHaveCount(1);
  expect(practiceRequests).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('ming-hanzi-progress-v1'))).toBe(localBefore);
});

test('Con guía, Sin guía y Comenzar permanecen en una sola fila responsive', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'La matriz responsive se ejecuta una vez en Chromium.');
  const browserErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  page.on('pageerror', (error) => browserErrors.push(error.message));
  const viewports = [320, 360, 375, 390, 393, 414, 430, 768, 1024];

  for (const width of viewports) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto('/study/l2/hanzi?character=早&tab=Practicar');
    const controls = page.getByRole('group', { name: 'Modo e inicio de práctica' });
    const buttons = controls.getByRole('button');
    const writer = page.locator('.practice-panel .hanzi-writer-frame');
    await expect(controls.locator('.practice-start-button')).toBeEnabled();
    await expect(buttons).toHaveCount(3);
    await expect(buttons).toHaveText(['Con guía', 'Sin guía', 'Comenzar']);

    const [controlsBox, writerBox, buttonBoxes, documentWidth] = await Promise.all([
      controls.boundingBox(),
      writer.boundingBox(),
      buttons.evaluateAll((items) => items.map((item) => {
        const box = item.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, whiteSpace: getComputedStyle(item).whiteSpace };
      })),
      page.evaluate(() => document.documentElement.scrollWidth),
    ]);
    if (!controlsBox || !writerBox) throw new Error(`${width}px: no se pudo medir Practicar.`);
    expect(buttonBoxes).toHaveLength(3);
    expect(buttonBoxes.every((box) => Math.abs(box.y - buttonBoxes[0].y) <= 1), `${width}px: los botones saltaron de fila`).toBe(true);
    expect(buttonBoxes.every((box) => Math.abs(box.height - buttonBoxes[0].height) <= 1)).toBe(true);
    expect(buttonBoxes.every((box) => box.height >= 48 && box.height <= 52)).toBe(true);
    expect(buttonBoxes.every((box) => box.whiteSpace === 'nowrap')).toBe(true);
    expect(Math.max(...buttonBoxes.map((box) => box.width)) - Math.min(...buttonBoxes.map((box) => box.width))).toBeLessThanOrEqual(1);
    expect(controlsBox.width).toBeLessThanOrEqual(writerBox.width + 1);
    expect(writerBox.y - (controlsBox.y + controlsBox.height)).toBeGreaterThanOrEqual(12);
    expect(writerBox.y - (controlsBox.y + controlsBox.height)).toBeLessThanOrEqual(16);
    expect(documentWidth).toBeLessThanOrEqual(width + 1);
  }
  expect(browserErrors).toEqual([]);
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
    expect(stageLabel, `${viewport.width}px: etiqueta inesperada ${stageLabel}`).toMatch(/^[123]\.[12]\s*·\s*Texto [12]$/i);

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

test('los filtros Hanzi siguen los seis textos curriculares y distinguen nuevo de repaso', async ({ page, isMobile }) => {
  await page.addInitScript(() => localStorage.setItem('ming-hanzi-progress-v1', JSON.stringify({
    'c-好:writing': { attempts: 1, completed: 1, mistakes: 1, lastPracticedAt: '2026-08-27T12:00:00.000Z' },
  })));
  await page.goto('/lesson/1/hanzi');
  const stateFilters = page.getByRole('group', { name: 'Estado de aprendizaje' });
  await expect(stateFilters.getByRole('button', { name: 'Por aprender', exact: true })).toBeVisible();
  await expect(stateFilters.getByRole('button', { name: 'Nuevos', exact: true })).toHaveCount(0);
  await expect(stateFilters.getByRole('button', { name: 'Aprendiendo', exact: true })).toHaveCount(0);
  const grid = page.locator('.hanzi-picker-grid > button');
  for (const [stage, label, count] of [['1.1','1.1 Texto 1',40],['1.2','1.2 Texto 2',26],['2.1','2.1 Texto 1',57],['2.2','2.2 Texto 2',42],['3.1','3.1 Texto 1',36],['3.2','3.2 Texto 2',39]] as const) {
    if (isMobile) await page.locator('.stage-filter-mobile select').selectOption(String(stage));
    else await page.getByRole('button', { name: label, exact: true }).click();
    await expect(grid).toHaveCount(count);
  }
  if (isMobile) await page.locator('.stage-filter-mobile select').selectOption('1.1');
  else await page.getByRole('button', { name: '1.1 Texto 1', exact: true }).click();
  await page.getByRole('button', { name: 'Por aprender', exact: true }).click();
  await expect(grid).toHaveCount(39);
  await page.getByRole('button', { name: 'Repasar', exact: true }).click();
  await expect(grid).toHaveCount(1);
  await expect(page.getByRole('button', { name: '好, hǎo, bueno; bien, estado repasar' })).toBeVisible();
  await expect(page.getByRole('button', { name: '好, hǎo, bueno; bien, estado repasar' })).toHaveAttribute('data-curricular-state','new');
  await stateFilters.getByRole('button',{name:'Todos',exact:true}).click();
  if (isMobile) await page.locator('.stage-filter-mobile select').selectOption('3.2');
  else await page.getByRole('button',{name:'3.2 Texto 2',exact:true}).click();
  await expect(page.getByRole('button',{name:/^张, zhāng,/})).toHaveAttribute('data-curricular-state','review');
  await expect(page.getByRole('button',{name:/^真, zhēn,/})).toHaveAttribute('data-curricular-state','new');
});

test('Trazos y Aparece en conservan detalle técnico, contexto y enlaces en iPhone portrait', async ({ page }) => {
  await page.setViewportSize({ width:390,height:844 });
  await page.goto('/lesson/1/hanzi?character=张&tab=Trazos');
  const strokeNames = page.locator('.stroke-name-list > li');
  await expect(strokeNames).toHaveCount(7);
  await expect(strokeNames.first()).toContainText('1 · 横折 · héngzhé');
  await expect(strokeNames.first()).toContainText('Dirección:');
  await expect(page.getByText(/^Trazo 1$/)).toHaveCount(0);

  await page.goto('/lesson/1/hanzi?character=么&tab=Componentes');
  const contexts = page.locator('.components-panel .hanzi-context');
  await expect(contexts.getByRole('heading',{name:'Aparece en'})).toBeVisible();
  await expect(contexts).toContainText('什么');
  await expect(contexts).toContainText('shénme');
  await expect(contexts).toContainText('怎么样');
  await expect(contexts).toContainText('zěnmeyàng');
  expect(await contexts.innerText()).not.toMatch(/\b[123]\.[12]\b/);

  await page.goto('/lesson/1/hanzi?character=照&tab=Componentes');
  const photo = page.locator('.components-panel .hanzi-context article').filter({hasText:'照片'}).first();
  await expect(photo).toContainText('zhàopiàn');
  await expect(photo).toContainText('fotografía');
  const relatedPhoto = photo.getByRole('link',{name:'Abrir ficha Hanzi de 片'});
  const touchTarget = await relatedPhoto.boundingBox();
  expect(touchTarget?.width).toBeGreaterThanOrEqual(44);
  expect(touchTarget?.height).toBeGreaterThanOrEqual(44);
  await relatedPhoto.click();
  await expect(page.locator('.hanzi-glyph')).toHaveText('片');

  await page.goto('/lesson/1/hanzi?character=张&tab=Componentes');
  await expect(page.locator('.components-panel .hanzi-context')).toContainText('这张照片真漂亮');
  const dimensions = await page.evaluate(() => ({ viewport:window.innerWidth,content:document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
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
  await page.goto('/study/l2/hanzi?character=早');
  const early = page.getByRole('button', { name: '早, zǎo, temprano; mañana, estado aprendiendo' });
  const above = page.getByRole('button', { name: '上, shàng, arriba; en la mañana, estado repasar' });
  const recent = page.getByRole('button', { name: '刚, gāng, recién, estado nuevo' });
  await expect(early.locator('small')).toHaveText('zǎo');
  await expect(early.locator('em')).toHaveText('temprano; mañana');
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
    const longMeaning = cards.find((card) => card.textContent?.includes('amigo; en 朋友'))?.querySelector('em');
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
