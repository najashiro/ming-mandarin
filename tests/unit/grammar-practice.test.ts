import { describe, expect, it } from 'vitest';
import { getCurriculum } from '@/seed/curriculum';
import { grammarPracticeModel } from '@/lib/grammar-practice';
import { grammarReading } from '@/lib/grammar-language';
import { compareExerciseAnswer } from '@/lib/pinyin';

const scopes = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'] as const;

describe('grammar practice across lessons 1–6', () => {
  for (const scope of scopes) {
    it(`${scope}: every grammar exercise remains completable with its original backend answer`, () => {
      const curriculum = getCurriculum(scope);
      const exercises = curriculum.exercises.filter(exercise => exercise.dimension === 'grammar');
      expect(exercises.length).toBeGreaterThan(0);
      for (const exercise of exercises) {
        const original = structuredClone(exercise);
        const model = grammarPracticeModel(exercise, curriculum.sentences);
        expect(model.tokens.length, exercise.id).toBeGreaterThan(0);
        expect(compareExerciseAnswer(exercise.type, model.tokens.join(''), exercise.answer), `${exercise.id}: ${model.tokens.join('|')} → ${exercise.answer}`).toBe(true);
        expect([...model.options].sort(), exercise.id).toEqual([...model.tokens].sort());
        // Display retains source punctuation (e.g. 、 and quotation marks),
        // while submitted blocks must match the backend's exact answer rules.
        expect(model.hanzi.replace(/[\p{P}\s]/gu, ''), exercise.id).toBe(exercise.answer.replace(/[\p{P}\s]/gu, ''));
        expect(model.pinyin, `${exercise.id}: phrase pinyin`).toBeTruthy();
        expect(model.spanish, `${exercise.id}: phrase Spanish`).toBeTruthy();
        for (const token of model.options) {
          if (!/\p{Script=Han}/u.test(token)) continue;
          expect(grammarReading(token)?.pinyin, `${exercise.id}: ${token} pinyin`).toBeTruthy();
          expect(grammarReading(token)?.spanish, `${exercise.id}: ${token} Spanish`).toBeTruthy();
        }
        expect(exercise).toEqual(original);
      }
    });
  }

  it('keeps existing lesson 5 token order and exercise identifiers unchanged', () => {
    const curriculum = getCurriculum('l5');
    const exercises = curriculum.exercises.filter(exercise => exercise.dimension === 'grammar');
    expect(exercises).toHaveLength(22);
    for (const exercise of exercises) expect(grammarPracticeModel(exercise, curriculum.sentences).options).toEqual(exercise.options);
  });

  it('adapts legacy transformations to Chinese blocks without converting backend types', () => {
    const curriculum = getCurriculum('l1');
    for (const id of ['ma-transform', 'find-error-ye', 'find-error-ma']) {
      const exercise = curriculum.exercises.find(item => item.id === id)!;
      expect(exercise.type).toBe('pinyin');
      expect(exercise.prompt).toMatch(/Convierte|Corrige/);
      const model = grammarPracticeModel(exercise, curriculum.sentences);
      expect(model.tokens.length).toBeGreaterThan(1);
      expect(compareExerciseAnswer(exercise.type, model.tokens.join(''), exercise.answer)).toBe(true);
      expect(exercise.id).toBe(id);
      expect(exercise.type).toBe('pinyin');
    }
  });

  it('retains repeated blocks as distinct selectable positions', () => {
    const source = getCurriculum('l1').exercises.find(exercise => exercise.id === 'order-ye')!;
    const repeated = { ...source, answer: '我我你', options: ['你', '我', '我'] };
    const model = grammarPracticeModel(repeated);
    expect(model.options).toEqual(['你', '我', '我']);
    expect(model.tokens).toEqual(['我', '我', '你']);
    expect(model.options.filter(token => token === '我')).toHaveLength(2);
  });
});
