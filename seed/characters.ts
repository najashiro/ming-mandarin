import curriculum from '@/data/lesson1-hanzi.json' with { type: 'json' };
import type { CharacterEntry, CharacterWord, HanziSourceCode, HanziStageId, SourceRef } from '@/data/types';
import { normalizePinyin } from '@/lib/pinyin';

type CharacterMeta = readonly [pinyin: string, meaning: string, strokeCount: number];

export const hanziStages = curriculum.stages as Array<{
  id: HanziStageId;
  title: string;
  shortTitle: string;
  chinese: string;
  description: string;
  characters: string[];
}>;

const metadata: Record<string, CharacterMeta> = {
  一: ['yī', 'uno', 1], 二: ['èr', 'dos', 2], 三: ['sān', 'tres', 3], 四: ['sì', 'cuatro', 5],
  五: ['wǔ', 'cinco', 4], 六: ['liù', 'seis', 4], 七: ['qī', 'siete', 2], 八: ['bā', 'ocho', 2],
  九: ['jiǔ', 'nueve', 2], 十: ['shí', 'diez', 2], 百: ['bǎi', 'cien', 6], 千: ['qiān', 'mil', 3],
  你: ['nǐ', 'tú', 7], 我: ['wǒ', 'yo', 7], 他: ['tā', 'él', 5], 好: ['hǎo', 'bueno; bien', 6],
  老: ['lǎo', 'mayor; en 老师', 6], 师: ['shī', 'maestro; profesor', 6], 早: ['zǎo', 'temprano; mañana', 6],
  上: ['shàng', 'arriba; en la mañana', 3], 午: ['wǔ', 'mediodía', 4], 下: ['xià', 'abajo; después', 3],
  晚: ['wǎn', 'tarde; noche', 11], 安: ['ān', 'paz; tranquilo', 6], 再: ['zài', 'de nuevo', 6], 见: ['jiàn', 'ver', 4],
  叫: ['jiào', 'llamarse', 5], 什: ['shén', 'qué; en 什么', 4], 么: ['me', 'sílaba neutra en 什么 / 怎么', 3],
  请: ['qǐng', 'por favor; invitar', 10], 问: ['wèn', 'preguntar', 6], 名: ['míng', 'nombre', 6],
  字: ['zì', 'carácter; palabra', 6], 姓: ['xìng', 'apellido', 8], 认: ['rèn', 'reconocer', 4],
  识: ['shi', 'conocer; sílaba neutra en 认识', 7], 高: ['gāo', 'alto', 10], 兴: ['xìng', 'ánimo; en 高兴', 6],
  也: ['yě', 'también', 3], 在: ['zài', 'estar; encontrarse', 6], 吗: ['ma', 'partícula interrogativa neutra', 6],
  进: ['jìn', 'entrar', 7], 坐: ['zuò', 'sentarse', 7], 谢: ['xiè', 'agradecer', 12],
  很: ['hěn', 'muy', 9], 忙: ['máng', 'ocupado', 6], 不: ['bù', 'no; negación', 4], 太: ['tài', 'demasiado; muy', 4],
  最: ['zuì', 'más; el máximo', 12], 近: ['jìn', 'cerca; reciente', 7], 怎: ['zěn', 'cómo', 9], 样: ['yàng', 'forma; manera', 10],
};

const textbook = (pdfPage: number, printedPage: number): SourceRef => ({
  type: 'textbook', file: 'Libro Basico 1 - Lección 1 y 2 课本内容.pdf', pdfPage, printedPage,
});

const auditedMetadata: Record<string, { radical: string; components: string[]; source: SourceRef }> = {
  叫: { radical: '口', components: ['口', '丩'], source: textbook(60, 59) },
  姓: { radical: '女', components: ['女', '生'], source: textbook(60, 59) },
  么: { radical: '丿', components: ['丿', '厶'], source: textbook(60, 59) },
  名: { radical: '口', components: ['夕', '口'], source: textbook(61, 60) },
  最: { radical: '曰', components: ['曰', '耳', '又'], source: textbook(61, 60) },
  近: { radical: '辶', components: ['斤', '辶'], source: textbook(61, 60) },
  认: { radical: '讠', components: ['讠', '人'], source: textbook(61, 60) },
  识: { radical: '讠', components: ['讠', '只'], source: textbook(61, 60) },
  样: { radical: '木', components: ['木', '羊'], source: textbook(61, 60) },
  进: { radical: '辶', components: ['井', '辶'], source: textbook(61, 60) },
  坐: { radical: '土', components: ['人', '人', '土'], source: textbook(61, 60) },
  你: { radical: '亻', components: ['亻', '尔'], source: textbook(58, 57) },
  好: { radical: '女', components: ['女', '子'], source: textbook(46, 45) },
  我: { radical: '戈', components: ['手', '戈'], source: textbook(46, 45) },
};

export const hanziSourceGroups: Record<HanziSourceCode, string[]> = {
  'hanzi-1.1': ['你', '好', '老', '师', '再', '见', '早', '上', '午', '下', '晚', '安'],
  'hanzi-1.2': ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千'],
  'hanzi-1.3': ['在', '吗', '请', '进', '坐', '谢', '最', '近', '怎', '么', '样', '忙', '不', '太', '他'],
  'hanzi-1.4': ['你', '好', '我', '叫', '什', '么', '请', '问', '名', '字', '姓', '认', '识', '很', '高', '兴', '也'],
  'hanzi-1.5': ['你', '我', '他', '好', '请', '问', '什', '么', '名', '字', '认', '识', '高', '兴', '很', '也', '叫', '姓', '在', '吗', '进', '坐', '最', '近', '怎', '样', '忙'],
};

const worksheetFiles: Record<HanziSourceCode, string> = {
  'hanzi-1.1': 'Hanzi Leccion 1.1 - Ciclo 1 - Junio a Julio 2026 Instituto Confucio.pdf',
  'hanzi-1.2': 'Hanzi Leccion 1.2 - Ciclo 1 - Junio a Julio 2026 Instituto Confucio.pdf',
  'hanzi-1.3': 'Hanzi Leccion 1.3 - Ciclo 1 - Junio a Julio 2026 Instituto Confucio.pdf',
  'hanzi-1.4': 'Hanzi Leccion 1.4 - Ciclo 1 - Junio a Julio 2026 Instituto Confucio.pdf',
  'hanzi-1.5': 'Hanzi Leccion 1.5 - Ciclo 1 - Junio a Julio 2026 Instituto Confucio.pdf',
};

function worksheetPage(group: HanziSourceCode, hanzi: string) {
  if (group === 'hanzi-1.2') return ['百', '千'].includes(hanzi) ? 2 : 1;
  if (group === 'hanzi-1.3') return ['样', '忙', '不', '太', '他'].includes(hanzi) ? 2 : 1;
  if (group === 'hanzi-1.4') return ['姓', '认', '识', '很', '高', '兴', '也'].includes(hanzi) ? 2 : 1;
  if (group !== 'hanzi-1.5') return 1;
  if (['你', '我', '他', '好'].includes(hanzi)) return 1;
  if (['请', '问', '什', '么', '名', '字'].includes(hanzi)) return 2;
  if (['认', '识', '高', '兴', '很', '也'].includes(hanzi)) return 3;
  if (['叫', '姓', '在', '吗', '进'].includes(hanzi)) return 4;
  if (['坐', '最', '近', '怎', '样'].includes(hanzi)) return 5;
  return 6;
}

function sourcesFor(hanzi: string) {
  const groups = (Object.keys(hanziSourceGroups) as HanziSourceCode[]).filter((group) => hanziSourceGroups[group].includes(hanzi));
  const sources: SourceRef[] = groups.map((group) => ({
    type: 'hanzi_worksheet', file: worksheetFiles[group], pdfPage: worksheetPage(group, hanzi),
    note: group === 'hanzi-1.5' ? 'Repaso acumulativo; no introduce un carácter nuevo.' : `Fuente curricular ${group.replace('hanzi-', 'Hanzi ')}`,
  }));
  if (auditedMetadata[hanzi]) sources.push(auditedMetadata[hanzi].source);
  return { groups, sources };
}

const contexts: CharacterWord[] = [
  { hanzi: '你好', pinyin: 'nǐ hǎo', translation: 'hola', stage: 2, href: '/lesson/1/dialogues' },
  { hanzi: '老师', pinyin: 'lǎoshī', translation: 'profesor/a', stage: 2, href: '/lesson/1/vocabulary' },
  { hanzi: '早上', pinyin: 'zǎoshang', translation: 'mañana', stage: 2, href: '/lesson/1/vocabulary' },
  { hanzi: '早上好', pinyin: 'zǎoshang hǎo', translation: 'buenos días', stage: 2, href: '/lesson/1/dialogues' },
  { hanzi: '上午好', pinyin: 'shàngwǔ hǎo', translation: 'buenos días', stage: 2, href: '/lesson/1/dialogues' },
  { hanzi: '下午好', pinyin: 'xiàwǔ hǎo', translation: 'buenas tardes', stage: 2, href: '/lesson/1/dialogues' },
  { hanzi: '晚上好', pinyin: 'wǎnshang hǎo', translation: 'buenas noches', stage: 2, href: '/lesson/1/dialogues' },
  { hanzi: '晚安', pinyin: 'wǎn’ān', translation: 'buenas noches', stage: 2, href: '/lesson/1/dialogues' },
  { hanzi: '再见', pinyin: 'zàijiàn', translation: 'adiós', stage: 2, href: '/lesson/1/dialogues' },
  { hanzi: '我很好', pinyin: 'wǒ hěn hǎo', translation: 'estoy bien', stage: 5, href: '/lesson/1/grammar' },
  { hanzi: '他也很好', pinyin: 'tā yě hěn hǎo', translation: 'él también está bien', stage: 5, href: '/lesson/1/grammar' },
  { hanzi: '什么', pinyin: 'shénme', translation: 'qué', stage: 3, href: '/lesson/1/vocabulary' },
  { hanzi: '请问', pinyin: 'qǐngwèn', translation: 'disculpe; permítame preguntar', stage: 3, href: '/lesson/1/dialogues' },
  { hanzi: '名字', pinyin: 'míngzi', translation: 'nombre', stage: 3, href: '/lesson/1/vocabulary' },
  { hanzi: '认识', pinyin: 'rènshi', translation: 'conocer', stage: 3, href: '/lesson/1/vocabulary' },
  { hanzi: '高兴', pinyin: 'gāoxìng', translation: 'contento/a', stage: 3, href: '/lesson/1/vocabulary' },
  { hanzi: '你叫什么名字？', pinyin: 'nǐ jiào shénme míngzi?', translation: '¿cómo te llamas?', stage: 3, href: '/lesson/1/dialogues' },
  { hanzi: '我姓……', pinyin: 'wǒ xìng…', translation: 'mi apellido es…', stage: 3, href: '/lesson/1/dialogues' },
  { hanzi: '认识你很高兴。', pinyin: 'rènshi nǐ hěn gāoxìng', translation: 'encantado/a de conocerte', stage: 3, href: '/lesson/1/dialogues' },
  { hanzi: '在吗？', pinyin: 'zài ma?', translation: '¿está?', stage: 4, href: '/lesson/1/dialogues' },
  { hanzi: '请进', pinyin: 'qǐng jìn', translation: 'pase, por favor', stage: 4, href: '/lesson/1/dialogues' },
  { hanzi: '请坐', pinyin: 'qǐng zuò', translation: 'siéntese, por favor', stage: 4, href: '/lesson/1/dialogues' },
  { hanzi: '谢谢', pinyin: 'xièxie', translation: 'gracias', stage: 4, href: '/lesson/1/dialogues' },
  { hanzi: '很好', pinyin: 'hěn hǎo', translation: 'muy bien', stage: 5, href: '/lesson/1/grammar' },
  { hanzi: '很忙', pinyin: 'hěn máng', translation: 'muy ocupado/a', stage: 5, href: '/lesson/1/grammar' },
  { hanzi: '不忙', pinyin: 'bù máng', translation: 'no estar ocupado/a', stage: 5, href: '/lesson/1/grammar' },
  { hanzi: '不太忙', pinyin: 'bú tài máng', translation: 'no estar muy ocupado/a', stage: 5, href: '/lesson/1/grammar' },
  { hanzi: '你忙吗？', pinyin: 'nǐ máng ma?', translation: '¿estás ocupado/a?', stage: 5, href: '/lesson/1/grammar' },
  { hanzi: '最近', pinyin: 'zuìjìn', translation: 'recientemente', stage: 6, href: '/lesson/1/vocabulary' },
  { hanzi: '怎么样', pinyin: 'zěnmeyàng', translation: 'cómo; qué tal', stage: 6, href: '/lesson/1/vocabulary' },
  { hanzi: '你最近怎么样？', pinyin: 'nǐ zuìjìn zěnmeyàng?', translation: '¿cómo has estado?', stage: 6, href: '/lesson/1/dialogues' },
];

function stageFor(hanzi: string) {
  const stage = hanziStages.find((item) => item.characters.includes(hanzi));
  if (!stage) throw new Error(`El carácter curricular ${hanzi} no tiene etapa primaria.`);
  return stage.id;
}

export const lesson1Characters: CharacterEntry[] = hanziStages.flatMap((stage) => stage.characters).map((hanzi) => {
  const item = metadata[hanzi];
  if (!item) throw new Error(`Falta metadata curricular para ${hanzi}.`);
  const audited = auditedMetadata[hanzi];
  const { groups, sources } = sourcesFor(hanzi);
  return {
    id: `c-${hanzi}`,
    lessonId: 'lesson-1',
    hanzi,
    pinyin: normalizePinyin(item[0]),
    meaning: item[1],
    strokeCount: item[2],
    radical: audited?.radical ?? '',
    components: audited?.components ?? [],
    recognitionRequired: true,
    writingRequired: true,
    source: sources[0],
    sources,
    sourceGroups: groups,
    primaryStage: stageFor(hanzi),
    curricular: true,
    radicalAudited: Boolean(audited),
    componentsAudited: Boolean(audited),
    words: contexts.filter((context) => context.hanzi.includes(hanzi)),
  };
});

const legacy = (hanzi: string, pinyin: string, meaning: string, strokeCount: number, radical: string, components: string[], pdfPage: number, printedPage: number): CharacterEntry => ({
  id: `c-${hanzi}`, lessonId: 'lesson-1-supplementary', hanzi, pinyin: normalizePinyin(pinyin), meaning, strokeCount, radical, components,
  recognitionRequired: true, writingRequired: true, source: textbook(pdfPage, printedPage), sources: [textbook(pdfPage, printedPage)],
  sourceGroups: [], curricular: false, radicalAudited: true, componentsAudited: true, words: contexts.filter((context) => context.hanzi.includes(hanzi)),
});

export const legacyCharacters: CharacterEntry[] = [
  legacy('力', 'lì', 'fuerza', 2, '力', ['力'], 60, 59),
  legacy('生', 'shēng', 'nacer; vida', 5, '生', ['生'], 60, 59),
  legacy('言', 'yán', 'discurso', 7, '言', ['言'], 60, 59),
  legacy('人', 'rén', 'persona', 2, '人', ['人'], 60, 59),
  legacy('木', 'mù', 'madera', 4, '木', ['木'], 60, 59),
  legacy('羊', 'yáng', 'oveja', 6, '羊', ['羊'], 60, 59),
  legacy('井', 'jǐng', 'pozo', 4, '二', ['井'], 60, 59),
  legacy('土', 'tǔ', 'tierra', 3, '土', ['土'], 60, 59),
  legacy('林', 'lín', 'bosque', 8, '木', ['木', '木'], 61, 60),
];

// Conserva los 23 IDs anteriores para historial y API. La experiencia curricular usa lesson1Characters.
export const characters: CharacterEntry[] = [...lesson1Characters, ...legacyCharacters];
