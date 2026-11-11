import lesson5 from '@/data/lesson5-public.json';
import support from '@/data/grammar-language-support.json';
import type { SentenceEntry } from '@/data/types';
import { audioForMandarinText } from '@/lib/mandarin-audio';

export type GrammarReading = { hanzi: string; pinyin: string; spanish: string };
export type GrammarTextSegment = { text: string; reading?: GrammarReading };

const hanzi = /\p{Script=Han}/u;
// Keep letters/numbers: a Spanish sentence containing Hanzi is not a Chinese phrase.
const readingKey = (text: string) => text.normalize('NFC').replace(/[\s，。！？、,.!?：:；;（）()“”「」"'‘’…]/g, '');
const readings = new Map<string, GrammarReading>();
function addReading(entry: GrammarReading) {
  if (entry.pinyin && entry.spanish) readings.set(readingKey(entry.hanzi), entry);
}
for (const entry of [...lesson5.vocabulary, ...lesson5.phrases]) addReading(entry);
for (const sentence of lesson5.sentences) addReading({ ...sentence, spanish: sentence.translation });
// Compact reviewed aids keep editorial translations separate from source exports.
// They include contextual readings (教 jiāo, 一下 yíxià, 不是 bú shì).
for (const entry of support.readings) addReading(entry);
const sentences = new Map(lesson5.sentences.map(sentence => [sentence.id, sentence as SentenceEntry]));

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

/** Full recordings first. Arrays are word-by-word listening, never fluent speech. */
export function grammarAudio(text: string): string | string[] | undefined {
  const exact = grammarReading(text);
  const recorded = audioForMandarinText(text, exact?.pinyin) ?? audioForMandarinText(text);
  if (recorded) return recorded;
  const clean = readingKey(text);
  if (!/^[\p{Script=Han}]+$/u.test(clean)) return undefined;
  // Memoized complete-coverage segmentation: do not play a misleading partial phrase.
  const memo = new Map<number, string[] | undefined>();
  const resolve = (offset: number): string[] | undefined => {
    if (offset === clean.length) return [];
    if (memo.has(offset)) return memo.get(offset);
    for (let end = clean.length; end > offset; end--) {
      const part = clean.slice(offset, end);
      const reading = grammarReading(part);
      if (!reading) continue;
      // Explicit readings prevent a different pronunciation of a polyphonic glyph.
      const clip = audioForMandarinText(part, reading.pinyin);
      if (!clip) continue;
      const rest = resolve(end);
      if (rest) { const sources = [clip, ...rest]; memo.set(offset, sources); return sources; }
    }
    memo.set(offset, undefined);
    return undefined;
  };
  return resolve(0);
}
