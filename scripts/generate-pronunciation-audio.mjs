import { readFile, mkdir, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const manifestDefinitions = [
  { path: path.join(projectDirectory, 'data', 'pronunciation.json'), directory: path.join(projectDirectory, 'public', 'audio', 'pinyin') },
  { path: path.join(projectDirectory, 'data', 'mandarin-audio.json'), directory: path.join(projectDirectory, 'public', 'audio', 'mandarin') },
  { path: path.join(projectDirectory, 'data', 'time-audio.json'), directory: path.join(projectDirectory, 'public', 'audio', 'mandarin'), scope: 'time' },
];
const localEnvironment = path.join(projectDirectory, '.env.audio.local');

if (existsSync(localEnvironment)) process.loadEnvFile(localEnvironment);

const apiKey = process.env.OPENAI_API_KEY?.trim();
const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');
const scope = process.argv.find((argument) => argument.startsWith('--scope='))?.split('=', 2)[1];
const only = process.argv.find((argument) => argument.startsWith('--only='))?.split('=', 2)[1];
const voice = 'marin';

if (!apiKey && !dryRun) {
  console.error('Falta OPENAI_API_KEY. Configúrala en la terminal o en .env.audio.local; nunca la copies al repositorio ni al navegador.');
  process.exit(1);
}

const manifests = await Promise.all(manifestDefinitions.filter(definition => !scope || definition.scope === scope).map(async (definition) => ({
  ...definition,
  clips: JSON.parse(await readFile(definition.path, 'utf8')).clips,
})));
const clips = manifests.flatMap((manifest) => manifest.clips.map((clip) => ({ ...clip, directory: manifest.directory })));
const selectedClips = only ? clips.filter((clip) => clip.id === only) : clips;

if (only && !selectedClips.length) {
  console.error(`No existe el clip solicitado: ${only}`);
  process.exit(1);
}

if (dryRun) {
  const existing = selectedClips.filter(clip => existsSync(path.join(clip.directory, clip.file))).length;
  const phrases = selectedClips.filter(clip => clip.id.startsWith('time-s-')).length;
  console.log(`Dry-run: ${selectedClips.length} clips; ${existing} existentes; ${selectedClips.length-existing} faltantes; ${phrases} frases completas; ${selectedClips.length-phrases} tokens/pregunta.`);
  process.exit(0);
}

const baseInstructions = [
  'Habla exclusivamente en mandarín estándar de China continental.',
  'Voz clara de docente de fonética para principiantes.',
  'Pronuncia exactamente el texto chino de entrada, sin traducir, deletrear, explicar ni añadir palabras.',
  'Ritmo lento y natural, con dicción limpia y sin música.'
].join(' ');

let cursor = 0;
let generated = 0;
async function generateNext() {
while (cursor < selectedClips.length) {
  const clip = selectedClips[cursor++];
  const destination = path.join(clip.directory, clip.file);
  await mkdir(path.dirname(destination), { recursive: true });
  if (!force && existsSync(destination)) {
    continue;
  }

  let response;
  for (let attempt = 0; attempt < 5; attempt++) {
    response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice,
      input: clip.input,
      instructions: `${baseInstructions} ${clip.instructions}`,
      response_format: 'mp3'
    })
    });
    if (response.ok || ![429,500,502,503,504].includes(response.status)) break;
    await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
  }

  if (!response.ok) {
    throw new Error(`OpenAI devolvió ${response.status} al generar ${clip.file}. Se detuvo sin registrar el cuerpo de la respuesta.`);
  }

  const temporary = `${destination}.tmp-${process.pid}`;
  await writeFile(temporary, Buffer.from(await response.arrayBuffer()));
  await rename(temporary, destination);
  generated++;
  if (generated % 25 === 0) console.log(`Generados: ${generated}/${selectedClips.length}`);
}
}
await Promise.all(Array.from({ length: scope === 'time' ? 3 : 1 }, () => generateNext()));

console.log(`Listo: ${generated} clips nuevos; ${selectedClips.length - generated} ya existentes.`);
