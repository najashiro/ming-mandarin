import { describe, expect, it } from 'vitest';
import lesson6 from '@/data/lesson6-public.json';
import { chooseHideSpot, hasHideGame, hideClue, hideLevels, locations, makeHideRound, nextHideRound, positions, startHideGame } from '@/lib/hide-and-seek';

describe('Escondites L6: aprendizaje y reglas de la aventura', () => {
  it('usa los seis locativos y el pinyin de la lección, con pistas positivas inequívocas', () => {
    for (const spot of positions) {
      const source = lesson6.vocabulary.find(word => word.id === locations[spot].vocabularyId)!;
      expect(locations[spot]).toMatchObject({ hanzi: source.hanzi, pinyin: source.pinyin });
      expect(hideClue({ level: 0, target: spot, options: [spot], excluded: null }).hanzi).toBe(`它在桌子${source.hanzi}。`);
    }
    expect(hasHideGame('l6')).toBe(true);
    expect(hasHideGame('l1-l2-l3-l4-l5-l6')).toBe(true);
    expect(hasHideGame('l5')).toBe(false);
  });
  it('ofrece dos intentos distintos y no permite sumar dos veces ni elegir escondites inactivos', () => {
    const start = startHideGame(() => 0);
    const wrong = start.round.options.find(spot => spot !== start.round.target)!;
    const first = chooseHideSpot(start, wrong);
    expect(first).toMatchObject({ score: 0, status: 'searching', guesses: [wrong] });
    expect(chooseHideSpot(first, wrong)).toBe(first);
    expect(chooseHideSpot(start, 'left')).toBe(start);
    const found = chooseHideSpot(first, start.round.target);
    expect(found).toMatchObject({ score: 5, status: 'found', found: 1, collection: { rabbit: 1 } });
    expect(chooseHideSpot(found, start.round.target)).toBe(found);
    expect(chooseHideSpot(start, start.round.target)).toMatchObject({ score: 10, streak: 1 });
  });
  it('revela la respuesta tras dos fallos, conserva puntos y permite seguir', () => {
    const state = { ...startHideGame(), score: 50, streak: 3, round: makeHideRound(50, 5) };
    const wrong = state.round.options.filter(spot => spot !== state.round.target);
    const missed = chooseHideSpot(chooseHideSpot(state, wrong[0]), wrong[1]);
    expect(missed).toMatchObject({ score: 50, status: 'missed', streak: 0 });
    expect(chooseHideSpot(missed, state.round.target)).toBe(missed);
    const next = nextHideRound(missed);
    expect(next).toMatchObject({ score: 50, status: 'searching', guesses: [] });
    expect(next.round.target).not.toBe(missed.round.target);
    expect(nextHideRound(state)).toBe(state);
  });
  it('aumenta opciones y cambia animales al cruzar cada umbral, sin repetir la ubicación anterior', () => {
    for (const [score, level] of [[0,0],[20,0],[25,1],[45,1],[50,2],[70,2],[75,3],[95,3]]) {
      for (const random of [() => 0, () => .499, () => .999]) for (let round = 0; round < 6; round++) {
        const result = makeHideRound(score, round, 'above', random);
        expect(result.level).toBe(level);
        expect(result.options).toHaveLength(hideLevels[level].options);
        expect(new Set(result.options).size).toBe(result.options.length);
        expect(result.options).toContain(result.target);
        expect(result.target).not.toBe('above');
        if (level === 3) {
          expect(result.excluded).not.toBe(result.target);
          expect(hideClue(result).hanzi).toBe(`它不在桌子${locations[result.excluded!].hanzi}。它在桌子${locations[result.target].hanzi}。`);
        }
      }
    }
  });
  it('termina exactamente en 100 y reinicia una aventura completa, incluso con aciertos al segundo intento', () => {
    for (const secondAttempt of [false, true]) {
      let state = startHideGame();
      for (let i = 0; i < 20 && state.status !== 'won'; i++) {
        if (secondAttempt) state = chooseHideSpot(state, state.round.options.find(spot => spot !== state.round.target)!);
        state = chooseHideSpot(state, state.round.target);
        if (state.status !== 'won') state = nextHideRound(state);
      }
      expect(state).toMatchObject({ status: 'won', score: 100 });
      expect(Object.values(state.collection).every(count => count > 0)).toBe(true);
      expect(nextHideRound(state)).toBe(state);
      expect(startHideGame()).toMatchObject({ score: 0, roundNumber: 0, found: 0, bestStreak: 0 });
    }
    const state = { ...startHideGame(), score: 95 };
    expect(chooseHideSpot(state, state.round.target)).toMatchObject({ score: 100, earned: 5, status: 'won' });
  });
});
