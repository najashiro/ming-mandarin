import type { WorkbookMode, WorkbookQuestion } from './workbook-games';

/** Shuffle a copy; repeated tokens retain their own positions in the UI. */
export function shuffleWorkbookOptions<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

/** Round-robin sampling gives every selected lesson a turn before repeating one. */
export function createWorkbookRound(questions: readonly WorkbookQuestion[], mode: WorkbookMode, limit = 6, random: () => number = Math.random): WorkbookQuestion[] {
  const byLesson = new Map<number, WorkbookQuestion[]>();
  const seen = new Set<string>();
  for (const question of questions) {
    if (question.mode !== mode || seen.has(question.id)) continue;
    seen.add(question.id);
    const bucket = byLesson.get(question.lesson) ?? [];
    bucket.push(question);
    byLesson.set(question.lesson, bucket);
  }
  const buckets = shuffleWorkbookOptions([...byLesson.values()], random).map(items => shuffleWorkbookOptions(items, random));
  const round: WorkbookQuestion[] = [];
  const count = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 6;
  for (let index = 0; round.length < count; index++) {
    let added = false;
    for (const bucket of buckets) {
      if (round.length >= count) break;
      if (bucket[index]) { round.push(bucket[index]); added = true; }
    }
    if (!added) break;
  }
  return round;
}

function normalizeAnswer(value: string): string {
  return value.normalize('NFKC').replace(/[\s，。！？、；：,.!?;:]/gu, '').trim();
}

/** Ignore punctuation, never drop Chinese characters or accept partial answers. */
export function checkWorkbookAnswer(question: WorkbookQuestion, answer: string): boolean {
  const value = normalizeAnswer(answer);
  return value.length > 0 && [question.answer, ...(question.acceptedAnswers ?? [])].some(candidate => normalizeAnswer(candidate) === value);
}
