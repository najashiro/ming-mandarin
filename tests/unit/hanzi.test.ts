import { describe, expect, it } from 'vitest';
import { cumulativeStrokeSets, getHanziTransform, strokeDirection, toScreenPoint } from '@/lib/hanzi/geometry';
import { isHanziCharacterData } from '@/lib/hanzi/loader';
import { isSuccessfulHanziAttempt, updateLocalHanziProgress } from '@/lib/hanzi/mastery';
import { classifyHanziLearningState, recommendHanziCharacters, summarizeHanziStages } from '@/lib/hanzi/progress';
import type { HanziAttemptPayload, HanziCharacterData, HanziProgressMap } from '@/lib/hanzi/types';
import manifest from '@/public/hanzi-data/manifest.json';
import one from '@/public/hanzi-data/一.json';
import good from '@/public/hanzi-data/好.json';
import evening from '@/public/hanzi-data/晚.json';
import thanks from '@/public/hanzi-data/谢.json';
import { characters, hanziSourceGroups, hanziStages, legacyCharacters, lesson1Characters } from '@/seed/characters';
import { strokeNamesForCharacter } from '@/lib/hanzi/stroke-names';

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

  it('mantiene nombres técnicos separados de la dirección y evita nombres ambiguos', () => {
    const names = strokeNamesForCharacter('好', goodData.strokes.length);
    expect(names[0]).toEqual({ hanzi: '撇点', pinyin: 'piědiǎn' });
    expect(names[1]).toEqual({ hanzi: '撇', pinyin: 'piě' });
    expect(names[3]).toBeNull();
    expect(names).toHaveLength(goodData.strokes.length);
  });

  it('valida datos y disponibilidad para todo el inventario de la lección', () => {
    expect(isHanziCharacterData(good)).toBe(true);
    expect(isHanziCharacterData({ strokes: ['M0'], medians: [] })).toBe(false);
    expect(characters.every((item) => manifest[item.hanzi as keyof typeof manifest]?.available)).toBe(true);
    expect(characters.every((item) => manifest[item.hanzi as keyof typeof manifest]?.strokeCount === item.strokeCount)).toBe(true);
  });

  it('mantiene 52 Hanzi únicos distribuidos una sola vez en seis etapas', () => {
    expect(lesson1Characters).toHaveLength(52);
    expect(new Set(lesson1Characters.map((item) => item.hanzi)).size).toBe(52);
    expect(new Set(lesson1Characters.map((item) => item.id)).size).toBe(52);
    expect(hanziStages.map((stage) => stage.characters.length)).toEqual([12, 14, 13, 5, 4, 4]);
    expect(lesson1Characters.every((item) => item.writingRequired && item.primaryStage)).toBe(true);
  });

  it('conserva los nueve registros complementarios y no duplica IDs previos', () => {
    expect(legacyCharacters.map((item) => item.hanzi)).toEqual(['力', '生', '言', '人', '木', '羊', '井', '土', '林']);
    expect(characters.find((item) => item.hanzi === '好')?.id).toBe('c-好');
    expect(characters.find((item) => item.hanzi === '力')?.id).toBe('c-力');
    expect(new Set(characters.map((item) => item.id)).size).toBe(characters.length);
  });

  it('trata 1.5 como evidencia de repaso sin introducir caracteres', () => {
    const introduced = new Set([...hanziSourceGroups['hanzi-1.1'], ...hanziSourceGroups['hanzi-1.2'], ...hanziSourceGroups['hanzi-1.3'], ...hanziSourceGroups['hanzi-1.4']]);
    expect(Object.values(hanziSourceGroups).map((group) => group.length)).toEqual([12, 12, 15, 17, 27]);
    expect(hanziSourceGroups['hanzi-1.5']).toHaveLength(27);
    expect(hanziSourceGroups['hanzi-1.5'].every((item) => introduced.has(item))).toBe(true);
    const particle = lesson1Characters.find((item) => item.hanzi === '么')!;
    expect(particle.primaryStage).toBe(3);
    expect(particle.words?.map((word) => word.hanzi)).toEqual(expect.arrayContaining(['什么', '怎么样']));
  });

  it('mantiene el pinyin curricular normalizado en Unicode NFC', () => {
    expect(lesson1Characters.every((item) => item.pinyin === item.pinyin.normalize('NFC'))).toBe(true);
    expect(lesson1Characters.flatMap((item) => item.words ?? []).every((word) => word.pinyin === word.pinyin.normalize('NFC'))).toBe(true);
  });

  it('carga trazos locales para un carácter simple, conocido, intermedio y complejo', () => {
    for (const data of [one, good, evening, thanks]) expect(isHanziCharacterData(data)).toBe(true);
    expect((one as HanziCharacterData).strokes).toHaveLength(1);
    expect((good as HanziCharacterData).strokes).toHaveLength(6);
    expect((evening as HanziCharacterData).strokes).toHaveLength(11);
    expect((thanks as HanziCharacterData).strokes).toHaveLength(12);
  });

  it('deriva estados y recomendaciones desde mastery, SRS y errores reales', () => {
    const now = new Date('2026-08-27T12:00:00Z');
    const progress: HanziProgressMap = {
      'c-好': { openErrors: 1, dimensions: { writing: { mastery: 42, stability: 1.2, exposures: 3, nextReviewAt: '2026-08-28T12:00:00Z', lastSeenAt: now.toISOString() } } },
    };
    expect(classifyHanziLearningState('c-一', undefined, {}, now)).toBe('new');
    expect(classifyHanziLearningState('c-好', progress['c-好'], {}, now)).toBe('review');
    expect(recommendHanziCharacters(lesson1Characters, progress, 1, now)[0].hanzi).toBe('好');
    expect(summarizeHanziStages(lesson1Characters, progress)[1]).toMatchObject({ stage: 2, studied: 1, total: 14 });
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
