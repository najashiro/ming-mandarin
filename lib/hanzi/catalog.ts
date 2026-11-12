import corpus, { lesson4, lesson5, lesson6 } from '@/lib/active-corpus';
import { allCurriculumCharacters } from '@/seed/curriculum';
import { supplementalHanziByGlyph } from '@/data/supplemental-hanzi';
import type { HanziLabCharacter } from '@/components/hanzi/HanziLab';
import { compactHanziContexts, hanziContextKey } from '@/lib/hanzi/contexts';

// Character containment supplies reading context, never a new writing target
// or the meaning/pronunciation of an isolated character.
const contexts = [
  ...corpus.vocabulary,
  ...corpus.phrases,
  ...[lesson4, lesson5, lesson6].flatMap((lesson, index) =>
    lesson.readings.map(reading => ({ ...reading, lessons: [index + 4] }))),
].filter(row => row.pinyin && row.spanish);

const compactContexts = contexts.flatMap(row => compactHanziContexts({
  hanzi: row.hanzi, pinyin: row.pinyin, translation: row.spanish,
}));

const curricularGlyphs = new Set(allCurriculumCharacters.map(character => character.hanzi));
const characters: HanziLabCharacter[] = [
  ...allCurriculumCharacters,
  ...[...supplementalHanziByGlyph.values()].filter(character => !curricularGlyphs.has(character.hanzi))
    .map(character => ({ ...character, radical: '', components: [], componentsAudited: false,
      writingRequired: false, introducedIn: null, appearsIn: [], words: [] })),
];

export const hanziCatalog: HanziLabCharacter[] = characters.map(character => {
  const matches = contexts.filter(row => row.hanzi.includes(character.hanzi));
  const words = [...new Map([
    ...(character.words ?? []).flatMap(word => compactHanziContexts(word)),
    ...compactContexts.filter(word => word.hanzi.includes(character.hanzi)),
  ].filter(word => word.hanzi.includes(character.hanzi)).map(word => [hanziContextKey(word), word])).values()];
  const { id, hanzi, pinyin, meaning, strokeCount, radical, components, componentsAudited, writingRequired, introducedIn, appearsIn } = character;
  return { id, hanzi, pinyin, meaning, strokeCount, radical, components, componentsAudited, writingRequired, introducedIn, appearsIn,
    referenceLessons: [...new Set([...(character.referenceLessons ?? []), ...matches.flatMap(row => row.lessons)])].sort((a, b) => a - b),
    words: words.slice(0, 12),
  };
});

export const hanziCatalogByGlyph = new Map(hanziCatalog.map(character => [character.hanzi, character]));
