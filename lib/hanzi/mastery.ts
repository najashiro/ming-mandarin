import type { HanziAttemptPayload, HanziLocalProgress } from './types';

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
    lastPracticedAt: now.toISOString(),
  } satisfies HanziLocalProgress;
}
