import type { Exercise } from '@/data/types';
import { lesson1Characters } from './characters';
import { coreVocabulary, vocabulary } from './vocabulary';

const textbook = (pdfPage: number, printedPage: number) => ({
  type: 'textbook' as const,
  file: 'Libro Basico 1 - Lección 1 y 2 课本内容.pdf',
  pdfPage,
  printedPage,
});

const workbook = (pdfPage: number) => ({
  type: 'workbook' as const,
  file: 'Libro de Ejercicios Basico 1 - Lección 1 -2.pdf',
  pdfPage,
});

const distractors = (index: number, field: 'translation' | 'hanzi') => {
  const pool = coreVocabulary.filter((_, itemIndex) => itemIndex !== index);
  return [1, 7, 13].map((offset) => pool[(index + offset) % pool.length][field].split(';')[0]);
};

const meaningExercises: Exercise[] = coreVocabulary.map((word, index) => ({
  id: `meaning-${word.id}`,
  type: 'choice',
  prompt: `¿Qué significa ${word.hanzi}?`,
  answer: word.translation.split(';')[0],
  options: [word.translation.split(';')[0], ...distractors(index, 'translation')],
  explanation: `${word.hanzi} se lee ${word.pinyin} y aquí significa “${word.translation}”.`,
  rule: 'Recupera primero el significado sin mirar el pinyin.',
  itemId: word.id,
  dimension: 'meaning',
  difficulty: 1,
  source: word.source,
}));

const pinyinExercises: Exercise[] = coreVocabulary.map((word) => ({
  id: `pinyin-${word.id}`,
  type: 'pinyin',
  prompt: `Escribe el pinyin con tono de ${word.hanzi}.`,
  answer: word.pinyin,
  explanation: `${word.hanzi} se escribe ${word.pinyin}.`,
  rule: 'La marca tonal forma parte de la respuesta.',
  itemId: word.id,
  dimension: 'pinyin',
  difficulty: 3,
  source: word.source,
}));

const manualExercises: Exercise[] = [
  {
    id: 'order-recent', type: 'order', prompt: 'Ordena: 最近 / 你 / 怎么样', answer: '你最近怎么样',
    options: ['最近', '你', '怎么样'], explanation: 'El sujeto abre la oración y 最近 aparece antes de 怎么样。',
    rule: 'Sujeto + tiempo/adverbio + predicado.', itemId: 'g-order', dimension: 'grammar', difficulty: 2, source: textbook(53, 52),
  },
  {
    id: 'order-ye', type: 'order', prompt: 'Ordena: 也 / 他 / 很 / 好', answer: '他也很好',
    options: ['也', '他', '很', '好'], explanation: '也 va después del sujeto y antes del predicado.',
    rule: 'Sujeto + 也 + predicado.', itemId: 'g-ye', dimension: 'grammar', difficulty: 2, source: textbook(52, 51),
  },
  {
    id: 'order-bu-tai', type: 'order', prompt: 'Ordena: 忙 / 我 / 不 / 太', answer: '我不太忙',
    options: ['忙', '我', '不', '太'], explanation: '不太 forma una unidad delante del adjetivo.',
    rule: 'Sujeto + 不太 + adjetivo.', itemId: 'g-bu-tai', dimension: 'grammar', difficulty: 2, source: textbook(51, 50),
  },
  {
    id: 'ma-transform', type: 'pinyin', prompt: 'Convierte en pregunta de sí/no: 他很忙。', answer: '他忙吗',
    explanation: 'Al formar la pregunta se añade 吗 y generalmente se elimina 很.',
    rule: 'Predicado adjetival + 吗；很 se elimina en la pregunta.', itemId: 'g-ma', dimension: 'grammar', difficulty: 3, source: textbook(50, 49),
  },
  {
    id: 'find-error-ye', type: 'pinyin', prompt: 'Corrige: 也我很好。', answer: '我也很好',
    explanation: 'También se refiere al sujeto 我, por eso 也 va después de 我.',
    rule: 'Sujeto + 也 + predicado.', itemId: 'g-ye', dimension: 'grammar', difficulty: 3, source: textbook(52, 51),
  },
  {
    id: 'find-error-ma', type: 'pinyin', prompt: 'Corrige: 你最近怎么样吗？', answer: '你最近怎么样',
    explanation: '怎么样 ya introduce una pregunta abierta; no se combina aquí con 吗.',
    rule: 'No añadas 吗 a una pregunta con 怎么样.', itemId: 'g-ma', dimension: 'grammar', difficulty: 4, source: textbook(49, 48),
  },
  {
    id: 'dialogue-name', type: 'dialogue', prompt: '请问，你叫什么名字？', answer: '我叫马大为',
    options: ['我叫马大为。', '我很好。', '请坐。', '他也很忙。'], explanation: 'La pregunta pide tu nombre; responde con 我叫 + nombre.',
    rule: '我叫 + nombre.', itemId: 's-name-question', dimension: 'production', difficulty: 2, source: textbook(45, 44),
  },
  {
    id: 'dialogue-recent', type: 'dialogue', prompt: '你最近怎么样？', answer: '我很好',
    options: ['我很好。', '我叫宋华。', '请问。', '他姓宋。'], explanation: '怎么样 pide una descripción del estado.',
    rule: 'Sujeto + 很 + adjetivo.', itemId: 's-recent', dimension: 'production', difficulty: 2, source: textbook(47, 46),
  },
  {
    id: 'reading-libo', type: 'reading', prompt: '大为很好，丁力波很忙，林娜不太忙。谁很忙？', answer: '丁力波',
    options: ['马大为', '丁力波', '林娜', '宋华'], explanation: 'El texto afirma directamente 丁力波很忙。',
    rule: 'Localiza el nombre unido a 很忙.', itemId: 'reading-1', dimension: 'reading', difficulty: 2, source: textbook(56, 55),
  },
  {
    id: 'reading-linna', type: 'reading', prompt: '大为很好，丁力波很忙，林娜不太忙，她也很好。林娜怎么样？', answer: '她不太忙，也很好',
    options: ['她很忙', '她不太忙，也很好', '她很困', '她不在'], explanation: 'Las dos informaciones sobre 林娜 son 不太忙 y 也很好.',
    rule: 'Combina las dos pistas que tienen el mismo referente.', itemId: 'reading-2', dimension: 'reading', difficulty: 3, source: textbook(56, 55),
  },
  ...['nǐ', 'hǎo', 'wǒ', 'máng', 'xièxie'].map((answer, index): Exercise => ({
    id: `tone-${answer}`, type: 'tone', prompt: `Elige el tono principal de ${answer}.`, answer: String([3, 3, 3, 2, 4][index]),
    options: ['1', '2', '3', '4', '5'], explanation: `${answer} lleva tono ${[3, 3, 3, 2, 4][index]}.`,
    rule: 'Observa la dirección de la marca tonal.', itemId: `tone-${answer}`, dimension: 'tone', difficulty: 1, source: textbook(54, 53),
  })),
  ...lesson1Characters.map((character): Exercise => ({
    id: `hanzi-${character.id}`, type: 'hanzi', prompt: `¿Cuántos trazos tiene ${character.hanzi}?`, answer: String(character.strokeCount),
    options: Array.from(new Set([character.strokeCount, character.strokeCount + 1, Math.max(1, character.strokeCount - 1), character.strokeCount + 2])).map(String),
    explanation: `${character.hanzi} tiene ${character.strokeCount} trazos.`, rule: 'Cuenta cada trazo continuo una vez.',
    itemId: character.id, dimension: 'hanzi', difficulty: 2, source: character.source,
  })),
  {
    id: 'workbook-question-form', type: 'pinyin', prompt: 'Formula la pregunta para la respuesta: 我很好。', answer: '你怎么样',
    explanation: 'La respuesta describe un estado, así que la pregunta usa 怎么样.', rule: '你 + 怎么样？',
    itemId: 'g-order', dimension: 'production', difficulty: 4, source: workbook(5),
  },
];

export const exercises = [...meaningExercises, ...pinyinExercises, ...manualExercises];

export function exerciseById(id: string) {
  return exercises.find((exercise) => exercise.id === id);
}

export function dailyExerciseIds(): string[] {
  return ['meaning-v-你', 'pinyin-v-好', 'tone-nǐ', 'order-recent', 'dialogue-recent', 'hanzi-c-一', 'reading-libo'];
}

export const categories = [
  { id: 'core', label: 'Libro', count: vocabulary.filter((item) => item.category === 'core').length },
  { id: 'supplementary', label: 'Suplementario', count: vocabulary.filter((item) => item.category === 'supplementary').length },
  { id: 'teacher_supplement', label: 'Nota de clase', count: vocabulary.filter((item) => item.category === 'teacher_supplement').length },
];
