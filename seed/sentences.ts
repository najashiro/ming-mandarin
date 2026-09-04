import type { SentenceEntry } from '@/data/types';
import { normalizePinyin } from '@/lib/pinyin';

const source = (pdfPage: number, printedPage: number) => ({
  type: 'textbook' as const,
  file: 'Libro Basico 1 - Lección 1 y 2 课本内容.pdf',
  pdfPage,
  printedPage,
});

const classSource = (pdfPage: number) => ({
  type: 'class_presentation' as const,
  file: '1.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 Instituto Confucio 你最近怎么样.pdf',
  pdfPage,
});

const s = (
  id: string,
  hanzi: string,
  pinyin: string,
  translation: string,
  tokens: string[],
  grammarTags: string[],
  pdfPage: number,
  printedPage: number,
  difficulty: SentenceEntry['difficulty'] = 1,
): SentenceEntry => ({ id, hanzi, pinyin: normalizePinyin(pinyin), translation, tokens, grammarTags, difficulty, source: source(pdfPage, printedPage) });

export const sentences: SentenceEntry[] = [
  s('s-nihao', '你好！', 'Nǐ hǎo!', '¡Hola!', ['你', '好'], ['saludo'], 45, 44),
  s('s-wojiao', '我叫马大为。', 'Wǒ jiào Mǎ Dàwéi.', 'Me llamo Ma Dawei.', ['我', '叫', '马大为'], ['presentación', 'sujeto-predicado'], 45, 44),
  s('s-name-question', '请问，你叫什么名字？', 'Qǐngwèn, nǐ jiào shénme míngzi?', 'Disculpa, ¿cómo te llamas?', ['请问', '你', '叫', '什么', '名字'], ['pregunta', 'nombre'], 45, 44, 2),
  s('s-surname', '我姓宋，叫宋华。', 'Wǒ xìng Sòng, jiào Sòng Huá.', 'Me apellido Song y me llamo Song Hua.', ['我', '姓', '宋', '叫', '宋华'], ['presentación', 'apellido'], 45, 44, 2),
  s('s-meet', '认识你很高兴。', 'Rènshi nǐ hěn gāoxìng.', 'Encantado/a de conocerte.', ['认识', '你', '很', '高兴'], ['primer-encuentro', '很'], 45, 44, 2),
  s('s-meet-too', '认识你我也很高兴。', 'Rènshi nǐ wǒ yě hěn gāoxìng.', 'También estoy encantado/a de conocerte.', ['认识', '你', '我', '也', '很', '高兴'], ['也', 'primer-encuentro'], 45, 44, 3),
  s('s-linna-home', '林娜在吗？', 'Lín Nà zài ma?', '¿Está Lin Na?', ['林娜', '在', '吗'], ['吗', 'pregunta-sí-no'], 47, 46),
  s('s-please-enter', '请进。', 'Qǐng jìn.', 'Entra, por favor.', ['请', '进'], ['请+verbo'], 47, 46),
  s('s-please-sit', '请坐。', 'Qǐng zuò.', 'Siéntate, por favor.', ['请', '坐'], ['请+verbo'], 47, 46),
  s('s-thanks', '谢谢。', 'Xièxie.', 'Gracias.', ['谢谢'], ['cortesía'], 47, 46),
  s('s-recent', '你最近怎么样？', 'Nǐ zuìjìn zěnmeyàng?', '¿Cómo has estado?', ['你', '最近', '怎么样'], ['pregunta-abierta', 'orden'], 47, 46, 2),
  s('s-good-you', '我很好。你呢？', 'Wǒ hěn hǎo. Nǐ ne?', 'Estoy muy bien. ¿Y tú?', ['我', '很', '好', '你', '呢'], ['很', '呢'], 47, 46, 2),
  s('s-busy', '我很忙。', 'Wǒ hěn máng.', 'Estoy muy ocupado/a.', ['我', '很', '忙'], ['很', 'predicado-adjetival'], 47, 46),
  s('s-busy-question', '你忙吗？', 'Nǐ máng ma?', '¿Estás ocupado/a?', ['你', '忙', '吗'], ['吗', 'pregunta-sí-no'], 47, 46, 2),
  s('s-not-too-busy', '我不太忙。', 'Wǒ bú tài máng.', 'No estoy muy ocupado/a.', ['我', '不', '太', '忙'], ['不太', 'predicado-adjetival'], 47, 46, 2),
  s('s-dawei-good', '大为好吗？', 'Dàwéi hǎo ma?', '¿Está bien Dawei?', ['大为', '好', '吗'], ['吗', 'pregunta-sí-no'], 47, 46, 2),
  s('s-he-too-good', '他也很好。', 'Tā yě hěn hǎo.', 'Él también está muy bien.', ['他', '也', '很', '好'], ['也', '很', 'orden'], 47, 46, 2),
  {
    id: 's-ninhao', hanzi: '您好！', pinyin: 'Nín hǎo!', translation: '¡Hola! (formal)',
    tokens: ['您', '好'], grammarTags: ['saludo', 'formal'], difficulty: 1, source: classSource(20),
  },
  {
    id: 's-nimenhao', hanzi: '你们好！', pinyin: 'Nǐmen hǎo!', translation: '¡Hola a todos!',
    tokens: ['你们', '好'], grammarTags: ['saludo', 'plural'], difficulty: 1, source: classSource(19),
  },
];
