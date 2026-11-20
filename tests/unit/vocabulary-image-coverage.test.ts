import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getVocabularyMixSet, vocabularyCatalog, vocabularyMixScopes } from '@/lib/vocabulary';
import { imageForWord, vocabularyMedia } from '@/lib/vocabulary-media';

describe('complete vocabulary image coverage', () => {
  for (const scope of vocabularyMixScopes) {
    it(`provides an approved image for every card selectable in ${scope}`, () => {
      const missing = getVocabularyMixSet(scope).filter(word => !imageForWord(word.id))
        .map(word => `${word.id}: ${word.spanish}`);
      expect(missing).toEqual([]);
    });
  }

  it('covers every word throughout the active corpus, including catalog-only entries', () => {
    const missing = vocabularyCatalog.filter(word => !imageForWord(word.id))
      .map(word => `${word.id}: ${word.spanish}`);
    expect(missing).toEqual([]);
  });

  it('ships every approved local image with the exact reviewed bytes', () => {
    const assets = new Map(vocabularyMedia.filter(entry => entry.status === 'approved' && entry.src)
      .map(entry => [entry.src, entry]));
    const problems: string[] = [];
    for (const [src, entry] of assets) {
      const pathname = src.split('?')[0];
      if (!pathname.startsWith('/')) continue;
      const file = resolve(process.cwd(), 'public', pathname.slice(1));
      if (!existsSync(file)) problems.push(`Missing file: ${src}`);
      else if (createHash('sha256').update(readFileSync(file)).digest('hex') !== entry.sha256) problems.push(`Review hash mismatch: ${src}`);
    }
    expect(problems).toEqual([]);
  });
});
