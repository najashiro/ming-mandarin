import geographyMedia from '@/data/lessons123-geography-media.json';
import completionMedia from '@/data/corpus-completion-media.json';
import completionDiagrams from '@/data/corpus-completion-diagrams-media.json';
import pedagogyMedia from '@/data/lessons123-pedagogy-media.json';
import contextMedia from '@/data/lessons123-context-media.json';
import generatedMedia from '@/data/lessons123-generated-media.json';
import lessons123Media from '@/data/lessons123-media.json';
import lesson5Media from '@/data/lesson5-media.json';
import lesson7Media from '@/data/lesson7-media.json';
import lesson4Media from '@/data/lesson4-media.json';
import media from '@/data/vocabulary-media.json';
import type { ActiveWord } from './vocabulary';
type LegacyPracticeType = 'hanzi' | 'image' | 'context';
export type VocabularyMediaEntry = (typeof media)[number] & { curriculumWordId?: string };
export const vocabularyMedia: VocabularyMediaEntry[] = [...new Map([...media, ...lesson4Media, ...lesson5Media, ...lessons123Media, ...contextMedia, ...generatedMedia, ...pedagogyMedia, ...geographyMedia, ...completionMedia, ...completionDiagrams, ...lesson7Media].map(entry => [entry.wordId, entry])).values()];
const visibleImageStatuses = new Set(['approved']);
export function imageForWord(id: string, catalog: readonly VocabularyMediaEntry[] = vocabularyMedia) {
  return catalog.find(m => m.wordId === id && visibleImageStatuses.has(m.status) && m.src);
}
/** Lesson-local senses cannot reuse an illustration reviewed for another meaning. */
export function imageForVocabularyWord(word: Pick<ActiveWord, 'id' | 'imageReuseBlocked' | 'spanish'>, catalog: readonly VocabularyMediaEntry[] = vocabularyMedia) {
  const base = imageForWord(word.id, catalog);
  if (!word.imageReuseBlocked) return base;
  return catalog.find(entry => entry.curriculumWordId === word.id && entry.sense === word.spanish
    && visibleImageStatuses.has(entry.status) && entry.src) ?? (base?.sense === word.spanish ? base : undefined);
}
// Reviewed against SRC-WB-03 p9, activity 14/4. The Spanish hint disambiguates
// the open question; this is retrieval of the supplied gloss, not its answer key.
export const vocabularyContexts = [{ wordId: 'v-宠物', lesson: 3, phraseId: 'PH-66ed84625f85675a', clue: '你们家有____吗？', hint: 'Completa con la palabra que significa «mascota».', status: 'approved', review: 'Codex local 2026-09-25: palabra, sentido y hueco cotejados con el testigo; consigna editorial Míng.' }];
export function contextForWord(id: string) { return vocabularyContexts.find(c => c.wordId === id && c.status === 'approved'); }
export function availablePracticeTypes(word: ActiveWord, catalog: readonly VocabularyMediaEntry[] = vocabularyMedia): LegacyPracticeType[] {
  return ['hanzi', ...(word.visual_ming.image_quiz_eligible && imageForVocabularyWord(word, catalog)?.imageQuizEligible ? ['image' as const] : []), ...(contextForWord(word.id) ? ['context' as const] : [])];
}
