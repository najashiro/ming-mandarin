import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
const catalog = process.argv.includes('--catalog');
const manifest = catalog
 ? {clips: JSON.parse(await readFile('docs/hanzi-engine-audit.json','utf8')).inventory.map(row=>({id:row.id,input:row.hanzi,expectedPinyin:row.pinyin,path:`public${row.audio}`}))}
 : JSON.parse(await readFile('data/hanzi-audio.json','utf8'));
if(catalog && process.argv.includes('--publish'))throw new Error('Only the dedicated Hanzi manifest can be published.');
const browser = await chromium.launch();
const results=[];
try {
 const page=await browser.newPage();
 for(const clip of manifest.clips){
  const bytes=await readFile(clip.path ?? `public/audio/mandarin/${clip.file}`);
  const signal=await page.evaluate(async encoded=>{
   const context=new AudioContext();
   try{const buffer=await context.decodeAudioData(Uint8Array.from(atob(encoded),c=>c.charCodeAt(0)).buffer);
    const data=buffer.getChannelData(0);
    return {duration:buffer.duration,rms:Math.sqrt(data.reduce((sum,v)=>sum+v*v,0)/data.length)};
   }finally{await context.close();}
  },bytes.toString('base64'));
  results.push({id:clip.id,hanzi:clip.input,pinyin:clip.expectedPinyin,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,...signal});
 }
}finally{await browser.close();}
await writeFile(catalog ? 'docs/hanzi-catalog-audio-review.json' : 'docs/hanzi-audio-review.json',JSON.stringify({voice:'marin',model:'gpt-4o-mini-tts',verification:'MP3 decode, duration, signal and hash; not independent human phonetic review',results},null,2)+'\n');
const failed=results.filter(row=>row.duration<0.2||row.duration>8||row.rms<0.002);
if(!catalog)await writeFile('/tmp/ming-hanzi-audio-retry.json',JSON.stringify(failed.map(row=>row.id)));
if(failed.length){console.error(JSON.stringify(failed.map(({id,hanzi,duration,rms})=>({id,hanzi,duration,rms})),null,2));throw new Error(`${failed.length} recordings failed signal review`);}
if(process.argv.includes('--publish'))await writeFile('data/hanzi-audio-available.json',JSON.stringify({files:manifest.clips.map(clip=>clip.file)},null,2)+'\n');
console.log(`Verified ${results.length} Hanzi recordings; ${results.reduce((s,r)=>s+r.duration,0).toFixed(1)} seconds total.`);
