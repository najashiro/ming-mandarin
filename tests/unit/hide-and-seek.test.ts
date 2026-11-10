import { describe, expect, it } from 'vitest';
import lesson6 from '@/data/lesson6-public.json';
import { chooseHideSpot, hasHideGame, hideClue, hideLevels, HIDE_LIVES, locations, makeHideRound, nextHideRound, positions, startHideGame } from '@/lib/hide-and-seek';

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
  it('descuenta una vida por error válido sin penalizar clics repetidos o escondites inactivos', () => {
    const start = startHideGame(() => 0);
    expect(start.lives).toBe(HIDE_LIVES);
    expect(start.lives).toBe(2);
    const wrong = start.round.options.find(spot => spot !== start.round.target)!;
    const first = chooseHideSpot(start, wrong);
    expect(first).toMatchObject({ score: 0, lives: 1, status: 'searching', guesses: [wrong] });
    expect(chooseHideSpot(first, wrong)).toBe(first);
    expect(chooseHideSpot(start, 'left')).toBe(start);
    const found = chooseHideSpot(first, start.round.target);
    expect(found).toMatchObject({ score: 5, status: 'found', found: 1, collection: { rabbit: 1 }, lives: 1 });
    expect(chooseHideSpot(found, start.round.target)).toBe(found);
    expect(chooseHideSpot(start, start.round.target)).toMatchObject({ score: 10, streak: 1, lives: 2 });
  });
  it('termina la aventura tras dos fallos en la misma ronda y conserva la respuesta hasta un reinicio explícito', () => {
    let state = startHideGame(() => 0);
    for (let round = 0; round < 5; round++) {
      state = nextHideRound(chooseHideSpot(state, state.round.target), () => .499);
    }
    expect(state).toMatchObject({ score: 50, roundNumber: 5, streak: 5, found: 5, lives: 2 });
    const wrong = state.round.options.filter(spot => spot !== state.round.target);
    const firstMiss = chooseHideSpot(state, wrong[0]);
    expect(firstMiss).toMatchObject({ score: 50, status: 'searching', guesses: [wrong[0]], streak: 0, lives: 1 });
    const missed = chooseHideSpot(firstMiss, wrong[1]);
    expect(missed).toMatchObject({ score: 50, status: 'missed', streak: 0, guesses: wrong.slice(0, 2), lives: 0 });
    expect(missed.round).toBe(state.round);
    expect(missed.collection).toBe(state.collection);
    expect(chooseHideSpot(missed, state.round.target)).toBe(missed);
    expect(chooseHideSpot(missed, wrong[2])).toBe(missed);
    expect(nextHideRound(missed)).toBe(missed);
    expect(nextHideRound(state)).toBe(state);

    const restarted = startHideGame(() => .499);
    expect(restarted).toMatchObject({
      score: 0, roundNumber: 0, status: 'searching', guesses: [], earned: 0, lives: 2,
      streak: 0, bestStreak: 0, found: 0,
      collection: { rabbit: 0, dog: 0, cat: 0, mouse: 0 },
      round: { level: 0, excluded: null },
    });
    expect(restarted.round.options).toHaveLength(2);
    expect(missed.score).toBe(50);
  });
  it('mantiene la vida perdida entre rondas y animales; el segundo error termina incluso en una ronda nueva', () => {
    let state = startHideGame(() => 0);
    const firstWrong = state.round.options.find(spot => spot !== state.round.target)!;
    state = chooseHideSpot(state, firstWrong);
    state = chooseHideSpot(state, state.round.target);
    expect(state).toMatchObject({ score: 5, lives: 1, status: 'found' });
    state = nextHideRound(state, () => .499);
    expect(state).toMatchObject({ lives: 1, roundNumber: 1, guesses: [], status: 'searching' });
    for (let i = 0; i < 5; i++) {
      state = chooseHideSpot(state, state.round.target);
      expect(state.lives).toBe(1);
      state = nextHideRound(state, () => .499);
      expect(state.lives).toBe(1);
    }
    expect(state).toMatchObject({ score: 55, roundNumber: 6, lives: 1, round: { level: 2 } });
    expect(state.collection.rabbit).toBeGreaterThan(0);
    expect(state.collection.dog).toBeGreaterThan(0);
    const secondWrong = state.round.options.find(spot => spot !== state.round.target)!;
    const missed = chooseHideSpot(state, secondWrong);
    expect(missed).toMatchObject({ score: 55, lives: 0, status: 'missed', guesses: [secondWrong], earned: 0 });
    expect(missed.round).toBe(state.round);
    expect(chooseHideSpot(missed, state.round.target)).toBe(missed);
    expect(chooseHideSpot(missed, secondWrong)).toBe(missed);
    expect(nextHideRound(missed)).toBe(missed);
    expect(startHideGame()).toMatchObject({ score: 0, lives: 2, roundNumber: 0, guesses: [], status: 'searching' });
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
  it('permite ganar con cero o un error y solo restaura las dos vidas al empezar otra aventura', () => {
    for (const secondAttempt of [false, true]) {
      let state = startHideGame();
      for (let i = 0; i < 20 && state.status !== 'won'; i++) {
        if (secondAttempt && i === 0) state = chooseHideSpot(state, state.round.options.find(spot => spot !== state.round.target)!);
        state = chooseHideSpot(state, state.round.target);
        if (state.status !== 'won') state = nextHideRound(state);
      }
      expect(state).toMatchObject({ status: 'won', score: 100, lives: secondAttempt ? 1 : 2 });
      expect(hideLevels[state.round.level]).toMatchObject({ animal: 'mouse', name: 'ratón' });
      expect(state.collection.mouse).toBeGreaterThan(0);
      expect(Object.values(state.collection).every(count => count > 0)).toBe(true);
      expect(nextHideRound(state)).toBe(state);
      expect(startHideGame()).toMatchObject({ score: 0, roundNumber: 0, found: 0, bestStreak: 0, lives: 2 });
    }
    const state = { ...startHideGame(), score: 95 };
    expect(chooseHideSpot(state, state.round.target)).toMatchObject({ score: 100, earned: 5, status: 'won' });
  });
});
