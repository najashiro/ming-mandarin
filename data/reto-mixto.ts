import type { CurriculumScope, LessonNumber, SourceRef, SourceType } from '@/data/types';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { normalizePinyin } from '@/lib/pinyin';
import { characters } from '@/seed/characters';
import { getCurriculum } from '@/seed/curriculum';

export const retoMixtoModes = [
  'image-hanzi',
  'hanzi-image',
  'audio-hanzi',
  'audio-image',
  'conversation-response',
  'construct-response',
] as const;

export type RetoMixtoMode = typeof retoMixtoModes[number];
export type RetoMixtoCategory = 'core' | 'supplementary' | 'ppt' | 'hanzi' | 'workbook' | 'phrase' | 'example_only';

export type RetoMixtoEntry = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningEs: string;
  lesson: LessonNumber;
  lessons: LessonNumber[];
  sources: SourceRef[];
  sourceTypes: SourceType[];
  category: RetoMixtoCategory;
  imageable: boolean;
  imageSrc?: string;
  audioSrc: string;
  hanziTargets: string[];
  distractorGroup: string;
  playableModes: RetoMixtoMode[];
  tokens?: string[];
};

export type RetoMixtoConversation = {
  id: string;
  lesson: LessonNumber;
  promptHanzi: string;
  answerHanzi: string;
  acceptedResponses: string[];
  source: SourceRef;
};

type Draft = Omit<RetoMixtoEntry, 'id' | 'sourceTypes' | 'audioSrc' | 'hanziTargets' | 'imageable' | 'playableModes'> & {
  id?: string;
  sourceTypes?: SourceType[];
  audioSrc?: string;
  hanziTargets?: string[];
  imageable?: boolean;
  playableModes?: RetoMixtoMode[];
};

const textbook12 = (pdfPage: number, printedPage?: number, note?: string): SourceRef => ({
  type: 'textbook',
  file: 'Libro Basico 1 - Lección 1 y 2 课本内容.pdf',
  pdfPage,
  printedPage,
  note,
});

const workbook12 = (pdfPage: number, note: string): SourceRef => ({
  type: 'workbook',
  file: 'Libro de Ejercicios Basico 1 - Lección 1 -2.pdf',
  pdfPage,
  note,
});

const workbook3 = (pdfPage: number, note: string): SourceRef => ({
  type: 'workbook',
  file: 'Libro de Ejecicios Basico 1 - Lección 3 - Nimen jiã you jĩ kou rén.pdf',
  pdfPage,
  note,
});

const presentation = (file: string, pdfPage: number, type: SourceType = 'class_presentation', note?: string): SourceRef => ({
  type,
  file,
  pdfPage,
  note,
});

const presentation21 = '2.1 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你是哪国人？.pdf';
const presentation11 = '1.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 Instituto Confucio 你最近怎么样.pdf';
const presentation22 = '2.2 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你是哪国人啊？.pdf';
const presentation31 = '3.1 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你家有几口人？.pdf.pdf';

const imageAssets: Record<string, { imageSrc: string; distractorGroup: string }> = {
  饺子: { imageSrc: '/images/games/reto-mixto/jiaozi.webp', distractorGroup: 'food' },
  包子: { imageSrc: '/images/games/reto-mixto/baozi.webp', distractorGroup: 'food' },
  米饭: { imageSrc: '/images/games/reto-mixto/rice.webp', distractorGroup: 'food' },
  面条: { imageSrc: '/images/games/reto-mixto/noodles.webp', distractorGroup: 'food' },
  点心: { imageSrc: '/images/games/reto-mixto/dim-sum.webp', distractorGroup: 'food' },
  面包: { imageSrc: '/images/games/reto-mixto/bread.webp', distractorGroup: 'food' },
  咖啡: { imageSrc: '/images/games/reto-mixto/coffee.webp', distractorGroup: 'drink' },
  茶: { imageSrc: '/images/games/reto-mixto/tea.webp', distractorGroup: 'drink' },
  水: { imageSrc: '/images/games/reto-mixto/water.webp', distractorGroup: 'drink' },
  可乐: { imageSrc: '/images/games/reto-mixto/cola.webp', distractorGroup: 'drink' },
  牛奶: { imageSrc: '/images/games/reto-mixto/milk.webp', distractorGroup: 'drink' },
  果汁: { imageSrc: '/images/games/reto-mixto/juice.webp', distractorGroup: 'drink' },
  爸爸: { imageSrc: '/images/games/reto-mixto/father.webp', distractorGroup: 'family' },
  妈妈: { imageSrc: '/images/games/reto-mixto/mother.webp', distractorGroup: 'family' },
  爷爷: { imageSrc: '/images/games/reto-mixto/grandfather.webp', distractorGroup: 'family' },
  奶奶: { imageSrc: '/images/games/reto-mixto/grandmother.webp', distractorGroup: 'family' },
  外公: { imageSrc: '/images/games/reto-mixto/maternal-grandfather.webp', distractorGroup: 'family' },
  外婆: { imageSrc: '/images/games/reto-mixto/maternal-grandmother.webp', distractorGroup: 'family' },
  哥哥: { imageSrc: '/images/games/reto-mixto/older-brother.webp', distractorGroup: 'family' },
  弟弟: { imageSrc: '/images/games/reto-mixto/younger-brother.webp', distractorGroup: 'family' },
  姐姐: { imageSrc: '/images/games/reto-mixto/older-sister.webp', distractorGroup: 'family' },
  妹妹: { imageSrc: '/images/games/reto-mixto/younger-sister.webp', distractorGroup: 'family' },
  女儿: { imageSrc: '/images/games/reto-mixto/daughter.webp', distractorGroup: 'family' },
  家人: { imageSrc: '/images/games/reto-mixto/family.webp', distractorGroup: 'family' },
  家: { imageSrc: '/images/games/reto-mixto/home.webp', distractorGroup: 'place' },
  照片: { imageSrc: '/images/games/reto-mixto/photo.webp', distractorGroup: 'object' },
  医生: { imageSrc: '/images/games/reto-mixto/doctor.webp', distractorGroup: 'person' },
  钢琴: { imageSrc: '/images/games/reto-mixto/piano.webp', distractorGroup: 'object' },
  狗: { imageSrc: '/images/games/reto-mixto/dog.webp', distractorGroup: 'animal' },
  猫: { imageSrc: '/images/games/reto-mixto/cat.webp', distractorGroup: 'animal' },
  牛: { imageSrc: '/images/games/reto-mixto/cow.webp', distractorGroup: 'animal' },
  羊: { imageSrc: '/images/games/reto-mixto/sheep.webp', distractorGroup: 'animal' },
  高兴: { imageSrc: '/images/games/reto-mixto/happy.webp', distractorGroup: 'state' },
  忙: { imageSrc: '/images/games/reto-mixto/busy.webp', distractorGroup: 'state' },
  困: { imageSrc: '/images/games/reto-mixto/sleepy.webp', distractorGroup: 'state' },
  累: { imageSrc: '/images/games/reto-mixto/tired.webp', distractorGroup: 'state' },
};

const semanticGroups: Record<string, string> = {
  你: 'pronoun', 我: 'pronoun', 他: 'pronoun', 她: 'pronoun', 您: 'pronoun', 我们: 'pronoun', 你们: 'pronoun', 他们: 'pronoun', 她们: 'pronoun',
  中国: 'country', 美国: 'country', 秘鲁: 'country', 英国: 'country', 德国: 'country', 法国: 'country', 日本: 'country', 西班牙: 'country', 加拿大: 'country', 墨西哥: 'country', 澳大利亚: 'country',
  汉语: 'language', 英语: 'language', 法语: 'language', 德语: 'language', 俄语: 'language', 日语: 'language', 西班牙语: 'language', 韩语: 'language', 语言: 'language',
  爸爸: 'family', 妈妈: 'family', 爷爷: 'family', 奶奶: 'family', 外公: 'family', 外婆: 'family', 姥姥: 'family', 姥爷: 'family', 哥哥: 'family', 弟弟: 'family', 姐姐: 'family', 妹妹: 'family', 女儿: 'family', 家人: 'family',
  饺子: 'food', 包子: 'food', 米饭: 'food', 面条: 'food', 点心: 'food', 面包: 'food',
  咖啡: 'drink', 茶: 'drink', 水: 'drink', 可乐: 'drink', 牛奶: 'drink', 饮料: 'drink', 果汁: 'drink',
  狗: 'animal', 猫: 'animal', 牛: 'animal', 羊: 'animal', 小狗: 'animal', 小猫: 'animal',
  高兴: 'state', 忙: 'state', 困: 'state', 渴: 'state', 饿: 'state', 累: 'state', 好: 'state', 漂亮: 'state', 可爱: 'state',
  老师: 'person', 学生: 'person', 医生: 'person', 工人: 'person', 老人: 'person', 男朋友: 'person',
  北京: 'place', 上海: 'place', 家: 'place',
  一: 'number', 二: 'number', 三: 'number', 四: 'number', 五: 'number', 六: 'number', 七: 'number', 八: 'number', 九: 'number', 十: 'number', 百: 'number', 千: 'number', 两: 'number', 几: 'number',
  口: 'classifier', 个: 'classifier', 张: 'classifier', 只: 'classifier',
};

const additionalEvidence: Record<string, SourceRef[]> = {
  你: [presentation('0.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 Instituto Confucio 拼音第一节.pdf', 42, 'phonetics_presentation', 'Vocabulario inicial')],
  好: [presentation('0.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 Instituto Confucio 拼音第一节.pdf', 42, 'phonetics_presentation', 'Vocabulario inicial')],
  我: [presentation('0.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 Instituto Confucio 拼音第一节.pdf', 42, 'phonetics_presentation', 'Vocabulario inicial')],
  老师: [presentation('0.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 Instituto Confucio 拼音第一节.pdf', 42, 'phonetics_presentation', 'Vocabulario inicial')],
  谢谢: [presentation('0.2 Presentación Curso Ciclo 1 - Junio a Julio 2026 Instituto Confucio 语音 谢谢.pdf', 1, 'phonetics_presentation', 'Unidad fonética 谢谢')],
};

const extraRows = [
  ['作业', 'zuòyè', 'tarea', 1, 'ppt', presentation(presentation11, 3, 'class_presentation', 'Vocabulario explícito y frase 我们有作业')],
  ['厕所', 'cèsuǒ', 'baño; servicios higiénicos', 1, 'ppt', presentation(presentation11, 4, 'class_presentation', 'Vocabulario explícito en 可以去厕所吗')],
  ['可以', 'kěyǐ', 'poder; estar permitido', 1, 'ppt', presentation(presentation11, 4, 'class_presentation', 'Expresión funcional explícitamente enseñada')],
  ['去', 'qù', 'ir', 1, 'ppt', presentation(presentation11, 4, 'class_presentation', 'Verbo explícitamente enseñado en contexto')],
  ['早饭', 'zǎofàn', 'desayuno', 2, 'ppt', presentation(presentation21, 5, 'class_presentation', 'Vocabulario explícito 吃早饭')],
  ['女朋友', 'nǚpéngyou', 'novia', 2, 'ppt', presentation(presentation21, 8, 'class_presentation', 'Vocabulario de relaciones junto a 男朋友')],
  ['甜品', 'tiánpǐn', 'postre', 2, 'ppt', presentation(presentation22, 12, 'class_presentation', 'Vocabulario explícito y contraste con 点心')],
  ['我姓宋，叫宋华。', 'Wǒ xìng Sòng, jiào Sòng Huá.', 'Me apellido Song y me llamo Song Hua.', 2, 'phrase', presentation(presentation21, 42, 'class_presentation', 'Respuesta conversacional completa')],
  ['学生', 'xuéshēng', 'estudiante', 2, 'ppt', presentation(presentation21, 10, 'class_presentation', '生词 explícito')],
  ['老人', 'lǎorén', 'persona mayor', 2, 'ppt', presentation(presentation21, 9, 'class_presentation', 'Contraste léxico con 老师')],
  ['男朋友', 'nánpéngyou', 'novio', 2, 'ppt', presentation(presentation21, 12, 'class_presentation', 'Ejemplo guiado con 这是')],
  ['语言', 'yǔyán', 'idioma; lenguaje', 2, 'ppt', presentation(presentation21, 44, 'class_presentation', 'Pregunta explícita 什么语言')],
  ['家人', 'jiārén', 'familiares; miembros de la familia', 3, 'ppt', presentation(presentation31, 6, 'class_presentation', 'Ampliación visual explícita')],
  ['小狗', 'xiǎogǒu', 'perrito', 3, 'ppt', presentation(presentation31, 24, 'class_presentation', '补充词语 sobre animales')],
  ['小猫', 'xiǎomāo', 'gatito', 3, 'ppt', presentation(presentation31, 24, 'class_presentation', '补充词语 sobre animales')],
  ['可爱', 'kěʼài', 'adorable', 3, 'ppt', presentation(presentation31, 24, 'class_presentation', 'Adjetivo de la ampliación de animales')],
  ['大学老师', 'dàxué lǎoshī', 'profesor/a universitario/a', 3, 'example_only', presentation(presentation31, 25, 'class_presentation', 'Ejemplo contextual; no núcleo evaluable')],
  ['现在', 'xiànzài', 'ahora', 3, 'example_only', presentation(presentation31, 26, 'class_presentation', 'Ejemplo contextual; no núcleo evaluable')],
  ['工人', 'gōngrén', 'obrero/a; trabajador/a', 3, 'example_only', presentation(presentation31, 26, 'class_presentation', 'Familia léxica de 工作')],
  ['工作日', 'gōngzuòrì', 'día laborable', 3, 'example_only', presentation(presentation31, 26, 'class_presentation', 'Familia léxica de 工作')],
  ['作业', 'zuòyè', 'tarea', 3, 'example_only', presentation(presentation31, 26, 'class_presentation', 'Familia léxica de 工作')],
  ['卡片', 'kǎpiàn', 'tarjeta', 3, 'example_only', presentation(presentation31, 20, 'class_presentation', 'Ejemplo del clasificador 张')],
] as const satisfies ReadonlyArray<readonly [string, string, string, LessonNumber, RetoMixtoCategory, SourceRef]>;

function stableId(prefix: string, hanzi: string) {
  return `rm-${prefix}-${[...hanzi].map((character) => character.codePointAt(0)?.toString(16)).join('-')}`;
}

function uniqueSources(sources: SourceRef[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.type}:${source.file}:${source.pdfPage}:${source.printedPage ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function categoryForVocabulary(category: 'core' | 'supplementary' | 'teacher_supplement' | 'name'): RetoMixtoCategory {
  if (category === 'supplementary') return 'supplementary';
  if (category === 'teacher_supplement') return 'ppt';
  return 'core';
}

function workbookEvidence(lesson: LessonNumber): SourceRef {
  if (lesson === 1) return workbook12(1, 'Comprensión y producción de la Lección 1');
  if (lesson === 2) return workbook12(9, 'Comprensión y producción de la Lección 2');
  return workbook3(1, 'Comprensión oral y escrita de la Lección 3');
}

function textbookEvidenceForLesson2(source: SourceRef): SourceRef {
  const secondText = source.file.startsWith('2.2 ');
  return textbook12(secondText ? 70 : 66, secondText ? 69 : 65, secondText ? 'Lección 2 · Texto 2 y vocabulario' : 'Lección 2 · Texto 1 y vocabulario');
}

const map = new Map<string, Draft>();

function merge(draft: Draft) {
  const current = map.get(draft.hanzi);
  if (!current) {
    map.set(draft.hanzi, draft);
    return;
  }
  current.lessons = [...new Set([...current.lessons, ...draft.lessons])].sort() as LessonNumber[];
  current.sources = uniqueSources([...current.sources, ...draft.sources]);
  if (current.category === 'hanzi' && draft.category !== 'hanzi') current.category = draft.category;
  if (!current.tokens && draft.tokens) current.tokens = draft.tokens;
}

for (const lesson of [1, 2, 3] as const) {
  const curriculum = getCurriculum(`l${lesson}`);
  for (const word of curriculum.vocabulary) {
    const sources = [word.source, ...(additionalEvidence[word.hanzi] ?? [])];
    if (lesson === 2) sources.push(textbookEvidenceForLesson2(word.source));
    merge({
      hanzi: word.hanzi,
      pinyin: normalizePinyin(word.pinyin),
      meaningEs: word.translation,
      lesson,
      lessons: [lesson],
      sources: uniqueSources(sources),
      category: categoryForVocabulary(word.category),
      distractorGroup: semanticGroups[word.hanzi] ?? `vocabulary-${lesson}`,
    });
  }
}

for (const [hanzi, pinyin, meaningEs, lesson, category, source] of extraRows) {
  merge({ hanzi, pinyin: normalizePinyin(pinyin), meaningEs, lesson, lessons: [lesson], sources: [source], category, distractorGroup: semanticGroups[hanzi] ?? `ppt-${lesson}` });
}

for (const character of characters) {
  const lesson = Number(character.introducedIn[0]) as LessonNumber;
  merge({
    hanzi: character.hanzi,
    pinyin: normalizePinyin(character.pinyin),
    meaningEs: character.meaning,
    lesson,
    lessons: [lesson],
    sources: uniqueSources(character.sources?.length ? character.sources : [character.source]),
    category: 'hanzi',
    distractorGroup: semanticGroups[character.hanzi] ?? `hanzi-${lesson}-${character.sourceRole}`,
  });
}

for (const lesson of [1, 2, 3] as const) {
  const curriculum = getCurriculum(`l${lesson}`);
  for (const sentence of curriculum.sentences) {
    merge({
      id: stableId('phrase', sentence.hanzi),
      hanzi: sentence.hanzi,
      pinyin: normalizePinyin(sentence.pinyin),
      meaningEs: sentence.translation,
      lesson,
      lessons: [lesson],
      sources: uniqueSources([sentence.source, workbookEvidence(lesson)]),
      category: 'phrase',
      distractorGroup: `phrase-${lesson}`,
      tokens: sentence.tokens,
    });
  }
}

const knownHanzi = new Set(characters.map((character) => character.hanzi));

export const retoMixtoCorpus: RetoMixtoEntry[] = [...map.values()].map((draft) => {
  const image = imageAssets[draft.hanzi];
  const audioSrc = audioForMandarinText(draft.hanzi) ?? '';
  const sourceTypes = [...new Set(draft.sources.map((source) => source.type))];
  const isPhrase = draft.category === 'phrase';
  const playable = draft.category !== 'example_only';
  const modes: RetoMixtoMode[] = [];
  if (playable) modes.push('audio-hanzi');
  if (playable && image) modes.push('image-hanzi', 'hanzi-image', 'audio-image');
  if (isPhrase && draft.tokens && draft.tokens.length > 1) modes.push('construct-response');
  return {
    ...draft,
    id: draft.id ?? stableId(isPhrase ? 'phrase' : 'item', draft.hanzi),
    sourceTypes,
    imageable: Boolean(image),
    imageSrc: image?.imageSrc,
    audioSrc,
    hanziTargets: [...new Set([...draft.hanzi].filter((character) => knownHanzi.has(character)))],
    distractorGroup: image?.distractorGroup ?? draft.distractorGroup,
    playableModes: modes,
  };
});

export const retoMixtoConversations: RetoMixtoConversation[] = [
  { id: 'rm-conv-l1-hello', lesson: 1, promptHanzi: '你好！', answerHanzi: '你好！', acceptedResponses: ['你好'], source: textbook12(45, 44) },
  { id: 'rm-conv-l1-name', lesson: 1, promptHanzi: '请问，你叫什么名字？', answerHanzi: '我叫马大为。', acceptedResponses: ['我叫马大为'], source: textbook12(45, 44) },
  { id: 'rm-conv-l1-meet', lesson: 1, promptHanzi: '认识你很高兴。', answerHanzi: '认识你我也很高兴。', acceptedResponses: ['认识你我也很高兴'], source: textbook12(45, 44) },
  { id: 'rm-conv-l1-recent', lesson: 1, promptHanzi: '你最近怎么样？', answerHanzi: '我很好。你呢？', acceptedResponses: ['我很好你呢', '我很好'], source: textbook12(47, 46) },
  { id: 'rm-conv-l2-morning', lesson: 2, promptHanzi: '陈老师，早上好！', answerHanzi: '你们好！', acceptedResponses: ['你们好'], source: presentation(presentation21, 42) },
  { id: 'rm-conv-l2-surname', lesson: 2, promptHanzi: '请问，您贵姓？', answerHanzi: '我姓宋，叫宋华。', acceptedResponses: ['我姓宋叫宋华', '我姓宋'], source: presentation(presentation21, 42) },
  { id: 'rm-conv-l2-country', lesson: 2, promptHanzi: '你是哪国人？', answerHanzi: '我是美国人。', acceptedResponses: ['我是美国人'], source: presentation(presentation21, 42) },
  { id: 'rm-conv-l3-family', lesson: 3, promptHanzi: '你家有几口人？', answerHanzi: '我家有四口人。', acceptedResponses: ['我家有四口人'], source: presentation(presentation31, 35) },
  { id: 'rm-conv-l3-work', lesson: 3, promptHanzi: '你爸爸做什么工作？', answerHanzi: '我爸爸是医生。', acceptedResponses: ['我爸爸是医生'], source: presentation(presentation31, 35) },
  { id: 'rm-conv-l3-sisters', lesson: 3, promptHanzi: '你家还有谁？', answerHanzi: '我有两个姐姐。', acceptedResponses: ['我有两个姐姐'], source: presentation(presentation31, 36) },
];

const countsBy = <T extends string | number>(values: T[]) => Object.fromEntries([...new Set(values)].map((value) => [value, values.filter((item) => item === value).length]));
const playableCorpus = retoMixtoCorpus.filter((entry) => entry.playableModes.length > 0);

export const retoMixtoAudit = {
  totalUnique: retoMixtoCorpus.length,
  playable: playableCorpus.length,
  excludedExamples: retoMixtoCorpus.length - playableCorpus.length,
  byLesson: countsBy(retoMixtoCorpus.flatMap((entry) => entry.lessons)),
  byCategory: countsBy(retoMixtoCorpus.map((entry) => entry.category)),
  bySourceType: countsBy(retoMixtoCorpus.flatMap((entry) => entry.sourceTypes)),
  imageable: retoMixtoCorpus.filter((entry) => entry.imageable).length,
  withAudio: retoMixtoCorpus.filter((entry) => Boolean(entry.audioSrc)).length,
  conversations: retoMixtoConversations.length,
};

export function retoMixtoLessonsForScope(scope: CurriculumScope): LessonNumber[] {
  return getCurriculum(scope).definition.lessonIds;
}
