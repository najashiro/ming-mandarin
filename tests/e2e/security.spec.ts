import { expect, test } from '@playwright/test';
import { examBank } from '../../seed/exam';
import { scoreExamAnswers } from '../../lib/exam-score';

test('la nota se deriva de respuestas y no del score enviado por el cliente', () => {
  const answers = Object.fromEntries(examBank.map((question) => [question.id, question.answer]));
  expect(scoreExamAnswers(answers).score).toBe(100);
  expect(scoreExamAnswers({}).score).toBe(0);
});
