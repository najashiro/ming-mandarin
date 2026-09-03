import { createHash } from 'node:crypto';
import { readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = await readFile(join(root, 'seed', 'curriculum.ts'), 'utf8');
const lesson1VocabularySource = await readFile(join(root, 'seed', 'vocabulary.ts'), 'utf8');
const lesson1SentenceSource = await readFile(join(root, 'seed', 'sentences.ts'), 'utf8');
const manifestPath = join(root, 'data', 'mandarin-audio.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const pronunciation = JSON.parse(await readFile(join(root, 'data', 'pronunciation.json'), 'utf8'));
const normalize = (value) => value.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
// L2/L3 se regeneran desde la fuente tipada; L1 conserva sus IDs históricos.
manifest.clips = manifest.clips.filter((clip) => clip.lessonId === 1 && !/^l1-[vs]-[a-f0-9]{10}$/.test(clip.id));
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
  const charactersBlock = block(`const l${lessonId}CharacterMeta`, lessonId === 2 ? 'const l3CharacterMeta' : 'const makeStages');
  for (const match of charactersBlock.matchAll(/\['([^']+)','([^']+)'/g)) add(match[1], match[2], lessonId, 'h');
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
