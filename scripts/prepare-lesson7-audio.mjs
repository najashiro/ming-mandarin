// Offline, deterministic plan for the audio batch authorized on 2026-11-20.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { loadApplicationModule } from './lib/load-application-module.mjs';
const request=JSON.parse(readFileSync('docs/lesson7-media-request.json','utf8'));
const lesson=JSON.parse(readFileSync('data/lesson7-public.json','utf8'));
const { audioForMandarinText }=loadApplicationModule('lib/mandarin-audio.ts');
const { dialoguePinyinByCharacter }=loadApplicationModule('lib/dialogue-pinyin.ts');
const normalize=value=>value.normalize('NFC').toLowerCase().replace(/[\s'’ʼ.,!?，。？！]/g,'');
const key=(hanzi,pinyin)=>`${hanzi.replace(/[^\u3400-\u9fffA-Za-z]/g,'')}:${normalize(pinyin)}`;
const clips=new Map();
function add(hanzi,pinyin,usage) {
  if (!hanzi || !pinyin) throw new Error(`Missing reviewed reading: ${hanzi}`);
  const existing=audioForMandarinText(hanzi,pinyin);
  if (existing && !existing.includes('/l7-')) return;
  const identity=key(hanzi,pinyin);
  if (clips.has(identity)) { clips.get(identity).usage.push(usage); return; }
  const id=`l7-${createHash('sha256').update(identity).digest('hex').slice(0,16)}`;
  clips.set(identity,{id,file:`${id}.mp3`,input:hanzi,expectedPinyin:pinyin,lessonId:7,usage:[usage],
    instructions:`Pronuncia exactamente una vez, sin introducción. Lectura de referencia: ${pinyin}. No leas el pinyin ni traduzcas. Respeta los tonos y las sílabas neutras de esta lectura.`});
}
for (const row of request.missingAudio) add(row.hanzi,row.pinyin,row.usage.join(','));
for (const row of lesson.readings) add(row.hanzi,row.pinyin,'reading');
for (const activity of lesson.documentaryExercises) for (const track of activity.listeningPractice?.tracks ?? []) add(track.hanzi,track.pinyin,'listening_practice');
// Editorial readings for fragments used by the workbook. Source and target
// sentence readings remain unchanged. These are not additional curriculum words.
const fragments={ '老北京':'lǎo Běijīng','这些':'zhèxiē','这件':'zhè jiàn','宜':'yí','宣':'xuān','恰':'qià','借':'jiè','货':'huò' };
const readings=new Map([...lesson.vocabulary,...lesson.phrases,...lesson.sentences,...lesson.dialogues.flatMap(row=>row.turns)]
  .map(row=>[row.hanzi,row.pinyin]));
for (const row of lesson.workbookGames) readings.set(row.modelHanzi ?? row.answer,row.pinyin);
for (const [hanzi,pinyin] of Object.entries(fragments)) readings.set(hanzi,pinyin);
for (const row of request.missingWorkbookFragments) add(row.hanzi,row.pinyin ?? readings.get(row.hanzi),'workbook_fragment');
for (const sentence of lesson.sentences) {
  const aligned=dialoguePinyinByCharacter(sentence.tokens.join(''),sentence.pinyin);
  let offset=0;
  for (const token of sentence.tokens) {
    const glyphs=[...token], tokens=aligned.slice(offset,offset+glyphs.length);
    offset+=glyphs.length;
    const pinyin=tokens.filter((reading,index)=>glyphs[index]!=='儿' || reading!==tokens[index-1]).join(' ');
    if (tokens.some(reading=>!reading)) throw new Error(`Unaligned token: ${token}`);
    add(token,pinyin,'construction_token');
  }
}
for (const row of clips.values()) row.usage=[...new Set(row.usage)];
if (existsSync('docs/lesson7-audio-repairs.json')) {
  const overrides=JSON.parse(readFileSync('docs/lesson7-audio-repairs.json','utf8')).repairs;
  for (const row of clips.values()) {
    const repair=overrides.find(item=>item.id===row.id);
    if (repair) { row.instructions=repair.instructions; for(const key of ['speechInput','voice','standaloneInstructions']) if(repair[key]) row[key]=repair[key]; }
  }
}
writeFileSync('data/lesson7-audio.json',JSON.stringify({version:1,corpusFingerprint:lesson.fingerprint,authorization:request.authorization,clips:[...clips.values()]},null,2)+'\n');
console.log(JSON.stringify({clips:clips.size,characters:[...clips.values()].reduce((sum,row)=>sum+row.input.length,0)}));
