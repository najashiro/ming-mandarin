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

export const examBank: ExamQuestion[] = [
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
  { id: 'e-h1', section: 'hanzi', points: 4, prompt: '木 + 木 forma:', options: ['样', '林', '认', '坐'], answer: '林' },
  { id: 'e-h2', section: 'hanzi', points: 6, prompt: '¿Cuántos trazos tiene 力?', options: ['2', '3', '4', '5'], answer: '2' },
  { id: 'e-c1', section: 'communication', points: 5, prompt: 'Te presentan a un compañero. Escribe “Encantado de conocerte”.', answer: '认识你很高兴' },
];

export const examTotal = examBank.reduce((total, question) => total + question.points, 0);
