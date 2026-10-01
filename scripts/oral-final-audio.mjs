// Offline by default. Only --generate performs the explicitly authorized paid request.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dataPath = path.join(root, 'data/rehearsals/oral-final.json');
const requestPath = path.join(root, '.github/audio-requests/oral-final.json');
const manifestPath = path.join(root, 'data/rehearsals/oral-final-audio.json');
const directory = path.join(root, 'public/audio/oral-final');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const request = JSON.parse(readFileSync(requestPath, 'utf8'));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const mode = process.argv[2] ?? '--check';
assert(['--check', '--generate', '--publish', '--verify'].includes(mode), 'Modo no permitido');
assert.equal(data.id, 'oral-final-basico2-20260930');
assert.equal(request.requestId, data.id);
assert.equal(request.model, 'gpt-4o-mini-tts');
assert.equal(request.voice, 'marin');
assert(['requested', 'completed'].includes(request.status));
assert.equal(request.maxUniqueClips, 28);
assert.equal(request.maxInputCharacters, 2000);
assert.equal(data.turns.length, 29);
assert.equal(new Set(data.turns.map(turn => turn.id)).size, 29);
const canonical = data.turns.map(({ id, hanzi, pinyin }) => ({ id, hanzi, pinyin }));
assert.equal(sha256(JSON.stringify(canonical)), request.textFingerprint, 'El texto cambió: necesita una nueva autorización de audio');
assert(data.turns.every(turn => turn.hanzi && turn.pinyin && turn.spanish));
assert(data.turns.reduce((sum, turn) => sum + turn.hanzi.length, 0) <= request.maxInputCharacters);

const baseInstructions = [
  'Habla exclusivamente en mandarín estándar de China continental con la voz clara de un docente para principiantes.',
  'Pronuncia exactamente el texto de entrada, sin traducir, deletrear, explicar ni añadir palabras. Ritmo pausado y natural, sin música.',
  'Usa los tonos contextuales y tonos neutros naturales; no pronuncies números de tono.',
  '秘鲁 se pronuncia Bìlǔ. 尤世洛 se pronuncia Yóu Shìluò.',
  'El nombre escrito en pinyin Shěn Bówén se pronuncia en mandarín shen3 bo2 wen2, nunca en inglés.',
  'No añadas erhua a 点 diǎn. En 面条儿 sí integra la terminación r en miàntiáor, no como una sílaba ér separada.'
].join(' ');
const byHash = new Map();
const plans = data.turns.map(turn => {
  const instructions = `${baseInstructions} Lectura esperada (no leer la instrucción): ${turn.pinyin}`;
  const hash = sha256(JSON.stringify({ model: request.model, voice: request.voice, input: turn.hanzi, instructions }));
  const plan = { id: turn.id, hash, input: turn.hanzi, pinyin: turn.pinyin, instructions, src: `/audio/oral-final/${hash}.mp3`, file: path.join(directory, `${hash}.mp3`) };
  byHash.set(hash, plan);
  return plan;
});
assert.equal(byHash.size, request.maxUniqueClips);
const unique = [...byHash.values()];
console.log(`Audio autorizado: ${data.turns.length} turnos / ${unique.length} clips únicos. Modo ${mode}.`);

function inspect(file) {
  assert(existsSync(file), `Falta ${path.basename(file)}`);
  const bytes = readFileSync(file);
  assert(bytes.length > 512, 'MP3 vacío o demasiado pequeño');
  execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'null', '-'], { stdio: 'pipe' });
  const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file], { encoding: 'utf8' }));
  assert(Number.isFinite(duration) && duration >= 0.2 && duration <= 60, 'Duración inesperada');
  return { durationSeconds: duration, sha256: sha256(bytes) };
}

if (mode === '--generate') {
  const missing = unique.filter(clip => !existsSync(clip.file));
  if (missing.length) {
    assert.equal(request.status, 'requested', 'El lote completado no autoriza regenerar clips');
    const key = process.env.OPENAI_API_KEY?.trim();
    assert(key, 'Falta OPENAI_API_KEY en el entorno de generación; nunca ponerla en el navegador');
    mkdirSync(directory, { recursive: true });
    for (const clip of missing) {
      let response;
      for (let attempt = 0; attempt < 3; attempt++) {
        response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: request.model, voice: request.voice, input: clip.input, instructions: clip.instructions, response_format: 'mp3' }),
          signal: AbortSignal.timeout(90000),
        });
        if (response.ok || ![429, 500, 502, 503, 504].includes(response.status)) break;
        await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 2000));
      }
      assert(response?.ok, `OpenAI devolvió ${response?.status ?? 'error'}; cuerpo y clave no registrados`);
      const temporary = `${clip.file}.tmp`;
      writeFileSync(temporary, Buffer.from(await response.arrayBuffer()));
      inspect(temporary);
      renameSync(temporary, clip.file);
      console.log(`Generado ${clip.id}`);
    }
  } else {
    console.log('Los 28 MP3 ya existen: cero solicitudes de generación a OpenAI.');
  }
  for (const clip of unique) inspect(clip.file);
}

if (mode === '--publish') {
  const reports = new Map(unique.map(clip => [clip.hash, inspect(clip.file)]));
  const clips = Object.fromEntries(plans.map(clip => [clip.id, { src: clip.src, hanzi: clip.input, pinyin: clip.pinyin, ...reports.get(clip.hash) }]));
  writeFileSync(manifestPath, JSON.stringify({ schemaVersion: 1, model: request.model, voice: request.voice, textFingerprint: request.textFingerprint, clips }, null, 2) + '\n');
  request.status = 'completed';
  // Preserve the original generating run: validation reruns must not create asset-only commits.
  request.completedByWorkflowRun ??= process.env.GITHUB_RUN_ID ?? null;
  writeFileSync(requestPath, JSON.stringify(request, null, 2) + '\n');
}

if (mode === '--verify') {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.equal(request.status, 'completed');
  assert.equal(manifest.textFingerprint, request.textFingerprint);
  assert.equal(Object.keys(manifest.clips).length, 29);
  for (const clip of plans) {
    const published = manifest.clips[clip.id];
    assert.equal(published.src, clip.src);
    assert.equal(published.hanzi, clip.input);
    assert.equal(published.pinyin, clip.pinyin);
    assert.equal(published.sha256, inspect(clip.file).sha256);
  }
  console.log('PASS: 29 turnos, 28 MP3 decodificables, texto/pinyin y huellas coincidentes. No certifica revisión auditiva humana.');
}
