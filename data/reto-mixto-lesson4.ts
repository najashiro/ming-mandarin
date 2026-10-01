import { lesson4Vocabulary, lesson4Sentences } from '@/seed/lesson4';
import { retoMixtoCorpus, type RetoMixtoEntry } from '@/data/reto-mixto';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { canonicalCharacters } from '@/seed/characters';
import type { CurriculumScope, LessonNumber } from '@/data/types';
import { getVocabularySet } from '@/lib/vocabulary';
import { imageForWord, type VocabularyMediaEntry } from '@/lib/vocabulary-media';

const known = new Set(canonicalCharacters.map(character => character.hanzi));
export const retoMixtoLesson4: RetoMixtoEntry[] = lesson4Vocabulary.map(word => ({
  id: `rm-l4-${word.id}`, hanzi: word.hanzi, pinyin: word.pinyin, meaningEs: word.translation,
  vocabularyId: word.id,
  lesson: 4, lessons: [4], sources: [word.source], sourceTypes: [word.source.type],
  category: word.isCore ? 'core' : 'supplementary', imageable: false,
  audioSrc: audioForMandarinText(word.hanzi, word.pinyin) ?? '',
  hanziTargets: [...word.hanzi].filter(character => known.has(character)),
  distractorGroup: 'l4-vocabulary', playableModes: ['audio-hanzi'],
}));
const sentenceEntries: RetoMixtoEntry[] = lesson4Sentences.map(sentence => ({
  id: `rm-l4-${sentence.id}`, hanzi: sentence.hanzi, pinyin: sentence.pinyin, meaningEs: sentence.translation,
  lesson: 4, lessons: [4], sources: [sentence.source], sourceTypes: [sentence.source.type], category: 'phrase',
  imageable: false, audioSrc: audioForMandarinText(sentence.hanzi, sentence.pinyin) ?? '',
  hanziTargets: [...sentence.hanzi].filter(character => known.has(character)),
  distractorGroup: 'l4-phrase', playableModes: ['construct-response'], tokens: sentence.tokens,
}));

// Only consume current server-resolved approvals. Empty media hides legacy art too.
export function retoMixtoForScope(scope: CurriculumScope, media: readonly VocabularyMediaEntry[] = []): RetoMixtoEntry[] {
  const words = getVocabularySet(scope);
  const source = scope === 'l4' ? [...retoMixtoLesson4, ...sentenceEntries]
    : scope === 'l1-l2-l3-l4' ? [...retoMixtoCorpus, ...retoMixtoLesson4, ...sentenceEntries] : retoMixtoCorpus;
  const entries = new Map<string, RetoMixtoEntry>();
  for (const entry of source) {
    // Never merge contextual senses/pronunciations (e.g. 只) just by Hanzi.
    const key = `${entry.hanzi}:${entry.pinyin}:${entry.meaningEs}`;
    const previous = entries.get(key);
    entries.set(key, previous ? { ...previous, lessons: [...new Set([...previous.lessons, ...entry.lessons])] } : { ...entry });
  }
  for (const word of words) {
    const previous = [...entries.values()].find(entry => entry.category !== 'phrase' && entry.hanzi === word.hanzi && entry.pinyin === word.pinyin);
    if (previous) { previous.vocabularyId = word.id; continue; }
    const image = imageForWord(word.id, media);
    if (!image) continue;
    const lessons = word.lessons.filter((lesson): lesson is LessonNumber => [1,2,3,4].includes(lesson));
    entries.set(`vocab:${word.id}`, {
      id: `rm-vocab-${word.id}`, vocabularyId: word.id, hanzi: word.hanzi, pinyin: word.pinyin, meaningEs: word.spanish,
      lesson: lessons[0], lessons, sources: [], sourceTypes: [], category: 'supplementary', imageable: false,
      audioSrc: audioForMandarinText(word.hanzi, word.pinyin) ?? '', hanziTargets: [...word.hanzi].filter(character => known.has(character)),
      distractorGroup: image.visualMode, playableModes: [],
    });
  }
  return [...entries.values()].map(entry => {
    const word = words.find(word => word.id === entry.vocabularyId || (word.hanzi === entry.hanzi && word.pinyin === entry.pinyin));
    const image = word ? imageForWord(word.id, media) : undefined;
    const imageable = Boolean(image?.imageQuizEligible && entry.category !== 'example_only');
    const playableModes: RetoMixtoEntry['playableModes'] = entry.playableModes.filter(mode => mode === 'construct-response');
    if (entry.audioSrc && entry.category !== 'example_only') playableModes.push('audio-hanzi');
    if (imageable) {
      playableModes.push('image-hanzi', 'hanzi-image');
      if (entry.audioSrc) playableModes.push('audio-image');
    }
    return { ...entry, vocabularyId: word?.id, imageable, imageSrc: imageable ? image?.src : undefined,
      supportImageSrc: image?.src, familyTarget: undefined, playableModes };
  });
}
