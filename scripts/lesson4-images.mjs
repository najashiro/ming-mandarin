// Prepare prompts offline; import individually inspected built-in ImageGen PNGs.
// Usage: node scripts/lesson4-images.mjs --prepare
//        node scripts/lesson4-images.mjs --word=v-电视 --input=/path/image.png
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const corpus = await read('data/lesson4-public.json');
const subjects = {
  'v-电视': 'One complete unbranded television, dark glass screen turned off, thin bezel and two complete feet. No remote or other objects.',
  'v-睡觉': 'One adult sleeping peacefully on their side in a complete simple single bed, eyes closed, head on pillow, blanket covering body. Only person, mattress, pillow, blanket and bed frame; all corners visible.',
};
const entries = corpus.vocabulary.map(word => ({
  wordId: word.id, visual: word.visual_ming, status: subjects[word.id] ? 'ready_to_generate' : 'not_selected',
  reason: subjects[word.id] ? 'Concrete subject/action suitable for a transparent cutout.' : 'No new image selected: abstract, contextual or potentially ambiguous; use the text card or existing reviewed asset.',
  prompt: subjects[word.id] ? `Use case: photorealistic-natural. Educational vocabulary cutout for Ming: ${word.hanzi} (${word.pinyin}), ${word.spanish}. Style ming-vocabulary-transparent-subject-golden-v2. ${subjects[word.id]} Photorealistic natural daylight and realistic materials. True transparent alpha background; no room, floor, scenery, colored background, checkerboard, text, logos, UI or symbols. Golden-ratio landscape canvas target 1618x1000. Complete subject on right half x46–96%, y3–96%; left half reserved for live HTML text. Transparent canvas corners; no cropping. Only the isolated subject.` : null,
}));
await writeFile('docs/lesson4-image-prompts.json', JSON.stringify({ styleId: 'ming-vocabulary-transparent-subject-golden-v2', entries }, null, 2) + '\n');
const wordId = process.argv.find(arg => arg.startsWith('--word='))?.slice(7);
const input = process.argv.find(arg => arg.startsWith('--input='))?.slice(8);
if (wordId || input) {
  const entry = entries.find(row => row.wordId === wordId);
  const word = corpus.vocabulary.find(row => row.id === wordId);
  if (!entry?.prompt || !input || !word.visual_ming.image_support) throw new Error('Word/input is not eligible for this batch.');
  const meta = await sharp(input).metadata();
  if (!meta.hasAlpha) throw new Error('The master must contain real alpha.');
  const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + info.channels - 1];
  if ([[0,0],[info.width-1,0],[0,info.height-1],[info.width-1,info.height-1]].some(([x,y]) => alphaAt(x,y) !== 0)) throw new Error('Opaque corners.');
  const slug = wordId === 'v-电视' ? 'television' : 'sleep';
  const directory = 'public/images/vocabulary/lesson4';
  await mkdir(directory, { recursive: true });
  // Preserve alpha and fit without cropping, stretching or thresholding edges.
  const png = await sharp(input).resize(1618, 1000, { fit: 'contain', background: '#00000000' }).png().toBuffer();
  const webp = await sharp(png).webp({ quality: 88 }).toBuffer();
  await writeFile(`${directory}/${slug}.png`, png);
  await writeFile(`${directory}/${slug}.webp`, webp);
  const hash = value => createHash('sha256').update(value).digest('hex');
  let media = [];
  try { media = await read('data/lesson4-media.json'); } catch { /* first import */ }
  const asset = { wordId, sense: word.spanish, hintType: 'image', src: `/images/vocabulary/lesson4/${slug}.webp`,
    alt: `Representación de ${word.spanish}`, description: `Apoyo visual para ${word.hanzi}`, status: 'approved',
    presentation: 'transparent-cutout', visualMode: word.visual_ming.visual_mode, imageQuizEligible: false,
    ambiguityRisk: word.visual_ming.ambiguity_risk, width: 1618, height: 1000, sha256: hash(webp),
    promptSha256: hash(entry.prompt), model: 'built-in-imagegen', quality: 'generated',
    review: 'Revisión del modelo: sujeto, composición y alfa; no revisión humana independiente.',
    provenance: 'ImageGen integrado; prompt reproducible en docs/lesson4-image-prompts.json.' };
  media = [...media.filter(row => row.wordId !== wordId), asset];
  await writeFile('data/lesson4-media.json', JSON.stringify(media, null, 2) + '\n');
  console.log(`Imported ${wordId}: PNG + WebP with alpha verified.`);
}
