// Measure alpha bounds for game display; never modify an approved image.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const entries = [...new Map([...(await read('data/vocabulary-media.json')), ...(await read('data/lesson4-media.json'))].map(entry => [entry.wordId, entry])).values()];
const bounds = {};
for (const entry of entries.filter(entry => entry.status === 'approved' && entry.presentation === 'transparent-cutout')) {
  const { info } = await sharp(`public${entry.src}`).trim({ background: '#00000000', threshold: 0 }).toBuffer({ resolveWithObject: true });
  bounds[entry.src] = { sha256: entry.sha256, x: -(info.trimOffsetLeft ?? 0), y: -(info.trimOffsetTop ?? 0),
    width: info.width, height: info.height, canvasWidth: entry.width, canvasHeight: entry.height };
}
await writeFile('data/vocabulary-game-framing.json', `${JSON.stringify(bounds, null, 2)}\n`);
console.log(`Measured ${Object.keys(bounds).length} approved images; originals unchanged.`);
