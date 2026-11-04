// Offline recipe/catalog builder and importer; never calls an image API.
// --prepare; --structured; --word=v-跑步 --input=path --prompt-file=path --approve
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const corpus = await read('data/lesson4-public.json');
const recipes = await read('scripts/lesson4-image-recipes.json');
const catalog = await read('docs/lesson4-image-prompts.json');
const legacy = await read('docs/vocabulary-image-prompts.json');
const laterPrompts = await read('docs/lesson5-image-prompts.json');
const reusablePrompts = new Map([...legacy.entries, ...laterPrompts.entries].map(entry => [entry.wordId, entry]));
const sharedMedia = await read('data/vocabulary-media.json');
let media = await read('data/lesson4-media.json');
const directory = 'public/images/vocabulary/lesson4';
await mkdir(directory, { recursive: true });
const photoPrompt = (word, recipe) => `Use case: photorealistic-natural. Educational vocabulary cutout for Ming: ${word.hanzi}, ${word.spanish}. Style ming-vocabulary-transparent-subject-golden-v2. ${recipe.subject} Photorealistic natural daylight and realistic materials. True transparent alpha background; no room, floor, scenery, colored background, checkerboard, text, logos, UI or symbols. Golden-ratio landscape canvas target 1618x1000. Complete subject on right half x46–96%, y3–96%; left half reserved for live HTML text. Transparent canvas corners; no cropping. Only the isolated subject.`;
// New documentary/editorial vocabulary must also reach the administration plan.
// Existing prompts remain immutable while their assets are in use.
for (const word of corpus.vocabulary) {
  if (!catalog.entries.some(entry => entry.wordId === word.id)) {
    catalog.entries.push({ wordId: word.id, visual: word.visual_ming, status: 'requires_semantic_review' });
  }
}
for (const entry of catalog.entries) {
  const recipe = recipes[entry.wordId];
  const word = corpus.vocabulary.find(word => word.id === entry.wordId);
  if (!word) continue;
  if (recipe && !media.some(asset => asset.wordId === entry.wordId)) {
    entry.prompt = recipe.kind === 'photo' ? photoPrompt(word, recipe)
      : `Composición determinista de apoyo para ${word.hanzi} (${word.spanish}). Receta ${JSON.stringify(recipe)}. Lienzo alfa 1618 × 1000; contenido en la mitad derecha. Números, sectores y relaciones exactos, nunca generados por IA. Es un ejemplo contextual; no habilita una pregunta de reconocimiento aislado.`;
    entry.status = recipe.kind === 'photo' ? 'ready_to_generate' : 'deterministic_composition';
    entry.reason = 'Receta editorial explícita; conservar corpus y revisión por versión.';
  } else if (!recipe && !entry.prompt) {
    const existing = reusablePrompts.get(entry.wordId);
    if (existing) {
      entry.status = 'existing_asset'; entry.prompt = existing.prompt;
      entry.reason = 'Reutilizar el recurso y la revisión existentes; no duplicar ni aprobar de nuevo.';
    } else if (word.visual_ming.visual_mode === 'none') {
      entry.status = 'no_image'; entry.reason = 'El corpus indica none: no inventar un recurso.';
    } else {
      entry.status = 'requires_semantic_review';
      entry.reason = 'Definir una escena compatible con el sentido y sus ejemplos antes de generar.';
      entry.prompt = `Preparar apoyo editorial para ${word.hanzi} (${word.pinyin}): ${word.spanish}. Modo ${word.visual_ming.visual_mode}. Elegir un contexto compatible entre los vínculos auditados: ${word.examplePhraseIds.join(', ')}. No inferir identidades, nacionalidad, profesión ni equivalencias por apariencia. Requiere revisión semántica antes de generación. Sujeto o escena aislada con alfa, sin texto, UI ni fondo. No usar como definición visual aislada ni habilitar quiz.`;
    }
  }
}
const ink = '#315848', accent = '#b34424', pale = '#e6eee5';
const text = (x,y,value,size=50,color=ink) => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial,sans-serif" font-size="${size}" text-anchor="middle">${value}</text>`;
const circle = (x,y,r,fill=ink) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
function diagram(recipe) {
  let body = '';
  if (recipe.kind === 'timeline') {
    body = '<path d="M800 550H1500" stroke="#315848" stroke-width="8"/>';
    for (let i=-1;i<=1;i++) {
      const x=1150+i*260, selected=i===recipe.offset;
      body+=`<rect x="${x-100}" y="350" width="200" height="260" rx="24" fill="${selected?pale:'#fffdf8'}" stroke="${selected?accent:ink}" stroke-width="${selected?12:5}"/>`;
      body+=text(x,495,i===0?'HOY':i<0?'−1':'+1',i===0?46:60);
      if(selected) body+=`<path d="M${x-35} 270L${x} 315L${x+35} 270" fill="none" stroke="${accent}" stroke-width="14"/>`;
    }
  } else if (recipe.kind === 'day-period') {
    body=`<path d="M810 490H1500" stroke="${pale}" stroke-width="48"/>`;
    body+=`<path d="M${810+recipe.start/24*690} 490H${810+recipe.end/24*690}" stroke="${accent}" stroke-width="48"/>`;
    for(const h of [0,6,12,18,24]) { const x=810+h/24*690; body+=`<path d="M${x} 465V520" stroke="${ink}" stroke-width="4"/>`+text(x,590,String(h).padStart(2,'0'),40); }
    body+=text(1155,360,'24 h',48);
  } else if (recipe.kind === 'clock' || recipe.kind === 'fraction') {
    const minutes=recipe.minutes, angle=minutes/60*2*Math.PI, x=1160+255*Math.sin(angle),y=500-255*Math.cos(angle);
    body=circle(1160,500,280,'#fffdf8');
    if(minutes) body+=`<path d="M1160 500L1160 245A255 255 0 ${minutes>30?1:0} 1 ${x} ${y}Z" fill="${pale}"/>`;
    body+=`<circle cx="1160" cy="500" r="280" fill="none" stroke="${ink}" stroke-width="9"/>`;
    if(recipe.kind==='clock') {
      for(let i=0;i<60;i++) { const a=i/60*2*Math.PI; body+=`<path d="M${1160+Math.sin(a)*245} ${500-Math.cos(a)*245}L${1160+Math.sin(a)*265} ${500-Math.cos(a)*265}" stroke="${ink}" stroke-width="${i%5===0?6:2}"/>`; }
      body+=`<path d="M1160 500L${x} ${y}" stroke="${accent}" stroke-width="10" stroke-linecap="round"/>`;
      if(!minutes) body+='<path d="M1160 500H1290" stroke="#315848" stroke-width="15" stroke-linecap="round"/>';
      body+=text(1160,880,minutes?`${minutes} min`:'3:00',65);
    } else { body+=`<path d="M1160 220V780" stroke="${ink}" stroke-width="6"/>`+text(1160,880,'½',90); }
  } else if(recipe.kind==='quantity') {
    body='<rect x="910" y="300" width="500" height="320" rx="35" fill="none" stroke="#315848" stroke-width="8"/>'+text(1160,790,'0',110);
  } else if(recipe.kind==='comparison') {
    for (const [side,count] of [['few',2],['many',12]]) {
      const x=side==='few'?825:1200,selected=side===recipe.side;
      body+=`<rect x="${x}" y="270" width="320" height="440" rx="28" fill="${selected?pale:'#fffdf8'}" stroke="${selected?accent:ink}" stroke-width="${selected?10:4}"/>`;
      for(let i=0;i<count;i++) body+=circle(x+65+(i%3)*95,345+Math.floor(i/3)*95,24);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1618" height="1000" viewBox="0 0 1618 1000">${body}</svg>`;
}
async function publish(wordId, input, approved, promptOverride) {
  const word=corpus.vocabulary.find(word=>word.id===wordId), recipe=recipes[wordId], entry=catalog.entries.find(entry=>entry.wordId===wordId);
  if(!word || !recipe || !entry?.prompt) throw new Error('Missing audited word/recipe/prompt');
  if(promptOverride) entry.prompt=promptOverride;
  const raw=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(!(await sharp(input).metadata()).hasAlpha) throw new Error('No alpha');
  const alpha=(x,y)=>raw.data[(y*raw.info.width+x)*4+3];
  if([[0,0],[raw.info.width-1,0],[0,raw.info.height-1],[raw.info.width-1,raw.info.height-1]].some(([x,y])=>alpha(x,y)!==0)) throw new Error('Opaque corners');
  // Isolated alpha=1 noise in generated negative space must not shrink the
  // visible subject. Measure alpha directly, keeping a 2px feather margin;
  // neither repaint nor crop any visible part of the subject.
  let left=raw.info.width, top=raw.info.height, right=-1, bottom=-1;
  if (recipe.kind === 'photo') {
    for (let y=0;y<raw.info.height;y++) for (let x=0;x<raw.info.width;x++) if (alpha(x,y)>1) {
      left=Math.min(left,x); right=Math.max(right,x); top=Math.min(top,y); bottom=Math.max(bottom,y);
    }
    if (right < left) throw new Error('Empty alpha subject');
    left=Math.max(0,left-2); top=Math.max(0,top-2);
    right=Math.min(raw.info.width-1,right+2); bottom=Math.min(raw.info.height-1,bottom+2);
  }
  const fitted=recipe.kind==='photo' ? await sharp(input).extract({left,top,width:right-left+1,height:bottom-top+1}).resize(770,recipe.maxHeightPx ?? 900,{fit:'inside'}).png().toBuffer() : input;
  const size=await sharp(fitted).metadata();
  // Tall dark subjects may need extra transparent room for the top-right flip
  // control. This is canvas placement only; it does not modify the photograph.
  const rightEdge = recipe.rightEdgePx ?? 1535;
  const photoTop = recipe.bottomEdgePx ? recipe.bottomEdgePx-size.height : (1000-size.height)/2;
  if (recipe.kind === 'photo' && (rightEdge > 1535 || rightEdge-size.width < 700 || photoTop < 30 || photoTop+size.height > 970)) throw new Error('Photo placement overlaps card text or edge');
  const png=recipe.kind==='photo' ? await sharp({create:{width:1618,height:1000,channels:4,background:'#00000000'}}).composite([{input:fitted,left:Math.round(rightEdge-size.width),top:Math.round(photoTop)}]).png().toBuffer() : await sharp(input).png().toBuffer();
  const webp=await sharp(png).webp({quality:88,alphaQuality:100}).toBuffer(), sha=hash(webp), slug=`${recipe.slug}-${sha.slice(0,12)}`;
  await writeFile(`${directory}/${slug}.png`,png); await writeFile(`${directory}/${slug}.webp`,webp);
  const asset={wordId,sense:word.spanish,hintType:'image',src:`/images/vocabulary/lesson4/${slug}.webp`,alt:`Apoyo visual de ${word.spanish}`,description:`Apoyo editorial para ${word.hanzi}`,status:approved?'approved':'pending_review',presentation:'transparent-cutout',visualMode:word.visual_ming.visual_mode,imageQuizEligible:approved && recipe.quiz===true,ambiguityRisk:word.visual_ming.ambiguity_risk,width:1618,height:1000,sha256:sha,promptSha256:hash(entry.prompt),model:recipe.kind==='photo'?'built-in-imagegen':'deterministic-svg',quality:'reviewed',review:approved?'Revisión del modelo: semántica, alfa y encuadre; autorización del usuario para recursos sin contradicción. No revisión humana independiente.':'Pendiente de revisión visual.',provenance:'Receta y prompt en docs/lesson4-image-prompts.json; no fuente curricular.'};
  media=[...media.filter(row=>row.wordId!==wordId),asset]; entry.status=asset.status;
  console.log(`${wordId}: ${asset.status} ${asset.src}`);
}
const arg=name=>process.argv.find(arg=>arg.startsWith(`--${name}=`))?.slice(name.length+3);
const only = arg('only')?.split(',');
if(process.argv.includes('--structured')) for(const [id,recipe] of Object.entries(recipes)) if(recipe.kind!=='photo' && corpus.vocabulary.some(word => word.id === id) && (!only || only.includes(id))) await publish(id,Buffer.from(diagram(recipe)),process.argv.includes('--approve'));
if(arg('word')) await publish(arg('word'),arg('input'),process.argv.includes('--approve'),arg('prompt-file')?await readFile(arg('prompt-file'),'utf8'):undefined);
// Explicit reuse after visual/semantic review preserves the generated file and
// prompt hashes. Remote no_image/pending decisions still override this manifest.
if (arg('reuse-reviewed')) {
  if (!process.argv.includes('--approve') || !arg('review-file')) throw new Error('Reviewed reuse requires --approve and --review-file');
  const review = (await readFile(arg('review-file'), 'utf8')).trim();
  if (!review) throw new Error('Missing review evidence');
  for (const id of arg('reuse-reviewed').split(',')) {
    const word = corpus.vocabulary.find(word => word.id === id);
    const source = sharedMedia.find(asset => asset.wordId === id);
    const entry = catalog.entries.find(entry => entry.wordId === id);
    if (!word || !source || !entry?.prompt || hash(entry.prompt) !== source.promptSha256) throw new Error(`Unverified reuse prompt: ${id}`);
    const buffer = await readFile(`public${source.src}`);
    if (hash(buffer) !== source.sha256) throw new Error(`Unverified reuse file: ${id}`);
    const metadata = await sharp(buffer).metadata();
    const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (!metadata.hasAlpha || [[0,0],[info.width-1,0],[0,info.height-1],[info.width-1,info.height-1]].some(([x,y]) => data[(y*info.width+x)*4+3] !== 0)) throw new Error(`Unverified reuse alpha: ${id}`);
    media = [...media.filter(asset => asset.wordId !== id), { ...source, sense: word.spanish, status: 'approved', imageQuizEligible: false, review, provenance: `${source.provenance} Revisión de reutilización L4: archivo y prompt originales intactos.` }];
  }
}
for (const entry of catalog.entries) {
  const asset = media.find(asset => asset.wordId === entry.wordId);
  if (asset) entry.status = asset.status;
}
await writeFile('docs/lesson4-image-prompts.json',JSON.stringify(catalog,null,2)+'\n');
await writeFile('data/lesson4-media.json',JSON.stringify(media,null,2)+'\n');
