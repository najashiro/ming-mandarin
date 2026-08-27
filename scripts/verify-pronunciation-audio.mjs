import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const localEnvironment = path.join(projectDirectory, '.env.audio.local');
const manifestPath = path.join(projectDirectory, 'data', 'pronunciation.json');
const audioDirectory = path.join(projectDirectory, 'public', 'audio', 'pinyin');

if (existsSync(localEnvironment)) process.loadEnvFile(localEnvironment);
const apiKey = process.env.OPENAI_API_KEY?.trim();
if (!apiKey) {
  console.error('Falta OPENAI_API_KEY para verificar los clips.');
  process.exit(1);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const only = process.argv.find((argument) => argument.startsWith('--only='))?.split('=', 2)[1];
const selectedClips = only ? manifest.clips.filter((clip) => clip.id === only) : manifest.clips;
if (only && !selectedClips.length) {
  console.error(`No existe el clip solicitado: ${only}`);
  process.exit(1);
}
const normalize = (value) => value.replace(/[^\u3400-\u9fff]/g, '');
const results = [];

for (const clip of selectedClips) {
  const filePath = path.join(audioDirectory, clip.file);
  const form = new FormData();
  form.append('model', 'gpt-4o-mini-transcribe');
  form.append('language', 'zh');
  form.append('prompt', '普通话发音练习。请只转写听到的汉字，不要解释。');
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
  console.log(`${matches ? 'OK' : recognized ? 'HOMÓFONO / REVISAR' : 'FALLO'} ${clip.file}: ${heard || '(vacío)'}`);
}

const failed = results.filter((result) => !result.recognized);
const exact = results.filter((result) => result.matches).length;
console.log(`Resultado: ${results.length - failed.length}/${results.length} contienen habla reconocible; ${exact}/${results.length} coinciden exactamente pese a los homófonos.`);
if (failed.length) process.exitCode = 2;
