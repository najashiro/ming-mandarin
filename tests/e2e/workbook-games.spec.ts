import { expect, test, type Page } from '@playwright/test';
import { getWorkbookQuestions, type WorkbookQuestion } from '../../lib/workbook-games';

const bank = new Map(getWorkbookQuestions('l1-l2-l3-l4-l5').map(question => [question.id, question]));

async function currentQuestion(page: Page): Promise<WorkbookQuestion> {
  const id = await page.locator('.workbook-round').getAttribute('data-question-id');
  const question = bank.get(id!);
  expect(question, `Question ${id} belongs to the documented bank`).toBeTruthy();
  return question!;
}

async function answer(page: Page, correct = true) {
  const question = await currentQuestion(page);
  if (question.mode === 'order') {
    for (const token of question.tokens!) {
      await page.locator('.workbook-token-tray').getByRole('button', { name: `Añadir ${token}`, exact: true }).and(page.locator('button:not(:disabled)')).first().click();
    }
  } else {
    const value = correct ? question.answer : question.options!.find(option => option !== question.answer)!;
    await page.locator('.workbook-options button').filter({ has: page.getByText(value, { exact: true }) }).click();
  }
  await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
  await expect(page.locator(`.workbook-feedback.${correct ? 'correct' : 'incorrect'}`)).toBeVisible();
}

test('el catálogo da acceso a los tres juegos y conserva la lección', async ({ page }) => {
  await page.goto('/study/l5/games');
  const links = page.getByRole('region', { name: 'Del cuaderno al juego', exact: true });
  await expect(links.getByRole('link')).toHaveCount(3);
  await links.getByRole('link', { name: /El carácter que falta/ }).click();
  await expect(page).toHaveURL(/\/study\/l5\/games\/workbook\?mode=complete$/);
  await expect(page.locator('.workbook-mode[aria-pressed="true"]')).toContainText('El carácter que falta');
  await expect(page.locator('.workbook-games')).toHaveAttribute('data-workbook-scope', 'l5');
  await expect(page.getByRole('button', { name: 'Empezar a jugar' })).toBeVisible();
});

test('completar ideas explica los errores, ofrece pistas y los recupera en una segunda vuelta', async ({ page }) => {
  await page.goto('/study/l1-l2-l3-l4-l5/games/workbook?mode=complete');
  await page.getByRole('button', { name: 'Empezar a jugar' }).click();
  await expect(page.getByRole('button', { name: 'Comprobar', exact: true })).toBeDisabled();
  const initial = await currentQuestion(page);
  await page.getByRole('button', { name: 'Dame una pista' }).click();
  await expect(page.locator('.workbook-hint')).toContainText(initial.hint);
  await answer(page, false);
  await expect(page.locator('.workbook-explanation')).toContainText(initial.explanation);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  const lessons = new Set([initial.lesson]);
  for (let index = 1; index < 6; index++) {
    lessons.add((await currentQuestion(page)).lesson);
    await answer(page);
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  }
  expect(lessons.size).toBe(5);
  await page.getByRole('button', { name: 'Comenzar repaso' }).click();
  expect((await currentQuestion(page)).id).toBe(initial.id);
  await expect(page.locator('.workbook-feedback')).toHaveCount(0);
  await expect(page.locator('.workbook-hint')).toHaveCount(0);
  await answer(page);
  await page.getByRole('button', { name: 'Ver mi resultado' }).click();
  await expect(page.locator('.workbook-summary')).toContainText('Sesión completada');
  await expect(page.locator('.workbook-stats>div').nth(0)).toContainText('5 / 6');
  await expect(page.locator('.workbook-stats>div').nth(1)).toContainText('1');
  await expect(page.locator('.workbook-stats>div').nth(2)).toContainText('1');
  await expect(page.getByRole('button', { name: 'Repasar pendientes' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Nueva sesión', exact: true }).click();
  await expect(page.locator('.workbook-round')).toBeVisible();
});

test('construir permite quitar, vaciar y usar dos bloques iguales', async ({ page }) => {
  await page.goto('/study/l4/games/workbook?mode=order');
  await page.getByRole('button', { name: 'Empezar a jugar' }).click();
  const available = page.locator('.workbook-token-tray button:not(:disabled)');
  await available.first().click();
  await expect(page.locator('.workbook-target button')).toHaveCount(1);
  await page.locator('.workbook-target button').click();
  await expect(page.locator('.workbook-target button')).toHaveCount(0);
  await available.first().click();
  await page.getByRole('button', { name: 'Vaciar', exact: true }).click();
  await expect(page.locator('.workbook-target button')).toHaveCount(0);
  let repeatedTokenQuestionSeen = false;
  for (let index = 0; index < 5; index++) {
    const question = await currentQuestion(page);
    repeatedTokenQuestionSeen ||= new Set(question.tokens).size < question.tokens!.length;
    for (const token of question.tokens!) {
      const buttons = page.locator('.workbook-token-tray button:not(:disabled)');
      await buttons.filter({ has: page.locator('.hanzi-run', { hasText: new RegExp(`^${token}$`) }) }).first().click();
    }
    await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
    await expect(page.locator('.workbook-feedback.correct')).toBeVisible();
    await page.getByRole('button', { name: 'Mostrar pinyin', exact: true }).click();
    await expect(page.locator('.workbook-model-pinyin')).toBeVisible();
    await page.getByRole('button', { name: index === 4 ? 'Ver mi resultado' : 'Continuar', exact: true }).click();
  }
  expect(repeatedTokenQuestionSeen).toBe(true);
  await expect(page.locator('.workbook-summary')).toContainText('Sesión completada');
});

test('diálogos reinicia al cambiar juego y mantiene la ruta al cambiar lección', async ({ page }) => {
  await page.goto('/study/l2/games/workbook?mode=dialogue');
  await page.getByRole('button', { name: 'Empezar a jugar' }).click();
  await answer(page);
  await page.locator('.workbook-mode').filter({ hasText: 'Constructor de frases' }).click();
  await expect(page.locator('.workbook-feedback')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Empezar a jugar' })).toBeVisible();
  const selector = page.getByRole('combobox', { name: 'Cambiar lección de estudio' });
  if (await selector.isVisible()) await selector.selectOption('l3');
  else await page.locator('.curriculum-nav').getByRole('link', { name: 'Lección 3', exact: true }).click();
  await expect(page).toHaveURL(/\/study\/l3\/games\/workbook$/);
  await expect(page.locator('.workbook-games')).toHaveAttribute('data-workbook-scope', 'l3');
});

test('la pantalla y sus controles caben en móvil y escritorio', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/study/l1-l2-l3-l4-l5/games/workbook?mode=dialogue');
    await page.getByRole('button', { name: 'Empezar a jugar' }).click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await expect(page.locator('.workbook-round h3')).toBeFocused();
    await page.screenshot({ path: info.outputPath(`workbook-${width}.png`), fullPage: true });
  }
  expect(errors).toEqual([]);
});

test('los errores persistentes terminan la sesión y se pueden practicar de forma dirigida', async ({ page }) => {
  await page.goto('/study/l1/games/workbook?mode=complete');
  await page.getByRole('button', { name: 'Empezar a jugar' }).click();
  const pendingId = (await currentQuestion(page)).id;
  await answer(page, false);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  for (let index = 1; index < 5; index++) {
    await answer(page);
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Comenzar repaso' }).click();
  await answer(page, false);
  await page.getByRole('button', { name: 'Ver mi resultado' }).click();
  await expect(page.locator('.workbook-summary-note')).toContainText('1 reto necesita más práctica');
  await page.getByRole('button', { name: 'Repasar pendientes' }).click();
  expect((await currentQuestion(page)).id).toBe(pendingId);
  await expect(page.locator('.workbook-session-top')).toContainText('1 / 1');
  await answer(page);
  await page.getByRole('button', { name: 'Ver mi resultado' }).click();
  await expect(page.locator('.workbook-summary-note')).toContainText('Has respondido correctamente a todos');
});
