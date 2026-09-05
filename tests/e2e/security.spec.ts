import { expect, test } from '@playwright/test';
import { examBank } from '../../seed/exam';
import { scoreExamAnswers } from '../../lib/exam-score';

test('la nota se deriva de respuestas y no del score enviado por el cliente', () => {
  const answers = Object.fromEntries(examBank.map((question) => [question.id, question.answer]));
  expect(scoreExamAnswers(answers).score).toBe(100);
  expect(scoreExamAnswers({}).score).toBe(0);
});

test('las estadísticas globales no están disponibles sin autorización administrativa', async ({ page, request }) => {
  const response = await request.get('/api/admin/analytics?range=30');
  expect(response.status()).toBe(401);
  await page.goto('/admin/analytics');
  await expect(page).toHaveURL(/\/admin\/login\?returnTo=%2Fadmin%2Fanalytics/);
  await expect(page.getByRole('heading', { name: 'Administración de Míng' })).toBeVisible();
});
