import type { CurriculumScope } from '@/data/types';
import type { ActiveWord } from './vocabulary';

export type PracticeType = 'hanzi';
export type Review = { streak: number; due: number; attempts: number; lastEvent: string };
export type ReviewMap = Record<string, Review>;
export type MixAnswer = { id: string; wordId: string; known: boolean; answeredAt: number };
export type MixResultSnapshot = { sessionId: string; scope: CurriculumScope; requestedSize: number; actualSize: number; deck: string[]; answers: MixAnswer[] };
export type MixSession = {
  formatVersion: 2;
  id: string;
  userId: string;
  scope: CurriculumScope;
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

export function startMix(options: StartMixOptions): MixSession {
  const random = options.random ?? Math.random;
  const uniqueWords = [...new Map(options.words.map(word => [word.id, word])).values()];
  const actualSize = Math.min(Math.max(0, options.requestedSize), uniqueWords.length);
  let deck: string[] = [];
  for (let attempt = 0; attempt < 6; attempt += 1) {
    deck = shuffle(uniqueWords, random).slice(0, actualSize).map(word => word.id);
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
