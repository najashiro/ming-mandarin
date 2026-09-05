import type { HanziAttemptPayload, HanziLocalProgress } from './types';

export type HanziStudyProgress = {
  mastery: number;
  stability: number;
  difficulty: number;
  exposures: number;
  correctCount: number;
  incorrectCount: number;
  streak: number;
  lastSeenAt: string | null;
  nextReviewAt: string | null;
};

export function isSuccessfulHanziAttempt(attempt: HanziAttemptPayload) {
  if (!attempt.completed || attempt.usedAnswer) return false;
  const mistakeAllowance = attempt.mode === 'guided' ? 3 : attempt.mode === 'independent' ? 1 : 0;
  return attempt.mistakes <= mistakeAllowance;
}

export function updateLocalHanziProgress(current: HanziLocalProgress | undefined, attempt: HanziAttemptPayload, now = new Date()) {
  return {
    attempts: (current?.attempts ?? 0) + 1,
    completed: (current?.completed ?? 0) + (attempt.completed ? 1 : 0),
    mistakes: (current?.mistakes ?? 0) + Math.max(0, attempt.mistakes),
    ...(typeof current?.studyExposures === 'number' ? { studyExposures: current.studyExposures } : {}),
    lastPracticedAt: now.toISOString(),
  } satisfies HanziLocalProgress;
}

export function advanceHanziStudyExposure(current: HanziStudyProgress | undefined, now = new Date()) {
  return {
    mastery: current?.mastery ?? 0,
    stability: current?.stability ?? 0,
    difficulty: current?.difficulty ?? 5,
    exposures: (current?.exposures ?? 0) + 1,
    correctCount: current?.correctCount ?? 0,
    incorrectCount: current?.incorrectCount ?? 0,
    streak: current?.streak ?? 0,
    lastSeenAt: now.toISOString(),
    nextReviewAt: current?.nextReviewAt ?? null,
  } satisfies HanziStudyProgress;
}

export function updateLocalHanziStudyExposure(current: HanziLocalProgress | undefined, now = new Date()) {
  return {
    attempts: current?.attempts ?? 0,
    completed: current?.completed ?? 0,
    mistakes: current?.mistakes ?? 0,
    studyExposures: (current?.studyExposures ?? 0) + 1,
    lastPracticedAt: now.toISOString(),
  } satisfies HanziLocalProgress;
}
