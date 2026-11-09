import { createHash } from 'node:crypto';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('data/directions-audio.json',root),'utf8'));
const language = JSON.parse(await readFile(new URL('data/directions-language.json',root),'utf8'));
for(const entry of Object.values(language.entries)) {
  if((await stat(new URL(`public${entry.audioSrc}`,root))).size < 1024) throw new Error(`Clip vacío: ${entry.hanzi}`);
}
console.log(`${Object.keys(language.entries).length} audios presentes.`);
if(!process.argv.includes('--transcribe')) process.exit(0);
const env=process.env.OPENAI_ENV_FILE || new URL('.env.audio.local',root);
if(existsSync(env)) process.loadEnvFile(env);
const apiKey=process.env.OPENAI_API_KEY?.trim();
if(!apiKey) throw new Error('Falta la credencial de verificación de audio.');
const variants = {東:'东',圖:'图',書:'书',館:'馆',銀:'银',學:'学',體:'体',樓:'楼',門:'门',這:'这',兒:'儿',謝:'谢',見:'见',嗎:'吗',問:'问',說:'说',麼:'么',飯:'饭',邊:'边',請:'请',妳:'你'};
const normalize=text=>[...text.normalize('NFC').replace(/[^\u3400-\u9fff]/g,'')].map(char=>variants[char]??char).join('');
const results=[];
for(const clip of manifest.clips) {
  const bytes=await readFile(new URL(`public/audio/directions/${clip.file}`,root));
  const form=new FormData();
  form.append('model','gpt-4o-mini-transcribe');form.append('language','zh');
  form.append('file',new Blob([bytes],{type:'audio/mpeg'}),path.basename(clip.file));
  const response=await fetch('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`},body:form});
  if(!response.ok) throw new Error(`Verificación interrumpida: HTTP ${response.status}.`);
  const heard=(await response.json()).text??'';
  const matches=normalize(heard)===normalize(clip.input);
  results.push({file:clip.file,sha256:createHash('sha256').update(bytes).digest('hex'),expected:clip.input,heard,matches});
  console.log(`${matches?'OK':'REVISAR'} ${clip.input}: ${heard}`);
}
await writeFile(new URL('docs/directions-audio-review.json',root),JSON.stringify({method:'automatic_speech_recognition',independentHumanReview:false,results},null,2)+'\n');
console.log(`Coincidencias: ${results.filter(row=>row.matches).length}/${results.length}.`);
