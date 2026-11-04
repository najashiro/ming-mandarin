import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
const read = async file => JSON.parse(await readFile(file, 'utf8'));
const corpus = await read('data/lesson5-public.json');
const clips = new Map();
for (const row of [
  ...corpus.vocabulary,
  ...corpus.dialogues.flatMap(dialogue => dialogue.turns),
  ...corpus.phrases.filter(phrase => phrase.pinyin && phrase.spanish),
  ...corpus.readings,
  ...corpus.characters,
]) {
  const input = row.hanzi;
  const pinyin = row.pinyin || '';
  const id = `l5-${createHash('sha256').update(`${input}:${pinyin}`).digest('hex').slice(0, 16)}`;
  if (!input || clips.has(id)) continue;
  clips.set(id, { id, file: `${id}.mp3`, input, expectedPinyin: pinyin, lessonId: 5,
    instructions: pinyin ? `Pronuncia una vez. Lectura de referencia, no leerla en voz alta: ${pinyin}` : 'Lee el texto completo en mandarín estándar. No añadas traducciones.' });
}
await writeFile('data/lesson5-audio.json', JSON.stringify({ version: 1, corpusFingerprint: corpus.fingerprint, clips: [...clips.values()] }, null, 2) + '\n');
console.log(`L5: ${clips.size} clips preparados. No se hicieron llamadas TTS.`);
