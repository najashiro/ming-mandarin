import data from '@/data/lesson5-public.json';
import type { CharacterEntry, Exercise, GrammarPoint, HanziUnitDefinition, SentenceEntry, SourceRef, VocabularyEntry } from '@/data/types';

export const lesson5Units = data.units as HanziUnitDefinition[];
export const lesson5Characters = data.characters as CharacterEntry[];
export const lesson5Grammar = data.grammar as GrammarPoint[];
export const lesson5Vocabulary: VocabularyEntry[] = data.vocabulary.map(word => ({
  id: word.id, hanzi: word.hanzi, pinyin: word.pinyin, translation: word.spanish,
  grammaticalType: '', category: word.roles.includes('core_textbook') ? 'core' : word.roles.includes('supplementary_textbook') ? 'supplementary' : 'teacher_supplement',
  isCore: word.roles.includes('core_textbook'), source: (data.vocabularySources as Record<string, SourceRef>)[word.id],
}));
export const lesson5Sentences = data.sentences as SentenceEntry[];
export const lesson5Exercises: Exercise[] = lesson5Vocabulary.flatMap(word => [
  { id: `l5-pinyin-${word.id}`, type: 'pinyin', prompt: `Escribe el pinyin con tono de ${word.hanzi}.`,
    answer: word.pinyin, explanation: `${word.hanzi} · ${word.pinyin} · ${word.translation}`,
    rule: 'Conserva las marcas tonales.', itemId: word.id, dimension: 'pinyin', difficulty: 3, source: word.source },
  { id: `l5-meaning-${word.id}`, type: 'choice', prompt: `¿Qué significa ${word.hanzi}?`,
    answer: word.translation, options: [word.translation, ...[...new Set(lesson5Vocabulary.filter(other => other.translation !== word.translation).map(other => other.translation))].slice(0, 3)],
    explanation: `${word.hanzi} · ${word.pinyin} · ${word.translation}`, rule: 'Recupera el significado.',
    itemId: word.id, dimension: 'meaning', difficulty: 1, source: word.source },
]);
lesson5Exercises.push(...lesson5Sentences.map((sentence): Exercise => ({
  id: `l5-order-${sentence.id}`, type: 'order', prompt: `Escribe en chino: ${sentence.translation}`,
  answer: sentence.tokens.join(''), options: [...sentence.tokens.slice(1), sentence.tokens[0]],
  explanation: `${sentence.hanzi} · ${sentence.pinyin}`, rule: 'Reconstruye la frase estudiada.',
  itemId: sentence.id, dimension: 'grammar', difficulty: 2, source: sentence.source,
})));
