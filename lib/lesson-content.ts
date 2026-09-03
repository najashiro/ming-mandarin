import type { ListeningEntry, SentenceEntry, VocabularyEntry } from '@/data/types';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { sentences } from '@/seed/sentences';
import { vocabulary } from '@/seed/vocabulary';
import type { CurriculumScope } from '@/data/types';
import { getCurriculum } from '@/seed/curriculum';

export type VocabularyModuleId = 'name' | 'states';

const vocabularyIds: Record<VocabularyModuleId, string[]> = {
  name: ['v-你', 'v-我', 'v-叫', 'v-请问', 'v-什么', 'v-名字', 'v-姓', 'v-认识', 'v-高兴'],
  states: ['v-好', 'v-忙', 'v-困', 'v-渴', 'v-饿', 'v-累', 'v-还行', 'v-马马虎虎'],
};

const greetingIds = ['s-nihao', 's-ninhao', 's-nimenhao'];

export function getVocabularyForModule(moduleId: VocabularyModuleId): VocabularyEntry[] {
  const allowed = new Set(vocabularyIds[moduleId]);
  return vocabulary.filter((entry) => allowed.has(entry.id));
}

export function getGreetingSentences(): SentenceEntry[] {
  const allowed = new Set(greetingIds);
  return sentences.filter((sentence) => allowed.has(sentence.id));
}

export function getListeningEntriesForLessons(lessonIds: number[]): ListeningEntry[] {
  if (!lessonIds.includes(1)) return [];
  return vocabulary.flatMap((entry) => {
    const audioSrc = audioForMandarinText(entry.hanzi);
    const hasHanzi = /[\u3400-\u9fff]/.test(entry.hanzi);
    if (!audioSrc || !hasHanzi || !entry.pinyin.trim() || !entry.translation.trim()) return [];
    return [{
      id: entry.id,
      lessonId: 1,
      hanzi: entry.hanzi,
      pinyin: entry.pinyin,
      translation: entry.translation,
      audioSrc,
    }];
  });
}

export function getListeningEntriesForScope(scope: CurriculumScope): ListeningEntry[] {
  const data = getCurriculum(scope);
  const lessonId = data.definition.lessonIds.at(-1) ?? 1;
  return data.vocabulary.flatMap((entry) => {
    const audioSrc = audioForMandarinText(entry.hanzi);
    if (!audioSrc || !/[\u3400-\u9fff]/.test(entry.hanzi)) return [];
    return [{ id: entry.id, lessonId, hanzi: entry.hanzi, pinyin: entry.pinyin, translation: entry.translation, audioSrc }];
  });
}
