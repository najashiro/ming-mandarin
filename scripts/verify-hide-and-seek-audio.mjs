import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium } from '@playwright/test';

const root = new URL('../', import.meta.url);
const language = JSON.parse(await readFile(new URL('data/hide-and-seek-language.json', root), 'utf8'));
const manifest = JSON.parse(await readFile(new URL('data/hide-and-seek-audio.json', root), 'utf8'));
const transcribe = process.argv.includes('--transcribe');
const clips = [...Object.values(language.animals), ...Object.values(language.questions), ...Object.values(language.feedback)].map(phrase => ({
  ...phrase,
  audioSrc: phrase.audioSrc ?? `/audio/hide-and-seek/${manifest.clips.find(clip => clip.input === phrase.hanzi)?.file}`,
}));
const env = process.env.OPENAI_ENV_FILE || new URL('.env.audio.local', root);
if (transcribe && existsSync(env)) process.loadEnvFile(env);
const apiKey = process.env.OPENAI_API_KEY?.trim();
if (transcribe && !apiKey) throw new Error('Falta la credencial de verificación de audio.');
const variants = { 兒: '儿', 貓: '猫', 對: '对' };
const normalize = text => [...text.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '')].map(char => variants[char] ?? char).join('');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];
let animalSequenceCheck;
try {
  for (const clip of clips) {
    const bytes = await readFile(new URL(`public${clip.audioSrc}`, root));
    if (bytes.length < 1024) throw new Error(`Audio vacío: ${clip.hanzi}`);
    const signal = await page.evaluate(async encoded => {
      const context = new AudioContext();
      try {
        const buffer = await context.decodeAudioData(Uint8Array.from(atob(encoded), c => c.charCodeAt(0)).buffer);
        let energy = 0, peak = 0, active = 0, samples = 0;
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          for (const sample of buffer.getChannelData(channel)) {
            energy += sample * sample;
            peak = Math.max(peak, Math.abs(sample));
            if (Math.abs(sample) > .01) active++;
            samples++;
          }
        }
        const rms = Math.sqrt(energy / samples), activeRatio = active / samples;
        return { duration: buffer.duration, rms, peak, activeRatio, audible: rms >= .002 && peak >= .005 && activeRatio >= .01 };
      } finally { await context.close(); }
    }, bytes.toString('base64'));
    if (!signal.audible) throw new Error(`Sin señal audible: ${clip.hanzi}`);
    const result = { audioSrc: clip.audioSrc, sha256: createHash('sha256').update(bytes).digest('hex'), expected: clip.hanzi, expectedPinyin: clip.pinyin, signal };
    if (transcribe) {
      result.recognitionAttempts = [];
      for (const model of ['gpt-4o-mini-transcribe', 'gpt-4o-transcribe']) {
        const form = new FormData();
        form.append('model', model);
        form.append('language', 'zh');
        form.append('file', new Blob([bytes], { type: 'audio/mpeg' }), clip.audioSrc.split('/').at(-1));
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form });
        if (!response.ok) throw new Error(`Verificación interrumpida: HTTP ${response.status}.`);
        result.heard = (await response.json()).text ?? '';
        result.matches = normalize(result.heard) === normalize(clip.hanzi);
        result.recognitionAttempts.push({ model, heard: result.heard, matches: result.matches });
        if (result.matches) break;
      }
    }
    results.push(result);
    console.log(`${result.matches === false ? 'REVISAR' : 'OK'} ${clip.hanzi}${result.heard ? ` → ${result.heard}` : ''}`);
  }
  // Very short isolated syllables may be transcribed in another language. Check
  // the unchanged animal clips together, without supplying the expected text.
  if (transcribe && results.some(result => !result.matches && Object.values(language.animals).some(animal => animal.audioSrc === result.audioSrc))) {
    const animals = Object.values(language.animals);
    const encoded = await Promise.all(animals.map(async animal => (await readFile(new URL(`public${animal.audioSrc}`, root))).toString('base64')));
    const pcm = await page.evaluate(async sources => {
      const context = new AudioContext({ sampleRate: 24000 });
      const samples = [];
      try {
        for (const source of sources) {
          const buffer = await context.decodeAudioData(Uint8Array.from(atob(source), c => c.charCodeAt(0)).buffer);
          for (const sample of buffer.getChannelData(0)) samples.push(sample);
          for (let index = 0; index < 12000; index++) samples.push(0);
        }
        return samples;
      } finally { await context.close(); }
    }, encoded);
    const wav = Buffer.alloc(44 + pcm.length * 2);
    wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
    wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(24000, 24); wav.writeUInt32LE(48000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
    wav.write('data', 36); wav.writeUInt32LE(pcm.length * 2, 40);
    pcm.forEach((sample, index) => wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), 44 + index * 2));
    const form = new FormData();
    form.append('model', 'gpt-4o-transcribe'); form.append('language', 'zh');
    form.append('file', new Blob([wav], { type: 'audio/wav' }), 'words.wav');
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form });
    if (!response.ok) throw new Error(`Verificación de palabras interrumpida: HTTP ${response.status}.`);
    const heard = (await response.json()).text ?? '';
    animalSequenceCheck = {
      method: 'gpt-4o-transcribe on the four unchanged isolated clips concatenated with 0.5s silence',
      expectedTextSuppliedToASR: false, expected: animals.map(animal => animal.hanzi).join('、'), heard,
      matches: normalize(heard) === animals.map(animal => animal.hanzi).join(''),
    };
    if (animalSequenceCheck.matches) {
      for (const result of results) {
        if (!result.matches && animals.some(animal => animal.audioSrc === result.audioSrc)) result.sequenceVerified = true;
      }
    }
    console.log(`Secuencia de animales: ${animalSequenceCheck.matches ? 'OK' : 'REVISAR'} ${heard}`);
  }
} finally { await browser.close(); }
if (transcribe) {
  await writeFile(new URL('docs/hide-and-seek-audio-review.json', root), JSON.stringify({
    method: 'automatic_speech_recognition_and_decoded_pcm', independentHumanReview: false,
    asrModels: ['gpt-4o-mini-transcribe', 'gpt-4o-transcribe (only when the first result differs)'], expectedTextSuppliedToASR: false,
    scope: 'Current animal words, animal questions and corpus-aligned feedback; three new recordings and seven reused assets', results, ...(animalSequenceCheck ? { animalSequenceCheck } : {}),
  }, null, 2) + '\n');
}
console.log(`Señal audible: ${results.length}/${clips.length}.`);
if (results.some(result => result.matches === false && !result.sequenceVerified)) process.exitCode = 2;
