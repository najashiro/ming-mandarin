export type ExamSection = 'listening' | 'pinyin' | 'vocabulary' | 'grammar' | 'dialogue' | 'reading' | 'hanzi' | 'communication';

export type ExamQuestion = {
  id: string;
  section: ExamSection;
  points: number;
  prompt: string;
  options?: string[];
  answer: string;
  audioText?: string;
};

const coreExamBank: ExamQuestion[] = [
  { id: 'e-l1', section: 'listening', points: 4, prompt: 'Escucha y elige.', options: ['忙', '好', '困', '渴'], answer: '忙', audioText: '忙' },
  { id: 'e-l2', section: 'listening', points: 5, prompt: 'Escucha y elige la frase.', options: ['我很好。', '我很忙。', '我不太忙。', '他也很好。'], answer: '我很好。', audioText: '我很好' },
  { id: 'e-l3', section: 'listening', points: 6, prompt: 'Escucha: ¿cómo está la persona?', options: ['Muy bien', 'Muy ocupada', 'No muy ocupada', 'Cansada'], answer: 'No muy ocupada', audioText: '我不太忙' },
  { id: 'e-p1', section: 'pinyin', points: 4, prompt: 'Escribe el pinyin con tono de 你好。', answer: 'nǐ hǎo' },
  { id: 'e-p2', section: 'pinyin', points: 5, prompt: '¿Qué tono lleva 忙 máng?', options: ['1', '2', '3', '4', 'neutro'], answer: '2' },
  { id: 'e-p3', section: 'pinyin', points: 6, prompt: 'Escribe qingwen con marcas tonales.', answer: 'qǐngwèn' },
  { id: 'e-v1', section: 'vocabulary', points: 4, prompt: '¿Qué significa 最近?', options: ['también', 'recientemente', 'nombre', 'entrar'], answer: 'recientemente' },
  { id: 'e-v2', section: 'vocabulary', points: 5, prompt: 'Escribe en chino: ocupado/a.', answer: '忙' },
  { id: 'e-v3', section: 'vocabulary', points: 6, prompt: 'Completa: 我___宋，叫宋华。', options: ['叫', '姓', '在', '问'], answer: '姓' },
  { id: 'e-g1', section: 'grammar', points: 4, prompt: 'Ordena: 也 / 他 / 很 / 好', answer: '他也很好' },
  { id: 'e-g2', section: 'grammar', points: 5, prompt: 'Convierte en pregunta: 林娜在。', answer: '林娜在吗' },
  { id: 'e-g3', section: 'grammar', points: 6, prompt: 'Corrige: 我很不忙。', answer: '我不忙' },
  { id: 'e-d1', section: 'dialogue', points: 4, prompt: '请问，你叫什么名字？', options: ['我叫宋华。', '我很好。', '请坐。', '谢谢。'], answer: '我叫宋华。' },
  { id: 'e-d2', section: 'dialogue', points: 5, prompt: '我很好。你呢？', options: ['我也很好。', '我姓宋。', '林娜在吗？', '请进。'], answer: '我也很好。' },
  { id: 'e-d3', section: 'dialogue', points: 6, prompt: 'Formula la pregunta para: 我不太忙。', answer: '你忙吗' },
  { id: 'e-r1', section: 'reading', points: 4, prompt: '丁力波很忙，林娜不太忙。谁不太忙？', options: ['马大为', '丁力波', '林娜', '宋华'], answer: '林娜' },
  { id: 'e-r2', section: 'reading', points: 6, prompt: '马大为叫马大为，宋华姓宋。谁姓宋？', options: ['马大为', '宋华', '丁力波', '林娜'], answer: '宋华' },
  { id: 'e-c1', section: 'communication', points: 5, prompt: 'Te presentan a un compañero. Escribe “Encantado de conocerte”.', answer: '认识你很高兴' },
];

const hanziQuestions4: ExamQuestion[] = [
  { id: 'e-h1-s1', section: 'hanzi', points: 4, prompt: '¿Cuántos trazos tiene 一?', options: ['1', '2', '3', '4'], answer: '1' },
  { id: 'e-h1-s2', section: 'hanzi', points: 4, prompt: '再 + 见 forma:', options: ['再见', '老师', '晚安', '早上'], answer: '再见' },
  { id: 'e-h1-s3', section: 'hanzi', points: 4, prompt: '名 + 字 forma:', options: ['名字', '认识', '请问', '什么'], answer: '名字' },
  { id: 'e-h1-s4', section: 'hanzi', points: 4, prompt: 'Completa la invitación: 请___。', options: ['进', '最', '忙', '也'], answer: '进' },
  { id: 'e-h1-s5', section: 'hanzi', points: 4, prompt: '¿Qué carácter expresa negación?', options: ['不', '很', '太', '忙'], answer: '不' },
  { id: 'e-h1-s6', section: 'hanzi', points: 4, prompt: '最 + 近 forma:', options: ['最近', '再见', '认识', '怎么样'], answer: '最近' },
];

const hanziQuestions6: ExamQuestion[] = [
  { id: 'e-h2-s1', section: 'hanzi', points: 6, prompt: 'Escribe el Hanzi de cien.', answer: '百' },
  { id: 'e-h2-s2', section: 'hanzi', points: 6, prompt: '¿Cuántos trazos tiene 好?', options: ['4', '5', '6', '7'], answer: '6' },
  { id: 'e-h2-s3', section: 'hanzi', points: 6, prompt: '请 + 问 forma:', options: ['请问', '请进', '什么', '最近'], answer: '请问' },
  { id: 'e-h2-s4', section: 'hanzi', points: 6, prompt: '¿Qué carácter completa 谢___ para decir “gracias”?', options: ['谢', '见', '问', '好'], answer: '谢' },
  { id: 'e-h2-s5', section: 'hanzi', points: 6, prompt: 'Ordena: 忙 / 不 / 太', answer: '不太忙' },
  { id: 'e-h2-s6', section: 'hanzi', points: 6, prompt: '怎 + 么 + 样 forma:', options: ['怎么样', '什么', '最近', '再见'], answer: '怎么样' },
];

function seedIndex(seed: string, salt: string, length: number) {
  const value = [...`${seed}-${salt}`].reduce((sum, character) => (sum * 31 + character.charCodeAt(0)) >>> 0, 2166136261);
  return value % length;
}

export function examQuestionsForSeed(seed: string): ExamQuestion[] {
  return [...coreExamBank, hanziQuestions4[seedIndex(seed, 'hanzi-4', hanziQuestions4.length)], hanziQuestions6[seedIndex(seed, 'hanzi-6', hanziQuestions6.length)]];
}

export const examBank = examQuestionsForSeed('lesson-1-default');

export const examTotal = examBank.reduce((total, question) => total + question.points, 0);
