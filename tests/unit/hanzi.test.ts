import { describe, expect, it } from 'vitest';
import { cumulativeStrokeSets, getHanziTransform, strokeDirection, toScreenPoint } from '@/lib/hanzi/geometry';
import { isHanziCharacterData } from '@/lib/hanzi/loader';
import { advanceHanziStudyExposure, isSuccessfulHanziAttempt, updateLocalHanziProgress, updateLocalHanziStudyExposure } from '@/lib/hanzi/mastery';
import { classifyHanziLearningState, recommendHanziCharacters, summarizeHanziStages } from '@/lib/hanzi/progress';
import type { HanziAttemptPayload, HanziCharacterData, HanziProgressMap } from '@/lib/hanzi/types';
import manifest from '@/public/hanzi-data/manifest.json';
import one from '@/public/hanzi-data/一.json';
import good from '@/public/hanzi-data/好.json';
import evening from '@/public/hanzi-data/晚.json';
import thanks from '@/public/hanzi-data/谢.json';
import { canonicalCharacters, characters, hanziSourceGroups, hanziUnits, legacyCharacters, lesson1Characters } from '@/seed/characters';
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

  it('organiza un solo corpus canónico por las seis unidades reales', () => {
    expect(canonicalCharacters).toHaveLength(192);
    expect(new Set(canonicalCharacters.map((item) => item.hanzi)).size).toBe(192);
    expect(new Set(canonicalCharacters.map((item) => item.id)).size).toBe(192);
    expect(hanziUnits.map((unit) => unit.id)).toEqual(['1.1','1.2','2.1','2.2','3.1','3.2']);
    expect(hanziUnits.map((unit) => unit.characters.length)).toEqual([40,26,57,42,36,39]);
    expect(hanziUnits.map((unit) => canonicalCharacters.filter((item) => item.introducedIn === unit.id).length)).toEqual([40,18,45,35,29,25]);
    expect(canonicalCharacters.every((item) => item.writingRequired && item.id === `c-${item.hanzi}`)).toBe(true);
  });

  it('conserva los registros técnicos no curriculares sin duplicar IDs', () => {
    expect(legacyCharacters.map((item) => item.hanzi)).toEqual(['力','言','木','羊','井','土','林']);
    expect(characters.find((item) => item.hanzi === '好')?.id).toBe('c-好');
    expect(characters.find((item) => item.hanzi === '力')?.id).toBe('c-力');
    expect(new Set(characters.map((item) => item.id)).size).toBe(characters.length);
  });

  it('distingue introducción y repaso sin crear copias por unidad', () => {
    expect(Object.keys(hanziSourceGroups)).toEqual(['1.1','1.2','2.1','2.2','3.1','3.2']);
    const particle = lesson1Characters.find((item) => item.hanzi === '么')!;
    expect(particle.introducedIn).toBe('1.1');
    expect(particle.appearsIn).toEqual(['1.1','1.2']);
    expect(particle.words?.map((word) => word.hanzi)).toEqual(expect.arrayContaining(['什么', '怎么样']));
    expect(canonicalCharacters.find((item) => item.hanzi === '问')?.appearsIn).toEqual(['1.1','1.2']);
    expect(canonicalCharacters.find((item) => item.hanzi === '也')?.appearsIn).toEqual(['1.1','1.2']);
    expect(canonicalCharacters.find((item) => item.hanzi === '这')?.appearsIn).toEqual(['2.1','2.2']);
    expect(canonicalCharacters.find((item) => item.hanzi === '那')).toMatchObject({ introducedIn:'2.1',appearsIn:['2.1','2.2'] });
    expect(canonicalCharacters.find((item) => item.hanzi === '生')).toMatchObject({ introducedIn:'2.1',appearsIn:['2.1','3.1'] });
    expect(canonicalCharacters.find((item) => item.hanzi === '谁')).toMatchObject({ id:'c-谁',introducedIn:'2.1',appearsIn:['2.1','3.1'] });
    expect(canonicalCharacters.find((item) => item.hanzi === '张')).toMatchObject({ id:'c-张',introducedIn:'3.1',appearsIn:['3.1','3.2'],sourceRole:'core' });
    expect(canonicalCharacters.find((item) => item.hanzi === '平')).toMatchObject({ introducedIn:'3.2',pinyin:'píng' });
    expect(canonicalCharacters.some((item) => item.hanzi === '萍')).toBe(false);
    expect(canonicalCharacters.every((item) => item.sources?.length && item.appearsIn.includes(item.introducedIn))).toBe(true);
  });

  it('marca las extensiones docentes auditadas y las lecturas polisémicas del corpus', () => {
    for (const hanzi of [...'困渴饿累会说喝水茶咖啡牛奶爷外公婆姥猫只爱男帅餐厅去找弹']) {
      expect(canonicalCharacters.find((item) => item.hanzi === hanzi)?.sourceRole, hanzi).toBe('teacherExtension');
    }
    expect(canonicalCharacters.find((item) => item.hanzi === '呢')?.pinyin).toBe('ne');
    expect(canonicalCharacters.find((item) => item.hanzi === '漂')?.pinyin).toBe('piào');
    expect(canonicalCharacters.find((item) => item.hanzi === '弹')?.pinyin).toBe('tán');
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
    expect(summarizeHanziStages(lesson1Characters, progress)[0]).toMatchObject({ stage:'1.1',studied:1,total:40 });
  });

  it('separa éxito evaluado y resumen local sin coordenadas', () => {
    expect(isSuccessfulHanziAttempt(attempt)).toBe(true);
    expect(isSuccessfulHanziAttempt({ ...attempt, usedAnswer: true })).toBe(false);
    expect(isSuccessfulHanziAttempt({ ...attempt, mode: 'guided', mistakes: 3 })).toBe(true);
    const local = updateLocalHanziProgress(undefined, attempt, new Date('2026-08-27T10:00:00Z'));
    expect(local).toEqual({ attempts: 1, completed: 1, mistakes: 0, lastPracticedAt: '2026-08-27T10:00:00.000Z' });
    expect(local).not.toHaveProperty('coordinates');
  });

  it('registra estudio consciente sin convertirlo en un acierto evaluado', () => {
    const now = new Date('2026-09-04T12:00:00Z');
    const current = {
      mastery: 37,
      stability: 2.4,
      difficulty: 4,
      exposures: 3,
      correctCount: 2,
      incorrectCount: 1,
      streak: 2,
      lastSeenAt: '2026-09-01T12:00:00.000Z',
      nextReviewAt: '2026-09-10T12:00:00.000Z',
    };

    expect(advanceHanziStudyExposure(current, now)).toEqual({
      ...current,
      exposures: 4,
      lastSeenAt: '2026-09-04T12:00:00.000Z',
    });

    const local = updateLocalHanziStudyExposure(undefined, now);
    expect(local).toEqual({
      attempts: 0,
      completed: 0,
      mistakes: 0,
      studyExposures: 1,
      lastPracticedAt: '2026-09-04T12:00:00.000Z',
    });
    expect(classifyHanziLearningState('c-一', undefined, { 'c-一:recognition': local }, now)).toBe('learning');

    const syncedStudyOnly: HanziProgressMap = {
      'c-一': {
        openErrors: 0,
        dimensions: {
          recognition: {
            mastery: 0,
            stability: 0,
            exposures: 1,
            nextReviewAt: null,
            lastSeenAt: now.toISOString(),
          },
        },
      },
    };
    expect(classifyHanziLearningState('c-一', syncedStudyOnly['c-一'], {}, now)).toBe('learning');
  });
});
