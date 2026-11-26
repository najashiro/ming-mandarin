// Offline by default. Only --transcribe makes an explicitly requested API call.
// Evidence is retained only when both the audio SHA and its documented reading match.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const signalPath = resolve(root, 'docs/lesson6-dialogue-audio-verification.json');
const transcriptPath = resolve(root, 'docs/lesson6-dialogue-audio-transcription.json');
const manifestPath = resolve(root, 'data/lesson6-dialogue-audio.json');
const availablePath = resolve(root, 'data/lesson6-dialogue-audio-available.json');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const save = (file, value) => {
  mkdirSync(dirname(file), { recursive: true });
  const temporary = `${file}.tmp-${process.pid}`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, file);
};
const argument = flag => {
  const pair = process.argv.find(value => value.startsWith(`${flag}=`));
  if (pair) return pair.slice(flag.length + 1);
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a path`);
  return value;
};
const normalizeText = value => value.normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');
const manifest = readJson(manifestPath);
if (!Array.isArray(manifest.clips) || !manifest.clips.length) throw new Error('The L6 dialogue audio manifest must contain clips.');
const ids = new Set();
const files = new Set();
for (const clip of manifest.clips) {
  if (!clip.id || !clip.input || !clip.expectedPinyin || !/^[a-z0-9-]+\.mp3$/.test(clip.file)) throw new Error('Invalid L6 dialogue audio manifest entry.');
  if (ids.has(clip.id) || files.has(clip.file)) throw new Error(`Duplicate L6 dialogue audio entry: ${clip.id}`);
  ids.add(clip.id);
  files.add(clip.file);
}
const idsFile = argument('--ids-file');
const selection = idsFile ? readJson(resolve(process.cwd(), idsFile)) : [...ids];
if (!Array.isArray(selection) || !selection.length || selection.some(id => typeof id !== 'string' || !ids.has(id)) || new Set(selection).size !== selection.length) {
  throw new Error('The IDs file must contain unique existing L6 dialogue audio IDs.');
}
const selected = new Set(selection);
const records = manifest.clips.map(clip => {
  const file = resolve(root, 'public/audio/mandarin', clip.file);
  const metadata = { id: clip.id, file: clip.file, input: clip.input, expectedPinyin: clip.expectedPinyin };
  if (!existsSync(file)) return { ...metadata, error: 'Missing MP3 file' };
  const bytes = readFileSync(file);
  return { ...metadata, sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
});
const byId = new Map(records.map(record => [record.id, record]));
const currentEvidence = row => {
  const clip = byId.get(row.id);
  return Boolean(clip?.sha256 && row.sha256 === clip.sha256 && row.input === clip.input && row.expectedPinyin === clip.expectedPinyin && row.file === clip.file);
};
const priorRows = file => existsSync(file) ? (readJson(file).results ?? []).filter(currentEvidence) : [];
const signalResults = new Map(priorRows(signalPath).map(row => [row.id, row]));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.evaluate(() => { window.lesson6DialogueAudioContext = new AudioContext(); });
  for (const clip of records.filter(record => selected.has(record.id))) {
    if (clip.error || clip.bytes < 1024) {
      signalResults.set(clip.id, { ...clip, decoded: false, audible: false, error: clip.error ?? 'Empty or truncated MP3 file' });
      continue;
    }
    const encoded = readFileSync(resolve(root, 'public/audio/mandarin', clip.file)).toString('base64');
    const result = await page.evaluate(async bytes => {
      try {
        const buffer = await window.lesson6DialogueAudioContext.decodeAudioData(Uint8Array.from(atob(bytes), c => c.charCodeAt(0)).buffer);
        let power = 0;
        let peak = 0;
        let active = 0;
        const count = buffer.length * buffer.numberOfChannels;
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          for (const sample of buffer.getChannelData(channel)) {
            power += sample * sample;
            peak = Math.max(peak, Math.abs(sample));
            if (Math.abs(sample) > 0.01) active++;
          }
        }
        const rms = Math.sqrt(power / count);
        const activeRatio = active / count;
        return {
          decoded: true, duration: buffer.duration, rms, peak, activeRatio,
          audible: buffer.duration >= 0.2 && rms >= 0.002 && peak >= 0.005 && activeRatio >= 0.01,
        };
      } catch {
        return { decoded: false, audible: false, error: 'MP3 decoding failed' };
      }
    }, encoded);
    signalResults.set(clip.id, { ...clip, ...result });
  }
  await page.evaluate(() => window.lesson6DialogueAudioContext.close());
} finally {
  await browser.close();
}
const orderedSignals = records.flatMap(clip => signalResults.has(clip.id) ? [signalResults.get(clip.id)] : []);
const signalFailures = orderedSignals.filter(row => !row.audible);
const unchecked = records.filter(clip => !signalResults.has(clip.id)).map(clip => clip.id);
save(signalPath, {
  schema_version: 1,
  method: 'Chromium AudioContext MP3 decode and PCM signal analysis. Not pronunciation verification.',
  total: records.length, checked: orderedSignals.length, failures: signalFailures.map(row => row.id), unchecked,
  results: orderedSignals,
});
console.log(JSON.stringify({ total: records.length, checked: orderedSignals.length, audible: orderedSignals.length - signalFailures.length, failures: signalFailures.map(row => row.id), unchecked: unchecked.length }));

// Always prune stale transcription evidence, even during an offline repair check.
const transcriptResults = new Map(priorRows(transcriptPath).map(row => [row.id, row]));
function writeTranscripts() {
  const results = records.flatMap(clip => transcriptResults.has(clip.id) ? [transcriptResults.get(clip.id)] : []);
  save(transcriptPath, {
    schema_version: 1,
    method: 'Independent gpt-4o-transcribe recognition in Chinese, requested in simplified characters; no expected answer supplied. Differences require review. Not human listening or tone verification.',
    total: records.length, checked: results.length,
    exact: results.filter(row => row.exact).length,
    review: results.filter(row => !row.exact).map(row => row.id),
    unchecked: records.filter(clip => !transcriptResults.has(clip.id)).map(clip => clip.id),
    results,
  });
}
if (existsSync(transcriptPath)) writeTranscripts();
if (process.argv.includes('--transcribe')) {
  const invalid = records.filter(clip => selected.has(clip.id) && !signalResults.get(clip.id)?.audible);
  // Keep reviewing the valid clips when one recording needs regeneration.
  // Invalid clips remain unchecked and can never pass publication below.
  if (invalid.length) console.log(JSON.stringify({ skippedTranscription: invalid.map(clip => clip.id) }));
  const environment = process.env.OPENAI_ENV_FILE || resolve(root, '.env.audio.local');
  if (existsSync(environment)) process.loadEnvFile(environment);
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new Error('OPENAI_API_KEY is required for --transcribe; never store it in the repository or browser.');
  const transcriptionPrompt = '录音是供初学者学习的普通话句子。请用简体中文转写听到的内容，不添加解释。'
    + (process.argv.includes('--preserve-colloquial-forms') ? '保留实际听到的儿化词尾，不要添加未听到的字。' : '');
  const work = records.filter(clip => selected.has(clip.id) && signalResults.get(clip.id)?.audible
    && (process.argv.includes('--force-transcribe') || !transcriptResults.has(clip.id)));
  const workIds = new Set(work.map(clip => clip.id));
  const reused = records.filter(clip => selected.has(clip.id) && !workIds.has(clip.id) && transcriptResults.has(clip.id)).length;
  if (reused) console.log(JSON.stringify({ reusedCurrentTranscriptions: reused }));
  let cursor = 0;
  async function worker() {
    while (cursor < work.length) {
      const clip = work[cursor++];
      // Remove prior evidence before a new attempt, so a failed retry cannot
      // leave an older transcription looking like the result of this request.
      const previous = transcriptResults.get(clip.id);
      transcriptResults.delete(clip.id);
      writeTranscripts();
      let transcript;
      for (let attempt = 0; attempt < 4; attempt++) {
        const body = new FormData();
        body.append('model', 'gpt-4o-transcribe');
        body.append('language', 'zh');
        body.append('prompt', transcriptionPrompt);
        const bytes = readFileSync(resolve(root, 'public/audio/mandarin', clip.file));
        if (createHash('sha256').update(bytes).digest('hex') !== clip.sha256) throw new Error(`Audio changed during transcription: ${clip.id}; rerun verification.`);
        body.append('file', new Blob([bytes], { type: 'audio/mpeg' }), clip.file);
        let response;
        try {
          response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST', headers: { Authorization: `Bearer ${key}` }, body,
            signal: AbortSignal.timeout(90000),
          });
        } catch {
          if (attempt === 3) throw new Error(`Transcription request failed for ${clip.id}; no request details logged.`);
        }
        if (response?.ok) {
          const value = await response.json();
          if (typeof value.text !== 'string' || !value.text.trim()) throw new Error(`Empty transcription for ${clip.id}`);
          transcript = value.text.trim();
          break;
        }
        if (response && ![429, 500, 502, 503, 504].includes(response.status)) throw new Error(`Transcription HTTP ${response.status} for ${clip.id}; response body omitted.`);
        if (attempt === 3) throw new Error(`Transcription retry limit reached for ${clip.id}.`);
        await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
      }
      const previousSameFileTranscriptions = previous
        ? [...(previous.previousSameFileTranscriptions ?? []), { model: previous.model, transcript: previous.transcript, prompt: previous.prompt, sha256: previous.sha256 }]
        : [];
      transcriptResults.set(clip.id, { ...clip, model: 'gpt-4o-transcribe', prompt: transcriptionPrompt, transcript, exact: normalizeText(transcript) === normalizeText(clip.input),
        ...(previousSameFileTranscriptions.length ? { previousSameFileTranscriptions } : {}) });
      writeTranscripts();
    }
  }
  const outcomes = await Promise.allSettled(Array.from({ length: Math.min(3, work.length) }, () => worker()));
  const failed = outcomes.find(result => result.status === 'rejected');
  if (failed) throw failed.reason;
  console.log(JSON.stringify({ transcribed: work.length, exact: work.filter(clip => transcriptResults.get(clip.id)?.exact).length, review: work.filter(clip => !transcriptResults.get(clip.id)?.exact).map(clip => clip.id) }));
}
if (process.argv.includes('--publish')) {
  for (const clip of records) {
    const file = resolve(root, 'public/audio/mandarin', clip.file);
    if (!existsSync(file) || createHash('sha256').update(readFileSync(file)).digest('hex') !== clip.sha256) throw new Error(`Audio changed before publication: ${clip.id}; rerun verification.`);
  }
  if (unchecked.length || signalFailures.length || orderedSignals.length !== records.length) throw new Error('A complete successful current signal verification is required before publication.');
  const reviewed = readJson(resolve(root, 'docs/lesson6-dialogue-audio-review.json')).results;
  for (const clip of records) {
    if (!transcriptResults.has(clip.id) || !reviewed.some(row => row.id === clip.id && row.status === 'accepted' && currentEvidence(row))) {
      throw new Error(`Current transcription and discrepancy review required: ${clip.id}`);
    }
  }
  save(availablePath, { files: manifest.clips.map(clip => clip.file) });
  console.log(`Registered ${records.length} reviewed local audio files; no remote publication.`);
}
if (signalFailures.length || unchecked.length) process.exitCode = 1;
