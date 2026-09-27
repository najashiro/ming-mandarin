import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const promptCatalog = JSON.parse(readFileSync(join(root, 'docs/vocabulary-image-prompts.json'), 'utf8'));
const corpus = JSON.parse(readFileSync(join(root, 'data/corpus-v21-public.json'), 'utf8'));
const sourceDir = join(root, 'output/imagegen/vocabulary-master');
const normalizedDir = join(root, 'output/imagegen/vocabulary-normalized');
const publicDir = join(root, 'public/images/vocabulary');
mkdirSync(normalizedDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });

const sha256 = value => createHash('sha256').update(value).digest('hex');
const results = [];
const missing = [];

for (const entry of promptCatalog.entries) {
  const source = join(sourceDir, entry.output);
  if (!existsSync(source)) {
    missing.push(entry.wordId);
    continue;
  }
  const input = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = input.data;
  let foreground = 0;
  for (let offset = 3; offset < rgba.length; offset += 4) {
    const alpha = rgba[offset];
    rgba[offset] = alpha > 240 ? 255 : 0;
    if (rgba[offset]) foreground++;
  }
  if (!foreground) throw new Error(`No opaque subject after alpha cleanup: ${entry.wordId}`);
  const normalized = await sharp(rgba, { raw: input.info })
    .resize({ width: 1500, height: 1000, fit: 'contain', position: 'east', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ left: 59, right: 59, top: 0, bottom: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  const normalizedPath = join(normalizedDir, entry.output);
  writeFileSync(normalizedPath, normalized);
  const publicPath = join(publicDir, entry.public_output);
  await sharp(normalized).webp({ quality: 86, alphaQuality: 100, smartSubsample: true }).toFile(publicPath);
  const publicBuffer = readFileSync(publicPath);
  const metadata = await sharp(publicBuffer).metadata();
  const pixels = await sharp(publicBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cornerOffsets = [3, (pixels.info.width - 1) * 4 + 3, ((pixels.info.height - 1) * pixels.info.width) * 4 + 3, (pixels.info.width * pixels.info.height - 1) * 4 + 3];
  if (cornerOffsets.some(offset => pixels.data[offset] !== 0)) throw new Error(`Non-transparent corner: ${entry.wordId}`);
  results.push({
    wordId: entry.wordId,
    sense: entry.spanish,
    hintType: 'image',
    src: `/images/vocabulary/${entry.public_output}`,
    alt: `Representación visual de ${entry.spanish}`,
    description: `Apoyo visual para ${entry.hanzi} (${entry.pinyin}): ${entry.spanish}`,
    status: 'generated',
    presentation: 'transparent-cutout',
    visualMode: entry.visual_ming.visual_mode,
    imageQuizEligible: entry.visual_ming.image_quiz_eligible,
    ambiguityRisk: entry.visual_ming.ambiguity_risk,
    width: metadata.width,
    height: metadata.height,
    sha256: sha256(publicBuffer),
    promptSha256: entry.prompt_sha256,
    model: entry.model,
    quality: entry.quality,
    review: 'Validación técnica automatizada de alfa, dimensiones y procedencia; pendiente de revisión humana semántica independiente.',
    provenance: 'OpenAI Image API mediante la clave local del usuario; corpus y clasificación visual sin modificaciones.',
  });
}

if (missing.length) throw new Error(`Missing ${missing.length} generated masters; first IDs: ${missing.slice(0, 10).join(', ')}`);
if (results.length !== 305) throw new Error(`Expected 305 published images, received ${results.length}`);

writeFileSync(join(root, 'data/vocabulary-media.json'), `${JSON.stringify(results, null, 2)}\n`);
writeFileSync(join(root, 'docs/vocabulary-image-manifest.json'), `${JSON.stringify({
  schema_version: 1,
  style_id: promptCatalog.style_id,
  corpus_version: corpus.version,
  generated_with: 'openai_image_api',
  image_count: results.length,
  excluded_visual_mode_none: corpus.vocabulary.length - results.length,
  master_location: 'output/imagegen/vocabulary-normalized (local build artifact, gitignored)',
  public_location: 'public/images/vocabulary',
  entries: results,
}, null, 2)}\n`);
console.log(JSON.stringify({ published: results.length, publicDir, manifest: 'docs/vocabulary-image-manifest.json' }, null, 2));
