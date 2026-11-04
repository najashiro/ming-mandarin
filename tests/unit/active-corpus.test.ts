import { describe, expect, it } from 'vitest';
import corpus, { lesson4, lesson5 } from '@/lib/active-corpus';
import baseline from '@/data/corpus-v21-public.json';
import { normalizePinyinForComparison } from '@/lib/pinyin';
import { publicExamplesForVocabulary } from '@/lib/vocabulary-examples';
import { searchGlobalVocabulary } from '@/lib/vocabulary';

describe('integration of lesson extensions into the global catalog', () => {
  it('retains L4 membership and examples for words already introduced earlier', () => {
    const today = corpus.vocabulary.find(word => word.id === 'v-今天')!;
    const contextual = lesson4.vocabulary.find(word => word.id === today.id)!;
    const completeIds = contextual.examplePhraseIds.filter(id => lesson4.phrases.some(phrase => phrase.id === id && phrase.pinyin && phrase.spanish));
    expect(completeIds.length).toBeGreaterThan(0);
    expect(today.lessons).toContain(4);
    expect(today.curriculumLinks).toEqual(expect.arrayContaining(contextual.curriculumLinks));
    expect(today.examplePhraseIds).toEqual(expect.arrayContaining(completeIds));
    expect(searchGlobalVocabulary('今天')[0]).toBe(today);
    expect(publicExamplesForVocabulary(today.id).map(phrase => phrase.id)).toEqual(expect.arrayContaining(completeIds));
  });

  it('keeps contextual readings separate when a Hanzi has different pronunciations', () => {
    const classifier = corpus.vocabulary.find(word => word.id === 'v-只')!;
    const only = lesson4.vocabulary.find(word => word.id === classifier.id)!;
    expect(classifier.pinyin).toBe('zhī');
    expect(only.pinyin).toBe('zhǐ');
    expect(classifier.lessons).toContain(4);
    expect(publicExamplesForVocabulary(classifier.id).map(phrase => phrase.hanzi)).toContain('一只猫');
    expect(classifier.examplePhraseIds.some(id => only.examplePhraseIds.includes(id))).toBe(false);
  });

  it('merges compatible readings even when syllable spacing differs', () => {
    const word = corpus.vocabulary.find(word => word.id === 'v-早饭')!;
    const contextual = lesson4.vocabulary.find(row => row.id === word.id)!;
    expect(normalizePinyinForComparison(word.pinyin)).toBe(normalizePinyinForComparison(contextual.pinyin));
    const completeIds = contextual.examplePhraseIds.filter(id => lesson4.phrases.some(phrase => phrase.id === id && phrase.pinyin && phrase.spanish));
    expect(word.examplePhraseIds).toEqual(expect.arrayContaining(completeIds));
  });

  it('does not mutate the independently exported lesson snapshots while merging later lessons', () => {
    expect(baseline.vocabulary.every(word => word.lessons.every(lesson => lesson < 4))).toBe(true);
    expect(lesson4.vocabulary.every(word => word.lessons.length === 1 && word.lessons[0] === 4)).toBe(true);
    expect(lesson5.vocabulary.every(word => word.lessons.length === 1 && word.lessons[0] === 5)).toBe(true);
    expect(new Set(corpus.vocabulary.map(word => word.id)).size).toBe(corpus.vocabulary.length);
  });
});
