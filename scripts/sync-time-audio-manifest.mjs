import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { timeAudioFile, timeAudioKey } from '../lib/time-audio-key.mjs';
import { loadTimeGame } from './load-time-game.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const [{ buildAcceptedTimeAnswers }, { timeTokens }] = await loadTimeGame();
const oldManifests = await Promise.all(['mandarin-audio.json','pronunciation.json'].map(async name => JSON.parse(await readFile(join(root,'data',name),'utf8'))));
const existing = new Map(oldManifests.flatMap(manifest => manifest.clips.map(clip => [clip.input.normalize('NFC').replace(/[^\u3400-\u9fff]/g,''),clip])));
const candidates = new Map();
let reusedTokens=0,reusedSentences=0;
function add(input, expectedPinyin, kind) {
  const clean=input.normalize('NFC').replace(/[^\u3400-\u9fff]/g,'');
  if(existing.has(clean)) {if(kind==='t'||kind==='q')reusedTokens++;else reusedSentences++;return;}
  if(candidates.has(clean))return;
  candidates.set(clean,{
    id:timeAudioKey(input,kind),file:timeAudioFile(input,kind),input,
    expectedPinyin,
    instructions:kind==='s'?'Pronuncia la frase completa una sola vez, con ritmo natural y conectado.':'Pronuncia exactamente la entrada una sola vez.',
  });
}
for(const token of timeTokens)add(token.hanzi,token.pinyin,'t');
add('现在','xiànzài','t');
add('现在几点？','xiànzài jǐ diǎn','q');
const sentences = new Map();
for(let hour=1;hour<=12;hour++)for(let minute=0;minute<60;minute++)for(const variant of buildAcceptedTimeAnswers(hour,minute)){
  sentences.set(`现在${variant.hanzi}`,`xiànzài ${variant.pinyin}`);
}
for(const [input,pinyin] of sentences)add(input,pinyin,'s');
const clips=[...candidates.values()].sort((a,b)=>a.id.localeCompare(b.id));
const ids=new Set(clips.map(clip=>clip.id));
if(ids.size!==clips.length)throw new Error('Colisión de IDs de audio.');
const manifestPath=join(root,'data','time-audio.json');
await writeFile(manifestPath,`${JSON.stringify({clips},null,2)}\n`,'utf8');
console.log(`Frases únicas: ${sentences.size}; clips existentes reutilizados: ${reusedTokens+reusedSentences} (${reusedTokens} tokens/pregunta, ${reusedSentences} frases); clips de horas en manifiesto: ${clips.length} (${clips.filter(c=>c.id.startsWith('time-s-')).length} frases, ${clips.filter(c=>!c.id.startsWith('time-s-')).length} tokens/pregunta).`);
