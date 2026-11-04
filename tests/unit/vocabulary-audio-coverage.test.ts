import { statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import reviewed from '@/data/lessons123-public.json';
import { audioForMandarinText } from '@/lib/mandarin-audio';

describe('audio del vocabulario y ejemplos históricos L1–L3', () => {
  it('conserva todos los archivos originales con su lectura histórica', () => {
    // Resolve against the same snapshot: the active examples now contain
    // reviewed readings and new teaching material without new recordings.
    const phrasesById = new Map(corpus.phrases.map(phrase => [phrase.id, phrase]));
    const rows = corpus.vocabulary.flatMap(word => [word, ...word.examplePhraseIds.map(id => {
      const phrase = phrasesById.get(id);
      expect(phrase, id).toBeDefined();
      return phrase!;
    })]);
    const checked = new Set<string>();
    for (const row of rows) {
      const key = `${row.hanzi}:${row.pinyin}`;
      if (checked.has(key)) continue;
      checked.add(key);
      const source = audioForMandarinText(row.hanzi, row.pinyin);
      expect(source, `${row.id}: ${key}`).toMatch(/^\/audio\/(mandarin|pinyin)\/[a-z0-9-]+\.mp3$/);
      expect(statSync(`public${source}`).size, key).toBeGreaterThan(1024);
    }
  });

  it('reuses existing recordings for every reviewed spelling correction with the same reading', () => {
    const previousById = new Map([...corpus.vocabulary, ...corpus.phrases].map(row => [row.id, row]));
    const changedReadings = new Set(['v-后年', 'v-晚上好', 'PH-0a3721928d6f00d4']);
    const corrected = [...reviewed.vocabulary, ...reviewed.phrases].filter(row => {
      const previous = previousById.get(row.id);
      return previous && previous.pinyin !== row.pinyin && !changedReadings.has(row.id);
    });
    expect(corrected).toHaveLength(39);
    for (const row of corrected) {
      const previous = previousById.get(row.id)!;
      const original = audioForMandarinText(previous.hanzi, previous.pinyin);
      const current = audioForMandarinText(row.hanzi, row.pinyin);
      // 我累死了。 was recovered as a selectable example in this review;
      // its historical text had never received a recording.
      if (row.id === 'PH-121d6a3b3b2b5204') {
        expect(original).toBeUndefined();
        expect(current).toBeUndefined();
        continue;
      }
      expect(original, `${row.id}: ${previous.pinyin}`).toBeTruthy();
      expect(current, `${row.id}: ${row.pinyin}`).toBe(original);
      expect(statSync(`public${current}`).size, row.id).toBeGreaterThan(1024);
    }
  });

  it('does not assign an old clip when a correction changes a tone or final consonant', () => {
    for (const id of ['v-后年', 'v-晚上好', 'PH-0a3721928d6f00d4']) {
      const previous = [...corpus.vocabulary, ...corpus.phrases].find(row => row.id === id)!;
      const current = [...reviewed.vocabulary, ...reviewed.phrases].find(row => row.id === id)!;
      expect(audioForMandarinText(previous.hanzi, previous.pinyin), id).toBeTruthy();
      expect(audioForMandarinText(current.hanzi, current.pinyin), id).toBeUndefined();
    }
    // Orthographic repairs must not erase real differences in homographs.
    expect(audioForMandarinText('好', 'hǎo')).toBeTruthy();
    expect(audioForMandarinText('好', 'hào')).toBeUndefined();
    for (const [hanzi, first, second] of [['只', 'zhǐ', 'zhī'], ['差', 'chà', 'chā']]) {
      const firstClip = audioForMandarinText(hanzi, first);
      const secondClip = audioForMandarinText(hanzi, second);
      expect(firstClip).toBeTruthy();
      expect(secondClip).toBeTruthy();
      expect(firstClip).not.toBe(secondClip);
    }
  });
});
