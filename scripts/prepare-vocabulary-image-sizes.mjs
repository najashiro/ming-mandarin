// Offline web derivatives. The approved master and its review hash stay intact.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const check = process.argv.includes('--check');
const catalogs = await Promise.all(['vocabulary', 'lesson4', 'lesson5', 'lessons123', 'lessons123-context', 'lessons123-generated', 'lessons123-pedagogy', 'lessons123-geography'].map(name => read(`data/${name}-media.json`)));
const current = [...new Map(catalogs.flat().map(entry => [entry.wordId, entry])).values()];
const sources = [...new Map(current.filter(entry => entry.status === 'approved').map(entry => [entry.src, entry])).values()];
const directory = 'public/images/vocabulary/responsive';
const entries = {};
if (!check) await mkdir(directory, { recursive: true });
let originalBytes = 0;
let cardBytes = 0;
for (const source of sources.sort((a, b) => a.src < b.src ? -1 : a.src > b.src ? 1 : 0)) {
  const original = await readFile(`public${source.src}`);
  if (hash(original) !== source.sha256) throw new Error(`Master hash mismatch: ${source.src}`);
  const metadata = await sharp(original).metadata();
  const widths = [400, 800, 1200].filter(width => width < metadata.width);
  const variants = [];
  for (const width of widths) {
    const resized = await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 80, alphaQuality: 100 }).toBuffer();
    // Very simple diagrams can already be smaller than a recompressed version.
    if (resized.length >= original.length) continue;
    const sha256 = hash(resized);
    const filename = `${sha256}.webp`;
    if (check) {
      if (hash(await readFile(`${directory}/${filename}`)) !== sha256) throw new Error(`Derivative hash mismatch: ${filename}`);
    } else {
      const existing = await readFile(`${directory}/${filename}`).catch(() => null);
      if (!existing?.equals(resized)) await writeFile(`${directory}/${filename}`, resized);
    }
    variants.push({ width, src: `/images/vocabulary/responsive/${filename}`, bytes: resized.length });
  }
  if (!variants.length) continue;
  entries[source.src] = { sha256: source.sha256, width: metadata.width, height: metadata.height, variants };
  originalBytes += original.length;
  cardBytes += (variants.find(variant => variant.width >= 800) ?? variants.at(-1)).bytes;
}
const output = `${JSON.stringify({ schema_version: 1, entries }, null, 2)}\n`;
if (check) {
  if (await readFile('data/vocabulary-image-sizes.json', 'utf8') !== output) throw new Error('Responsive image manifest is stale. Run node scripts/prepare-vocabulary-image-sizes.mjs.');
} else await writeFile('data/vocabulary-image-sizes.json', output);
console.log(JSON.stringify({ sources: Object.keys(entries).length, originalBytes, cardBytes, reductionAt2x: `${Math.round((1 - cardBytes / originalBytes) * 100)}%` }));
