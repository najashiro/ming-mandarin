import type { CurriculumScope } from '@/data/types';
import type { ActiveWord } from './vocabulary';
import { getVocabularyMixPriority, type MixGroup } from './vocabulary-priorities';

export type PracticeType = 'hanzi';
export type MixDifficulty = 'easy' | 'medium' | 'hard';
export type MixPresentation = 'image' | 'hanzi';
export const DEFAULT_MIX_DIFFICULTY: MixDifficulty = 'medium';
export const DEFAULT_MIX_PRESENTATION: MixPresentation = 'hanzi';
export type Review = { streak: number; due: number; attempts: number; lastEvent: string };
export type ReviewMap = Record<string, Review>;
export type MixAnswer = { id: string; wordId: string; known: boolean; answeredAt: number };
export type MixResultSnapshot = { sessionId: string; scope: CurriculumScope; difficulty: MixDifficulty; presentation: MixPresentation; requestedSize: number; actualSize: number; deck: string[]; answers: MixAnswer[] };
export type MixSession = {
  formatVersion: 2;
  id: string;
  userId: string;
  scope: CurriculumScope;
  difficulty: MixDifficulty;
  presentation: MixPresentation;
  requestedSize: number;
  actualSize: number;
  deck: string[];
  index: number;
  revealed: boolean;
  paused: boolean;
  kind: 'normal' | 'review';
  originSessionId?: string;
  originResult?: MixResultSnapshot;
  startedAt: number;
  answers: MixAnswer[];
};
export type MixTurn = { sessionId: string; index: number; wordId: string };
export type StartMixOptions = {
  words: readonly ActiveWord[];
  requestedSize: number;
  scope: CurriculumScope;
  difficulty?: MixDifficulty;
  presentation?: MixPresentation;
  userId: string;
  id: string;
  now: number;
  previousSequence?: readonly string[];
  random?: () => number;
  kind?: 'normal' | 'review';
  originSessionId?: string;
  originResult?: MixResultSnapshot;
};
export const REVIEW_DAYS = [1, 3, 7, 14, 30];
export const reviewKey = (id: string) => `${id}:hanzi`;

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.min(index, Math.max(0, Math.floor(random() * (index + 1))));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function sameSequence(left: readonly string[], right?: readonly string[]) {
  return Boolean(right && left.length === right.length && left.every((id, index) => id === right[index]));
}

const groups: readonly MixGroup[] = ['core', 'consolidation', 'extension'];
export const MIX_GROUP_SHARES: Record<MixDifficulty, Record<MixGroup, number>> = {
  easy: { core: 0.7, consolidation: 0.2, extension: 0.1 },
  medium: { core: 0.3, consolidation: 0.5, extension: 0.2 },
  hard: { core: 0.1, consolidation: 0.3, extension: 0.6 },
};
const fillOrder: Record<MixDifficulty, readonly MixGroup[]> = {
  easy: ['core', 'consolidation', 'extension'],
  medium: ['consolidation', 'core', 'extension'],
  hard: ['extension', 'consolidation', 'core'],
};

/** Whole-card quotas; largest remainders keep every supported size exact. */
export function mixGroupQuotas(size: number, difficulty: MixDifficulty): Record<MixGroup, number> {
  const counts = { core: 0, consolidation: 0, extension: 0 };
  const remainders = groups.map(group => {
    const exact = size * MIX_GROUP_SHARES[difficulty][group];
    counts[group] = Math.floor(exact);
    return { group, remainder: exact - counts[group] };
  }).sort((a, b) => b.remainder - a.remainder);
  const missing = size - groups.reduce((sum, group) => sum + counts[group], 0);
  for (let index = 0; index < missing; index += 1) counts[remainders[index].group] += 1;
  return counts;
}

function priorityDeck(words: readonly ActiveWord[], size: number, scope: CurriculumScope, difficulty: MixDifficulty, random: () => number) {
  const pools: Record<MixGroup, string[]> = { core: [], consolidation: [], extension: [] };
  for (const word of shuffle(words, random)) pools[getVocabularyMixPriority(word.id, scope).group].push(word.id);
  const quotas = mixGroupQuotas(size, difficulty);
  const selected = groups.flatMap(group => pools[group].splice(0, quotas[group]));
  // Small lesson pools can lack a group. Fill only from this lesson's unused words.
  for (const group of fillOrder[difficulty]) selected.push(...pools[group].splice(0, size - selected.length));
  return shuffle(selected, random);
}

export function startMix(options: StartMixOptions): MixSession {
  const random = options.random ?? Math.random;
  const difficulty = options.difficulty ?? DEFAULT_MIX_DIFFICULTY;
  const presentation = options.presentation ?? DEFAULT_MIX_PRESENTATION;
  const uniqueWords = [...new Map(options.words.map(word => [word.id, word])).values()];
  const actualSize = Math.min(Math.max(0, options.requestedSize), uniqueWords.length);
  let deck: string[] = [];
  for (let attempt = 0; attempt < 6; attempt += 1) {
    deck = options.kind === 'review'
      ? shuffle(uniqueWords, random).slice(0, actualSize).map(word => word.id)
      : priorityDeck(uniqueWords, actualSize, options.scope, difficulty, random);
    if (!sameSequence(deck, options.previousSequence)) break;
  }
  if (sameSequence(deck, options.previousSequence)) {
    if (deck.length > 1) [deck[0], deck[1]] = [deck[1], deck[0]];
    else if (deck.length === 1 && uniqueWords.length > 1) {
      const alternative = uniqueWords.find(word => word.id !== deck[0]);
      if (alternative) deck[0] = alternative.id;
    }
  }
  return {
    formatVersion: 2,
    id: options.id,
    userId: options.userId,
    scope: options.scope,
    difficulty,
    presentation,
    requestedSize: options.requestedSize,
    actualSize: deck.length,
    deck,
    index: 0,
    revealed: false,
    paused: false,
    kind: options.kind ?? 'normal',
    originSessionId: options.originSessionId,
    originResult: options.originResult,
    startedAt: options.now,
    answers: [],
  };
}

/** Accept exactly one answer for the expected turn of the expected session. */
export function evaluateMix(session: MixSession, progress: ReviewMap, known: boolean, now: number, expected: MixTurn) {
  const wordId = session.deck[session.index];
  const eventId = `${session.id}:${session.index}:${wordId}`;
  if (!wordId || !session.revealed || session.paused || session.id !== expected.sessionId || session.index !== expected.index || wordId !== expected.wordId || session.answers.some(answer => answer.id === eventId)) return { session, progress };
  const key = reviewKey(wordId);
  const previous = progress[key];
  if (previous?.lastEvent === eventId) return { session, progress };
  const streak = known ? (previous?.streak ?? 0) + 1 : 0;
  const due = now + (known ? REVIEW_DAYS[Math.min(streak - 1, REVIEW_DAYS.length - 1)] * 86400000 : 600000);
  const answers = [...session.answers, { id: eventId, wordId, known, answeredAt: now }];
  return { session: { ...session, answers, index: session.index + 1, revealed: false }, progress: { ...progress, [key]: { streak, due, attempts: (previous?.attempts ?? 0) + 1, lastEvent: eventId } } };
}
export function mixStats(session: MixSession) {
  const correct = session.answers.filter(answer => answer.known).length;
  const incorrectIds = session.answers.filter(answer => !answer.known).map(answer => answer.wordId);
  const responded = session.answers.length;
  return { responded, correct, incorrect: incorrectIds.length, total: session.actualSize, percentage: responded ? Math.round(correct / responded * 100) : 0, incorrectIds };
}
export function isMixComplete(session: MixSession) {
  return session.index >= session.deck.length;
}
