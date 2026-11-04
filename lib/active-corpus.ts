import baseline from '@/data/corpus-v21-public.json';
import lesson4 from '@/data/lesson4-public.json';
import lesson5 from '@/data/lesson5-public.json';

type Word = (typeof baseline.vocabulary)[number];
type Phrase = (typeof baseline.phrases)[number];
type Radical = Omit<(typeof baseline.radicals)[number], 'strokeCount'> & { strokeCount: number | null };
const vocabulary: Word[] = baseline.vocabulary.map(word => ({ ...word }));
const phrases: Phrase[] = baseline.phrases.map(phrase => ({ ...phrase }));
const radicals: Radical[] = baseline.radicals.map(radical => ({ ...radical, examples: [...radical.examples], lessons: [...radical.lessons] }));
for (const [lessonNumber, extension] of [[4, lesson4], [5, lesson5]] as const) {
  for (const incoming of extension.vocabulary) {
    const existing = vocabulary.find(word => word.id === incoming.id);
    if (!existing) vocabulary.push(incoming as Word);
    else if (lessonNumber === 5) {
      // Preserve the established reading; merge explicit lesson membership and examples.
      existing.lessons = [...new Set([...existing.lessons, lessonNumber])];
      existing.curriculumLinks = [...existing.curriculumLinks, ...incoming.curriculumLinks as Word['curriculumLinks']];
      existing.examplePhraseIds = [...new Set([...existing.examplePhraseIds, ...incoming.examplePhraseIds.filter(id => extension.phrases.some(phrase => phrase.id === id && phrase.pinyin && phrase.spanish))])];
    }
  }
  for (const incoming of extension.phrases) {
    const existing = phrases.find(phrase => phrase.id === incoming.id);
    if (!existing) phrases.push(incoming as Phrase);
    else {
      existing.lessons = [...new Set([...existing.lessons, lessonNumber])];
      existing.exampleVocabIds = [...new Set([...existing.exampleVocabIds, ...incoming.exampleVocabIds])];
    }
  }
  for (const glyph of new Set(extension.characters.map(character => character.radical).filter(Boolean))) {
    const examples = extension.characters.filter(character => character.radical === glyph && character.pinyin)
      .map(character => ({ hanzi: character.hanzi, pinyin: character.pinyin, lessons: [lessonNumber] }));
    const existing = radicals.find(radical => radical.radical === glyph);
    if (existing) {
      existing.lessons = [...new Set([...existing.lessons, lessonNumber])];
      existing.examples.push(...examples);
    } else radicals.push({ id: `RAD-L${lessonNumber}-${glyph.codePointAt(0)!.toString(16)}`, radical: glyph, name: '', meaning: '', explanation: '', strokeCount: null, lessons: [lessonNumber], examples });
  }
}
const corpus = {
  ...baseline, version: lesson5.version, fingerprint: lesson5.fingerprint,
  vocabulary, phrases, dialogues: [...baseline.dialogues, ...lesson4.dialogues, ...lesson5.dialogues], radicals,
};
export default corpus;
export { lesson4, lesson5 };
