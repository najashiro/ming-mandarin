import lesson5 from './lesson5-public.json';
import type { RetoMixtoEntry, RetoMixtoConversation } from './reto-mixto';
import type { SourceRef } from './types';
import { audioForMandarinText } from '@/lib/mandarin-audio';

// These are retrieval activities from the canonical book, not workbook answer keys.
const dialogue = lesson5.dialogues[0];
const source = lesson5.vocabularySources['v-生日'] as SourceRef;
function entry(turn: number): RetoMixtoEntry {
  const row = dialogue.turns[turn - 1];
  return { id: `rm-l5-dialogue-${turn}`, hanzi: row.hanzi, pinyin: row.pinyin, meaningEs: row.spanish,
    lesson: 5, lessons: [5], sources: [source], sourceTypes: ['textbook'], category: 'phrase',
    imageable: false, audioSrc: audioForMandarinText(row.hanzi, row.pinyin) ?? '', hanziTargets: [],
    distractorGroup: 'l5-dialogue', playableModes: ['conversation-response'],
    tokens: lesson5.sentences.find(s => s.hanzi === row.hanzi)?.tokens };
}
export const lesson5Conversations = [[4,5],[7,8],[9,10],[12,13]].map(([question, response]) => {
  const prompt = entry(question), answer = entry(response);
  const definition: RetoMixtoConversation = { id: `rm-conv-l5-${question}`, lesson: 5,
    promptHanzi: prompt.hanzi, answerHanzi: answer.hanzi, acceptedResponses: [], source };
  return { ...definition, prompt, answer };
});

const find = (hanzi: string) => {
  const row = [...lesson5.phrases, ...lesson5.vocabulary].find(row => row.hanzi === hanzi);
  if (!row) throw new Error(`Missing L5 birthday reference: ${hanzi}`);
  return row;
};
const scenarios = [
  ['date', 'La fiesta de Lin Qiang', '25 de octubre', 'Di la fecha del cumpleaños del diálogo.', '十月二十五号。', ['十月二十七号。','十一月二十五号。'], 'En chino se dice primero el mes y después el día. El libro indica el 25 de octubre.'],
  ['birthday', 'Tu fecha de cumpleaños', '23 de agosto', 'Usa la respuesta completa del ejemplo para decir tu cumpleaños.', '我的生日是八月二十三号。', ['我的生日是三月二十八号。','我的生日是八月十三号。'], '八月 es agosto; 二十三号 es el día 23.'],
  ['tomorrow', 'Prepara la agenda', 'Mañana · 31 de octubre', 'Di la fecha de mañana con el modelo del cuaderno.', '明天十月三十一号。', ['昨天十月三十一号。','明天十一月三十号。'], '明天 precede al mes y al día. No hace falta 是 en este modelo.'],
  ['gift', 'El regalo de Lin Na', 'Un pastel para él', 'Reproduce la frase estudiada para entregar el regalo.', '我送他一个生日蛋糕。', ['他送我一个生日蛋糕。','我送他两盒巧克力。'], '送 va seguido de la persona que recibe y después del regalo.'],
  ['wish', 'Llega el momento de felicitar', '¡Feliz cumpleaños!', 'Elige la felicitación completa con 祝.', '祝你生日快乐！', ['你今年多大？','你星期日有时间吗？'], '祝 introduce el deseo; 你 es la persona a quien felicitas.'],
  ['noodles', 'La comida de cumpleaños', 'Dentro de un rato · todos · tallarines', 'Reproduce el anuncio de la comida.', '一会儿大家吃寿面。', ['昨天大家吃寿面。','一会儿我吃蛋糕。'], '一会儿 indica dentro de un rato y 大家 incluye a todos.'],
  ['toast', 'Termina con un brindis', '¡Vamos a brindar!', 'Invita al grupo a brindar.', '来，咱们干杯！', ['来，我送你礼物！','我来介绍一下。'], '咱们 incluye al interlocutor; 干杯 se pronuncia gānbēi.'],
  ['name', 'Descubre quién cumple años', 'El hermano de Lin Na', 'Reproduce el descubrimiento final del diálogo.', '他就是我哥哥！', ['他是我弟弟。','他不是我哥哥。'], '就 enfatiza la identificación: ¡es precisamente mi hermano mayor!'],
] as const;
export const birthdayRounds = scenarios.map(([id,title,clue,instruction,hanzi,distractors,explanation]) => {
  const row = find(hanzi);
  return { id, title, clue, instruction, hanzi, pinyin: row.pinyin, spanish: row.spanish,
    choices: [hanzi, ...distractors], explanation,
    tokens: lesson5.sentences.find(s => s.hanzi === hanzi)?.tokens ?? [hanzi.replace(/[。！]/g, '')] };
});
