import { describe, expect, it } from 'vitest';
import baseline from '@/data/corpus-v21-public.json';
import reviewed from '@/data/lessons123-public.json';
import active from '@/lib/active-corpus';
import { publicExamplesForVocabulary } from '@/lib/vocabulary-examples';
import { availablePracticeTypes, vocabularyMedia } from '@/lib/vocabulary-media';

describe('reviewed textbook-first lessons 1–3', () => {
  it('preserves progress IDs and provides Chinese, pinyin, Spanish and examples on every card', () => {
    expect(reviewed.vocabulary.map(word => word.id)).toEqual(baseline.vocabulary.map(word => word.id));
    for (const word of reviewed.vocabulary) {
      const current = active.vocabulary.find(row => row.id === word.id)!;
      expect(current.hanzi).toBe(word.hanzi);
      expect(current.pinyin, word.id).toBeTruthy();
      expect(current.spanish, word.id).toBeTruthy();
      const examples = publicExamplesForVocabulary(word.id);
      expect(examples.length, word.id).toBeGreaterThan(0);
      for (const example of examples) {
        expect(example.hanzi).toBeTruthy();
        expect(example.pinyin, example.id).toBeTruthy();
        expect(example.spanish, example.id).toBeTruthy();
        expect(example.hanzi).not.toMatch(/…|_|□/);
      }
    }
  });
  it('corrects readings without changing the historical source snapshot', () => {
    for (const [hanzi, pinyin] of [['法语','Fǎyǔ'],['奶奶','nǎinai'],['后年','hòunián'],['炒饭','chǎofàn']]) {
      expect(reviewed.vocabulary.find(word => word.hanzi === hanzi)?.pinyin).toBe(pinyin);
    }
    expect(baseline.vocabulary.find(word => word.hanzi === '后年')?.pinyin).toBe('hòuniá');
  });
  it('recovers textbook collocations and keeps explicit composition links separate', () => {
    expect(publicExamplesForVocabulary('没').some(p => p.hanzi === '没有朋友')).toBe(true);
    expect(publicExamplesForVocabulary('豆浆').some(p => p.hanzi === '喜欢喝豆浆')).toBe(true);
    const noFriends = publicExamplesForVocabulary('没').find(p => p.hanzi === '没有朋友')!;
    expect(noFriends.vocabIds).not.toContain('v-没');
    expect(noFriends.exampleVocabIds).toContain('v-没');
  });
  it('keeps documentary provenance internal and labelled teaching images out of recognition quizzes', () => {
    expect(JSON.stringify(reviewed)).not.toMatch(/source_refs|source_id|\.pdf|traduccion_ming|pinyin_ming|independent_human/);
    for (const asset of vocabularyMedia.filter(row => row.status === 'approved' && !row.imageQuizEligible)) {
      const word = active.vocabulary.find(row => row.id === asset.wordId);
      if (word) expect(availablePracticeTypes(word)).not.toContain('image');
    }
  });
});
