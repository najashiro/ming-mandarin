import corpus from '@/data/corpus-v21-public.json';
import type { CurriculumScope } from '@/data/types';
import { scopeDefinitions } from '@/seed/curriculum';

export type Occurrence = { source: string; kind: string; lesson: number | null; page: number; printedPage: number | null; role: string; section: string | null; item: number | null; evidence: string; reading: string | null; meaning: string | null };
export type VocabularyExample = { id: string; phraseId: string; hanzi: string; pinyin: string | null; spanish: string | null; status: string; source: string; kind: string; lesson: number | null; page: number; printedPage: number | null };
export type ActiveWord = { id: string; hanzi: string; pinyin: string; spanish: string; lessons: number[]; roles: string[]; occurrences: Occurrence[]; examples: VocabularyExample[] };
export type Selection = 'new' | 'context' | 'review' | 'pending';
export type ContentLevel = 'basic' | 'hard';
export const vocabularyCatalog = corpus.vocabulary as ActiveWord[];
const contextRoles = new Set(['workbook_context', 'phrase_context', 'core_review', 'numeral_in_context']);
const extensionRoles = new Set(['supplementary_textbook', 'supplementary_review', 'classroom_extension', 'classroom_expression', 'colloquial_classroom', 'proper_name', 'visual_label', 'numeral_support']);

export function selectVocabulary(scope: CurriculumScope, selection: Selection = 'review', level: ContentLevel = 'hard', source = '') {
  const lessons: readonly number[] = scopeDefinitions[scope].lessonIds;
  return vocabularyCatalog.filter(word => {
    if (selection === 'pending') return word.occurrences.some(o => o.lesson && lessons.includes(o.lesson) && (!source || o.kind === source)) && !word.occurrences.some(o => o.lesson && lessons.includes(o.lesson) && (o.role === 'core_textbook' || contextRoles.has(o.role) || extensionRoles.has(o.role)));
    return word.occurrences.some(o => {
    if (!o.lesson || !lessons.includes(o.lesson) || (source && o.kind !== source)) return false;
    const essential = o.role === 'core_textbook' || o.role === 'core_review' || o.role === 'workbook_context' || (contextRoles.has(o.role) && ['textbook', 'workbook'].includes(o.kind));
    if (level === 'basic' && !essential) return false;
    if (selection === 'new') return o.role === 'core_textbook';
    if (selection === 'context') return contextRoles.has(o.role);
    return essential || contextRoles.has(o.role) || extensionRoles.has(o.role);
    });
  });
}

/** Keep ü distinct from u; v/u: are search aliases only. Never change display pinyin. */
export function searchKey(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/u\u0308/g, 'v')
    .replace(/u:/g, 'v').replace(/[\u0300-\u036f]/g, '')
    .replace(/[1-5\s'’ʼ‘·-]/g, '').normalize('NFC');
}
export function searchVocabulary(words: ActiveWord[], query: string) {
  const key = searchKey(query);
  if (!key) return words;
  return words.map(word => {
    const keys = [word.hanzi, word.pinyin, word.spanish].map(searchKey);
    const rank = keys.some(k => k === key) ? 0 : keys.some(k => k.startsWith(key)) ? 1 : keys.some(k => k.includes(key)) ? 2 : 3;
    return { word, rank };
  }).filter(r => r.rank < 3).sort((a, b) => a.rank - b.rank).map(r => r.word);
}
export function examplesForScope(word: ActiveWord, scope: CurriculumScope) {
  const lessons: readonly number[] = scopeDefinitions[scope].lessonIds;
  return word.examples.filter(e => e.lesson && lessons.includes(e.lesson))
    .sort((a, b) => Number(Boolean(b.pinyin && b.spanish)) - Number(Boolean(a.pinyin && a.spanish)));
}
export function sourceLabel(kind: string) {
  return ({ textbook: 'Libro', workbook: 'Cuaderno', class_presentation: 'Presentación', worksheet: 'Hoja Hanzi' } as Record<string, string>)[kind] ?? kind;
}
