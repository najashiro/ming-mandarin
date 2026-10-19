import type { HanziAttemptPayload, HanziPracticeMode } from '@/lib/hanzi/types';
import { comparePinyin } from '@/lib/pinyin';

type ChoiceEntry = { hanzi: string; pinyin: string; meaning: string; radical?: string };
type ChoiceMode = 'Audio' | 'Significado' | 'Radical';

/** A semantic cue must not print the hidden character inside an example. */
export function meaningWithoutHanzi(meaning: string) {
  return meaning.replace(/\s*(?:en\s+)?[\u3400-\u9fff]+(?:\s*\/\s*[\u3400-\u9fff]+)*/gu, '').replace(/\s+/g, ' ').trim();
}

function meaningParts(meaning: string) {
  return meaningWithoutHanzi(meaning).toLocaleLowerCase('es').split(/[;,/]/u).map(part => part.trim()).filter(Boolean);
}

export function meaningsOverlap(left: string, right: string) {
  const parts = new Set(meaningParts(left));
  return meaningParts(right).some(part => parts.has(part));
}

function shuffle<T>(values: T[], random: () => number) {
  for (let index = values.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [values[index], values[other]] = [values[other], values[index]];
  }
  return values;
}

/** Sample the full pool; avoid two answers with the same supplied cue. */
export function hanziRecognitionChoices(target: ChoiceEntry, pool: readonly ChoiceEntry[], mode: ChoiceMode, random: () => number = Math.random) {
  const answer = mode === 'Radical' ? target.radical : target.hanzi;
  if (!answer) return [];
  const distractors = pool.filter(other => other.hanzi !== target.hanzi
    && (mode !== 'Audio' || !comparePinyin(other.pinyin, target.pinyin))
    && (mode !== 'Significado' || !meaningsOverlap(other.meaning, target.meaning)))
    .map(other => mode === 'Radical' ? other.radical : other.hanzi)
    .filter((value): value is string => Boolean(value) && value !== answer);
  return shuffle([answer, ...shuffle([...new Set(distractors)], random).slice(0, 3)], random);
}

export function writingHintShown(mode: HanziPracticeMode, mistakesOnStroke: number) {
  // Matches HanziWriterStage: once reached, the engine shows a hint after every miss.
  return mode !== 'exam' && mistakesOnStroke >= (mode === 'guided' ? 2 : 4);
}

export function gameWritingAttempt(characterId: string, mode: HanziPracticeMode, summary: { correctStrokes: number; mistakes: number; durationMs: number }, hintsUsed: number): HanziAttemptPayload {
  return { characterId, mode, skillDimension: 'writing', completed: true, ...summary, hintsUsed, usedAnswer: false };
}
