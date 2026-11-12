import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { grammarGuides } from '@/data/grammar-guides';
import { getCurriculum } from '@/seed/curriculum';
import reference from '@/data/lesson4-study-reference.json';
import { normalizeAnswer } from '@/lib/pinyin';
import lesson5 from '@/data/lesson5-public.json';
import support from '@/data/grammar-language-support.json';
import { grammarAudio, grammarReading, grammarSentence, grammarTextSegments, grammarSentenceForText, grammarPracticeTokens } from '@/lib/grammar-language';

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
    expect(grammarReading('别')?.spanish).not.toBe('separar');
    for (const row of support.readings) expect(row.source).toMatch(/^(data|seed)\//);
    expect(grammarReading('un texto español 教')).toBeUndefined();
    expect(grammarAudio('未收录的全新句子')).toBeUndefined();
    expect(grammarSentence('missing')).toBeUndefined();
  });
});


const globalCurriculum = getCurriculum('l1-l2-l3-l4-l5-l6');
const globalGrammar = globalCurriculum.grammar.map(point => reference.grammar.find(item => item.id === point.id) ?? point);
function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([field, entry]) =>
    ['source', 'id', 'slug', 'continuationOf', 'href', 'characterDetails'].includes(field) ? [] : allStrings(entry));
  return [];
}

describe('grammar language coverage for the whole course', () => {
  it('supports every visible Chinese run in all lesson rules, tables and book references', () => {
    const texts = allStrings([globalGrammar, reference.bookReference]);
    for (const text of texts) {
      const parts = grammarTextSegments(text);
      expect(parts.map(part => part.text).join('')).toBe(text);
      for (const part of parts) if (/\p{Script=Han}/u.test(part.text)) {
        expect(part.reading?.pinyin, text).toBeTruthy();
        expect(part.reading?.spanish, text).toBeTruthy();
      }
    }
    for (const point of globalGrammar) for (const example of point.examples) {
      expect(grammarReading(example)?.pinyin, example).toBeTruthy();
      expect(grammarReading(example)?.spanish, example).toBeTruthy();
      const audio = grammarAudio(example);
      if (example === '别着急，林小姐。') { expect(audio).toBeUndefined(); continue; }
      expect(audio, example).toBeTruthy();
      for (const clip of Array.isArray(audio) ? audio : [audio!]) expect(existsSync(join(process.cwd(), 'public', clip)), example).toBe(true);
    }
  });

  it('finds every source sentence by its stable ID and text, with readable tokens', () => {
    for (const sentence of globalCurriculum.sentences) {
      expect(grammarSentence(sentence.id)).toEqual(sentence);
      expect(grammarSentenceForText(sentence.hanzi)?.hanzi).toBe(sentence.hanzi);
      for (const token of sentence.tokens) {
        expect(grammarReading(token)?.pinyin, `${sentence.id}: ${token}`).toBeTruthy();
        expect(grammarReading(token)?.spanish, `${sentence.id}: ${token}`).toBeTruthy();
      }
    }
  });

  it('keeps all original exercise answers reconstructible and audible', () => {
    const missing: string[] = [];
    for (const exercise of globalCurriculum.exercises.filter(item => item.dimension === 'grammar')) {
      const tokens = grammarPracticeTokens(exercise.answer);
      expect(normalizeAnswer(tokens.join('')), exercise.id).toBe(normalizeAnswer(exercise.answer));
      const sources = grammarAudio(exercise.answer);
      if (!sources) missing.push(`${exercise.id}: ${exercise.answer}`);
      else for (const source of Array.isArray(sources) ? sources : [sources]) {
        expect(existsSync(join(process.cwd(), 'public', source)), exercise.id).toBe(true);
      }
    }
    expect(missing).toEqual([]);
  });

  it('does not silently remove numbers, foreign text, alternatives or error markers from audio', () => {
    expect(grammarAudio('他是A')).toBeUndefined();
    expect(grammarAudio('我有100元')).toBeUndefined();
    expect(grammarAudio('*我去学校昨天')).toBeUndefined();
    expect(grammarAudio('✗ 也我很好')).toBeUndefined();
    expect(grammarAudio('你 / ?')).toBeUndefined();
    const transformation = grammarAudio('他很忙。→ 他忙吗？');
    expect(Array.isArray(transformation)).toBe(true);
    expect((transformation as string[]).length).toBeGreaterThanOrEqual(2);
  });
});


it('covers every guide example with complete reading and verified audio', () => {
  for (const guide of Object.values(grammarGuides)) {
    const examples = [guide.example, ...(guide.patterns ?? []).map(pattern => pattern.example)]
      .filter((example): example is string => Boolean(example));
    for (const example of examples) {
      const reading = grammarReading(example);
      expect(reading?.pinyin, example).toBeTruthy();
      expect(reading?.spanish, example).toBeTruthy();
      const audio = grammarAudio(example);
      expect(audio, example).toBeTruthy();
      for (const clip of Array.isArray(audio) ? audio : [audio!]) {
        expect(existsSync(join(process.cwd(), 'public', clip)), example).toBe(true);
      }
    }
  }
});
