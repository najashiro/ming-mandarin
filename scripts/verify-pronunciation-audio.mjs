import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const localEnvironment = path.join(projectDirectory, '.env.audio.local');
const manifestDefinitions = [
  { path: path.join(projectDirectory, 'data', 'pronunciation.json'), directory: path.join(projectDirectory, 'public', 'audio', 'pinyin') },
  { path: path.join(projectDirectory, 'data', 'mandarin-audio.json'), directory: path.join(projectDirectory, 'public', 'audio', 'mandarin') },
];

if (existsSync(localEnvironment)) process.loadEnvFile(localEnvironment);
const apiKey = process.env.OPENAI_API_KEY?.trim();
const manifests = await Promise.all(manifestDefinitions.map(async (definition) => ({
  ...definition,
  clips: JSON.parse(await readFile(definition.path, 'utf8')).clips,
})));
const clips = manifests.flatMap((manifest) => manifest.clips.map((clip) => ({ ...clip, directory: manifest.directory })));
const only = process.argv.find((argument) => argument.startsWith('--only='))?.split('=', 2)[1];
const signalOnly = process.argv.includes('--signal-only');
const selectedClips = only ? clips.filter((clip) => clip.id === only) : clips;
const minimumRms = 0.002;
const minimumPeak = 0.005;
const minimumActiveRatio = 0.01;
if (only && !selectedClips.length) {
  console.error(`No existe el clip solicitado: ${only}`);
  process.exit(1);
}
const transcriptionEquivalents = new Map([
  ['語', '语'], ['學', '学'], ['習', '习'], ['國', '国'], ['這', '这'], ['兩', '两'],
]);
const normalize = (value) => value
  .replace(/[^\u3400-\u9fff]/g, '')
  .split('')
  .map((character) => transcriptionEquivalents.get(character) ?? character)
  .join('');
const results = [];
const staticFiles = [];

for (const clip of selectedClips) {
  const filePath = path.join(clip.directory, clip.file);
  const size = existsSync(filePath) ? (await stat(filePath)).size : 0;
  if (size < 1024) throw new Error(`Audio ausente o vacío: ${clip.file}`);
  staticFiles.push({ ...clip, filePath });
}

console.log(`Archivos estáticos: ${selectedClips.length}/${selectedClips.length} presentes y no vacíos.`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const signalResults = [];
try {
  for (const clip of staticFiles) {
    const bytes = (await readFile(clip.filePath)).toString('base64');
    const signal = await page.evaluate(async ({ bytes, minimumRms, minimumPeak, minimumActiveRatio }) => {
      const encoded = Uint8Array.from(atob(bytes), (value) => value.charCodeAt(0));
      const context = new AudioContext();
      const buffer = await context.decodeAudioData(encoded.buffer);
      let energy = 0;
      let peak = 0;
      let activeSamples = 0;
      let totalSamples = 0;

      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        const samples = buffer.getChannelData(channel);
        for (const sample of samples) {
          const absolute = Math.abs(sample);
          energy += sample * sample;
          peak = Math.max(peak, absolute);
          if (absolute > 0.01) activeSamples += 1;
          totalSamples += 1;
        }
      }
      await context.close();
      const rms = Math.sqrt(energy / totalSamples);
      const activeRatio = activeSamples / totalSamples;
      return {
        duration: buffer.duration,
        rms,
        peak,
        activeRatio,
        audible: rms >= minimumRms && peak >= minimumPeak && activeRatio >= minimumActiveRatio,
      };
    }, { bytes, minimumRms, minimumPeak, minimumActiveRatio });
    signalResults.push({ ...clip, ...signal });
  }
} finally {
  await browser.close();
}

const inaudible = signalResults.filter((result) => !result.audible);
if (inaudible.length) {
  for (const result of inaudible) {
    console.error(`SIN SEÑAL ${result.file}: duración=${result.duration.toFixed(3)}s rms=${result.rms.toFixed(5)} pico=${result.peak.toFixed(5)} actividad=${(result.activeRatio * 100).toFixed(1)}%`);
  }
  console.error(`Señal PCM: ${signalResults.length - inaudible.length}/${signalResults.length} clips audibles.`);
  process.exit(2);
}
console.log(`Señal PCM: ${signalResults.length}/${signalResults.length} clips audibles.`);

if (signalOnly) {
  console.log('Verificación de transcripción omitida por --signal-only.');
  process.exit(0);
}

if (!apiKey) {
  console.log('Verificación de transcripción omitida: no hay OPENAI_API_KEY en este entorno.');
  process.exit(0);
}

for (const clip of selectedClips) {
  const filePath = path.join(clip.directory, clip.file);
  const form = new FormData();
  form.append('model', 'gpt-4o-mini-transcribe');
  form.append('language', 'zh');
  form.append('file', new Blob([await readFile(filePath)], { type: 'audio/mpeg' }), clip.file);

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`OpenAI devolvió ${response.status} al verificar ${clip.file}: ${detail}`);
  }

  const transcript = (await response.json()).text ?? '';
  const expected = normalize(clip.input);
  const heard = normalize(transcript);
  const matches = heard === expected;
  const recognized = heard.length > 0;
  results.push({ file: clip.file, expected, heard, matches, recognized });
  console.log(`${matches ? 'OK' : recognized ? 'DIFERENTE / REVISAR' : 'FALLO'} ${clip.file}: ${heard || '(vacío)'}`);
}

const failed = results.filter((result) => !result.recognized);
const exact = results.filter((result) => result.matches).length;
console.log(`Resultado: ${results.length - failed.length}/${results.length} contienen habla reconocible; ${exact}/${results.length} coinciden con la escritura esperada o su equivalente tradicional.`);
if (failed.length) process.exitCode = 2;
