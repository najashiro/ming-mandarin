import lesson6 from './lesson6-public.json';
import type { RetoMixtoEntry, RetoMixtoConversation } from './reto-mixto';
import type { SourceRef } from './types';
import { audioForMandarinText } from '@/lib/mandarin-audio';

// These are retrieval activities from the canonical book, not workbook answer keys.
const dialogue = lesson6.dialogues[0];
const source = lesson6.vocabularySources['v-食堂'] as SourceRef;
function entry(turn: number): RetoMixtoEntry {
  const row = dialogue.turns[turn - 1];
  return { id: `rm-l6-dialogue-${turn}`, hanzi: row.hanzi, pinyin: row.pinyin, meaningEs: row.spanish,
    lesson: 6, lessons: [6], sources: [source], sourceTypes: ['textbook'], category: 'phrase',
    imageable: false, audioSrc: audioForMandarinText(row.hanzi, row.pinyin) ?? '', hanziTargets: [],
    distractorGroup: 'l6-dialogue', playableModes: ['conversation-response'],
    tokens: lesson6.sentences.find(s => s.hanzi === row.hanzi)?.tokens };
}
export const lesson6Conversations = [[1,2],[7,8],[9,10],[13,14]].map(([question, response]) => {
  const prompt = entry(question), answer = entry(response);
  const definition: RetoMixtoConversation = { id: `rm-conv-l6-${question}`, lesson: 6,
    promptHanzi: prompt.hanzi, answerHanzi: answer.hanzi, acceptedResponses: [], source };
  return { ...definition, prompt, answer };
});

