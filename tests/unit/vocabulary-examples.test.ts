import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import { publicExamplesForVocabulary } from '@/lib/vocabulary-examples';

describe('global vocabulary examples with editorial pinyin', () => {
  it('returns all three cat examples with pinyin and Spanish', () => {
    const rows = publicExamplesForVocabulary('猫');
    expect(rows.map((row) => row.hanzi)).toEqual(['一只猫', '你有小猫吗？', '我有两只小猫，他们很可爱。']);
    expect(rows.map((row) => row.pinyin)).toEqual(['Yì zhī māo', 'Nǐ yǒu xiǎomāo ma?', "Wǒ yǒu liǎng zhī xiǎomāo, tāmen hěn kě'ài."]);
    expect(rows.every((row) => row.spanish.length > 0)).toBe(true);
  });

  it('accepts canonical IDs and does not duplicate witnesses', () => {
    const rows = publicExamplesForVocabulary('v-猫');
    expect(rows).toEqual(publicExamplesForVocabulary('猫'));
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
  });

  it('keeps exact lexical tokens separate from pedagogical inheritance', () => {
    const kitten = publicExamplesForVocabulary('猫').find((row) => row.hanzi === '你有小猫吗？')!;
    expect(kitten.vocabIds).toContain('v-小猫');
    expect(kitten.vocabIds).not.toContain('v-猫');
    expect(kitten.exampleVocabIds).toContain('v-猫');
    expect(publicExamplesForVocabulary('小猫').map((row) => row.hanzi)).toEqual(['你有小猫吗？', '我有两只小猫，他们很可爱。']);
  });

  it('does not invent examples for unknown or substring queries', () => {
    expect(publicExamplesForVocabulary('不存在的词')).toEqual([]);
    expect(publicExamplesForVocabulary('熊猫')).toEqual([]);
  });

  it('looks up zhen examples globally across lessons', () => {
    const rows = publicExamplesForVocabulary('真');
    expect(rows.some((row) => row.hanzi === '真厉害！' && row.lessons.includes(2))).toBe(true);
    expect(rows.some((row) => row.hanzi === '这张照片真漂亮！' && row.lessons.includes(3))).toBe(true);
  });

  it('does not return templates or counterexamples as complete card examples', () => {
    for (const word of corpus.vocabulary) {
      for (const row of publicExamplesForVocabulary(word.id)) {
        expect(row.hanzi).not.toMatch(/…|_|□/);
        expect(row.kinds).not.toContain('counterexample');
      }
    }
  });

  it('keeps documentary pinyin and translation precedence', () => {
    expect(corpus.vocabulary.find((row) => row.hanzi === '猫')?.pinyin).toBe('māo');
    expect(corpus.vocabulary.find((row) => row.hanzi === '猫')?.spanish).toBe('gato');
    expect(corpus.phrases.find((row) => row.hanzi === '真厉害！')?.pinyin).toBe('zhēn lì hài!');
  });

  it('exports complete support without editorial provenance', () => {
    expect(corpus.vocabulary.every((row) => row.pinyin && row.spanish)).toBe(true);
    expect(corpus.phrases.every((row) => row.pinyin && row.spanish)).toBe(true);
    expect(JSON.stringify(corpus)).not.toMatch(/pinyin_ming|pinyin_display|review_status|source_text_sha256|COMP-MAO-XIAOMAO/);
  });

  it('returns a fresh list and never mutates curricular assignments', () => {
    const before = JSON.stringify(corpus.vocabulary.find((row) => row.hanzi === '猫'));
    publicExamplesForVocabulary('猫').pop();
    expect(publicExamplesForVocabulary('猫')).toHaveLength(3);
    expect(JSON.stringify(corpus.vocabulary.find((row) => row.hanzi === '猫'))).toBe(before);
  });
});
