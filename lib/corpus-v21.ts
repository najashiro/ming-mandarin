import corpus from '@/data/corpus-v21-public.json';
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
  return {
    vocabulary: corpus.vocabulary.filter((row) => row.lessons.some((lesson) => lessons.has(lesson))),
    phrases: corpus.phrases.filter((row) => row.lessons.some((lesson) => lessons.has(lesson))),
    dialogues: corpus.dialogues.filter((row) => lessons.has(row.lesson)),
    radicals: corpus.radicals.filter((row) => row.lessons.some((lesson) => lessons.has(lesson))).map((row) => ({
      ...row, examples: row.examples.filter((example) => example.pinyin && example.lessons.some((lesson) => lessons.has(lesson))),
    })),
  };
}
