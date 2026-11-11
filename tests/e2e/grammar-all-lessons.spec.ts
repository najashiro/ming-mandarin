import { expect, test, type Page } from '@playwright/test';
import type { CurriculumScope, Exercise } from '../../data/types';
import studyReference from '../../data/lesson4-study-reference.json' with { type: 'json' };
import lesson4 from '../../data/lesson4-public.json' with { type: 'json' };
import lesson5 from '../../data/lesson5-public.json' with { type: 'json' };
import lesson6 from '../../data/lesson6-public.json' with { type: 'json' };

const lessons: CurriculumScope[] = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'];
const reviews: CurriculumScope[] = ['l1-l2', 'l1-l2-l3', 'l1-l2-l3-l4', 'l1-l2-l3-l4-l5', 'l1-l2-l3-l4-l5-l6'];

test.beforeEach(async ({ context }) => {
  await context.route('**/api/analytics/**', route => route.fulfill({ status: 204, body: '' }));
});

// Stable curriculum IDs and first exercises are copied from the published course,
// independently of the UI's new model builder.
const topicIdsByLesson: Record<string, string[]> = {
  l1: ['g-ma', 'g-hen', 'g-bu', 'g-bu-tai', 'g-ye', 'g-ne', 'g-order'],
  l2: ['shi', 'interrogatives', 'ye-dou', 'he', 'xihuan', 'yao', 'hui', 'gang'].map(slug => `g-l2-${slug}`),
  l3: ['you', 'de', 'classifiers', 'liang', 'question-words', 'hai', 'age'].map(slug => `g-l3-${slug}`),
  l4: studyReference.grammar.filter(point => !point.continuationOf).map(point => point.id),
  l5: lesson5.grammar.map(point => point.id),
  l6: lesson6.grammar.map(point => point.id),
};
const topicIdsFor = (scope: CurriculumScope) => scope.split('-').flatMap(lesson => topicIdsByLesson[lesson]);
type FirstExercise = Pick<Exercise, 'id' | 'type' | 'answer' | 'options'>;
const firstExercises: Record<string, FirstExercise> = {
  l1: { id: 'order-recent', type: 'order', answer: '你最近怎么样', options: ['最近', '你', '怎么样'] },
  l2: { id: 'l2-sentence-1', type: 'order', answer: '陈老师，早上好', options: ['早上好', '陈老师'] },
  l3: { id: 'l3-sentence-1', type: 'order', answer: '你家有几口人', options: ['有', '几口人', '你家'] },
};
for (const [scope, data] of [['l4', lesson4], ['l5', lesson5], ['l6', lesson6]] as const) {
  const sentence = data.sentences[0];
  firstExercises[scope] = { id: `${scope}-order-${sentence.id}`, type: 'order', answer: sentence.tokens.join(''), options: [...sentence.tokens.slice(1), sentence.tokens[0]] };
}

async function assertNoConfidence(page: Page) {
  const practice = page.locator('.grammar-practice');
  await expect(practice.getByRole('radio')).toHaveCount(0);
  await expect(practice).not.toContainText(/Lo sé|Dudé|Tengo dudas|Estoy aprendiendo|¿Cómo te sientes/);
}

async function checkFirstExercise(page: Page, scope: CurriculumScope) {
  const exercise = firstExercises[scope.split('-')[0]];
  expect(exercise.type).toBe('order');
  expect(exercise.options?.length).toBeGreaterThan(0);
  let payload: Record<string, unknown> | undefined;
  await page.route('**/api/practice', route => {
    payload = route.request().postDataJSON();
    return route.fulfill({ json: { xp: 5 } });
  });
  const clean = (text: string) => text.replace(/[\s\p{Punctuation}]/gu, '');
  let remaining = clean(exercise.answer);
  const available = [...(exercise.options ?? [])];
  const practice = page.locator('.grammar-practice');
  const bank = practice.locator('.grammar-practice-bank');
  await assertNoConfidence(page);
  while (available.length) {
    const position = available.findIndex(option => remaining.startsWith(clean(option)));
    expect(position, `Los bloques de ${exercise.id} deben reconstruir la respuesta`).toBeGreaterThanOrEqual(0);
    const [token] = available.splice(position, 1);
    remaining = remaining.slice(clean(token).length);
    await bank.getByRole('button', { name: `Añadir: ${token}`, exact: true }).and(bank.locator('button:enabled')).first().click();
  }
  expect(remaining).toBe('');
  await practice.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect(practice.locator('.grammar-practice-feedback')).toContainText('¡Bien hecho!');
  await expect(practice.locator('.grammar-practice-feedback')).toContainText('Progreso guardado');
  expect(payload).toMatchObject({ exerciseId: exercise.id });
  expect(payload).not.toHaveProperty('selfRating');
  await expect(practice.getByRole('progressbar')).toHaveAttribute('value', '1');
  await practice.getByRole('button', { name: 'Siguiente frase', exact: true }).click();
  await expect(practice.locator('.grammar-practice-count')).toContainText('2 /');
  await expect(practice.locator('.grammar-practice-answer').getByRole('button')).toHaveCount(0);
}

async function checkUniversalControls(page: Page) {
  const study = page.locator('.grammar-study');
  await expect(page.getByRole('button', { name: 'Pinyin', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Español', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(study.locator('.pinyin-text:visible').first()).toBeVisible();
  await page.getByRole('button', { name: 'Ocultar pinyin y español', exact: true }).click();
  await expect(study.locator('.pinyin-text:visible')).toHaveCount(0);
  await expect(study.locator('.grammar-reading-spanish:visible, .grammar-practice-translation:visible')).toHaveCount(0);
  await expect(page.locator('.book-reference .pinyin-text:visible')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mostrar pinyin y español', exact: true }).click();
  await expect(study.locator('.pinyin-text:visible').first()).toBeVisible();
}

for (const scope of lessons) {
  test(`${scope}: todos los temas tienen ayudas y la práctica funciona sin autoevaluación`, async ({ page }, info) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/study/${scope}/grammar`);
    const pointIds = topicIdsFor(scope);
    const navigation = page.getByTestId('grammar-topics');
    await expect(navigation.getByRole('button')).toHaveCount(pointIds.length);
    for (const id of pointIds) {
      await navigation.locator(`[data-topic-id="${id}"]`).click();
      const topic = page.getByTestId('grammar-topic');
      await expect(topic).toHaveAttribute('id', id);
      const examples = topic.getByTestId('grammar-example');
      const exampleCount = await examples.count();
      if (scope !== 'l4') expect(exampleCount, `${scope}/${id} conserva ejemplos`).toBeGreaterThan(0);
      for (let index = 0; index < exampleCount; index++) {
        if (!/\p{Script=Han}/u.test(await examples.nth(index).textContent() ?? '')) continue;
        await expect(examples.nth(index).locator('.grammar-reading-pinyin').first()).toBeVisible();
        await expect(examples.nth(index).locator('.grammar-reading-spanish').first()).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${scope}/${id}`).toBe(true);
    }
    await navigation.getByRole('button').first().click();
    if (scope === 'l4' || scope === 'l6') {
      if (scope === 'l4') await navigation.locator('[data-topic-id="GR-L4-BOOK-04-09-05"]').click();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: info.outputPath(`${scope}-grammar-full.png`), fullPage: true });
      await page.locator(scope === 'l4' ? '.grammar-source-table' : '[data-testid="grammar-topic"]').evaluate(element => {
        window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 230, behavior: 'instant' });
      });
      await page.screenshot({ path: info.outputPath(`${scope}-grammar-viewport.png`) });
      await navigation.getByRole('button').first().click();
    }
    await checkUniversalControls(page);
    await checkFirstExercise(page, scope);
    expect(errors).toEqual([]);
  });
}

for (const scope of reviews) {
  test(`${scope}: repaso con controles universales y práctica conservada`, async ({ page }) => {
    await page.goto(`/study/${scope}/grammar`);
    await expect(page.getByTestId('grammar-topics').getByRole('button')).toHaveCount(topicIdsFor(scope).length);
    await checkUniversalControls(page);
    await checkFirstExercise(page, scope);
  });
}

test('ruta histórica de lección 1 mantiene la misma experiencia de estudio', async ({ page }) => {
  await page.goto('/lesson/1/grammar');
  await expect(page.getByTestId('grammar-topics').getByRole('button')).toHaveCount(topicIdsFor('l1').length);
  await checkUniversalControls(page);
  await checkFirstExercise(page, 'l1');
});

for (const route of ['/study/l1/grammar', '/study/l5/grammar', '/study/l1-l2-l3-l4-l5-l6/grammar', '/lesson/1/grammar']) {
  test(`${route}: explicación, patrón y ejemplos enlazan Hanzi en otra pestaña`, async ({ page }) => {
    await page.goto(route);
    const topic = page.getByTestId('grammar-topic');
    const topicId = await topic.getAttribute('id');
    const detail = topic.locator('.grammar-rule-detail');
    if (await detail.count()) await detail.locator('summary').click();
    const explanations = topic.locator('.grammar-rule-detail p, .grammar-topic-explanation');
    const link = explanations.locator('a.linked-hanzi').first();
    for (const area of [explanations, topic.locator('.grammar-pattern-guide'), topic.getByTestId('grammar-example').first()]) {
      const first = area.locator('a.linked-hanzi').first();
      await expect(first).toHaveAttribute('target', '_blank');
      await expect(first).toHaveAttribute('rel', 'noopener noreferrer');
      const target = new URL((await first.getAttribute('href'))!, page.url());
      expect(target.searchParams.get('focus')).toBe('glyph');
      expect(new URL(target.searchParams.get('returnTo')!, page.url()).pathname).toBe(route);
    }
    const character = (await link.textContent())!.trim();
    const popupPromise = page.waitForEvent('popup');
    await link.click();
    const popup = await popupPromise;
    await expect(popup.locator('#hanzi-detail-start')).toHaveAttribute('data-character', character);
    const destination = new URL(popup.url());
    expect(destination.searchParams.get('character')).toBe(character);
    expect(new URL(destination.searchParams.get('returnTo')!, page.url()).pathname).toBe(route);
    expect(new URL(page.url()).pathname).toBe(route);
    await expect(topic).toHaveAttribute('id', topicId!);
    await popup.close();

    const navigation = page.getByTestId('grammar-topics');
    const secondTopic = (await navigation.getByRole('button').nth(1).getAttribute('data-topic-id'))!;
    await page.goto(`${route}#${secondTopic}`);
    await expect(topic).toHaveAttribute('id', secondTopic);
    await expect(navigation.getByRole('button').nth(1)).toHaveAttribute('aria-current', 'step');
    const lastTopic = (await navigation.getByRole('button').last().getAttribute('data-topic-id'))!;
    await navigation.getByRole('button').last().click();
    await expect.poll(() => decodeURIComponent(new URL(page.url()).hash.slice(1))).toBe(lastTopic);
    await page.reload();
    await expect(topic).toHaveAttribute('id', lastTopic);
    await expect(navigation.getByRole('button').last()).toHaveAttribute('aria-current', 'step');
  });
}
