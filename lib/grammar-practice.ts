import type { Exercise, SentenceEntry } from '@/data/types';
import { grammarPracticeTokens, grammarReading, grammarSentence, grammarSentenceForText } from '@/lib/grammar-language';
import { compareExerciseAnswer, normalizeAnswer } from '@/lib/pinyin';

export type GrammarPracticeModel = {
  hanzi: string;
  pinyin?: string;
  spanish?: string;
  tokens: string[];
  options: string[];
};

/** Recover the solution using each original option exactly once, including repeats. */
function orderExistingOptions(answer: string, options: string[]): string[] | undefined {
  const target = normalizeAnswer(answer);
  const normalized = options.map(normalizeAnswer);
  const visit = (remaining: number[], offset: number): string[] | undefined => {
    if (!remaining.length) return offset === target.length ? [] : undefined;
    for (const position of remaining) {
      const word = normalized[position];
      if (!word || !target.startsWith(word, offset)) continue;
      const rest = visit(remaining.filter(index => index !== position), offset + word.length);
      if (rest) return [options[position], ...rest];
    }
    return undefined;
  };
  return visit(options.map((_, index) => index), 0);
}

/** Adapt the interaction without changing the exercise ID, type or expected answer. */
export function grammarPracticeModel(exercise: Exercise, sentences: SentenceEntry[] = []): GrammarPracticeModel {
  const sameAnswer = (sentence: SentenceEntry | undefined): sentence is SentenceEntry => Boolean(sentence && compareExerciseAnswer(exercise.type, sentence.hanzi, exercise.answer));
  const sentence = [
    sentences.find(candidate => candidate.id === exercise.itemId),
    grammarSentence(exercise.itemId),
    grammarSentenceForText(exercise.answer),
    sentences.find(sameAnswer),
  ].find(sameAnswer);
  const reading = grammarReading(exercise.answer);
  const originalTokens = exercise.type === 'order' && exercise.options
    ? orderExistingOptions(exercise.answer, exercise.options)
    : undefined;
  const sentenceTokens = sentence?.tokens && compareExerciseAnswer(exercise.type, sentence.tokens.join(''), exercise.answer)
    ? sentence.tokens
    : undefined;
  const tokens = originalTokens ?? sentenceTokens ?? grammarPracticeTokens(exercise.answer);
  return {
    hanzi: sentence?.hanzi ?? reading?.hanzi ?? exercise.answer,
    pinyin: sentence?.pinyin ?? reading?.pinyin,
    spanish: sentence?.translation ?? reading?.spanish,
    tokens,
    // Keep the approved bank order where one already exists.
    options: originalTokens ? [...exercise.options!] : [...tokens.slice(1), ...tokens.slice(0, 1)],
  };
}
