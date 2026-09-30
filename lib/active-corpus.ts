import baseline from '@/data/corpus-v21-public.json';
import lesson4 from '@/data/lesson4-public.json';

// Preserve the historical projection and its IDs. Contextual L4 readings are
// selected by the vocabulary adapter, never written over L1–L3 readings.
type Word = (typeof baseline.vocabulary)[number];
type Phrase = (typeof baseline.phrases)[number];
const knownWords = new Set(baseline.vocabulary.map(word => word.id));
const knownPhrases = new Set(baseline.phrases.map(phrase => phrase.id));
type Radical = Omit<(typeof baseline.radicals)[number], 'strokeCount'> & { strokeCount: number | null };
const radicals: Radical[] = baseline.radicals.map(radical => ({ ...radical, examples: [...radical.examples], lessons: [...radical.lessons] }));
for (const glyph of new Set(lesson4.characters.map(character => character.radical).filter(Boolean))) {
  const examples = lesson4.characters.filter(character => character.radical === glyph && character.pinyin)
    .map(character => ({ hanzi: character.hanzi, pinyin: character.pinyin, lessons: [4] }));
  const existing = radicals.find(radical => radical.radical === glyph);
  if (existing) {
    existing.lessons.push(4);
    existing.examples.push(...examples);
  } else radicals.push({ id: `RAD-L4-${glyph.codePointAt(0)!.toString(16)}`, radical: glyph, name: '', meaning: '', explanation: '', strokeCount: null, lessons: [4], examples });
}
const corpus = {
  ...baseline, version: lesson4.version, fingerprint: lesson4.fingerprint,
  vocabulary: [...baseline.vocabulary, ...lesson4.vocabulary.filter(word => !knownWords.has(word.id)) as Word[]],
  phrases: [...baseline.phrases, ...lesson4.phrases.filter(phrase => !knownPhrases.has(phrase.id)) as Phrase[]],
  dialogues: [...baseline.dialogues, ...lesson4.dialogues],
  radicals,
};
export default corpus;
export { lesson4 };
