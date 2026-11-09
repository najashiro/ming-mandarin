// Exact count diagrams replace generated photos with incorrect quantities.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const hash = b => createHash('sha256').update(b).digest('hex');
const media = JSON.parse(await fs.readFile('data/vocabulary-media.json', 'utf8'));
const entries = [], prompts = [];
await fs.mkdir('public/images/vocabulary/lessons123', { recursive: true });
for (const [hanzi, count] of [['八',8], ['百',100], ['千',1000], ['二十',20], ['二十五',25]]) {
  const wordId = `v-${hanzi}`, original = media.find(x => x.wordId === wordId);
  let marks = '';
  for (let i = 0; i < count; i++) {
    let x, y, radius;
    if (count >= 100) {
      const group = Math.floor(i / 100), within = i % 100;
      const cols = count === 1000 ? 2 : 1;
      const scale = count === 1000 ? 12 : 42;
      x = 910 + (group % cols) * 220 + (within % 10) * scale;
      y = 290 + Math.floor(group / cols) * 135 + Math.floor(within / 10) * scale;
      radius = count === 1000 ? 4 : 13;
    } else {
      const group = Math.floor(i / 10), within = i % 10;
      x = 900 + (within % 5) * 90;
      y = 360 + group * 160 + Math.floor(within / 5) * 65;
      radius = 22;
    }
    marks += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${Math.floor(i / (count >= 100 ? 100 : 10)) % 2 ? '#b45b32' : '#3c7868'}"/>`;
  }
  const prompt = `Diagrama Míng: ${count} puntos exactos agrupados en decenas o centenas; numeral ${count} y pinyin de ${hanzi}, transparencia y sin quiz de respuesta oculta.`;
  const word = JSON.parse(await fs.readFile('data/lessons123-public.json', 'utf8')).vocabulary.find(x => x.id === wordId);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1618" height="1000" viewBox="0 0 1618 1000"><text x="1120" y="210" text-anchor="middle" font-family="sans-serif" font-size="128" fill="#315848">${count}</text><text x="1120" y="270" text-anchor="middle" font-family="sans-serif" font-size="50" fill="#315848">${word.pinyin}</text>${marks}</svg>`;
  const bytes = await sharp(Buffer.from(svg)).webp({ lossless: true }).toBuffer();
  const filename = `count-${count}-${hash(bytes).slice(0,12)}.webp`;
  await fs.writeFile(`public/images/vocabulary/lessons123/${filename}`, bytes);
  prompts.push({wordId,prompt});
  entries.push({ ...original, src: `/images/vocabulary/lessons123/${filename}`, status: 'approved',
    alt: `${count} puntos agrupados para contar ${original.sense}`, description: `Diagrama de cantidad exacta: ${count} puntos.`,
    sha256: hash(bytes), promptSha256: hash(prompt), model: 'deterministic-svg', quality: 'lossless',
    imageQuizEligible: false, review: `2026-11-04 · ${count} elementos verificados por construcción y revisión visual del modelo. Sin validación humana independiente.`,
    provenance: 'Diagrama editorial Míng generado con SVG; no es una ilustración del libro.' });
}
await fs.writeFile('data/lessons123-media.json', JSON.stringify(entries, null, 2) + '\n');
await fs.writeFile('docs/lessons123-count-prompts.json', JSON.stringify({entries:prompts}, null, 2) + '\n');
console.log({ diagrams: entries.length });
