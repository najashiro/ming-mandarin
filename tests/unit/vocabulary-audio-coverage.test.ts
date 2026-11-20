import { statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import reviewed from '@/data/lessons123-public.json';
import activeCorpus from '@/lib/active-corpus';
import { examplesForVocabularyCard, getVocabularyMixSet, getVocabularySet, type ActiveWord } from '@/lib/vocabulary';
import { curriculumScopes } from '@/seed/curriculum';
import { audioForMandarinText } from '@/lib/mandarin-audio';

describe('audio del vocabulario y ejemplos históricos L1–L3', () => {
  it('conserva todos los archivos originales con su lectura histórica', () => {
    // Resolve against the same snapshot: the active examples now contain
    // reviewed readings and sentence recordings without replacing original clips.
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
      expect(original, `${row.id}: ${previous.pinyin}`).toBeTruthy();
      expect(current, `${row.id}: ${row.pinyin}`).toBe(original);
      expect(statSync(`public${current}`).size, row.id).toBeGreaterThan(1024);
    }
  });

  it('uses a separate recording when a word or sentence correction changes its reading', () => {
    for (const id of ['v-后年', 'v-晚上好', 'PH-0a3721928d6f00d4']) {
      const previous = [...corpus.vocabulary, ...corpus.phrases].find(row => row.id === id)!;
      const current = [...reviewed.vocabulary, ...reviewed.phrases].find(row => row.id === id)!;
      const previousClip = audioForMandarinText(previous.hanzi, previous.pinyin);
      const currentClip = audioForMandarinText(current.hanzi, current.pinyin);
      expect(previousClip, id).toBeTruthy();
      expect(currentClip, id).toBeTruthy();
      expect(currentClip, id).not.toBe(previousClip);
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

describe('audio del vocabulario activo L1–L6 y Vocabulario Mix', () => {
  function expectRecording(word: { id: string; hanzi: string; pinyin: string }, context: string) {
    const key = `${context}: ${word.id} ${word.hanzi} (${word.pinyin})`;
    const source = audioForMandarinText(word.hanzi, word.pinyin);
    expect(source, key).toMatch(/^\/audio\/(mandarin|pinyin|directions|hide-and-seek)\/[a-z0-9-]+\.mp3$/);
    expect(statSync(`public${source}`).size, key).toBeGreaterThan(1024);
  }

  it('covers the active catalog, including lesson-specific readings', () => {
    for (const word of activeCorpus.vocabulary) expectRecording(word, 'catálogo activo');
    // Lesson decks can use a different reading from the accumulated catalog:
    // for example, 只 zhǐ in L4 versus the earlier classifier zhī.
    for (const scope of curriculumScopes) {
      for (const word of getVocabularySet(scope)) expectRecording(word, scope);
    }
  });

  it('covers every playable Mix word and its actual accumulated-catalog prompt', () => {
    const catalog = new Map(activeCorpus.vocabulary.map(word => [word.id, word]));
    for (const scope of curriculumScopes) {
      for (const word of getVocabularyMixSet(scope)) {
        expectRecording(word, `Mix ${scope}`);
        const prompt = catalog.get(word.id);
        expect(prompt, `${scope}: ${word.id}`).toBeDefined();
        expectRecording(prompt!, `pregunta Mix ${scope}`);
      }
    }
  });

  it('reuses the exact existing L6 recordings and preserves neutral syllables', () => {
    expect(audioForMandarinText('教学楼', 'jiàoxuélóu')).toBe('/audio/directions/directions-6fc941b1c2e73e95.mp3');
    expect(audioForMandarinText('前边', 'qiánbian')).toBe('/audio/hide-and-seek/hide-5d55ee6f9335daeb.mp3');
    expect(audioForMandarinText('教学楼')).toBe(audioForMandarinText('教学楼', 'jiàoxuélóu'));
    expect(audioForMandarinText('北边', 'běibiān')).toBeUndefined();
    expect(audioForMandarinText('教学楼', 'jiāoxuélóu')).toBeUndefined();
  });
});


describe('audio de las oraciones realmente mostradas en el reverso', () => {
  function expectExamples(words: readonly ActiveWord[], context: string) {
    let count = 0;
    for (const word of words) {
      for (const example of examplesForVocabularyCard(word)) {
        const label = `${context}: ${word.id} → ${example.id} ${example.hanzi} (${example.pinyin})`;
        expect(example.pinyin, label).toBeTruthy();
        const source = audioForMandarinText(example.hanzi, example.pinyin);
        expect(source, label).toMatch(/^\/audio\/[a-z0-9/-]+\.mp3$/);
        expect(statSync(`public${source}`).size, label).toBeGreaterThan(1024);
        count++;
      }
    }
    expect(count, context).toBeGreaterThan(0);
  }

  it('covers every catalog example and each lesson-specific card, including segmented sentences', () => {
    expectExamples(activeCorpus.vocabulary, 'catálogo activo');
    for (const scope of curriculumScopes) expectExamples(getVocabularySet(scope), `vocabulario ${scope}`);
  });

  it('covers every Mix reverse and all examples reachable through Otro ejemplo', () => {
    const catalog = new Map(activeCorpus.vocabulary.map(word => [word.id, word]));
    for (const scope of curriculumScopes) {
      const selected = getVocabularyMixSet(scope);
      expectExamples(selected, `selección Mix ${scope}`);
      // Saved rounds store IDs; the game renders the active-catalog entry.
      expectExamples(selected.map(word => catalog.get(word.id)!), `reverso Mix ${scope}`);
    }
  });

  it('plays the reported bedroom sentence with its complete documented reading', () => {
    const bedroom = activeCorpus.vocabulary.find(word => word.id === 'v-卧室')!;
    const example = examplesForVocabularyCard(bedroom).find(row => row.hanzi === '我家有两个卧室。');
    expect(example).toBeDefined();
    expect(example!.pinyin).toBe('Wǒ jiā yǒu liǎng ge wòshì.');
    const sentence = audioForMandarinText(example!.hanzi, example!.pinyin);
    expect(sentence).toBeTruthy();
    expect(sentence).not.toBe(audioForMandarinText(bedroom.hanzi, bedroom.pinyin));
    // Supplying a different tone must not silently choose the sentence recording.
    expect(audioForMandarinText(example!.hanzi, 'Wǒ jiā yǒu liǎng ge wōshì.')).toBeUndefined();
  });
});
