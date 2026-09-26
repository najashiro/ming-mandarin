import { statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import { publicExamplesForVocabulary } from '@/lib/vocabulary-examples';
import { audioForMandarinText } from '@/lib/mandarin-audio';

describe('audio de todo el vocabulario publicado', () => {
  it('resuelve palabras y todos sus ejemplos a archivos locales con la lectura del corpus', () => {
    const rows = corpus.vocabulary.flatMap(word => [word, ...publicExamplesForVocabulary(word.id)]);
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
});
