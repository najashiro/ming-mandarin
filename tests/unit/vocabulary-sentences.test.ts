import { describe, expect, it } from 'vitest';
import { examplesForVocabularyCard, examplesForWord, getVocabularySet, vocabularyCatalog, vocabularyMixScopes, type VocabularyExample } from '@/lib/vocabulary';
import { vocabularyExampleSentences } from '@/lib/vocabulary-sentences';

const source = (hanzi: string, pinyin: string, spanish: string): VocabularyExample => ({
  id: 'source', phraseId: 'source', hanzi, pinyin, spanish, lessons: [4],
});
const segmenter = new Intl.Segmenter('zh', { granularity: 'sentence' });

describe('one relevant sentence per vocabulary card example', () => {
  it('extracts the reported sleeping sentence with its exact language support', () => {
    const word = vocabularyCatalog.find(word => word.hanzi === '睡觉')!;
    const examples = examplesForVocabularyCard(word);
    expect(examples.find(example => example.phraseId === 'PH-4f5957f98670a801')).toMatchObject({
      hanzi: '明天晚上我和朋友一起看电影，十二点睡觉。',
      pinyin: "Míngtiān wǎnshang wǒ hé péngyou yìqǐ kàn diànyǐng, shí'èr diǎn shuìjiào.",
      spanish: 'Mañana por la noche veo una película con amigos y me acuesto a las doce.',
    });
    expect(examplesForWord(word).find(example => example.id === 'PH-4f5957f98670a801')?.hanzi).toContain('明天我很忙。');
  });

  it('keeps relevant sentences individually, in order, without expanding word links', () => {
    const example = source('你忙吗？我很忙。你好吗？', 'Nǐ máng ma? Wǒ hěn máng. Nǐ hǎo ma?', '¿Estás ocupado? Estoy muy ocupado. ¿Cómo estás?');
    const before = structuredClone(example);
    const rows = vocabularyExampleSentences('忙', [example]);
    expect(rows.map(row => row.hanzi)).toEqual(['你忙吗？', '我很忙。']);
    expect(rows.map(row => row.spanish)).toEqual(['¿Estás ocupado?', 'Estoy muy ocupado.']);
    expect(rows.map(row => row.phraseId)).toEqual(['source', 'source']);
    expect(new Set(rows.map(row => row.id)).size).toBe(2);
    expect(example).toEqual(before);
  });

  it('does not guess alignment or leave paragraphs in the fallback', () => {
    expect(vocabularyExampleSentences('忙', [source('我很忙。你好。', 'Wǒ hěn máng.', 'Estoy ocupado. Hola.')])).toEqual([]);
    expect(vocabularyExampleSentences('忙', [source('我很忙。你好。', 'Wǒ hěn máng. Nǐ hǎo.', 'Estoy ocupado; hola.')])).toEqual([]);
  });

  it('preserves complete single-sentence support and nonliteral approved links', () => {
    const hui = source('七点半我回学校，我们班有活动。', 'Qī diǎn bàn wǒ huí xuéxiào, wǒmen bān yǒu huódòng.', 'Regresaré a la escuela a las siete y media. Nuestra clase tiene una actividad.');
    expect(vocabularyExampleSentences('回', [hui])).toEqual([hui]);
    const tiger = source('他属虎。', 'Tā shǔ hǔ.', 'Él es del signo del tigre.');
    expect(vocabularyExampleSentences('老虎', [tiger])).toEqual([tiger]);
    const long = source('我'.repeat(31) + '。', 'Wǒ.', 'Yo.');
    expect(vocabularyExampleSentences('我', [long])).toEqual([long]);
  });

  it('handles printed optional forms and removes repeated extracted sentences', () => {
    const paragraph = source('你好。七点上课。', 'Nǐ hǎo. Qī diǎn shàngkè.', 'Hola. La clase empieza a las siete.');
    const sentence = { ...source('七点上课。', 'Qī diǎn shàngkè.', 'La clase empieza a las siete.'), id: 'other', phraseId: 'other' };
    expect(vocabularyExampleSentences('点（钟）', [paragraph, sentence]).map(row => row.hanzi)).toEqual(['七点上课。']);
  });

  it('audits every card in all lesson scopes without changing source data or losing coverage', () => {
    const words = [...vocabularyCatalog, ...vocabularyMixScopes.flatMap(scope => getVocabularySet(scope))];
    for (const word of words) {
      const original = examplesForWord(word);
      const before = JSON.stringify(original);
      const examples = examplesForVocabularyCard(word);
      if (original.length) expect(examples.length, word.hanzi).toBeGreaterThan(0);
      expect(new Set(examples.map(example => example.id)).size, word.hanzi).toBe(examples.length);
      for (const example of examples) {
        expect([...segmenter.segment(example.hanzi)].length, `${word.hanzi}: ${example.hanzi}`).toBe(1);
        expect(example.hanzi).not.toMatch(/[\r\n]/);
        expect(word.examplePhraseIds, word.hanzi).toContain(example.phraseId);
        const parent = original.find(row => row.phraseId === example.phraseId)!;
        expect(parent.hanzi).toContain(example.hanzi);
        expect(parent.pinyin).toContain(example.pinyin);
        expect(parent.spanish).toContain(example.spanish);
      }
      expect(JSON.stringify(original)).toBe(before);
    }
  });
});
