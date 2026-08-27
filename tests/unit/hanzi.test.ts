import { describe, expect, it } from 'vitest';
import { cumulativeStrokeSets, getHanziTransform, strokeDirection, toScreenPoint } from '@/lib/hanzi/geometry';
import { isHanziCharacterData } from '@/lib/hanzi/loader';
import { isSuccessfulHanziAttempt, updateLocalHanziProgress } from '@/lib/hanzi/mastery';
import type { HanziAttemptPayload, HanziCharacterData } from '@/lib/hanzi/types';
import manifest from '@/public/hanzi-data/manifest.json';
import good from '@/public/hanzi-data/好.json';
import { characters } from '@/seed/characters';

const attempt: HanziAttemptPayload = {
  characterId: 'c-好', mode: 'exam', skillDimension: 'writing', completed: true,
  correctStrokes: 6, mistakes: 0, hintsUsed: 0, durationMs: 8000, usedAnswer: false,
};
const goodData = good as HanziCharacterData;

describe('laboratorio Hanzi', () => {
  it('mantiene la transformación canónica de Make Me a Hanzi', () => {
    const transform = getHanziTransform(128, 128, 0);
    expect(transform.scale).toBe(0.125);
    expect(transform.transform).toBe('translate(0, 112.5) scale(0.125, -0.125)');
    expect(toScreenPoint([0, 900], 128, 128, 0)).toEqual({ x: 0, y: 0 });
  });

  it('deriva dirección y despiece desde medianas y trazos reales', () => {
    expect(strokeDirection([[0, 0], [100, 0]]).label).toBe('derecha');
    expect(strokeDirection([[0, 0], [0, 100]]).label).toBe('arriba');
    const sets = cumulativeStrokeSets(goodData);
    expect(sets).toHaveLength(6);
    expect(sets.map((set) => set.length)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('valida datos y disponibilidad para todo el inventario de la lección', () => {
    expect(isHanziCharacterData(good)).toBe(true);
    expect(isHanziCharacterData({ strokes: ['M0'], medians: [] })).toBe(false);
    expect(characters.every((item) => manifest[item.hanzi as keyof typeof manifest]?.available)).toBe(true);
    expect(characters.every((item) => manifest[item.hanzi as keyof typeof manifest]?.strokeCount === item.strokeCount)).toBe(true);
  });

  it('separa éxito evaluado y resumen local sin coordenadas', () => {
    expect(isSuccessfulHanziAttempt(attempt)).toBe(true);
    expect(isSuccessfulHanziAttempt({ ...attempt, usedAnswer: true })).toBe(false);
    expect(isSuccessfulHanziAttempt({ ...attempt, mode: 'guided', mistakes: 3 })).toBe(true);
    const local = updateLocalHanziProgress(undefined, attempt, new Date('2026-08-27T10:00:00Z'));
    expect(local).toEqual({ attempts: 1, completed: 1, mistakes: 0, lastPracticedAt: '2026-08-27T10:00:00.000Z' });
    expect(local).not.toHaveProperty('coordinates');
  });
});
