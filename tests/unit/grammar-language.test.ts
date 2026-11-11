import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import lesson5 from '@/data/lesson5-public.json';
import support from '@/data/grammar-language-support.json';
import { grammarAudio, grammarReading, grammarSentence, grammarTextSegments } from '@/lib/grammar-language';

describe('lesson 5 grammar reading and audio support', () => {
  it('annotates every Chinese run in the 11 grammar cards without changing the text', () => {
    expect(lesson5.grammar).toHaveLength(11);
    for (const point of lesson5.grammar) {
      for (const text of [point.title, point.pattern, point.explanation, ...point.examples]) {
        const segments = grammarTextSegments(text);
        expect(segments.map(segment => segment.text).join('')).toBe(text);
        for (const segment of segments) {
          if (/\p{Script=Han}/u.test(segment.text)) {
            expect(segment.reading?.pinyin, segment.text).toBeTruthy();
            expect(segment.reading?.spanish, segment.text).toBeTruthy();
          }
        }
      }
      for (const example of point.examples) {
        expect(grammarReading(example)?.spanish, example).toBeTruthy();
      }
    }
  });

  it('supports all 22 complete practice sentences and every selectable block', () => {
    expect(lesson5.sentences).toHaveLength(22);
    for (const sentence of lesson5.sentences) {
      expect(grammarSentence(sentence.id)).toEqual(sentence);
      expect(grammarReading(sentence.hanzi)?.pinyin).toBe(sentence.pinyin);
      for (const token of sentence.tokens) {
        expect(grammarReading(token)?.pinyin, token).toBeTruthy();
        expect(grammarReading(token)?.spanish, token).toBeTruthy();
      }
      const clip = grammarAudio(sentence.hanzi);
      expect(typeof clip, sentence.hanzi).toBe('string');
      expect(existsSync(join(process.cwd(), 'public', clip as string))).toBe(true);
    }
  });

  it('offers complete word audio when no full example recording exists', () => {
    for (const point of lesson5.grammar) {
      for (const example of point.examples) {
        const audio = grammarAudio(example);
        expect(audio, example).toBeTruthy();
        for (const clip of Array.isArray(audio) ? audio : [audio!]) {
          expect(existsSync(join(process.cwd(), 'public', clip)), example).toBe(true);
        }
      }
    }
  });

  it('keeps contextual pronunciation and editorial provenance explicit', () => {
    expect(grammarReading('教')?.pinyin).toBe('jiāo');
    expect(grammarReading('一下')?.pinyin).toBe('yíxià');
    expect(grammarReading('不是')?.pinyin).toBe('bú shì');
    expect(grammarReading('干杯')?.pinyin).toBe('gānbēi');
    for (const row of support.readings) expect(row.source).toMatch(/^data\//);
    expect(grammarReading('un texto español 教')).toBeUndefined();
    expect(grammarAudio('未收录的全新句子')).toBeUndefined();
    expect(grammarSentence('missing')).toBeUndefined();
  });
});
