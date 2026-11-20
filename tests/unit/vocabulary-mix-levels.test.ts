import { describe, expect, it } from 'vitest';
import { getVocabularyMixSet, vocabularyMixScopes } from '@/lib/vocabulary';
import { getVocabularyMixPriority, type MixGroup } from '@/lib/vocabulary-priorities';
import {
  evaluateMix, isMixComplete, mixGroupQuotas, mixStats, startMix,
  type MixDifficulty, type MixResultSnapshot, type MixSession, type StartMixOptions,
} from '@/lib/vocabulary-review';
import { emptyVocabularyState, parseVocabularyState } from '@/lib/vocabulary-storage';

const scope = 'l1-l2-l3-l4-l5-l6' as const;
const groups: MixGroup[] = ['core', 'consolidation', 'extension'];
const levels: MixDifficulty[] = ['easy', 'medium', 'hard'];
const sizes = [10, 20, 30, 50];
const perTen = {
  easy: { core: 7, consolidation: 2, extension: 1 },
  medium: { core: 3, consolidation: 5, extension: 2 },
  hard: { core: 1, consolidation: 3, extension: 6 },
};

function seededRandom(seed = 42) {
  let state = seed;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function start(overrides: Partial<StartMixOptions> = {}) {
  return startMix({
    words: getVocabularyMixSet(scope), requestedSize: 10, scope,
    userId: 'guest', id: 'round', now: 1000, random: seededRandom(), ...overrides,
  });
}

function counts(ids: readonly string[], selectedScope: StartMixOptions['scope'] = scope) {
  const result = { core: 0, consolidation: 0, extension: 0 };
  for (const id of ids) result[getVocabularyMixPriority(id, selectedScope).group] += 1;
  return result;
}

function snapshot(session: MixSession): MixResultSnapshot {
  return {
    sessionId: session.id, scope: session.scope,
    difficulty: session.difficulty, presentation: session.presentation,
    requestedSize: session.requestedSize, actualSize: session.actualSize,
    deck: session.deck, answers: session.answers,
  };
}

describe('composición de Vocabulario Mix por nivel', () => {
  it('empieza en Medium y Sin imagen', () => {
    expect(start()).toMatchObject({ difficulty: 'medium', presentation: 'hanzi' });
  });

  for (const difficulty of levels) {
    for (const size of sizes) {
      it(`${difficulty}: distribuye exactamente los cupos de ${size} palabras`, () => {
        const expected = Object.fromEntries(groups.map(group => [group, perTen[difficulty][group] * size / 10]));
        expect(mixGroupQuotas(size, difficulty)).toEqual(expected);
      });
    }
    it(`${difficulty}: redondea rondas pequeñas sin perder ni añadir tarjetas`, () => {
      for (let size = 0; size <= 50; size += 1) {
        const quotas = Object.values(mixGroupQuotas(size, difficulty));
        expect(quotas.every(count => Number.isInteger(count) && count >= 0)).toBe(true);
        expect(quotas.reduce((sum, value) => sum + value, 0)).toBe(size);
      }
    });
  }

  for (const selectedScope of vocabularyMixScopes) {
    for (const difficulty of levels) {
      it(`${selectedScope}/${difficulty}: respeta contenido, cupos disponibles y tamaños`, () => {
        const words = getVocabularyMixSet(selectedScope);
        const originalIds = words.map(word => word.id);
        const available = counts(originalIds, selectedScope);
        for (const requestedSize of sizes) {
          const session = start({ words, scope: selectedScope, difficulty, requestedSize });
          expect(session.actualSize).toBe(Math.min(requestedSize, words.length));
          expect(session.deck).toHaveLength(session.actualSize);
          expect(new Set(session.deck).size).toBe(session.actualSize);
          expect(session.deck.every(id => originalIds.includes(id))).toBe(true);
          const quotas = mixGroupQuotas(session.actualSize, difficulty);
          if (groups.every(group => available[group] >= quotas[group])) {
            expect(counts(session.deck, selectedScope)).toEqual(quotas);
          }
        }
        expect(words.map(word => word.id)).toEqual(originalIds);
      });
    }
  }

  it('completa grupos escasos con palabras disponibles sin duplicar ni salir de la selección', () => {
    const all = getVocabularyMixSet(scope);
    const subset = [
      ...all.filter(word => getVocabularyMixPriority(word.id, scope).group === 'core').slice(0, 2),
      ...all.filter(word => getVocabularyMixPriority(word.id, scope).group === 'consolidation').slice(0, 9),
      ...all.filter(word => getVocabularyMixPriority(word.id, scope).group === 'extension').slice(0, 9),
    ];
    expect(counts(subset.map(word => word.id))).toEqual({ core: 2, consolidation: 9, extension: 9 });
    const session = start({ words: [...subset, subset[0]], difficulty: 'easy' });
    expect(counts(session.deck)).toEqual({ core: 2, consolidation: 7, extension: 1 });
    expect(new Set(session.deck).size).toBe(10);
    expect(session.deck.every(id => subset.some(word => word.id === id))).toBe(true);
    const limited = start({ words: [...subset, subset[0]], requestedSize: 50, difficulty: 'hard' });
    expect(new Set(limited.deck)).toEqual(new Set(subset.map(word => word.id)));
    expect(limited.actualSize).toBe(20);
  });

  it('cambiar la ayuda visual no cambia el banco ni el sorteo', () => {
    for (const difficulty of levels) {
      const hanzi = start({ difficulty, presentation: 'hanzi', random: seededRandom(77) });
      const image = start({ difficulty, presentation: 'image', random: seededRandom(77) });
      expect(image.deck).toEqual(hanzi.deck);
      expect(image.presentation).toBe('image');
    }
  });

  it('no adapta el sorteo al usuario ni a sus aciertos anteriores', () => {
    const first = start({ id: 'before', userId: 'learner-a', random: seededRandom(4) });
    const graded = evaluateMix({ ...first, revealed: true }, {}, false, 2000, {
      sessionId: first.id, index: 0, wordId: first.deck[0],
    });
    expect(graded.progress).not.toEqual({});
    const next = start({ id: 'after', userId: 'learner-b', now: 900000, random: seededRandom(4) });
    expect(next.deck).toEqual(first.deck);
    expect(next.deck).not.toBe(first.deck);
  });

  it('evita la secuencia exacta anterior sin cambiar los cupos', () => {
    const first = start({ random: () => 0 });
    const second = start({ id: 'second', random: () => 0, previousSequence: first.deck });
    expect(second.deck).not.toEqual(first.deck);
    expect(new Set(second.deck)).toEqual(new Set(first.deck));
    expect(counts(second.deck)).toEqual(counts(first.deck));
  });

  it('termina correctamente aunque solo quede una palabra o ninguna', () => {
    const word = getVocabularyMixSet(scope)[0];
    const one = start({ words: [word, word], requestedSize: 30 });
    const again = start({ words: [word], previousSequence: one.deck });
    expect(again.deck).toEqual([word.id]);
    expect(again.actualSize).toBe(1);
    const empty = start({ words: [] });
    expect(empty.deck).toEqual([]);
    expect(isMixComplete(empty)).toBe(true);
  });

  it('repasa todas las incorrectas aunque pertenezcan a un mismo grupo', () => {
    const words = getVocabularyMixSet(scope)
      .filter(word => getVocabularyMixPriority(word.id, scope).group === 'extension').slice(0, 7);
    expect(words).toHaveLength(7);
    const original = start({ difficulty: 'easy', presentation: 'image' });
    let session = start({
      words, requestedSize: words.length, kind: 'review', difficulty: original.difficulty,
      presentation: original.presentation, originSessionId: original.id, originResult: snapshot(original),
    });
    expect(new Set(session.deck)).toEqual(new Set(words.map(word => word.id)));
    while (!isMixComplete(session)) {
      session = evaluateMix({ ...session, revealed: true }, {}, false, 3000, {
        sessionId: session.id, index: session.index, wordId: session.deck[session.index],
      }).session;
    }
    expect(mixStats(session)).toMatchObject({ total: 7, responded: 7, incorrect: 7 });
    expect(session).toMatchObject({ difficulty: 'easy', presentation: 'image', originResult: snapshot(original) });
  });
});

describe('persistencia de nivel y presentación de Mix', () => {
  it('reanuda exactamente el mazo, la posición y la configuración de una ronda y su origen', () => {
    const original = start({ id: 'original', difficulty: 'hard', presentation: 'image' });
    const review = start({
      id: 'review', kind: 'review', difficulty: 'hard', presentation: 'image',
      originSessionId: original.id, originResult: snapshot(original),
    });
    const graded = evaluateMix({ ...review, revealed: true }, {}, true, 3000, {
      sessionId: review.id, index: 0, wordId: review.deck[0],
    });
    const session = { ...graded.session, paused: true, revealed: true };
    const state = { ...emptyVocabularyState(), progress: graded.progress, sessions: { [scope]: session } };
    expect(parseVocabularyState(JSON.stringify(state))).toEqual(state);
  });

  it('migra sesiones previas añadiendo Medium y Sin imagen sin reiniciar el progreso', () => {
    const original = start({ id: 'original' });
    const session = start({ kind: 'review', originSessionId: original.id, originResult: snapshot(original) });
    const legacy = JSON.parse(JSON.stringify(session));
    delete legacy.difficulty;
    delete legacy.presentation;
    delete legacy.originResult.difficulty;
    delete legacy.originResult.presentation;
    const state = { ...emptyVocabularyState(), sessions: { [scope]: legacy }, favorites: [session.deck[0]], lastSequences: { [scope]: session.deck } };
    const restored = parseVocabularyState(JSON.stringify(state));
    expect(restored.sessions[scope]).toEqual(session);
    expect(restored.favorites).toEqual(state.favorites);
    expect(restored.lastSequences).toEqual(state.lastSequences);
  });

  for (const [field, value] of [
    ['difficulty', 'expert'], ['difficulty', null], ['difficulty', 1],
    ['presentation', 'audio'], ['presentation', null], ['presentation', true],
  ] as const) {
    it(`rechaza ${field}=${String(value)} sin perder favoritos ni otras rondas`, () => {
      const valid = start({ scope: 'l1', words: getVocabularyMixSet('l1') });
      const invalid = { ...start(), [field]: value };
      const state = { ...emptyVocabularyState(), favorites: ['v-你'], sessions: { l1: valid, [scope]: invalid } };
      const restored = parseVocabularyState(JSON.stringify(state));
      expect(restored.sessions).toEqual({ l1: valid });
      expect(restored.favorites).toEqual(['v-你']);
    });
  }

  it('rechaza una configuración inválida en el resultado original de un repaso', () => {
    const session = start();
    const invalid = { ...session, kind: 'review', originResult: { ...snapshot(session), difficulty: 'invalid' } };
    const state = { ...emptyVocabularyState(), sessions: { [scope]: invalid } };
    expect(parseVocabularyState(JSON.stringify(state)).sessions).toEqual({});
  });
});
