// Import and normalize local photo and native diagram masters. No API calls.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const read=async file=>JSON.parse(await readFile(file,'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const manifest=await read('docs/lesson7-image-prompts.json');
const lesson=await read('data/lesson7-public.json');
const approved=process.argv.includes('--approve');
const entries=[],assets=[];
await mkdir('public/images/vocabulary/lesson7',{recursive:true});
for(const entry of manifest.entries) {
  if(entry.status==='planned') throw new Error(`Image not generated: ${entry.slug}`);
  const bytes=await readFile(entry.master);
  const metadata=await sharp(bytes).metadata();
  if(!metadata.hasAlpha) throw new Error(`Missing transparency: ${entry.master}`);
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let left=info.width,top=info.height,right=-1,bottom=-1;
  // The model may leave invisible alpha noise; it must not determine the crop.
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    if(data[(y*info.width+x)*4+3]<=8)continue;
    left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
  if(right<left)throw new Error(`Empty image: ${entry.slug}`);
  left=Math.max(0,left-4);top=Math.max(0,top-4);right=Math.min(info.width-1,right+4);bottom=Math.min(info.height-1,bottom+4);
  const subject=await sharp(bytes).extract({left,top,width:right-left+1,height:bottom-top+1}).resize(760,880,{fit:'inside'}).png().toBuffer();
  const size=await sharp(subject).metadata();
  const normalized=await sharp({create:{width:1618,height:1000,channels:4,background:'#00000000'}})
    .composite([{input:subject,left:810+Math.floor((760-size.width)/2),top:60+Math.floor((880-size.height)/2)}]).png().toBuffer();
  const web=await sharp(normalized).webp({quality:88,alphaQuality:100}).toBuffer();
  const sha256=hash(web),src=`/images/vocabulary/lesson7/${entry.slug}-${sha256.slice(0,12)}.webp`;
  await writeFile(`public${src}`,web);
  let diagramSource;
  if(entry.kind==='diagram') {
    const svg=await readFile(entry.master.replace(/\.png$/,'.svg'),'utf8');
    const scaleX=size.width/(right-left+1),scaleY=size.height/(bottom-top+1);
    const x=810+Math.floor((760-size.width)/2),y=60+Math.floor((880-size.height)/2);
    const normalizedSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="1618" height="1000" viewBox="0 0 1618 1000"><g transform="translate(${x} ${y}) scale(${scaleX} ${scaleY}) translate(${-left} ${-top})">${svg}</g></svg>`;
    diagramSource=`public${src.replace(/\.webp$/,'.svg')}`;
    await writeFile(diagramSource,normalizedSvg);
  }
  await writeFile(`output/imagegen/lesson7/${entry.slug}-normalized.png`,normalized);
  const word=lesson.vocabulary.find(row=>row.id===entry.wordId);
  // Distinct media IDs preserve both the historical illustration and its review.
  const contextual=['v-找','v-分'].includes(word.id);
  const assetWordId=contextual?`${word.id}@l7`:word.id;
  entry.assetWordId=assetWordId;
  const review=approved?'2026-11-20 · Revisión visual por Codex: sentido, composición completa, transparencia y legibilidad. Sin revisión humana independiente.':'Pendiente de revisión visual del modelo.';
  entries.push({wordId:assetWordId,...(contextual?{curriculumWordId:word.id}:{}),sense:word.spanish,hintType:'image',src,sha256,
    alt:`Apoyo visual: ${word.spanish}`,description:`Apoyo editorial para ${word.hanzi} (${word.pinyin}), lección 7`,status:approved?'approved':'pending_review',
    presentation:'transparent-cutout',visualMode:entry.kind==='diagram'?'visual_grammar':word.visual_ming.visual_mode==='concrete_object'?'literal_photo':'concept_scene',
    imageQuizEligible:entry.kind==='photo'&&word.visual_ming.image_quiz_eligible,ambiguityRisk:word.visual_ming.ambiguity_risk,width:1618,height:1000,
    promptSha256:hash(entry.prompt),model:entry.model,quality:entry.kind==='photo'?'generated':'deterministic',review,
    provenance:`Lote L7 autorizado el 20-11-2026. ${entry.kind==='photo'?'Herramienta integrada image_gen':'Diagrama SVG nativo'}. Prompt en docs/lesson7-image-prompts.json. Recurso editorial, no fuente curricular.`});
  assets.push({wordId:word.id,assetWordId,slug:entry.slug,kind:entry.kind,master:entry.master,masterSha256:hash(bytes),src,sha256,width:1618,height:1000,alpha:true,review,...(diagramSource?{source:diagramSource,sourceSha256:hash(await readFile(diagramSource))}:{})});
  if(approved)entry.status='approved';
}
await writeFile('data/lesson7-media.json',JSON.stringify(entries,null,2)+'\n');
await writeFile('docs/lesson7-image-assets.json',JSON.stringify({styleId:manifest.styleId,assets},null,2)+'\n');
await writeFile('docs/lesson7-image-prompts.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({assets:assets.length,approved}));
