import lesson7 from './lesson7-public.json';
import type { RetoMixtoEntry, RetoMixtoConversation } from './reto-mixto';
import type { SourceRef } from './types';
import { audioForMandarinText } from '@/lib/mandarin-audio';

// Retrieval practice uses complete book turns; it is not an official answer key.
export const lesson7Conversations = lesson7.conversationPairs.map(pair => {
  const dialogue = lesson7.dialogues.find(row => row.id === pair.dialogueId)!;
  const source = lesson7.vocabularySources['v-售货员'] as SourceRef;
  const entry = (turn: number): RetoMixtoEntry => {
    const row = dialogue.turns[turn - 1];
    return { id: `rm-l7-dialogue-${turn}`, hanzi: row.hanzi, pinyin: row.pinyin, meaningEs: row.spanish,
      lesson: 7, lessons: [7], sources: [source], sourceTypes: ['textbook'], category: 'phrase',
      imageable: false, audioSrc: audioForMandarinText(row.hanzi, row.pinyin) ?? '', hanziTargets: [],
      distractorGroup: 'l7-dialogue', playableModes: ['conversation-response'],
      tokens: lesson7.sentences.find(sentence => sentence.hanzi === row.hanzi)?.tokens };
  };
  const prompt = entry(pair.question), answer = entry(pair.answer);
  const definition: RetoMixtoConversation = { id: `rm-conv-l7-${pair.question}`, lesson: 7,
    promptHanzi: prompt.hanzi, answerHanzi: answer.hanzi, acceptedResponses: [], source };
  return { ...definition, prompt, answer };
});
