// Offline import of the explicitly authorized ImageGen CLI outputs.
// API credentials are never read by this script or included in a manifest.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const digest = value => createHash('sha256').update(value).digest('hex');
const manifestPath = 'docs/corpus-completion-image-prompts.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const directory = 'public/images/vocabulary/corpus-completion';
await mkdir(directory, { recursive: true });
const media = [], assets = [];
for (const entry of manifest.entries) {
  const master = `output/imagegen/corpus-completion/${entry.master}`;
  const bytes = await readFile(master);
  const metadata = await sharp(bytes).metadata();
  if (!metadata.hasAlpha) throw new Error(`Missing alpha: ${master}`);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const corners = [0, info.width - 1, (info.height - 1) * info.width, info.width * info.height - 1];
  if (corners.some(index => data[index * 4 + 3] !== 0)) throw new Error(`Opaque corner: ${master}`);
  // Normalize subject placement independently of the model's empty margins.
  // Trim alpha, then contain the complete subject inside the right-hand zone.
  // Image models can leave alpha 1–8 noise over the entire nominally empty
  // canvas. Ignore that invisible noise when measuring the visible subject.
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] <= 8) continue;
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  if (right < left || bottom < top) throw new Error(`Empty subject: ${master}`);
  left = Math.max(0, left - 4); top = Math.max(0, top - 4);
  right = Math.min(info.width - 1, right + 4); bottom = Math.min(info.height - 1, bottom + 4);
  const subject = await sharp(bytes).extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .resize(760, 880, { fit: 'inside' }).png().toBuffer();
  const bounds = await sharp(subject).metadata();
  const normalized = await sharp({ create: { width: 1618, height: 1000, channels: 4, background: '#00000000' } })
    .composite([{ input: subject, left: 810 + Math.floor((760 - bounds.width) / 2), top: 60 + Math.floor((880 - bounds.height) / 2) }])
    .png().toBuffer();
  const web = await sharp(normalized).webp({ quality: 88, alphaQuality: 100 }).toBuffer();
  const sha256 = digest(web), src = `/images/vocabulary/corpus-completion/${entry.slug}-${sha256.slice(0, 12)}.webp`;
  await writeFile(`public${src}`, web);
  await writeFile(`output/imagegen/corpus-completion/${entry.slug}-normalized.png`, normalized);
  const review = '2026-11-19 · Revisión visual por Codex, sin revisión humana independiente; sujeto completo, sentido de apoyo, alfa real y encuadre comprobados. No habilita reconocimiento por imagen.';
  for (const word of entry.words) media.push({
    wordId: word.id, sense: word.spanish, hintType: 'image', src, sha256,
    alt: `Apoyo visual: ${word.spanish}`, description: `Ilustración editorial de apoyo para ${word.hanzi}`,
    status: 'approved', presentation: 'transparent-cutout', visualMode: 'concept_scene',
    imageQuizEligible: false, ambiguityRisk: 'medium', width: 1618, height: 1000,
    promptSha256: digest(entry.prompt), model: entry.model, quality: entry.quality, review,
    provenance: 'OpenAI Image API autorizada por el usuario; prompts en docs/corpus-completion-image-prompts.json. Ilustración editorial, no fuente curricular.',
  });
  entry.status = 'approved';
  assets.push({ slug: entry.slug, wordIds: entry.ids, master, masterSha256: digest(bytes), normalizedSha256: digest(normalized), src, sha256, bytes: web.length, width: 1618, height: 1000, alpha: true, review });
}
await writeFile('data/corpus-completion-media.json', `${JSON.stringify(media, null, 2)}\n`);
await writeFile('docs/corpus-completion-image-assets.json', `${JSON.stringify({ styleId: manifest.styleId, assets }, null, 2)}\n`);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${assets.length} photographs; ${media.length} words; true alpha and safe placement verified.`);
