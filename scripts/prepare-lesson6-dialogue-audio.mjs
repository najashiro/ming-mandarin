// Offline plan for the dialogue audio requested on 2026-11-26.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { loadApplicationModule } from './lib/load-application-module.mjs';

const lesson = JSON.parse(readFileSync('data/lesson6-public.json', 'utf8'));
const { audioForMandarinText } = loadApplicationModule('lib/mandarin-audio.ts');
const clips = [];
const reused = [];
const hints = [
  ['旁边', '旁边 se pronuncia pángbiān, con primer tono en biān.'],
  ['胡同', '胡同 se pronuncia hútòng, con cuarto tono en tòng.'],
  ['右边', '右边 se pronuncia yòubian, con bian neutro.'],
  ['前边', '前边 se pronuncia qiánbian, con bian neutro.'],
  ['后边', '后边 se pronuncia hòubian, con bian neutro.'],
  ['教学楼', '教学楼 se pronuncia jiàoxuélóu.'],
  ['宋华', 'El nombre 宋华 se pronuncia Sòng Huá.'],
  ['着急', '着急 se pronuncia zháojí.'],
  ['小姐', '小姐 se pronuncia xiǎojie, con jie neutro.'],
  ['地方', '地方 se pronuncia dìfang, con fang neutro.'],
  ['客气', '客气 se pronuncia kèqi, con qi neutro.'],
  ['35', 'El número 35 se lee sānshíwǔ. 里 se pronuncia li neutro.'],
];
for (const dialogue of lesson.dialogues) for (const turn of dialogue.turns) {
  if (!turn.hanzi || !turn.pinyin) throw new Error(`Missing documented reading: ${dialogue.id}/${turn.turn}`);
  const usage = { dialogueId: dialogue.id, turn: turn.turn, phraseId: turn.phraseId };
  const existing = audioForMandarinText(turn.hanzi, turn.pinyin);
  if (existing && !existing.includes('/l6-dialogue-')) {
    if (!existsSync(`public${existing}`)) throw new Error(`Missing reusable file: ${existing}`);
    reused.push({ ...usage, input: turn.hanzi, expectedPinyin: turn.pinyin, src: existing });
    continue;
  }
  const id = `l6-dialogue-${createHash('sha256').update(`${turn.hanzi}:${turn.pinyin}`).digest('hex').slice(0, 16)}`;
  const previous = clips.find(clip => clip.id === id);
  if (previous) { previous.usage.push(usage); continue; }
  clips.push({ id, file: `${id}.mp3`, input: turn.hanzi, expectedPinyin: turn.pinyin, lessonId: 6,
    usage: [usage], ...(turn.hanzi.includes('35') ? { speechInput: turn.hanzi.replace('35', '三十五') } : {}),
    instructions: `Pronuncia la intervención completa exactamente una vez, sin introducción ni palabras adicionales. Lectura de referencia: ${turn.pinyin} No leas el pinyin ni traduzcas. Respeta tonos y sílabas neutras; 这儿 y 哪儿 llevan erhua sin separar 儿. ${hints.filter(([text]) => turn.hanzi.includes(text)).map(([, hint]) => hint).join(' ')}`.trim(),
  });
}
if (existsSync('docs/lesson6-dialogue-audio-repairs.json')) {
  const { repairs } = JSON.parse(readFileSync('docs/lesson6-dialogue-audio-repairs.json', 'utf8'));
  for (const repair of repairs) {
    const clip = clips.find(row => row.id === repair.id);
    if (!clip) throw new Error(`Unknown repair clip: ${repair.id}`);
    clip.standaloneInstructions = repair.instructions;
  }
}
const save = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
save('data/lesson6-dialogue-audio.json', { version: 1, corpusFingerprint: lesson.fingerprint,
  origin: 'ming_generated_practice', authorization: '2026-11-26: completar audios pendientes de los diálogos de la lección 6', clips });
save('docs/lesson6-dialogue-audio-reuse.json', { corpusFingerprint: lesson.fingerprint, totalTurns: clips.reduce((sum, clip) => sum + clip.usage.length, reused.length), reused });
console.log(JSON.stringify({ generatedClips: clips.length, reusedTurns: reused.length }));
