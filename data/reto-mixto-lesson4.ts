import { lesson4Vocabulary } from '@/seed/lesson4';
import { retoMixtoCorpus, type RetoMixtoEntry } from '@/data/reto-mixto';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { canonicalCharacters } from '@/seed/characters';
import type { CurriculumScope } from '@/data/types';

const known = new Set(canonicalCharacters.map(character => character.hanzi));
export const retoMixtoLesson4: RetoMixtoEntry[] = lesson4Vocabulary.map(word => ({
  id: `rm-l4-${word.id}`, hanzi: word.hanzi, pinyin: word.pinyin, meaningEs: word.translation,
  lesson: 4, lessons: [4], sources: [word.source], sourceTypes: [word.source.type],
  category: word.isCore ? 'core' : 'supplementary', imageable: false,
  audioSrc: audioForMandarinText(word.hanzi, word.pinyin) ?? '',
  hanziTargets: [...word.hanzi].filter(character => known.has(character)),
  distractorGroup: 'l4-vocabulary', playableModes: ['audio-hanzi'],
}));
export function retoMixtoForScope(scope: CurriculumScope) {
  if (scope === 'l4') return retoMixtoLesson4;
  if (scope === 'l1-l2-l3-l4') return [...retoMixtoCorpus, ...retoMixtoLesson4.filter(word => !retoMixtoCorpus.some(previous => previous.hanzi === word.hanzi))];
  return retoMixtoCorpus;
}
