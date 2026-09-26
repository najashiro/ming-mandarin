// Run vocabulary-resources.mjs first. Preparation is offline; generation is explicit.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const report = await read('docs/vocabulary-resources.json');
const corpus = await read('data/corpus-v21-public.json');
if (report.corpusFingerprint !== corpus.fingerprint) throw new Error('Refresh the resource audit first.');
const manifest = await read('data/mandarin-audio.json');
const entries = new Map([...corpus.vocabulary, ...corpus.phrases].map(entry => [entry.id, entry]));
const pending = report.resources.filter(row => ['not_requested', 'missing_file'].includes(row.status));
for (const row of pending) {
  if (manifest.clips.some(clip => clip.id === row.clipId)) continue;
  const entry = entries.get(row.entryId);
  const lessonId = entry?.lessons?.find(lesson => [1, 2, 3].includes(lesson));
  if (!lessonId || !row.expectedPinyin) throw new Error(`Missing curriculum metadata: ${row.entryId}`);
  manifest.clips.push({ id: row.clipId, file: row.file, input: row.input,
    expectedPinyin: row.expectedPinyin, lessonId,
    instructions: `Pronuncia la entrada una sola vez. Usa esta lectura de referencia para los caracteres, sin leer el pinyin en voz alta: ${row.expectedPinyin}` });
}
await writeFile('data/mandarin-audio.json', JSON.stringify(manifest, null, 2) + '\n');
await mkdir('tmp/vocabulary', { recursive: true });
for (let batch = 0; batch < 4; batch++) {
  await writeFile(`tmp/vocabulary/audio-batch-${batch}.json`, JSON.stringify(pending.filter((_, index) => index % 4 === batch).map(row => row.clipId)));
}
console.log(JSON.stringify({ pending: pending.length, batches: 4 }));
