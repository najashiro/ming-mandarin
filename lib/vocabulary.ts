import corpus from '@/data/corpus-v21-public.json';
import type { CurriculumScope } from '@/data/types';
import { scopeDefinitions } from '@/seed/curriculum';

export type ActiveWord = (typeof corpus.vocabulary)[number];
export type VocabularyExample = { id: string; phraseId: string; hanzi: string; pinyin: string | null; spanish: string | null; lessons: number[] };
export type Selection = 'new' | 'supplementary' | 'context' | 'review' | 'pending';
export type ContentLevel = 'basic' | 'hard';
export const vocabularyCatalog: ActiveWord[] = corpus.vocabulary;
const contextRoles = new Set(['workbook_context', 'phrase_context', 'worksheet_sequence', 'numeral_in_context']);
const extensionRoles = new Set(['classroom_extension', 'classroom_expression', 'colloquial_classroom', 'proper_name', 'visual_label', 'supplementary_review']);
// Core review and workbook practice remain essential for existing Mix sessions.
// List membership is always evaluated on the same link as the selected lesson.
function essential(link: ActiveWord['curriculumLinks'][number]) {
  return link.list_type === 'new_vocabulary' || link.role === 'core_review' || link.role === 'workbook_context';
}
function included(link: ActiveWord['curriculumLinks'][number]) {
  return essential(link) || link.list_type === 'supplementary_vocabulary' || contextRoles.has(link.role) || extensionRoles.has(link.role);
}
export function selectVocabulary(scope: CurriculumScope, selection: Selection = 'review', level: ContentLevel = 'hard') {
  const lessons: readonly number[] = scopeDefinitions[scope].lessonIds;
  return vocabularyCatalog.filter(word => {
    const links = word.curriculumLinks.filter(link => lessons.includes(link.lesson));
    if (selection === 'pending') return links.length > 0 && !links.some(included);
    return links.some(link => {
      if (level === 'basic' && !essential(link)) return false;
      if (selection === 'new') return link.list_type === 'new_vocabulary';
      if (selection === 'supplementary') return link.list_type === 'supplementary_vocabulary';
      if (selection === 'context') return contextRoles.has(link.role);
      return included(link);
    });
  });
}

// Presentation partition, built once from the unchanged documentary eligibility.
export type VocabularyLesson = 1 | 2 | 3;
const vocabularyLessonById = new Map<string, VocabularyLesson>();
const exclusiveLessons: Record<VocabularyLesson, ActiveWord[]> = { 1: [], 2: [], 3: [] };
for (const lesson of [1, 2, 3] as const) {
  for (const word of selectVocabulary(`l${lesson}`)) {
    if (vocabularyLessonById.has(word.id)) continue;
    vocabularyLessonById.set(word.id, lesson);
    exclusiveLessons[lesson].push(word);
  }
}
export const accumulatedVocabulary = [...exclusiveLessons[1], ...exclusiveLessons[2], ...exclusiveLessons[3]];
export function getVocabularyLesson(word: Pick<ActiveWord, 'id'>): VocabularyLesson | undefined {
  return vocabularyLessonById.get(word.id);
}
const vocabularySets: Record<CurriculumScope, ActiveWord[]> = {
  l1: exclusiveLessons[1], l2: exclusiveLessons[2], l3: exclusiveLessons[3],
  'l1-l2': [...exclusiveLessons[1], ...exclusiveLessons[2]], 'l1-l2-l3': accumulatedVocabulary,
};
const essentialSets = Object.fromEntries(Object.entries(vocabularySets).map(([scope, words]) => {
  const ids = new Set(selectVocabulary(scope as CurriculumScope, 'review', 'basic').map(word => word.id));
  return [scope, words.filter(word => ids.has(word.id))];
})) as Record<CurriculumScope, ActiveWord[]>;
export function getVocabularySet(scope: CurriculumScope, level: ContentLevel = 'hard'): ActiveWord[] {
  return (level === 'basic' ? essentialSets : vocabularySets)[scope];
}
export function searchGlobalVocabulary(query: string) {
  return searchVocabulary(accumulatedVocabulary, query);
}

// Positive examples only: a premise, transformation or open exercise is not an answer.
const exampleKinds = new Set(['example', 'grammar_example', 'dialogue_turn', 'dialogue_example', 'reading', 'writing_model', 'key_phrase', 'question_answer_printed', 'translation_answer_printed']);
const examplesByWord = new Map<string, VocabularyExample[]>();
for (const phrase of corpus.phrases) {
  const lessons = [...new Set(phrase.curriculumLinks.filter(link => exampleKinds.has(link.kind)).map(link => link.lesson))];
  if (!lessons.length || /[_＿□…]|\.{3}|[（(]\s*[)）]/u.test(phrase.hanzi) || phrase.kinds.some(kind => ['counterexample', 'distractor', 'exercise_premise', 'true_false_premise', 'grammar_transformation', 'dialogue_exercise'].includes(kind))) continue;
  const example = { id: phrase.id, phraseId: phrase.id, hanzi: phrase.hanzi, pinyin: phrase.pinyin, spanish: phrase.spanish, lessons };
  for (const id of phrase.vocabIds) {
    const examples = examplesByWord.get(id) ?? [];
    examples.push(example);
    examplesByWord.set(id, examples);
  }
}
// No selected/canonical lesson is involved in learner examples.
export function examplesForWord(word: ActiveWord) {
  return [...(examplesByWord.get(word.id) ?? [])].sort((a, b) =>
    Number(Boolean(b.pinyin)) - Number(Boolean(a.pinyin)) ||
    Number(a.hanzi.length > 30) - Number(b.hanzi.length > 30) ||
    Number(Boolean(b.spanish)) - Number(Boolean(a.spanish)) ||
    a.hanzi.length - b.hanzi.length || a.id.localeCompare(b.id));
}
// Documentary reporting only; the learner UI calls examplesForWord instead.
export function examplesForScope(word: ActiveWord, scope: CurriculumScope) {
  const lessons: readonly number[] = scopeDefinitions[scope].lessonIds;
  return examplesForWord(word).filter(example => example.lessons.some(lesson => lessons.includes(lesson)));
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
