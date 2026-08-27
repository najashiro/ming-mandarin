import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, 'node_modules', 'hanzi-writer-data');
const destination = join(root, 'public', 'hanzi-data');
const licenses = join(root, 'public', 'licenses');
const curriculum = JSON.parse(await readFile(join(root, 'data', 'lesson1-hanzi.json'), 'utf8'));
const lessonCharacters = curriculum.stages.flatMap((stage) => stage.characters);

await mkdir(destination, { recursive: true });
await mkdir(licenses, { recursive: true });

let previousManifest = {};
try {
  previousManifest = JSON.parse(await readFile(join(destination, 'manifest.json'), 'utf8'));
} catch {
  // A first synchronization starts with an empty manifest.
}

const characters = [...new Set([...Object.keys(previousManifest), ...lessonCharacters])];
const manifest = {};
const added = [];
for (const character of characters) {
  const filename = `${character}.json`;
  const destinationFile = join(destination, filename);
  let raw;
  try {
    raw = await readFile(destinationFile, 'utf8');
  } catch {
    raw = await readFile(join(source, filename), 'utf8');
    await writeFile(destinationFile, `${JSON.stringify(JSON.parse(raw))}\n`, 'utf8');
    added.push(character);
  }
  const data = JSON.parse(raw);
  if (!Array.isArray(data.strokes) || !Array.isArray(data.medians) || data.strokes.length !== data.medians.length) {
    throw new Error(`Datos de trazos inválidos para ${character}.`);
  }
  manifest[character] = { available: true, strokeCount: data.strokes.length };
}

await writeFile(join(destination, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await copyFile(join(root, 'node_modules', 'hanzi-writer', 'LICENSE'), join(licenses, 'HANZI_WRITER_MIT.txt'));
await copyFile(join(source, 'ARPHICPL.TXT'), join(licenses, 'ARPHICPL.TXT'));

console.log(`Verificados ${characters.length} caracteres; añadidos ${added.length}: ${added.join(' ') || 'ninguno'}.`);
