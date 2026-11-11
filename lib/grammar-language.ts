import language from '@/data/grammar-study-language.json';
import type { SentenceEntry } from '@/data/types';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { normalizeAnswer } from '@/lib/pinyin';

export type GrammarReading = { hanzi: string; pinyin: string; spanish: string };
export type GrammarTextSegment = { text: string; reading?: GrammarReading };

const hanzi = /\p{Script=Han}/u;
// Preserve foreign letters/numbers and transformation separators. Never normalize
// an instructional example into a different utterance by dropping its content.
const readingKey = (text: string) => text.normalize('NFC').replace(/[\s，。！？、,.!?：:；;（）()“”「」"'‘’…]/g, '');
const readings = new Map<string, GrammarReading>(language.readings.map(entry => [readingKey(entry.hanzi), entry]));
const wordKeys = new Set(language.wordKeys);
const pinyinKey = (text: string) => text.normalize('NFC').toLowerCase().replace(/[\s'’ʼ.,!?]/g, '');
const supplementalAudio = new Map(language.supplementalAudio.map(clip => [`${readingKey(clip.hanzi)}:${pinyinKey(clip.pinyin)}`, clip.src]));
function recordedAudio(text: string, pinyin?: string) {
  return (pinyin ? supplementalAudio.get(`${readingKey(text)}:${pinyinKey(pinyin)}`) : undefined) ?? audioForMandarinText(text, pinyin);
}
const sentences = new Map(language.sentences.map(sentence => [sentence.id, sentence as SentenceEntry]));
const sentencesByText = new Map(language.sentences.map(sentence => [readingKey(sentence.hanzi), sentence as SentenceEntry]));

/** Exact phrase/token support. Does not translate arbitrary unseen Chinese. */
export function grammarReading(text: string): GrammarReading | undefined {
  return readings.get(readingKey(text));
}

/** Preserve the original string, annotating complete phrases before words. */
export function grammarTextSegments(text: string): GrammarTextSegment[] {
  const exact = grammarReading(text);
  if (exact) return [{ text, reading: exact }];
  return text.split(/(\p{Script=Han}+)/u).flatMap((run): GrammarTextSegment[] => {
    if (!hanzi.test(run)) return run ? [{ text: run }] : [];
    const segments: GrammarTextSegment[] = [];
    let offset = 0;
    while (offset < run.length) {
      let found: GrammarReading | undefined;
      let end = run.length;
      for (; end > offset; end--) {
        found = grammarReading(run.slice(offset, end));
        if (found) break;
      }
      if (found) {
        segments.push({ text: run.slice(offset, end), reading: found });
        offset = end;
      } else {
        segments.push({ text: run[offset] });
        offset++;
      }
    }
    return segments;
  });
}

export function grammarSentence(itemId: string): SentenceEntry | undefined {
  return sentences.get(itemId);
}

/** Find a documented sentence when an old exercise uses a grammar-point ID. */
export function grammarSentenceForText(text: string): SentenceEntry | undefined {
  return sentencesByText.get(readingKey(text));
}

/** Tokenize a known practice answer without importing the full curriculum client-side. */
export function grammarPracticeTokens(text: string): string[] {
  const sentence = grammarSentenceForText(text);
  if (sentence && normalizeAnswer(sentence.tokens.join('')) === normalizeAnswer(text)) return [...sentence.tokens];
  const tokens: string[] = [];
  for (const run of text.split(/(\p{Script=Han}+)/u)) {
    if (!run) continue;
    if (!hanzi.test(run)) {
      // The backend ignores these punctuation marks. Retain all other content,
      // including enumeration marks, Arabic numbers and Latin-script labels.
      const meaningful = run.replace(/[\s。！？?!,，]/g, '');
      if (meaningful) {
        if (tokens.length) tokens[tokens.length - 1] += meaningful;
        else tokens.push(meaningful);
      }
      continue;
    }
    let offset = 0;
    while (offset < run.length) {
      let match: string | undefined;
      for (let end = run.length; end > offset; end--) {
        const part = run.slice(offset, end);
        if (wordKeys.has(part)) { match = part; break; }
      }
      tokens.push(match ?? run[offset]);
      offset += match?.length ?? 1;
    }
  }
  return tokens;
}

/** Full recordings first. Arrays preserve phrase boundaries or word-by-word listening. */
export function grammarAudio(text: string): string | string[] | undefined {
  // Diagrams, blanks, counterexample markers and foreign text are not utterances.
  // Reject them BEFORE the shared resolver, which otherwise strips non-Hanzi.
  if (!/^[\p{Script=Han}\s，。！？、,.!?：:；;（）()“”「」"'‘’…→／/]+$/u.test(text) || !hanzi.test(text)) return undefined;
  // Treat a transformation or alternatives as separate utterances, never one phrase.
  if (/[→／/]/u.test(text)) {
    const parts = text.split(/[→／/]/u).map(part => part.trim());
    if (parts.some(part => !part || !hanzi.test(part))) return undefined;
    const clips = parts.map(part => grammarAudio(part));
    if (clips.some(clip => !clip)) return undefined;
    return clips.flatMap(clip => Array.isArray(clip) ? clip : [clip!]);
  }
  const exact = grammarReading(text);
  const recorded = recordedAudio(text, exact?.pinyin) ?? audioForMandarinText(text);
  if (recorded) return recorded;
  const clean = readingKey(text);
  if (!/^[\p{Script=Han}]+$/u.test(clean)) return undefined;
  // Memoized complete-coverage segmentation: do not play a partial phrase.
  const memo = new Map<number, string[] | undefined>();
  const resolve = (offset: number): string[] | undefined => {
    if (offset === clean.length) return [];
    if (memo.has(offset)) return memo.get(offset);
    for (let end = clean.length; end > offset; end--) {
      const part = clean.slice(offset, end);
      const reading = grammarReading(part);
      if (!reading) continue;
      const clip = recordedAudio(part, reading.pinyin);
      if (!clip) continue;
      const rest = resolve(end);
      if (rest) { const sources = [clip, ...rest]; memo.set(offset, sources); return sources; }
    }
    memo.set(offset, undefined);
    return undefined;
  };
  return resolve(0);
}
