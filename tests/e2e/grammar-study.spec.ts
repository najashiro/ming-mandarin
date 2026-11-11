import { expect, test, type Page } from '@playwright/test';
import lesson5 from '../../data/lesson5-public.json' with { type: 'json' };

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

test('L5: ayudas universales e independientes, visibles al empezar y persistentes', async ({ page }) => {
  await page.goto('/study/l5/grammar');
  const pinyin = page.getByRole('button', { name: 'Pinyin', exact: true });
  const spanish = page.getByRole('button', { name: 'Español', exact: true });
  const topic = page.getByTestId('grammar-topic');
  const pattern = topic.locator('.grammar-pattern-guide');
  const practice = page.locator('.grammar-practice');
  const wishToken = practice.getByRole('button', { name: 'Añadir: 祝', exact: true });
  await expect(practice.getByRole('radio')).toHaveCount(0);
  await expect(practice).not.toContainText(/Lo sé|Dudé|Tengo dudas|Estoy aprendiendo/);
  await expect(pinyin).toHaveAttribute('aria-pressed', 'true');
  await expect(spanish).toHaveAttribute('aria-pressed', 'true');
  await expect(pattern.locator('.grammar-reading-pinyin').first()).toBeVisible();
  await expect(pattern.locator('.grammar-reading-spanish').first()).toBeVisible();
  await expect(practice.locator('.pinyin-text').first()).toBeVisible();
  await expect(practice.locator('.grammar-practice-translation').first()).toBeVisible();
  await expect(wishToken).toHaveAccessibleDescription(/zhù.*desear/);
  const detail = topic.locator('.grammar-rule-detail');
  await detail.locator('summary').click();
  await expect(detail.locator('.grammar-reading-pinyin').first()).toBeVisible();
  await expect(detail.locator('.grammar-reading-spanish').first()).toBeVisible();

  await page.getByRole('button', { name: 'Ocultar pinyin y español', exact: true }).click();
  await expect(pinyin).toHaveAttribute('aria-pressed', 'false');
  await expect(spanish).toHaveAttribute('aria-pressed', 'false');
  await expect(topic.locator('.grammar-reading-pinyin')).toHaveCount(0);
  await expect(topic.locator('.grammar-reading-spanish')).toHaveCount(0);
  await expect(practice.locator('.pinyin-text:visible')).toHaveCount(0);
  await expect(practice.locator('.grammar-practice-translation:visible')).toHaveCount(0);
  await expect(wishToken).toHaveAccessibleDescription('');
  await expect(topic.locator('[lang="zh-CN"]').first()).toBeVisible();

  await page.reload();
  await expect(pinyin).toHaveAttribute('aria-pressed', 'false');
  await expect(spanish).toHaveAttribute('aria-pressed', 'false');
  await pinyin.click();
  await expect(pattern.locator('.grammar-reading-pinyin').first()).toBeVisible();
  await expect(topic.locator('.grammar-reading-spanish')).toHaveCount(0);
  await expect(practice.locator('.pinyin-text').first()).toBeVisible();
  await expect(wishToken).toHaveAccessibleDescription('zhù');
  await page.getByRole('button', { name: 'Mostrar pinyin y español', exact: true }).click();
  await expect(pinyin).toHaveAttribute('aria-pressed', 'true');
  await expect(spanish).toHaveAttribute('aria-pressed', 'true');
  await expect(pattern.locator('.grammar-reading-spanish').first()).toBeVisible();
  await expectNoOverflow(page);
});

test('L5: los once temas ofrecen ejemplos legibles y audio en móvil y escritorio', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/study/l5/grammar');
  const navigation = page.getByTestId('grammar-topics');
  await expect(navigation.getByRole('button')).toHaveCount(lesson5.grammar.length);
  for (const [index, point] of lesson5.grammar.entries()) {
    await navigation.getByRole('button').nth(index).click();
    const topic = page.getByTestId('grammar-topic');
    await expect(navigation.getByRole('button').nth(index)).toHaveAttribute('aria-current', 'step');
    const examples = topic.getByTestId('grammar-example');
    await expect(examples).toHaveCount(point.examples.length);
    for (let exampleIndex = 0; exampleIndex < point.examples.length; exampleIndex++) {
      const example = examples.nth(exampleIndex);
      await expect(example).toContainText(point.examples[exampleIndex]);
      await expect(example.locator('.grammar-reading-pinyin').first()).toBeVisible();
      await expect(example.locator('.grammar-reading-spanish').first()).toBeVisible();
      await expect(example.getByRole('button', { name: /Escuchar/ }).first()).toBeVisible();
    }
    await expectNoOverflow(page);
  }
  await navigation.getByRole('button').first().click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: info.outputPath('grammar-lesson5-viewport.png') });
  await page.screenshot({ path: info.outputPath('grammar-lesson5.png'), fullPage: true });
  await page.getByRole('link', { name: 'Ir a la práctica' }).click();
  await page.evaluate(() => new Promise<void>(resolve => {
    let previous = -1;
    let stableFrames = 0;
    function checkScroll() {
      stableFrames = window.scrollY === previous ? stableFrames + 1 : 0;
      previous = window.scrollY;
      if (stableFrames >= 8) resolve();
      else requestAnimationFrame(checkScroll);
    }
    requestAnimationFrame(checkScroll);
  }));
  await page.screenshot({ path: info.outputPath('grammar-practice-viewport.png') });
  expect(errors).toEqual([]);
});

test('L5: la práctica reproduce MP3 reales a velocidad normal y lenta', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.Audio = function (src?: string) {
      const audio = new NativeAudio(src);
      (window as typeof window & { grammarAudio?: HTMLAudioElement }).grammarAudio = audio;
      return audio;
    } as unknown as typeof Audio;
  });
  await page.goto('/study/l5/grammar');
  const practice = page.locator('.grammar-practice');
  await practice.getByRole('button', { name: 'Escuchar frase', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { grammarAudio?: HTMLAudioElement }).grammarAudio?.currentTime ?? 0)).toBeGreaterThan(0);
  const normalRate = await page.evaluate(() => (window as typeof window & { grammarAudio?: HTMLAudioElement }).grammarAudio?.playbackRate ?? 1);
  const src = await page.evaluate(() => (window as typeof window & { grammarAudio?: HTMLAudioElement }).grammarAudio?.src ?? '');
  expect(src).toMatch(/\/audio\/.*\.mp3$/);
  const clip = await page.request.get(src);
  expect(clip.ok()).toBe(true);
  expect((await clip.body()).length).toBeGreaterThan(1000);

  await practice.getByRole('button', { name: 'Escuchar despacio', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { grammarAudio?: HTMLAudioElement }).grammarAudio?.currentTime ?? 0)).toBeGreaterThan(0);
  expect(await page.evaluate(() => (window as typeof window & { grammarAudio?: HTMLAudioElement }).grammarAudio?.playbackRate ?? 1)).toBeLessThan(normalRate);
});

test('L5: bloques reutilizables al deshacer y corrección disponible sin iniciar sesión', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/practice', route => {
    attempts++;
    return route.fulfill({ status: 401, json: { error: 'Elige un nombre para guardar tu progreso.' } });
  });
  await page.goto('/study/l5/grammar');
  const practice = page.locator('.grammar-practice');
  const bank = practice.locator('.grammar-practice-bank');
  const chosen = practice.locator('.grammar-practice-answer');
  const firstToken = lesson5.sentences[0].tokens[0];
  const token = bank.getByRole('button', { name: `Añadir: ${firstToken}`, exact: true });
  await token.click();
  await expect(token).toBeDisabled();
  await expect(chosen.getByRole('button', { name: `Quitar: ${firstToken}`, exact: true })).toHaveCount(1);
  await practice.getByRole('button', { name: 'Deshacer', exact: true }).click();
  await expect(token).toBeEnabled();
  await expect(chosen.getByRole('button')).toHaveCount(0);

  for (const word of lesson5.sentences[0].tokens) {
    await bank.getByRole('button', { name: `Añadir: ${word}`, exact: true }).click();
  }
  await practice.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect(practice.locator('.grammar-practice-feedback')).toContainText('¡Bien hecho!');
  await expect(practice.locator('.grammar-practice-feedback')).toContainText(lesson5.sentences[0].hanzi);
  await expect(practice.locator('.grammar-practice-feedback .pinyin-text').first()).toBeVisible();
  await expect.poll(() => attempts).toBe(1);
  await expect(practice.getByRole('button', { name: 'Siguiente frase', exact: true })).toBeEnabled();
  await expectNoOverflow(page);
});

test('L5: sesión finita de 22 frases y reinicio limpio', async ({ page }) => {
  test.setTimeout(90_000);
  await page.route('**/api/practice', route => route.fulfill({ status: 401, json: { error: 'Inicia sesión para guardar.' } }));
  await page.goto('/study/l5/grammar');
  const practice = page.locator('.grammar-practice');
  for (const [index, sentence] of lesson5.sentences.entries()) {
    for (const token of sentence.tokens) {
      await practice.locator('.grammar-practice-bank').getByRole('button', { name: `Añadir: ${token}`, exact: true }).and(practice.locator('button:enabled')).first().click();
    }
    await practice.getByRole('button', { name: 'Comprobar', exact: true }).click();
    await expect(practice.locator('.grammar-practice-feedback')).toContainText('¡Bien hecho!');
    await practice.getByRole('button', { name: index + 1 === lesson5.sentences.length ? 'Ver resultado' : 'Siguiente frase', exact: true }).click();
  }
  await expect(practice.getByRole('heading', { name: 'Práctica completada', exact: true })).toBeVisible();
  await expectNoOverflow(page);
  await practice.getByRole('button', { name: 'Repetir práctica', exact: true }).click();
  await expect(practice.locator('.grammar-practice-answer').getByRole('button')).toHaveCount(0);
  await expect(practice.getByRole('button', { name: 'Comprobar', exact: true })).toBeDisabled();
  await expect(practice.locator('.grammar-practice-bank').getByRole('button', { name: `Añadir: ${lesson5.sentences[0].tokens[0]}`, exact: true })).toBeEnabled();
});

test('L5: un error permite estudiar el modelo, reintentar y guardar sin autoevaluación', async ({ page }) => {
  const attempts: Array<{ exerciseId: string; answer: string; hintsUsed: number }> = [];
  await page.route('**/api/practice', route => {
    attempts.push(route.request().postDataJSON());
    return route.fulfill({ json: { xp: 8 } });
  });
  await page.goto('/study/l5/grammar');
  const practice = page.locator('.grammar-practice');
  const bank = practice.locator('.grammar-practice-bank');
  const sentence = lesson5.sentences[0];
  await expect(practice.getByRole('radio')).toHaveCount(0);
  for (const token of [...sentence.tokens].reverse()) {
    await bank.getByRole('button', { name: `Añadir: ${token}`, exact: true }).and(bank.locator('button:enabled')).first().click();
  }
  await practice.getByRole('button', { name: 'Comprobar', exact: true }).click();
  const feedback = practice.locator('.grammar-practice-feedback');
  await expect(feedback).toContainText('Vamos a repasarla');
  await expect(feedback).toContainText(sentence.hanzi);
  await expect(feedback).toContainText(sentence.translation);
  await expect(feedback).toContainText('Progreso guardado');
  await expect(feedback.getByRole('button', { name: 'Escuchar respuesta', exact: true })).toBeVisible();
  await practice.getByRole('button', { name: 'Intentar de nuevo', exact: true }).click();
  await expect(practice.locator('.grammar-practice-answer').getByRole('button')).toHaveCount(0);
  await expect(practice.getByRole('radio')).toHaveCount(0);
  await practice.getByRole('button', { name: 'Ver modelo de apoyo', exact: true }).click();
  await expect(practice.locator('.grammar-practice-model')).toContainText(sentence.hanzi);
  for (const token of sentence.tokens) {
    await bank.getByRole('button', { name: `Añadir: ${token}`, exact: true }).and(bank.locator('button:enabled')).first().click();
  }
  await practice.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect(feedback).toContainText('¡Bien hecho!');
  await expect(feedback).toContainText('Progreso guardado · +8 XP');
  await expect.poll(() => attempts.length).toBe(2);
  expect(attempts[0]).toMatchObject({ exerciseId: `l5-order-${sentence.id}`, hintsUsed: 0 });
  expect(attempts[1]).toMatchObject({ exerciseId: `l5-order-${sentence.id}`, answer: sentence.tokens.join(''), hintsUsed: 1 });
  for (const attempt of attempts) expect(attempt).not.toHaveProperty('selfRating');
});
