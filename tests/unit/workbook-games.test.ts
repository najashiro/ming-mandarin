import { describe, expect, it } from 'vitest';
import lesson4 from '@/data/lesson4-public.json';
import lesson5 from '@/MING_KNOWLEDGE/v2/lesson5/content.json';
import type { CurriculumScope } from '@/data/types';
import { getWorkbookQuestions, workbookModes, workbookQuestionEvidence } from '@/lib/workbook-games';
import { normalizeAnswer } from '@/lib/pinyin';

const all = getWorkbookQuestions('l1-l2-l3-l4-l5');

describe('juegos adaptados de los cuadernos L1–L5', () => {
  it('ofrece las tres habilidades en cada lección sin mezclar alcances', () => {
    expect(all).toHaveLength(80);
    expect(new Set(all.map((question) => question.id)).size).toBe(all.length);
    for (const lesson of [1, 2, 3, 4, 5]) {
      const scope = `l${lesson}` as CurriculumScope;
      const questions = getWorkbookQuestions(scope);
      expect(questions).toHaveLength(16);
      expect(questions.every((question) => question.lesson === lesson)).toBe(true);
      expect(getWorkbookQuestions(scope, 'order')).toHaveLength(5);
      expect(getWorkbookQuestions(scope, 'complete')).toHaveLength(5);
      expect(getWorkbookQuestions(scope, 'dialogue')).toHaveLength(6);
    }
    for (const scope of ['l1-l2', 'l1-l2-l3', 'l1-l2-l3-l4'] as const) {
      const lessons = scope.split('-').length;
      expect(getWorkbookQuestions(scope)).toHaveLength(16 * lessons);
      expect(getWorkbookQuestions(scope).every((question) => question.lesson <= lessons)).toBe(true);
    }
    expect(workbookModes.map((mode) => mode.id)).toEqual(['order', 'complete', 'dialogue']);
  });

  it('permite reconstruir todas las soluciones y conserva los bloques repetidos', () => {
    for (const question of all.filter((item) => item.mode === 'order')) {
      expect(question.tokens!.length, question.id).toBeGreaterThanOrEqual(3);
      expect(normalizeAnswer(question.tokens!.join('')), question.id).toBe(normalizeAnswer(question.answer));
      const characters = (value: string) => [...normalizeAnswer(value)].sort().join('');
      for (const alternative of question.acceptedAnswers ?? []) {
        expect(characters(alternative), question.id).toBe(characters(question.answer));
      }
      expect(question.pinyin, question.id).toBeTruthy();
      expect(question.translation, question.id).toBeTruthy();
    }
    const repeated = all.find((question) => question.id === 'wb-l4-order-1')!;
    expect(repeated.tokens!.filter((token) => token === '累')).toHaveLength(2);
    expect(all.find((question) => question.id === 'wb-l4-order-5')!.acceptedAnswers).toContain('我晚上十点回家。');
  });

  it('conserva una solución elegible y distractores distintos en cada pregunta', () => {
    for (const question of all.filter((item) => item.mode !== 'order')) {
      expect(question.options!.filter((option) => normalizeAnswer(option) === normalizeAnswer(question.answer)), question.id).toHaveLength(1);
      expect(new Set(question.options!.map(normalizeAnswer)).size, question.id).toBe(question.options!.length);
      expect(question.options!.length, question.id).toBeGreaterThanOrEqual(2);
      if (question.mode === 'complete') {
        expect(question.context!.match(/___/g), question.id).toHaveLength(1);
        expect([...question.answer], question.id).toHaveLength(1);
      }
    }
  });

  it('elimina respuestas semánticamente válidas que eran ambiguas al separar los emparejamientos', () => {
    const recent = all.find((question) => question.id === 'wb-l1-dialogue-5')!;
    expect(recent.context).toBe('你最近怎么样？');
    expect(recent.options).not.toContain('我不太累。');
    expect(recent.options).not.toContain('我也很忙。');
    const busy = all.find((question) => question.id === 'wb-l1-dialogue-6')!;
    expect(busy.options).not.toContain('我很忙。');
    expect(busy.options).not.toContain('我不太累。');
    const identify = all.find((question) => question.id === 'wb-l2-dialogue-5')!;
    expect(identify.options).not.toContain('那不是包子，是饺子。');
    const beibei = all.find((question) => question.id === 'wb-l3-dialogue-3')!;
    expect(beibei.options).not.toContain('他是老师。');
    const many = all.find((question) => question.id === 'wb-l4-dialogue-4')!;
    expect(many.options).not.toContain('二十八个人。');
    expect(all.find((question) => question.id === 'wb-l4-dialogue-6')!.prompt).toContain('número total');
    expect(all.find((question) => question.id === 'wb-l4-complete-4')!.prompt).toContain('muchas y pocas');
    expect(all.find((question) => question.id === 'wb-l1-dialogue-1')!.prompt).toContain('otro saludo');
    expect(all.find((question) => question.id === 'wb-l5-dialogue-6')!.prompt).toContain('Saluda');
  });

  it('acepta las posiciones naturales del tiempo y el mismo nombre y apellido en distinto orden', () => {
    const alternatives: Record<string, string> = {
      'wb-l1-order-5': '他叫宋华，姓宋。',
      'wb-l4-order-2': '上午我八点有口语课。',
      'wb-l4-order-3': '明天我们班中午有活动。',
      'wb-l4-order-5': '晚上我十点回家。',
    };
    for (const [id, answer] of Object.entries(alternatives)) {
      const question = all.find((item) => item.id === id)!;
      expect(question.acceptedAnswers, id).toContain(answer);
      // Each variant is constructible with the exact available blocks, not
      // merely with the same individual Hanzi in a different segmentation.
      const consume = (remaining: string, tokens: string[]): boolean => {
        if (!remaining) return tokens.length === 0;
        return tokens.some((token, index) => remaining.startsWith(token)
          && consume(remaining.slice(token.length), tokens.filter((_, position) => position !== index)));
      };
      expect(consume(normalizeAnswer(answer), question.tokens!), id).toBe(true);
    }
  });

  it('mantiene evidencia interna y distingue las respuestas editoriales de las claves oficiales', () => {
    expect(Object.keys(workbookQuestionEvidence)).toHaveLength(all.length);
    for (const question of all) {
      const evidence = workbookQuestionEvidence[question.id];
      expect(evidence.source.type).toBe('workbook');
      expect(evidence.source.file).toMatch(/\.pdf$/);
      expect(evidence.source.pdfPage).toBeGreaterThan(0);
      expect(evidence.sourceExerciseId).toBeTruthy();
      expect(evidence.answerOrigin).toBe('ming_adaptation');
      expect(question).not.toHaveProperty('source');
      expect(question).not.toHaveProperty('sourceExerciseId');
      expect(question.hint.trim()).toBeTruthy();
      expect(question.explanation.trim()).toBeTruthy();
    }
    expect(JSON.stringify(all)).not.toMatch(/pdfPage|\.pdf|requiresOriginalAudio|sourceExerciseId/);
  });

  it('enlaza las adaptaciones L4/L5 con actividades existentes sin usar las que requieren audio ausente', () => {
    for (const question of all.filter((item) => item.lesson >= 4)) {
      const evidence = workbookQuestionEvidence[question.id];
      const corpus = question.lesson === 4 ? lesson4.documentaryExercises : lesson5.documentaryExercises;
      const exercise = corpus.find((item) => item.id === evidence.sourceExerciseId);
      expect(exercise, question.id).toBeDefined();
      expect(exercise!.requiresOriginalAudio, question.id).toBe(false);
      if (question.mode === 'complete') {
        const normalizeBlanks = (value: string) => value.replace(/_+/g, '___');
        expect(exercise!.texts.some((text) => normalizeBlanks(text).startsWith(question.context!)), question.id).toBe(true);
      }
    }
    const birthdayAge = all.find((question) => question.id === 'wb-l5-dialogue-1')!;
    expect(birthdayAge.answer).toBe('我一九八五年出生，今年三十五岁。');
    expect(birthdayAge.explanation).toContain('2020');
  });

  it('devuelve copias independientes para barajar sesiones sin modificar el banco', () => {
    const first = getWorkbookQuestions('l1');
    const expected = getWorkbookQuestions('l1');
    first[0].tokens!.reverse();
    first[0].prompt = 'mutated';
    const choice = first.find((question) => question.options)!;
    choice.options!.pop();
    const alternative = first.find((question) => question.acceptedAnswers)!;
    alternative.acceptedAnswers!.pop();
    expect(getWorkbookQuestions('l1')).toEqual(expected);
  });
});
