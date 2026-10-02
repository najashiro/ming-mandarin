import { getVocabularySet, examplesForWord } from '@/lib/vocabulary';
import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import lesson4 from '@/data/lesson4-public.json';
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


describe('L4 approved examples', () => {
  it('restores global examples and retains incomplete language support', () => {
    const words = getVocabularySet('l4');
    for (const hanzi of ['累', '今天', '早饭']) {
      const word = words.find(word => word.hanzi === hanzi)!;
      const historical = corpus.vocabulary.find(word => word.hanzi === hanzi)!;
      expect(examplesForWord(word).map(example => example.id)).toEqual(expect.arrayContaining(historical.examplePhraseIds));
    }
    const half = examplesForWord(words.find(word => word.hanzi === '半')!);
    expect(half.length).toBeGreaterThan(0);
    expect(half.some(example => !example.pinyin || !example.spanish)).toBe(true);
    expect(words.filter(word => examplesForWord(word).length === 0).map(word => word.hanzi)).toEqual(['下']);
    for (const word of words) for (const example of examplesForWord(word)) {
      expect(word.examplePhraseIds).toContain(example.id);
      expect(example.hanzi).not.toMatch(/…|_|□/);
    }
  });
  it('uses the two explicit L4 examples with complete support and original lexical IDs', () => {
    const words = getVocabularySet('l4');
    expect(words).toHaveLength(73);
    expect(lesson4.sentences).toHaveLength(7);
    expect(lesson4.sentences.some(row => row.id === 'PH-05f97f56e77b1b66')).toBe(false);
    expect(words.filter(word => examplesForWord(word).length > 0)).toHaveLength(72);
    const hui = examplesForWord(words.find(word => word.hanzi === '回')!);
    expect(hui.map(row => row.id)).toEqual(['PH-f9131d33151602a9']);
    expect(hui[0].hanzi).toBe('七点半我回学校，我们班有活动。');
    expect(hui[0].spanish).toBe('Regresaré a la escuela a las siete y media. Nuestra clase tiene una actividad.');
    expect(hui[0].pinyin).toBe('Qī diǎn bàn wǒ huí xuéxiào, wǒmen bān yǒu huódòng.');
    expect(lesson4.phrases.find(row => row.id === hui[0].id)!.vocabIds).toContain('v-回学校');
    expect(lesson4.phrases.find(row => row.id === hui[0].id)!.vocabIds).not.toContain('v-回');
    const university = examplesForWord(words.find(word => word.hanzi === '里卡多帕尔玛大学')!);
    expect(university.map(row => row.id)).toEqual(['PH-05f97f56e77b1b66']);
    expect(university[0].hanzi).toBe('我是里卡多帕尔玛大学孔子学院的学生。');
    expect(university[0].pinyin).toBe("Wǒ shì Lǐkǎduō Pà'ěrmǎ Dàxué Kǒngzǐ Xuéyuàn de xuéshēng.");
    expect(university[0].spanish).toBe('Soy estudiante del Instituto Confucio de la Universidad Ricardo Palma.');
    expect(lesson4.phrases.find(row => row.id === university[0].id)!.vocabIds).toContain('v-里卡多帕尔玛大学孔子学院');
    expect(lesson4.phrases.find(row => row.id === university[0].id)!.vocabIds).not.toContain('v-里卡多帕尔玛大学');
    expect(words.some(word => word.hanzi === '里卡多帕尔玛大学孔子学院')).toBe(false);
    expect(JSON.stringify([...hui, ...university])).not.toMatch(/pinyin_ming|traduccion_ming|spanish_source|source_location|documentary_spanish/);
  });
  it('does not reuse classifier examples for contextual zhi', () => {
    const word = getVocabularySet('l4').find(word => word.hanzi === '只')!;
    expect(examplesForWord(word).length).toBeGreaterThan(0);
    expect(examplesForWord(word).every(example => example.lessons.includes(4))).toBe(true);
    expect(examplesForWord(word).map(example => example.hanzi)).not.toContain('一只猫');
  });
});
