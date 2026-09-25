import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
const report = JSON.parse(await readFile('docs/vocabulary-resources.json', 'utf8'));
const available = JSON.parse(await readFile('data/mandarin-audio-available.json', 'utf8'));
const pronunciation = JSON.parse(await readFile('data/pronunciation.json', 'utf8'));
const clips = process.argv.includes('--all-available')
  ? [...available.files.map(file => ({clipId:file, file, directory:'mandarin'})), ...pronunciation.clips.map(c => ({clipId:c.id, file:c.file, directory:'pinyin'}))]
  : report.resources.filter(r=>r.status.startsWith('available'));
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
const results=[];
for (const clip of clips) {
 const bytes=(await readFile(`public/audio/${clip.directory}/${clip.file}`)).toString('base64');
 const result=await page.evaluate(async encoded=>{
  const context=new AudioContext();
  try {const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));const buffer=await context.decodeAudioData(bytes.buffer);let power=0,peak=0;const values=buffer.getChannelData(0);for(const v of values){power+=v*v;peak=Math.max(peak,Math.abs(v));}return {decoded:true,duration:buffer.duration,rms:Math.sqrt(power/values.length),peak};}
  catch {return {decoded:false};}finally{await context.close();}
 },bytes);
 results.push({clipId:clip.clipId,...result});
}
await browser.close();
const failures=results.filter(r=>!r.decoded||r.rms<0.002||r.peak<0.005);
await writeFile('docs/vocabulary-audio-signal.json',JSON.stringify({total:results.length,failures,results},null,2));
console.log(JSON.stringify({decoded:results.length-failures.length,total:results.length,failures}));
if(failures.length)process.exitCode=1;
