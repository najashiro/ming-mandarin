// Offline import of the user-authorized ImageGen CLI outputs. Never calls an API.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const read = async path => JSON.parse(await readFile(path,'utf8'));
const prompts = await read('docs/lesson5-image-prompts.json');
const lesson = await read('data/lesson5-public.json');
const media = [], receipts = [];
const dir='public/images/vocabulary/lesson5';
await mkdir(dir,{recursive:true});
const hash = value => createHash('sha256').update(value).digest('hex');
const assets = new Map();
for (const entry of prompts.entries) {
  if (!entry.slug) continue;
  let asset=assets.get(entry.slug);
  if (!asset) {
    const refined=`output/imagegen/lesson5/${entry.slug}-v2.png`;
    const input=existsSync(refined) ? refined : `output/imagegen/lesson5/${entry.slug}.png`;
    const bytes=await readFile(input);
    const info=await sharp(bytes).metadata();
    if (!info.hasAlpha) throw new Error(`Missing alpha: ${input}`);
    const { data, info: raw } = await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for(const index of [0,raw.width-1,(raw.height-1)*raw.width,raw.width*raw.height-1]) if(data[index*4+3]!==0) throw new Error(`Opaque corner: ${input}`);
    const output=await sharp(bytes).resize(1618,1000,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).webp({quality:88}).toBuffer();
    const digest=hash(output), filename=`${entry.slug}-${digest.slice(0,12)}.webp`;
    await writeFile(`${dir}/${filename}`,output);
    asset={src:`/images/vocabulary/lesson5/${filename}`,sha256:digest};assets.set(entry.slug,asset);
    receipts.push({slug:entry.slug,master:input,masterSha256:hash(bytes),...asset,bytes:output.length,width:1618,height:1000,alpha:true});
  }
  const word=lesson.vocabulary.find(word=>word.id===entry.wordId);
  entry.status='approved';entry.reason='Revisión del modelo: sujeto, encuadre completo y alfa. Sin revisión humana independiente.';
  media.push({wordId:word.id,sense:word.spanish,hintType:'image',...asset,alt:`Apoyo visual: ${word.spanish}`,description:`Apoyo para ${word.hanzi}`,status:'approved',presentation:'transparent-cutout',visualMode:entry.visual.visual_mode==='concrete_object'?'literal_photo':'concept_scene',imageQuizEligible:entry.visual.image_quiz_eligible,ambiguityRisk:entry.visual.ambiguity_risk,width:1618,height:1000,promptSha256:hash(entry.prompt),model:'gpt-image-1.5',quality:'medium',review:entry.reason,provenance:'API autorizada; prompts en docs/lesson5-image-prompts.json. Imagen editorial, no fuente curricular.'});
}
await writeFile('data/lesson5-media.json',JSON.stringify(media,null,2)+'\n');
await writeFile('docs/lesson5-image-assets.json',JSON.stringify({assets:receipts},null,2)+'\n');
await writeFile('docs/lesson5-image-prompts.json',JSON.stringify(prompts,null,2)+'\n');
console.log(`${assets.size} imágenes; ${media.length} palabras; alfa y tamaño verificados.`);
