import lesson6 from '@/data/lesson6-public.json';

export const HIDE_GOAL = 100;
export const positions = ['above', 'below', 'left', 'right', 'behind', 'front'] as const;
export type HidePosition = typeof positions[number];
export type Animal = 'rabbit' | 'dog' | 'cat' | 'turtle';
const words: Record<HidePosition, string> = { above: '上边', below: '下边', left: '左边', right: '右边', behind: '后边', front: '前边' };
const meanings: Record<HidePosition, string> = { above: 'encima de la mesa', below: 'debajo de la mesa', left: 'a la izquierda de la mesa', right: 'a la derecha de la mesa', behind: 'detrás de la mesa', front: 'delante de la mesa' };
export const locations = Object.fromEntries(positions.map(id => {
  const word = lesson6.vocabulary.find(word => word.hanzi === words[id]);
  if (!word) throw new Error(`Falta el locativo L6: ${words[id]}`);
  return [id, { hanzi: word.hanzi, pinyin: word.pinyin, meaning: meanings[id], vocabularyId: word.id }];
})) as Record<HidePosition, { hanzi: string; pinyin: string; meaning: string; vocabularyId: string }>;

// Míng game adaptation of g-l6-zai and g-l6-locatives. The six locatives and
// their readings come from the L6 projection. 桌子 occurs in the L6 examples
// for 上边 / 下边. Animals are game characters, not additional curriculum words.
// These generated clues are not quotations or official workbook answers.
export const hideLevels: { animal: Animal; name: string; title: string; minimum: number; options: number; description: string }[] = [
  { animal: 'rabbit', name: 'conejo', title: 'Primeras huellas', minimum: 0, options: 2, description: 'Dos escondites y pistas con pinyin.' },
  { animal: 'dog', name: 'perro', title: 'Nariz de detective', minimum: 25, options: 4, description: 'Cuatro escondites. ¡Mira bien la mesa!' },
  { animal: 'cat', name: 'gato', title: 'Pasos silenciosos', minimum: 50, options: 6, description: 'Seis escondites. El pinyin queda a tu elección.' },
  { animal: 'turtle', name: 'tortuga', title: 'Maestro del escondite', minimum: 75, options: 6, description: 'Dos pistas: dónde no está y dónde sí.' },
];
export type HideRound = { level: number; target: HidePosition; options: HidePosition[]; excluded: HidePosition | null };
export type HideState = { score: number; roundNumber: number; round: HideRound; guesses: HidePosition[]; status: 'searching' | 'found' | 'missed' | 'won'; streak: number; bestStreak: number; found: number; collection: Record<Animal, number>; earned: number };
export function levelForScore(score: number) { return score >= 75 ? 3 : score >= 50 ? 2 : score >= 25 ? 1 : 0; }
function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function makeHideRound(score: number, roundNumber: number, previous?: HidePosition, random = Math.random): HideRound {
  const level = levelForScore(score);
  const pair = positions.slice((roundNumber % 3) * 2, (roundNumber % 3) * 2 + 2);
  const candidates = (level === 0 ? pair : positions).filter(id => id !== previous);
  const target = candidates[Math.floor(random() * candidates.length)];
  const options = level === 0 ? pair : [target, ...shuffle(positions.filter(id => id !== target), random).slice(0, hideLevels[level].options - 1)];
  return { level, target, options: positions.filter(id => options.includes(id)), excluded: level === 3 ? shuffle(options.filter(id => id !== target), random)[0] : null };
}
export function startHideGame(random = Math.random): HideState {
  return { score: 0, roundNumber: 0, round: makeHideRound(0, 0, undefined, random), guesses: [], status: 'searching', streak: 0, bestStreak: 0, found: 0, collection: { rabbit: 0, dog: 0, cat: 0, turtle: 0 }, earned: 0 };
}
export function chooseHideSpot(state: HideState, spot: HidePosition): HideState {
  if (state.status !== 'searching' || !state.round.options.includes(spot) || state.guesses.includes(spot)) return state;
  const guesses = [...state.guesses, spot];
  if (spot !== state.round.target) return { ...state, guesses, streak: 0, status: guesses.length === 2 ? 'missed' : 'searching' };
  const earned = Math.min(guesses.length === 1 ? 10 : 5, HIDE_GOAL - state.score);
  const score = state.score + earned;
  const streak = guesses.length === 1 ? state.streak + 1 : 0;
  const animal = hideLevels[state.round.level].animal;
  return { ...state, guesses, score, earned, streak, bestStreak: Math.max(streak, state.bestStreak), found: state.found + 1, collection: { ...state.collection, [animal]: state.collection[animal] + 1 }, status: score === HIDE_GOAL ? 'won' : 'found' };
}
export function nextHideRound(state: HideState, random = Math.random): HideState {
  if (state.status !== 'found' && state.status !== 'missed') return state;
  return { ...state, roundNumber: state.roundNumber + 1, round: makeHideRound(state.score, state.roundNumber + 1, state.round.target, random), guesses: [], earned: 0, status: 'searching' };
}
export function hideClue(round: HideRound) {
  const target = locations[round.target];
  const excluded = round.excluded ? locations[round.excluded] : null;
  return { hanzi: `${excluded ? `它不在桌子${excluded.hanzi}。` : ''}它在桌子${target.hanzi}。`, pinyin: `${excluded ? `Tā bú zài zhuōzi ${excluded.pinyin}. ` : ''}Tā zài zhuōzi ${target.pinyin}.`, spanish: `${excluded ? `No está ${excluded.meaning}. ` : ''}Está ${target.meaning}.` };
}
export function hasHideGame(scope: string) { return ['l6', '6.1', '6.2', 'l1-l2-l3-l4-l5-l6'].includes(scope); }
