import media from '@/data/vocabulary-media.json';
import type { ActiveWord } from './vocabulary';
import type { PracticeType } from './vocabulary-review';
export const vocabularyMedia = media;
export function imageForWord(id: string) { return media.find(m => m.wordId === id && m.status === 'approved' && m.src); }
// Reviewed against SRC-WB-03 p9, activity 14/4. The Spanish hint disambiguates
// the open question; this is retrieval of the supplied gloss, not its answer key.
export const vocabularyContexts = [{ wordId: 'v-宠物', lesson: 3, phraseId: 'PH-66ed84625f85675a', clue: '你们家有____吗？', hint: 'Completa con la palabra que significa «mascota».', status: 'approved', review: 'Codex local 2026-09-25: palabra, sentido y hueco cotejados con el testigo; consigna editorial Míng.' }];
export function contextForWord(id: string) { return vocabularyContexts.find(c => c.wordId === id && c.status === 'approved'); }
export function availablePracticeTypes(word: ActiveWord): PracticeType[] {
  return ['hanzi', ...(imageForWord(word.id) ? ['image' as const] : []), ...(contextForWord(word.id) ? ['context' as const] : [])];
}
