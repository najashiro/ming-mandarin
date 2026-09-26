import type { ActiveWord, ContentLevel } from './vocabulary';

export type PracticeType = 'hanzi' | 'image' | 'context';
export type Review = { streak: number; due: number; attempts: number; lastEvent: string };
export type ReviewMap = Record<string, Review>;
export type MixCard = { wordId: string; type: PracticeType };
export type MixSession = { id: string; scope: string; level: ContentLevel; queue: MixCard[]; index: number; revealed: boolean; paused: boolean; events: { id: string; wordId: string; type: PracticeType; known: boolean }[] };
export const REVIEW_DAYS = [1, 3, 7, 14, 30];
export const reviewKey = (id: string, type: PracticeType) => `${id}:${type}`;

export function startMix(words: ActiveWord[], size: number, scope: string, level: ContentLevel, progress: ReviewMap, id: string, now: number, random = Math.random, chooseType: (word: ActiveWord) => PracticeType = () => 'hanzi'): MixSession {
  const ordered = words.map(word => ({ word, type: chooseType(word), tie: random() })).sort((a, b) =>
    (progress[reviewKey(a.word.id, a.type)]?.due ?? 0) - (progress[reviewKey(b.word.id, b.type)]?.due ?? 0) || a.tie - b.tie);
  // New and due items first, followed by the nearest scheduled reviews.
  void now;
  return { id, scope, level, queue: ordered.slice(0, Math.max(1, Math.min(50, size))).map(({ word, type }) => ({ wordId: word.id, type })), index: 0, revealed: false, paused: false, events: [] };
}

/** One event per session position, max two attempts per word, no immediate repeat. */
export function evaluateMix(session: MixSession, progress: ReviewMap, known: boolean, now: number) {
  const card = session.queue[session.index];
  const eventId = `${session.id}:${session.index}`;
  if (!card || !session.revealed || session.paused || session.events.some(e => e.id === eventId)) return { session, progress };
  const key = reviewKey(card.wordId, card.type);
  const previous = progress[key];
  if (previous?.lastEvent === eventId) return { session, progress };
  const streak = known ? (previous?.streak ?? 0) + 1 : 0;
  const due = now + (known ? REVIEW_DAYS[Math.min(streak - 1, REVIEW_DAYS.length - 1)] * 86400000 : 600000);
  const events = [...session.events, { id: eventId, ...card, known }];
  const queue = [...session.queue];
  if (!known && queue.filter(c => c.wordId === card.wordId).length < 2 && queue.slice(session.index + 1).some(c => c.wordId !== card.wordId)) {
    queue.splice(Math.min(session.index + 3, queue.length), 0, card);
  }
  return { session: { ...session, queue, events, index: session.index + 1, revealed: false }, progress: { ...progress, [key]: { streak, due, attempts: (previous?.attempts ?? 0) + 1, lastEvent: eventId } } };
}
export function mixStats(session: MixSession) {
  const latest = new Map(session.events.map(e => [e.wordId, e.known]));
  return { unique: latest.size, attempts: session.events.length, remembered: session.events.filter(e => e.known).length, pending: [...latest.values()].filter(known => !known).length };
}

/** Keep completed history and progress; retire only pending cards outside the new partition. */
export function reconcileMixSession(session: MixSession, allowed: Set<string>): MixSession {
  const pending = session.queue.slice(session.index);
  if (pending.every(card => allowed.has(card.wordId))) return session;
  const remaining = pending.filter(card => allowed.has(card.wordId));
  return { ...session, queue: [...session.queue.slice(0, session.index), ...remaining], revealed: session.revealed && remaining[0] === pending[0] };
}
