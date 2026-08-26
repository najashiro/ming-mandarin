import type { VocabularyEntry } from '@/data/types';

const textbook = (pdfPage: number, printedPage: number) => ({
  type: 'textbook' as const,
  file: 'Libro Basico 1 - Lección 1 y 2 课本内容.pdf',
  pdfPage,
  printedPage,
});

const classNote = (pdfPage: number) => ({
  type: 'class_presentation' as const,
  file: '1.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 Instituto Confucio 你最近怎么样.pdf',
  pdfPage,
});

const entry = (
  hanzi: string,
  pinyin: string,
  translation: string,
  grammaticalType: string,
  source: ReturnType<typeof textbook> | ReturnType<typeof classNote>,
  category: VocabularyEntry['category'] = 'core',
  example?: string,
): VocabularyEntry => ({
  id: `v-${hanzi}`,
  hanzi,
  pinyin,
  translation,
  grammaticalType,
  category,
  isCore: category === 'core',
  example,
  source,
});

export const vocabulary: VocabularyEntry[] = [
  entry('你', 'nǐ', 'tú', 'pronombre', textbook(46, 45), 'core', '你好！'),
  entry('好', 'hǎo', 'bueno; bien', 'adjetivo', textbook(46, 45), 'core', '我很好。'),
  entry('我', 'wǒ', 'yo; mí', 'pronombre', textbook(46, 45), 'core', '我叫马大为。'),
  entry('叫', 'jiào', 'llamarse; llamar', 'verbo', textbook(46, 45), 'core', '你叫什么名字？'),
  entry('请问', 'qǐngwèn', '¿podría preguntar?; disculpe', 'expresión cortés', textbook(46, 45), 'core', '请问，林娜在吗？'),
  entry('请', 'qǐng', 'por favor; solicitar; invitar', 'verbo', textbook(46, 45), 'core', '请进。'),
  entry('问', 'wèn', 'preguntar', 'verbo', textbook(46, 45), 'core'),
  entry('什么', 'shénme', 'qué', 'pronombre interrogativo', textbook(46, 45), 'core', '你叫什么名字？'),
  entry('名字', 'míngzi', 'nombre', 'sustantivo', textbook(46, 45), 'core', '你叫什么名字？'),
  entry('姓', 'xìng', 'apellidarse; apellido', 'verbo / sustantivo', textbook(46, 45), 'core', '我姓宋。'),
  entry('认识', 'rènshi', 'conocer', 'verbo', textbook(46, 45), 'core', '认识你很高兴。'),
  entry('很', 'hěn', 'muy; enlace del predicado adjetival', 'adverbio', textbook(46, 45), 'core', '我很好。'),
  entry('高兴', 'gāoxìng', 'contento; encantado', 'adjetivo', textbook(46, 45), 'core', '认识你很高兴。'),
  entry('也', 'yě', 'también', 'adverbio', textbook(46, 45), 'core', '他也很好。'),
  entry('在', 'zài', 'estar; encontrarse', 'verbo', textbook(48, 47), 'core', '林娜在吗？'),
  entry('吗', 'ma', 'partícula para preguntas de sí/no', 'partícula modal', textbook(48, 47), 'core', '你忙吗？'),
  entry('进', 'jìn', 'entrar', 'verbo', textbook(48, 47), 'core', '请进。'),
  entry('坐', 'zuò', 'sentarse', 'verbo', textbook(48, 47), 'core', '请坐。'),
  entry('谢谢', 'xièxie', 'gracias; agradecer', 'verbo / expresión', textbook(48, 47), 'core', '谢谢。'),
  entry('最近', 'zuìjìn', 'últimamente; recientemente', 'adverbio', textbook(48, 47), 'core', '你最近怎么样？'),
  entry('怎么样', 'zěnmeyàng', 'cómo es; cómo está', 'pronombre interrogativo', textbook(48, 47), 'core', '你最近怎么样？'),
  entry('呢', 'ne', 'partícula de pregunta elíptica', 'partícula modal', textbook(48, 47), 'core', '你呢？'),
  entry('忙', 'máng', 'ocupado/a', 'adjetivo', textbook(48, 47), 'core', '我很忙。'),
  entry('不', 'bù', 'no', 'adverbio', textbook(48, 47), 'core', '我不太忙。'),
  entry('太', 'tài', 'demasiado; extremadamente', 'adverbio', textbook(48, 47), 'core', '我不太忙。'),
  entry('他', 'tā', 'él', 'pronombre', textbook(48, 47), 'core', '他也很好。'),

  entry('困', 'kùn', 'soñoliento/a', 'adjetivo', textbook(54, 53), 'supplementary', '她很困。'),
  entry('渴', 'kě', 'sediento/a; tener sed', 'adjetivo', textbook(54, 53), 'supplementary', '她很渴。'),
  entry('饿', 'è', 'hambriento/a; tener hambre', 'adjetivo', textbook(54, 53), 'supplementary', '她很饿。'),
  entry('累', 'lèi', 'cansado/a', 'adjetivo', textbook(54, 53), 'supplementary', '他很累。'),
  entry('还行', 'hái xíng', 'no está mal', 'expresión', textbook(54, 53), 'supplementary'),
  entry('马马虎虎', 'mǎmǎhūhū', 'más o menos; regular', 'adjetivo / expresión', textbook(54, 53), 'supplementary'),
  entry('她', 'tā', 'ella', 'pronombre', textbook(54, 53), 'supplementary', '她很困。'),

  entry('您', 'nín', 'usted', 'pronombre', classNote(20), 'teacher_supplement'),
  entry('们', 'men', 'sufijo plural para personas', 'sufijo', classNote(19), 'teacher_supplement'),
  entry('我们', 'wǒmen', 'nosotros/as', 'pronombre', classNote(19), 'teacher_supplement'),
  entry('你们', 'nǐmen', 'ustedes; vosotros/as', 'pronombre', classNote(19), 'teacher_supplement'),
  entry('他们', 'tāmen', 'ellos', 'pronombre', classNote(19), 'teacher_supplement'),
  entry('她们', 'tāmen', 'ellas', 'pronombre', classNote(19), 'teacher_supplement'),
  entry('是', 'shì', 'ser', 'verbo', classNote(29), 'teacher_supplement'),
  entry('贵', 'guì', 'honorable; caro', 'adjetivo', classNote(36), 'teacher_supplement'),

  entry('马大为', 'Mǎ Dàwéi', 'Ma Dawei', 'nombre propio', textbook(46, 45), 'name'),
  entry('宋华', 'Sòng Huá', 'Song Hua', 'nombre propio', textbook(46, 45), 'name'),
  entry('丁力波', 'Dīng Lìbō', 'Ding Libo', 'nombre propio', textbook(48, 47), 'name'),
  entry('林娜', 'Lín Nà', 'Lin Na', 'nombre propio', textbook(48, 47), 'name'),
];

export const coreVocabulary = vocabulary.filter((word) => word.isCore);
