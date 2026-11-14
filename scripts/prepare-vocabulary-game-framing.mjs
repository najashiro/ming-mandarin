// Measure the visible subject on vocabulary canvases reused in square game cards.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const catalogNames = ['vocabulary', 'lesson4', 'lesson5', 'lessons123', 'lessons123-context', 'lessons123-generated', 'lessons123-pedagogy', 'lessons123-geography'];
const catalogs = await Promise.all(catalogNames.map(async name => JSON.parse(await readFile(`data/${name}-media.json`, 'utf8'))));
const current = new Map(catalogs.flat().map(entry => [entry.wordId, entry]));
const bounds = {};
for (const entry of current.values()) {
  if (entry.status !== 'approved' || entry.presentation !== 'transparent-cutout' || bounds[entry.src]) continue;
  const source = await readFile(`public${entry.src}`);
  if (createHash('sha256').update(source).digest('hex') !== entry.sha256) throw new Error(`Master hash mismatch: ${entry.src}`);
  // Ignore nearly transparent compression noise in the empty margins. Keep fine lines and animal tails.
  const { info } = await sharp(source).trim({ background: '#00000000', threshold: 8, lineArt: true }).raw().toBuffer({ resolveWithObject: true });
  bounds[entry.src] = {
    sha256: entry.sha256, x: -(info.trimOffsetLeft ?? 0), y: -(info.trimOffsetTop ?? 0),
    width: info.width, height: info.height, canvasWidth: entry.width, canvasHeight: entry.height,
  };
}
await writeFile('data/vocabulary-game-framing.json', `${JSON.stringify(bounds, null, 2)}\n`);
console.log(`Measured ${Object.keys(bounds).length} approved images; originals unchanged.`);
