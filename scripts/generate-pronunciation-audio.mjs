import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const manifestPath = path.join(projectDirectory, 'data', 'pronunciation.json');
const outputDirectory = path.join(projectDirectory, 'public', 'audio', 'pinyin');
const localEnvironment = path.join(projectDirectory, '.env.audio.local');

if (existsSync(localEnvironment)) process.loadEnvFile(localEnvironment);

const apiKey = process.env.OPENAI_API_KEY?.trim();
const force = process.argv.includes('--force');
const only = process.argv.find((argument) => argument.startsWith('--only='))?.split('=', 2)[1];
const voice = process.env.OPENAI_TTS_VOICE?.trim() || 'marin';

if (!apiKey) {
  console.error('Falta OPENAI_API_KEY. Configúrala en la terminal o en .env.audio.local; nunca la copies al repositorio ni al navegador.');
  process.exit(1);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
await mkdir(outputDirectory, { recursive: true });
const selectedClips = only ? manifest.clips.filter((clip) => clip.id === only) : manifest.clips;

if (only && !selectedClips.length) {
  console.error(`No existe el clip solicitado: ${only}`);
  process.exit(1);
}

const baseInstructions = [
  'Habla exclusivamente en mandarín estándar de China continental.',
  'Voz clara de docente de fonética para principiantes.',
  'Pronuncia exactamente el texto chino de entrada, sin traducir, deletrear, explicar ni añadir palabras.',
  'Ritmo lento y natural, con dicción limpia y sin música.'
].join(' ');

for (const clip of selectedClips) {
  const destination = path.join(outputDirectory, clip.file);
  if (!force && existsSync(destination)) {
    console.log(`Ya existe: ${clip.file}`);
    continue;
  }

  console.log(`Generando: ${clip.file}`);
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
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

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`OpenAI devolvió ${response.status} al generar ${clip.file}: ${detail}`);
  }

  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

console.log(`Listo: ${selectedClips.length} clips generados en ${outputDirectory}`);
