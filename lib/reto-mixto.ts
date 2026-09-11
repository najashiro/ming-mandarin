import type { LessonNumber } from '@/data/types';
import type { RetoMixtoConversation, RetoMixtoEntry, RetoMixtoMode } from '@/data/reto-mixto';

export type RetoMixtoQuestion = {
  id: string;
  entryId: string;
  mode: RetoMixtoMode;
  optionIds: string[];
  lessonIds: LessonNumber[];
  conversationId?: string;
  retryOf?: string;
};

const normalizeChinese = (value: string) => value.normalize('NFC').replace(/[\s，。！？、；：“”‘’.,!?;:'"()]/g, '');
const punctuationOnly = /^[\s，。！？、；：“”‘’…—,.!?;:'"()（）]+$/u;

export function isSilentRetoMixtoToken(token: string) {
  return !token.trim() || punctuationOnly.test(token);
}

export function primaryRetoMixtoHanziTarget(entry: Pick<RetoMixtoEntry, 'hanzi' | 'hanziTargets'>) {
  if (entry.hanziTargets.includes(entry.hanzi)) return entry.hanzi;
  return entry.hanziTargets[0];
}

function shuffle<T>(values: T[], random: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function sample<T>(values: T[], random: () => number) {
  return values[Math.floor(random() * values.length)];
}

function optionsForEntry(entry: RetoMixtoEntry, pool: RetoMixtoEntry[], mode: RetoMixtoMode, random: () => number) {
  const needsImages = mode === 'hanzi-image' || mode === 'audio-image';
  const eligible = pool.filter((candidate) => candidate.id !== entry.id && (!needsImages || candidate.imageable));
  const sameGroup = shuffle(eligible.filter((candidate) => candidate.distractorGroup === entry.distractorGroup), random);
  const sameCategory = shuffle(eligible.filter((candidate) => candidate.category === entry.category && !sameGroup.includes(candidate)), random);
  const sameLesson = shuffle(eligible.filter((candidate) => candidate.lessons.some((lesson) => entry.lessons.includes(lesson)) && !sameGroup.includes(candidate) && !sameCategory.includes(candidate)), random);
  const rest = shuffle(eligible.filter((candidate) => !sameGroup.includes(candidate) && !sameCategory.includes(candidate) && !sameLesson.includes(candidate)), random);
  return shuffle([entry, ...sameGroup, ...sameCategory, ...sameLesson, ...rest].slice(0, 4), random).map((candidate) => candidate.id);
}

function optionsForConversation(conversation: RetoMixtoConversation, conversations: RetoMixtoConversation[], entries: RetoMixtoEntry[], random: () => number) {
  const answer = entries.find((entry) => normalizeChinese(entry.hanzi) === normalizeChinese(conversation.answerHanzi));
  if (!answer) return [];
  const answerIds = conversations
    .filter((candidate) => candidate.id !== conversation.id)
    .map((candidate) => entries.find((entry) => normalizeChinese(entry.hanzi) === normalizeChinese(candidate.answerHanzi)))
    .filter((entry): entry is RetoMixtoEntry => Boolean(entry));
  const distinct = [...new Map(answerIds.map((entry) => [entry.id, entry])).values()];
  return shuffle([answer, ...shuffle(distinct, random)].slice(0, 4), random).map((entry) => entry.id);
}

export function buildRetoMixtoDeck(
  entries: RetoMixtoEntry[],
  conversations: RetoMixtoConversation[],
  lessons: LessonNumber[],
  total: number,
  random: () => number = Math.random,
): RetoMixtoQuestion[] {
  const selectedEntries = entries.filter((entry) => entry.playableModes.length > 0 && entry.lessons.some((lesson) => lessons.includes(lesson)));
  const selectedConversations = conversations.filter((conversation) => lessons.includes(conversation.lesson));
  const constructionConversations = selectedConversations.filter((conversation) => {
    const answer = selectedEntries.find((entry) => normalizeChinese(entry.hanzi) === normalizeChinese(conversation.answerHanzi));
    return (answer?.tokens?.length ?? 0) > 1;
  });
  const candidates = new Map<RetoMixtoMode, RetoMixtoEntry[]>([
    ['image-hanzi', selectedEntries.filter((entry) => entry.imageable && entry.playableModes.includes('image-hanzi'))],
    ['hanzi-image', selectedEntries.filter((entry) => entry.imageable && entry.playableModes.includes('hanzi-image'))],
    ['audio-hanzi', selectedEntries.filter((entry) => Boolean(entry.audioSrc) && entry.playableModes.includes('audio-hanzi'))],
    ['audio-image', selectedEntries.filter((entry) => entry.imageable && Boolean(entry.audioSrc) && entry.playableModes.includes('audio-image'))],
  ]);
  const modes = (['image-hanzi', 'hanzi-image', 'audio-hanzi', 'audio-image', 'conversation-response', 'construct-response'] as RetoMixtoMode[])
    .filter((mode) => mode === 'conversation-response'
      ? selectedConversations.length > 0
      : mode === 'construct-response'
        ? constructionConversations.length > 0
        : (candidates.get(mode)?.length ?? 0) > 0);
  const modeSequence: RetoMixtoMode[] = [];
  while (modeSequence.length < total) {
    const batch = shuffle(modes, random);
    if (modeSequence.length && batch.length > 1 && batch[0] === modeSequence.at(-1)) batch.push(batch.shift()!);
    modeSequence.push(...batch);
  }
  const deck: RetoMixtoQuestion[] = [];
  let previousEntryId = '';

  for (let index = 0; index < total; index += 1) {
    const mode = modeSequence[index];
    if (mode === 'conversation-response' || mode === 'construct-response') {
      const sourceConversations = mode === 'construct-response' ? constructionConversations : selectedConversations;
      const conversationPool = sourceConversations.filter((candidate) => {
        const entry = entries.find((item) => normalizeChinese(item.hanzi) === normalizeChinese(candidate.answerHanzi));
        return entry && entry.id !== previousEntryId;
      });
      const conversation = sample(conversationPool.length ? conversationPool : sourceConversations, random);
      const entry = entries.find((candidate) => normalizeChinese(candidate.hanzi) === normalizeChinese(conversation.answerHanzi));
      if (!entry) continue;
      let optionIds = mode === 'construct-response' ? [] : optionsForConversation(conversation, selectedConversations, selectedEntries, random);
      if (mode === 'conversation-response' && optionIds.length < 4) {
        const supplement = optionsForEntry(entry, selectedEntries.filter((candidate) => candidate.category === 'phrase'), 'audio-hanzi', random);
        optionIds = [...new Set([...optionIds, ...supplement])].slice(0, 4);
      }
      deck.push({ id: `${conversation.id}-${index}`, entryId: entry.id, mode, conversationId: conversation.id, optionIds, lessonIds: [...lessons] });
      previousEntryId = entry.id;
      continue;
    }

    const pool = candidates.get(mode) ?? [];
    const candidatePool = pool.filter((entry) => entry.id !== previousEntryId);
    const entry = sample(candidatePool.length ? candidatePool : pool, random);
    if (!entry) continue;
    const optionIds = optionsForEntry(entry, selectedEntries, mode, random);
    deck.push({ id: `rm-question-${index}-${entry.id}-${mode}`, entryId: entry.id, mode, optionIds, lessonIds: [...lessons] });
    previousEntryId = entry.id;
  }

  return deck;
}

export function retryQuestion(
  question: RetoMixtoQuestion,
  entries: RetoMixtoEntry[],
  conversations: RetoMixtoConversation[],
  random: () => number = Math.random,
): RetoMixtoQuestion {
  const entry = entries.find((candidate) => candidate.id === question.entryId);
  if (!entry) return { ...question, id: `${question.id}-retry`, retryOf: question.id };
  const conversation = conversations.find((candidate) => candidate.id === question.conversationId);
  const scopedEntries = entries.filter((candidate) => candidate.lessons.some((lesson) => question.lessonIds.includes(lesson)));
  const scopedConversations = conversations.filter((candidate) => question.lessonIds.includes(candidate.lesson));
  const modes = [...entry.playableModes];
  if (conversation && !modes.includes('conversation-response')) modes.push('conversation-response');
  const alternatives = modes.filter((mode) => mode !== question.mode);
  const mode = sample(alternatives.length ? alternatives : modes, random) ?? question.mode;
  const optionIds = mode === 'conversation-response' && conversation
    ? optionsForConversation(conversation, scopedConversations, scopedEntries, random)
    : mode === 'construct-response'
      ? []
      : optionsForEntry(entry, scopedEntries, mode, random);
  return { ...question, id: `${question.id}-retry`, mode, optionIds, retryOf: question.retryOf ?? question.id };
}

export function insertRetry(queue: RetoMixtoQuestion[], currentIndex: number, question: RetoMixtoQuestion, random: () => number = Math.random) {
  const offset = 3 + Math.floor(random() * 4);
  const position = Math.min(queue.length, currentIndex + offset + 1);
  const result = [...queue];
  result.splice(position, 0, question);
  return result;
}

export function isAcceptedConversationResponse(value: string, conversation: RetoMixtoConversation) {
  const normalized = normalizeChinese(value);
  return conversation.acceptedResponses.some((answer) => normalizeChinese(answer) === normalized);
}
