import { createHash } from 'node:crypto';
import { readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = await readFile(join(root, 'seed', 'curriculum.ts'), 'utf8');
const lesson1VocabularySource = await readFile(join(root, 'seed', 'vocabulary.ts'), 'utf8');
const lesson1SentenceSource = await readFile(join(root, 'seed', 'sentences.ts'), 'utf8');
const characterSource = await readFile(join(root, 'seed', 'characters.ts'), 'utf8');
const retoMixtoSource = await readFile(join(root, 'data', 'reto-mixto.ts'), 'utf8');
const hanziCurriculum = JSON.parse(await readFile(join(root, 'data', 'lesson1-hanzi.json'), 'utf8'));
const manifestPath = join(root, 'data', 'mandarin-audio.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const pronunciation = JSON.parse(await readFile(join(root, 'data', 'pronunciation.json'), 'utf8'));
const normalize = (value) => value.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
// Los clips publicados se conservan para no invalidar URLs ya desplegadas.
const known = new Set(manifest.clips.map((clip) => normalize(clip.input)));
for (const clip of pronunciation.clips) known.add(normalize(clip.input));
const candidates = [];

function block(start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  if (from < 0 || to < 0) throw new Error(`No se encontró el bloque ${start}.`);
  return source.slice(from, to);
}

function add(input, pinyin, lessonId, kind) {
  const clean = normalize(input);
  if (!clean || known.has(clean)) return;
  known.add(clean);
  const digest = createHash('sha1').update(clean).digest('hex').slice(0, 10);
  candidates.push({
    id: `l${lessonId}-${kind}-${digest}`,
    file: `l${lessonId}-${kind}-${digest}.mp3`,
    input,
    expectedPinyin: pinyin.normalize('NFC'),
    lessonId,
    instructions: kind === 'h' ? `Pronuncia el carácter ${input} una sola vez, con la lectura auditada ${pinyin}.` : 'Pronuncia exactamente la entrada una sola vez, con ritmo natural.',
  });
}

for (const match of lesson1VocabularySource.matchAll(/entry\('([^']+)',\s*'([^']+)'/g)) add(match[1], match[2], 1, 'v');
for (const match of lesson1SentenceSource.matchAll(/s\('[^']+',\s*'([^']+)',\s*'([^']+)'/g)) add(match[1], match[2], 1, 's');

for (const lessonId of [2, 3]) {
  const vocabularyBlock = block(`export const lesson${lessonId}Vocabulary`, lessonId === 2 ? 'export const lesson3Vocabulary' : 'const sentence =');
  for (const match of vocabularyBlock.matchAll(/\['([^']+)','([^']+)'/g)) add(match[1], match[2], lessonId, 'v');
  const sentenceBlock = block(`export const lesson${lessonId}Sentences`, lessonId === 2 ? 'export const lesson3Sentences' : 'const grammar =');
  for (const match of sentenceBlock.matchAll(new RegExp(`sentence\\(${lessonId},'[^']+','([^']+)','([^']+)'`, 'g'))) add(match[1], match[2], lessonId, 's');
}

const extraStart = retoMixtoSource.indexOf('const extraRows = [');
const extraEnd = retoMixtoSource.indexOf('] as const satisfies', extraStart);
if (extraStart < 0 || extraEnd < 0) throw new Error('No se encontró el bloque extraRows de Reto Mixto.');
for (const match of retoMixtoSource.slice(extraStart, extraEnd).matchAll(/\['([^']+)',\s*'([^']+)',\s*'[^']+',\s*([123]),/g)) {
  add(match[1], match[2], Number(match[3]), 'v');
}

// Unidades completas que las fichas interactivas de Reto Mixto deben pronunciar.
// El pinyin procede de las oraciones curriculares que ya contienen cada bloque.
const retoMixtoInteractionAudio = [
  ['宋', 'Sòng', 1], ['大为', 'Dàwéi', 1],
  ['她很困。', 'Tā hěn kùn.', 1], ['她很渴。', 'Tā hěn kě.', 1],
  ['她很饿。', 'Tā hěn è.', 1], ['他很累。', 'Tā hěn lèi.', 1],
  ['陈老师', 'Chén lǎoshī', 2], ['早上好', 'zǎoshang hǎo', 2],
  ['我朋友', 'wǒ péngyou', 2], ['刚到', 'gāng dào', 2],
  ['哪国人', 'nǎ guó rén', 2], ['美国人', 'Měiguó rén', 2],
  ['会说', 'huì shuō', 2], ['我爸爸妈妈', 'wǒ bàba māma', 2],
  ['上海人', 'Shànghǎi rén', 2], ['还是', 'háishi', 2],
  ['喝茶', 'hē chá', 2], ['吃米饭', 'chī mǐfàn', 2],
  ['你家', 'nǐ jiā', 3], ['几口人', 'jǐ kǒu rén', 3],
  ['我家', 'wǒ jiā', 3], ['四口人', 'sì kǒu rén', 3],
  ['你爸爸', 'nǐ bàba', 3], ['什么工作', 'shénme gōngzuò', 3],
  ['我爸爸', 'wǒ bàba', 3], ['不是', 'bú shì', 3],
  ['我弟弟', 'wǒ dìdi', 3], ['我哥哥', 'wǒ gēge', 3],
  ['六个人', 'liù ge rén', 3], ['两个姐姐', 'liǎng ge jiějie', 3],
  ['我们家', 'wǒmen jiā', 3], ['这张照片', 'zhè zhāng zhàopiàn', 3],
  ['你女儿', 'nǐ nǚʼér', 3], ['几岁', 'jǐ suì', 3],
  ['今天晚上', 'jīntiān wǎnshang', 3], ['钢琴课', 'gāngqín kè', 3],
];
for (const [input, pinyin, lessonId] of retoMixtoInteractionAudio) add(input, pinyin, lessonId, 'v');

const characterPinyin = new Map([...characterSource.matchAll(/([\u3400-\u9fff]):\['([^']+)','/gu)].map((match) => [match[1], match[2]]));
const seenCharacters = new Set();
for (const unit of hanziCurriculum.units) {
  for (const character of [...unit.core, ...unit.teacherExtension, ...unit.support]) {
    if (seenCharacters.has(character)) continue;
    seenCharacters.add(character);
    const pinyin = characterPinyin.get(character);
    if (!pinyin) throw new Error(`Falta pinyin canónico para el audio de ${character}.`);
    add(character, pinyin, Number(unit.id[0]), 'h');
  }
}
for (const character of hanziCurriculum.legacyCharacters) {
  const pinyin = characterSource.match(new RegExp(`legacy\\('${character}','([^']+)'`))?.[1];
  if (!pinyin) throw new Error(`Falta pinyin del Hanzi histórico ${character}.`);
  add(character, pinyin, 1, 'h');
}

manifest.clips.push(...candidates);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
if (process.argv.includes('--prune')) {
  const audioDirectory = join(root, 'public', 'audio', 'mandarin');
  const currentFiles = new Set(manifest.clips.map((clip) => clip.file));
  for (const file of await readdir(audioDirectory)) {
    if (/^l[123]-[vsh]-[a-f0-9]{10}\.mp3$/.test(file) && !currentFiles.has(file)) await unlink(join(audioDirectory, file));
  }
}
console.log(`Manifest actualizado: ${candidates.length} clips nuevos; ${manifest.clips.length} clips totales.`);
