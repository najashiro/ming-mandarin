import type { CharacterEntry } from '@/data/types';

const source = (pdfPage: number, printedPage: number) => ({
  type: 'textbook' as const,
  file: 'Libro Basico 1 - Lección 1 y 2 课本内容.pdf',
  pdfPage,
  printedPage,
});

const c = (hanzi: string, pinyin: string, meaning: string, strokeCount: number, radical: string, components: string[], pdfPage: number, printedPage: number, writingRequired = true): CharacterEntry => ({
  id: `c-${hanzi}`, lessonId: 'lesson-1', hanzi, pinyin, meaning, strokeCount, radical, components,
  recognitionRequired: true, writingRequired, source: source(pdfPage, printedPage),
});

export const characters: CharacterEntry[] = [
  c('力', 'lì', 'fuerza', 2, '力', ['力'], 60, 59),
  c('生', 'shēng', 'nacer; vida', 5, '生', ['生'], 60, 59),
  c('言', 'yán', 'discurso', 7, '言', ['言'], 60, 59),
  c('人', 'rén', 'persona', 2, '人', ['人'], 60, 59),
  c('木', 'mù', 'madera', 4, '木', ['木'], 60, 59),
  c('羊', 'yáng', 'oveja', 6, '羊', ['羊'], 60, 59),
  c('井', 'jǐng', 'pozo', 4, '二', ['井'], 60, 59),
  c('土', 'tǔ', 'tierra', 3, '土', ['土'], 60, 59),
  c('叫', 'jiào', 'llamarse', 5, '口', ['口', '丩'], 60, 59),
  c('姓', 'xìng', 'apellido', 8, '女', ['女', '生'], 60, 59),
  c('么', 'me', 'sufijo interrogativo', 3, '丿', ['丿', '厶'], 60, 59),
  c('名', 'míng', 'nombre', 6, '口', ['夕', '口'], 61, 60),
  c('最', 'zuì', 'más; el máximo', 12, '曰', ['曰', '耳', '又'], 61, 60),
  c('近', 'jìn', 'cerca', 7, '辶', ['斤', '辶'], 61, 60),
  c('认', 'rèn', 'reconocer', 4, '讠', ['讠', '人'], 61, 60),
  c('识', 'shi', 'conocer; saber', 7, '讠', ['讠', '只'], 61, 60),
  c('样', 'yàng', 'forma; manera', 10, '木', ['木', '羊'], 61, 60),
  c('林', 'lín', 'bosque', 8, '木', ['木', '木'], 61, 60),
  c('进', 'jìn', 'entrar', 7, '辶', ['井', '辶'], 61, 60),
  c('坐', 'zuò', 'sentarse', 7, '土', ['人', '人', '土'], 61, 60),
  c('你', 'nǐ', 'tú', 7, '亻', ['亻', '尔'], 58, 57, false),
  c('好', 'hǎo', 'bueno; bien', 6, '女', ['女', '子'], 46, 45, false),
  c('我', 'wǒ', 'yo', 7, '戈', ['手', '戈'], 46, 45, false),
];
