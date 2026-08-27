import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const characters = ['力', '生', '言', '人', '木', '羊', '井', '土', '叫', '姓', '么', '名', '最', '近', '认', '识', '样', '林', '进', '坐', '你', '好', '我'];
const source = join(root, 'node_modules', 'hanzi-writer-data');
const destination = join(root, 'public', 'hanzi-data');
const licenses = join(root, 'public', 'licenses');

await mkdir(destination, { recursive: true });
await mkdir(licenses, { recursive: true });

const manifest = {};
for (const character of characters) {
  const filename = `${character}.json`;
  const raw = await readFile(join(source, filename), 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.strokes) || !Array.isArray(data.medians) || data.strokes.length !== data.medians.length) {
    throw new Error(`Datos de trazos inválidos para ${character}.`);
  }
  await writeFile(join(destination, filename), `${JSON.stringify(data)}\n`, 'utf8');
  manifest[character] = { available: true, strokeCount: data.strokes.length };
}

await writeFile(join(destination, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await copyFile(join(root, 'node_modules', 'hanzi-writer', 'LICENSE'), join(licenses, 'HANZI_WRITER_MIT.txt'));
await copyFile(join(source, 'ARPHICPL.TXT'), join(licenses, 'ARPHICPL.TXT'));

console.log(`Sincronizados ${characters.length} caracteres y sus licencias.`);
