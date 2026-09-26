import { loadVocabulary } from './load-vocabulary.mjs';
import { readFile, writeFile, stat, readdir, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
const read = async path => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
const arg = name => process.argv.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const execute = process.argv.includes('--execute');
const corpus = await read('data/corpus-v21-public.json');
const manifest = await read('data/mandarin-audio.json');
const pinyin = await read('data/pronunciation.json');
const available = new Set((await read('data/mandarin-audio-available.json')).files);
const media = await read('data/vocabulary-media.json');
const normalize = text => text.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
const reading = text => text.normalize('NFC').toLowerCase().replace(/[\s'’ʼ.,!?]/g, '');
const key = (text, pinyin) => `${normalize(text)}:${reading(pinyin ?? '')}`;
const config = { provider: 'OpenAI', model: 'gpt-4o-mini-tts', voice: 'marin', format: 'mp3', instructions: 'Habla exclusivamente en mandarín estándar de China continental. Voz clara de docente de fonética para principiantes. Pronuncia exactamente el texto chino de entrada, sin traducir, deletrear, explicar ni añadir palabras. Ritmo lento y natural, con dicción limpia y sin música. Pronuncia exactamente la entrada una sola vez, con ritmo natural.' };
const allClips = [...manifest.clips.map(c => ({ ...c, directory: 'mandarin', registered: available.has(c.file) })), ...pinyin.clips.map(c => ({ ...c, directory: 'pinyin', registered: true }))];
const { examplesForScope } = await loadVocabulary();
const resources = new Map();
function addResource(resource) {
  const id = key(resource.input, resource.expectedPinyin);
  const existing = resources.get(id);
  if (existing) {
    if (!existing.entryIds.includes(resource.entryId)) existing.entryIds.push(resource.entryId);
    if (resource.kind === 'word') Object.assign(existing, resource);
  } else resources.set(id, { ...resource, entryIds: [resource.entryId] });
}
for (const word of corpus.vocabulary) {
  addResource({ entryId: word.id, input: word.hanzi, expectedPinyin: word.pinyin, kind: 'word' });
  for (const example of examplesForScope(word, 'l1-l2-l3')) if (example.pinyin) addResource({ entryId: example.phraseId, input: example.hanzi, expectedPinyin: example.pinyin, kind: 'sentence' });
}
const rows = [];
for (const resource of resources.values()) {
  const matches = allClips.filter(c => key(c.input, c.expectedPinyin) === key(resource.input, resource.expectedPinyin));
  let candidate = matches.at(-1);
  for (const match of matches) { try { if ((await stat(`public/audio/${match.directory}/${match.file}`)).size > 1024 && match.registered) { candidate = match; break; } } catch {} }
  let status = 'not_requested';
  if (candidate) {
    try { const bytes = (await stat(`public/audio/${candidate.directory}/${candidate.file}`)).size; status = bytes < 1024 ? 'empty_or_invalid' : candidate.registered ? 'available_unverified_decode' : 'existing_unregistered'; } catch { status = 'missing_file'; }
  }
  const digest = createHash('sha256').update(JSON.stringify({ input: resource.input, reading: resource.expectedPinyin, ...config })).digest('hex').slice(0, 20);
  rows.push({ ...resource, status, clipId: candidate?.id ?? `vocab-${digest}`, file: candidate?.file ?? `vocab-${digest}.mp3`, directory: candidate?.directory ?? 'mandarin' });
}
const ids = arg('ids')?.split(',');
if (ids && ids.some(id => !rows.some(r => r.entryIds.includes(id) || r.clipId === id))) throw new Error('ID desconocido en la selección.');
const limit = Number(arg('limit') ?? 20);
if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new Error('Límite inválido (1–1000).');
const missing = rows.filter(r => !r.status.startsWith('available') && r.status !== 'existing_unregistered');
const selected = missing.filter(r => !ids || r.entryIds.some(id => ids.includes(id)) || ids.includes(r.clipId)).slice(0, limit);
const counters = Object.fromEntries([...new Set(rows.map(r => r.status))].map(s => [s, rows.filter(r => r.status === s).length]));
const collisions = [...new Set(allClips.map(c => normalize(c.input)))].map(text => ({ text, readings: [...new Set(allClips.filter(c => normalize(c.input) === text).map(c => reading(c.expectedPinyin)))] })).filter(r => r.readings.length > 1);
const files = await readdir('public/audio/mandarin');
const unregisteredFiles = files.filter(f => f.endsWith('.mp3') && !manifest.clips.some(c => c.file === f));
const report = { mode: execute ? 'execute' : 'dry-run', corpusFingerprint: corpus.fingerprint, config, counters, selectedCount: selected.length, selected, resources: rows, readingCollisions: collisions, unregisteredFiles, images: { pilot: media.length, approved: media.filter(m => m.status === 'approved').length, pending: media.filter(m => m.status !== 'approved') }, estimate: 'No se estimó coste: requiere tarifa vigente y duración. No se hicieron llamadas pagadas en dry-run.', pronunciationReview: 'La existencia o decodificación no certifica pronunciación.' };
if (arg('report')) await writeFile(arg('report'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ mode: report.mode, config, counters, selectedCount: selected.length, imagesPending: report.images.pending.length, estimate: report.estimate }, null, 2));
if (!execute) process.exit(0);
// A finite, explicit reservation is mandatory. The user supplies the authorized
// conservative ceiling per clip after reviewing provider prices and this batch.
const budget = Number(arg('max-budget-usd'));
const perClip = Number(arg('reserve-per-clip-usd'));
if (!ids || !Number.isFinite(budget) || budget <= 0 || !Number.isFinite(perClip) || perClip <= 0 || selected.length * perClip > budget || !process.argv.includes('--authorized')) throw new Error('Requiere --ids, --authorized, --max-budget-usd y --reserve-per-clip-usd suficientes.');
if (existsSync('.env.audio.local')) process.loadEnvFile('.env.audio.local');
if (!process.env.OPENAI_API_KEY?.trim()) throw new Error('Falta OPENAI_API_KEY; no se registró su valor.');
const checkpointPath = 'tmp/vocabulary/audio-checkpoint.json';
await mkdir('tmp/vocabulary', { recursive: true });
let checkpoint = {};
try { checkpoint = await read(checkpointPath); } catch {}
let reserved = Object.values(checkpoint).reduce((sum, row) => sum + row.reserved, 0);
for (const row of selected) {
  if (checkpoint[row.clipId]) continue; // An uncertain request is never automatically retried.
  if (reserved + perClip > budget) throw new Error('Presupuesto reservado agotado.');
  if (row.status === 'empty_or_invalid') throw new Error('Recurso inválido: revisar manualmente; no se sobrescribe.');
  if (!manifest.clips.some(c => c.id === row.clipId)) {
    manifest.clips.push({ id: row.clipId, file: row.file, input: row.input, expectedPinyin: row.expectedPinyin, lessonId: 0, instructions: config.instructions });
    await writeFile('data/mandarin-audio.json', JSON.stringify(manifest, null, 2) + '\n');
  }
  reserved += perClip;
  checkpoint[row.clipId] = { status: 'requested_uncertain', reserved: perClip, config };
  await writeFile(checkpointPath, JSON.stringify(checkpoint, null, 2) + '\n');
  // One request, no automatic retry after a possibly billed/uncertain response.
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY.trim()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: config.model, voice: config.voice, input: row.input, instructions: config.instructions, response_format: config.format }),
    signal: AbortSignal.timeout(120000),
  });
  if (!response.ok) throw new Error(`Generación interrumpida (${response.status}); revisar checkpoint antes de reanudar.`);
  const destination = `public/audio/${row.directory}/${row.file}`;
  if (existsSync(destination)) throw new Error('No se sobrescribe un recurso existente.');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1024) throw new Error('Respuesta vacía o inválida; revisar checkpoint.');
  await writeFile(destination, bytes, { flag: 'wx' });
  checkpoint[row.clipId].status = 'generated_pending_review';
  await writeFile(checkpointPath, JSON.stringify(checkpoint, null, 2) + '\n');
}
console.log('Lote generado. Decodificar y revisar antes de añadir a mandarin-audio-available.json.');
