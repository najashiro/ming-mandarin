import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { timeAudioFile } from '../lib/time-audio-key.mjs';
import { loadTimeGame } from './load-time-game.mjs';
import { chromium } from 'playwright';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const localEnvironment = path.join(projectDirectory, '.env.audio.local');
const manifestDefinitions = [
  { path: path.join(projectDirectory, 'data', 'pronunciation.json'), directory: path.join(projectDirectory, 'public', 'audio', 'pinyin') },
  { path: path.join(projectDirectory, 'data', 'mandarin-audio.json'), directory: path.join(projectDirectory, 'public', 'audio', 'mandarin') },
  { path: path.join(projectDirectory, 'data', 'time-audio.json'), directory: path.join(projectDirectory, 'public', 'audio', 'mandarin'), scope: 'time' },
];

if (existsSync(localEnvironment)) process.loadEnvFile(localEnvironment);
const apiKey = process.env.OPENAI_API_KEY?.trim();
const manifests = await Promise.all(manifestDefinitions.map(async (definition) => ({
  ...definition,
  clips: JSON.parse(await readFile(definition.path, 'utf8')).clips,
})));
const clips = manifests.flatMap((manifest) => manifest.clips.map((clip) => ({ ...clip, directory: manifest.directory, scope: manifest.scope })));
const only = process.argv.find((argument) => argument.startsWith('--only='))?.split('=', 2)[1];
const signalOnly = process.argv.includes('--signal-only');
const scope = process.argv.find((argument) => argument.startsWith('--scope='))?.split('=', 2)[1];
const selectedClips = clips.filter(clip => (!only || clip.id===only) && (!scope || clip.scope===scope));
const minimumRms = 0.002;
const minimumPeak = 0.005;
const minimumActiveRatio = 0.01;
if (only && !selectedClips.length) {
  console.error(`No existe el clip solicitado: ${only}`);
  process.exit(1);
}
const transcriptionEquivalents = new Map([
  ['語', '语'], ['學', '学'], ['習', '习'], ['國', '国'], ['這', '这'], ['兩', '两'], ['現','现'], ['點','点'], ['幾','几'], ['鐘','钟'],
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
const ids=new Set(clips.map(clip=>clip.id));
if(ids.size!==clips.length)throw new Error('IDs de audio duplicados.');
const timeClips=manifests.find(manifest=>manifest.scope==='time')?.clips??[];
const timeTexts=new Set(timeClips.map(clip=>normalize(clip.input)));
if(timeTexts.size!==timeClips.length)throw new Error('Textos de horas duplicados.');
const [{buildAcceptedTimeAnswers},{timeTokens}]=await loadTimeGame();
const knownTexts=new Set(clips.map(clip=>normalize(clip.input)));
for(const text of [...timeTokens.map(token=>token.hanzi),'现在','现在几点？']){
  if(!knownTexts.has(normalize(text)))throw new Error(`Audio de token/pregunta sin manifiesto: ${text}`);
}
for(let hour=1;hour<=12;hour++)for(let minute=0;minute<60;minute++)for(const answer of buildAcceptedTimeAnswers(hour,minute)){
  const sentence=`现在${answer.hanzi}`;
  if(!knownTexts.has(normalize(sentence)))throw new Error(`Audio sin manifiesto: ${sentence}`);
  const expected=timeAudioFile(sentence,'s');
  const recorded=timeClips.find(clip=>clip.input===sentence);
  if(recorded&&recorded.file!==expected)throw new Error(`ID inestable: ${sentence}`);
}
console.log(`Manifest de horas: ${timeClips.length} entradas únicas; respuestas aceptadas cubiertas.`);

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
