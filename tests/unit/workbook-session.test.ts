import { describe, expect, it } from 'vitest';
import { createWorkbookRound, shuffleWorkbookOptions, checkWorkbookAnswer } from '@/lib/workbook-session';
import type { WorkbookQuestion } from '@/lib/workbook-games';

function question(lesson: 1 | 2 | 3 | 4 | 5, n: number, mode: WorkbookQuestion['mode'] = 'order'): WorkbookQuestion {
  return { id: `${lesson}-${mode}-${n}`, lesson, mode, prompt: 'Ordena', answer: '我也很好。', tokens: ['我', '也', '很', '好'], hint: 'Piensa en el sujeto.', explanation: 'El sujeto va antes del estado.' };
}

describe('sesiones de juegos del cuaderno', () => {
  const questions = ([1, 2, 3, 4, 5] as const).flatMap(lesson => Array.from({ length: 8 }, (_, i) => question(lesson, i)));
  it('da un turno a cada lección en repaso general, sin repetir retos', () => {
    const round = createWorkbookRound(questions, 'order', 6, () => 0.37);
    expect(round).toHaveLength(6);
    expect(new Set(round.slice(0, 5).map(item => item.lesson)).size).toBe(5);
    expect(new Set(round.map(item => item.id)).size).toBe(6);
  });
  it('respeta modo y grupo recibido, y no modifica el banco', () => {
    const pool = [question(1, 0), question(1, 1), question(1, 2, 'complete')];
    const original = structuredClone(pool);
    expect(createWorkbookRound(pool, 'order', 6, () => 0.8)).toHaveLength(2);
    expect(createWorkbookRound(pool, 'dialogue')).toEqual([]);
    expect(pool).toEqual(original);
    expect(createWorkbookRound(pool, 'order', -1)).toEqual([]);
  });
  it('un banco escaso sigue repartiendo hasta agotarse y deduplica identificadores', () => {
    const sparse = [question(1, 0), question(1, 0), ...Array.from({ length: 5 }, (_, i) => question(2, i))];
    const round = createWorkbookRound(sparse, 'order', 20, () => 0.5);
    expect(round).toHaveLength(6);
    expect(round.filter(item => item.lesson === 1)).toHaveLength(1);
  });
  it('conserva los bloques repetidos al mezclar', () => {
    const tokens = ['我', '的', '老师', '的', '朋友'];
    const shuffled = shuffleWorkbookOptions(tokens, () => 0.2);
    expect(shuffled).not.toBe(tokens);
    expect(shuffled.filter(item => item === '的')).toHaveLength(2);
    expect([...shuffled].sort()).toEqual([...tokens].sort());
  });
  it('acepta puntuación equivalente y variantes explícitas sin aceptar frases parciales', () => {
    const item = { ...question(1, 0), acceptedAnswers: ['我很好。'] };
    expect(checkWorkbookAnswer(item, '我 也 很 好！')).toBe(true);
    expect(checkWorkbookAnswer(item, '我很好')).toBe(true);
    for (const answer of ['', '。', '好', '我也不好', '很好我也', 'wǒ yě hěn hǎo']) expect(checkWorkbookAnswer(item, answer)).toBe(false);
  });
});
