import type { GrammarPoint } from '@/data/types';

const source = (pdfPage: number, printedPage: number) => ({
  type: 'textbook' as const,
  file: 'Libro Basico 1 - Lección 1 y 2 课本内容.pdf',
  pdfPage,
  printedPage,
});

export const grammarPoints: GrammarPoint[] = [
  {
    id: 'g-ma', slug: 'ma', title: '吗 · Preguntas de sí/no', pattern: 'Oración declarativa + 吗？',
    explanation: 'Añade 吗 al final de una declaración. Para responder, usa la forma afirmativa o negativa sin 吗.',
    examples: ['他很忙。→ 他忙吗？', '林娜在。→ 林娜在吗？'], source: source(50, 49),
  },
  {
    id: 'g-hen', slug: 'hen', title: '很 · Predicado adjetival', pattern: 'Sujeto + 很 + adjetivo',
    explanation: 'Un adjetivo puede ser el predicado. 很 aparece normalmente cuando no hay comparación y no siempre conserva el sentido literal de “muy”.',
    examples: ['我很好。', '丁力波很忙。'], source: source(51, 50),
  },
  {
    id: 'g-bu', slug: 'bu', title: '不 · Negación', pattern: 'Sujeto + 不 + verbo/adjetivo',
    explanation: 'La negación se forma colocando 不 antes del verbo o adjetivo.',
    examples: ['我不忙。', '他不在。'], source: source(51, 50),
  },
  {
    id: 'g-bu-tai', slug: 'bu-tai', title: '不太 · No muy', pattern: 'Sujeto + 不太 + adjetivo',
    explanation: '不太 suaviza la negación: expresa “no muy” o “no demasiado”.',
    examples: ['我不太忙。', '她不太累。'], source: source(51, 50),
  },
  {
    id: 'g-ye', slug: 'ye', title: '也 · También', pattern: 'Sujeto + 也 + (不) + predicado',
    explanation: '也 va después del sujeto y antes del verbo o adjetivo. En una oración negativa, 也 precede a 不.',
    examples: ['他也很好。', '我也不忙。'], source: source(52, 51),
  },
  {
    id: 'g-ne', slug: 'ne', title: '呢 · Pregunta elíptica', pattern: 'Tema + 呢？',
    explanation: '呢 recupera una pregunta ya conocida sin repetirla completa: 我很好。你呢？',
    examples: ['我很好。你呢？', '我叫林娜。你呢？'], source: source(49, 48),
  },
  {
    id: 'g-order', slug: 'order', title: 'Orden básico', pattern: 'Sujeto (tema) + predicado',
    explanation: 'El tema o sujeto aparece normalmente al principio y el predicado lo sigue. La posición es crucial porque el chino no marca las funciones con flexión.',
    examples: ['我很忙。', '他姓宋。'], source: source(53, 52),
  },
];
