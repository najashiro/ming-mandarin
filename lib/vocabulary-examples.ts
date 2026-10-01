import corpus from '@/lib/active-corpus';

type PublicWord = (typeof corpus.vocabulary)[number];
export type PublicVocabularyExample = (typeof corpus.phrases)[number];
const wordsById = new Map<string, PublicWord>(corpus.vocabulary.map((row) => [row.id, row]));
const phrasesById = new Map<string, PublicVocabularyExample>(corpus.phrases.map((row) => [row.id, row]));

/** Global, ordered examples. No lesson filter, substring discovery or UI mutation. */
export function publicExamplesForVocabulary(wordOrId: string, exampleIds?: readonly string[]): PublicVocabularyExample[] {
  const term = wordOrId.trim();
  const word = wordsById.get(term.startsWith('v-') ? term : `v-${term}`);
  if (!word) return [];
  return (exampleIds ?? word.examplePhraseIds)
    .map((id) => phrasesById.get(id))
    .filter((row): row is PublicVocabularyExample => row !== undefined && Boolean(row.hanzi));
}
