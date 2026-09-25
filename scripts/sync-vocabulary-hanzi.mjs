import { readFile, writeFile } from 'node:fs/promises';
const entries = JSON.parse((await readFile('data/vocabulary-hanzi.json', 'utf8')).replace(/^\uFEFF/, ''));
const manifest = JSON.parse(await readFile('public/hanzi-data/manifest.json', 'utf8'));
for (const entry of entries) {
  const raw = await readFile(`node_modules/hanzi-writer-data/${entry.hanzi}.json`, 'utf8');
  const data = JSON.parse(raw);
  if (!data.strokes?.length || data.strokes.length !== data.medians?.length) throw new Error(`Invalid strokes: ${entry.hanzi}`);
  await writeFile(`public/hanzi-data/${entry.hanzi}.json`, `${JSON.stringify(data)}\n`);
  manifest[entry.hanzi] = { available: true, strokeCount: data.strokes.length };
}
await writeFile('public/hanzi-data/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${entries.length} glifos de consulta sincronizados; no añadidos a objetivos curriculares.`);
