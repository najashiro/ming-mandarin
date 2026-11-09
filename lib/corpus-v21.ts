import corpus, { lesson4, lesson5, lesson6 } from '@/lib/active-corpus';
import type { CurriculumScope } from '@/data/types';
import { scopeDefinitions } from '@/seed/curriculum';

export const corpusVersion = corpus.version;
export const corpusFingerprint = corpus.fingerprint;
export type PublicVocabulary = (typeof corpus.vocabulary)[number];
export type PublicPhrase = (typeof corpus.phrases)[number];
export type PublicDialogue = (typeof corpus.dialogues)[number];
export type PublicRadical = (typeof corpus.radicals)[number];

export function publicCorpusForScope(scope: CurriculumScope) {
  const lessons = new Set<number>(scopeDefinitions[scope].lessonIds);
  const selectedVocabulary = new Map(corpus.vocabulary.filter(row => row.curriculumLinks.some(link => lessons.has(link.lesson))).map(row => [row.id, row]));
  for (const extension of [...(lessons.has(4) ? [lesson4] : []), ...(lessons.has(5) ? [lesson5] : []), ...(lessons.has(6) ? [lesson6] : [])]) {
    for (const word of extension.vocabulary) selectedVocabulary.set(word.id, word as PublicVocabulary);
  }
  return {
    vocabulary: [...selectedVocabulary.values()],
    phrases: corpus.phrases.filter((row) => row.lessons.some((lesson) => lessons.has(lesson))),
    dialogues: corpus.dialogues.filter((row) => lessons.has(row.lesson)),
    radicals: corpus.radicals.filter((row) => row.lessons.some((lesson) => lessons.has(lesson))).map((row) => ({
      ...row, examples: row.examples.filter((example) => example.pinyin && example.lessons.some((lesson) => lessons.has(lesson))),
    })),
  };
}
