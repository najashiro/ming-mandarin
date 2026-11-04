// Original, editable SVG teaching diagrams. Offline; no photo editing or paid API.
// The user explicitly authorized arrows, pinyin and labels inside these aids.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const corpus = JSON.parse(await readFile('data/lessons123-public.json', 'utf8'));
const words = new Map(corpus.vocabulary.map(word => [word.hanzi, word]));
const phrases = new Map(corpus.phrases.map(phrase => [phrase.id, phrase]));
const directory = 'public/images/vocabulary/lessons123-pedagogy';
const check = process.argv.includes('--check');
const approve = process.argv.includes('--approve');
const hash = value => createHash('sha256').update(value).digest('hex');
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const jade = '#173b32', muted = '#466451', accent = '#b34424', light = '#e6eee5';
const text = (x, y, value, size = 54, color = jade, weight = 400) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="middle">${esc(value)}</text>`;
const line = (x1, y1, x2, y2, color = jade, width = 12, arrow = false) => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${arrow ? ' marker-end="url(#arrow)"' : ''}/>`;
const circle = (x, y, r, fill = light, stroke = jade, width = 8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const rect = (x, y, w, h, fill = light, stroke = jade, radius = 20) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="7"/>`;
const path = (d, fill = 'none', stroke = jade, width = 12) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const person = (x, y, scale = 1, color = jade) => `<g transform="translate(${x} ${y}) scale(${scale})">${circle(0, 0, 36, '#f0c8a8', color, 7)}${path('M-52 116 Q-50 50 0 50 Q50 50 52 116', light, color, 9)}${line(-22, 117, -22, 167, color, 9)}${line(22, 117, 22, 167, color, 9)}</g>`;
const cup = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${path('M-65 0 H65 V84 Q62 130 0 130 Q-62 130 -65 84 Z', '#f0c8a8')}${path('M65 20 C135 8 134 100 65 88')}${path('M-20 -75 Q-50 -45 -20 -20 M25 -75 Q0 -45 25 -20', 'none', muted, 8)}</g>`;
const clock = (x, y, hour, scale = 1) => {
  const angle = hour / 12 * Math.PI * 2;
  return `<g transform="translate(${x} ${y}) scale(${scale})">${circle(0, 0, 112, '#fffdf8')}${[0,3,6,9].map(h => { const a = h / 12 * Math.PI * 2; return line(Math.sin(a)*92,-Math.cos(a)*92,Math.sin(a)*101,-Math.cos(a)*101,muted,5); }).join('')}${line(0,0,0,-80,jade,8)}${line(0,0,Math.sin(angle)*63,-Math.cos(angle)*63,accent,12)}${circle(0,0,9,jade,jade,0)}</g>`;
};
function example(hanzi, expected) {
  const word = words.get(hanzi);
  const phrase = word?.examplePhraseIds.map(id => phrases.get(id)).find(p => p.hanzi === expected);
  if (!phrase?.pinyin || !phrase.spanish) throw new Error(`Missing reviewed example for ${hanzi}: ${expected}`);
  return phrase;
}
const grammarExamples = {
  很: '很好吃。', 太: '我不太累。', 在: '林娜在。', 是: '他是学生。', 刚: '我刚认识她。',
  还: '我要咖啡，还要点心。', 晚: '很晚', 会: '我会用筷子。', 一下: '你说一下，你家有几口人？', 死: '我累死了。', 真: '真好',
};
function footer(phrase, options = {}) {
  const hanzi = options.hanzi ?? phrase.hanzi;
  const pinyin = options.pinyin ?? phrase.pinyin;
  return text(1130, 762, hanzi, 58) + text(1130, 822, pinyin, pinyin.length > 30 ? 38 : 44, muted)
    + (options.gloss ? text(1130, 888, options.gloss, 43, accent, 600) : '');
}
const recipes = [];
function add(hanzi, family, content, explanation, phrase = null) {
  const word = words.get(hanzi);
  if (!word?.pinyin || !word.spanish) throw new Error(`Missing corpus word: ${hanzi}`);
  recipes.push({ hanzi, wordId: word.id, pinyin: word.pinyin, spanish: word.spanish, family, explanation,
    examplePhraseId: phrase?.id ?? null, exampleHanzi: phrase?.hanzi ?? null, examplePinyin: phrase?.pinyin ?? null, content });
}

// Relative years: arrows and offsets remain correct when the calendar year changes.
const yearWords = ['前年', '去年', '今年', '明年', '后年'];
for (let chosen = 0; chosen < yearWords.length; chosen++) {
  const nodes = yearWords.map((h, i) => {
    const x = 790 + i * 165;
    return circle(x, 440, i === chosen ? 53 : 32, i === chosen ? accent : light, i === chosen ? accent : muted, 6)
      + text(x, 458, ['−2','−1','0','+1','+2'][i], i === chosen ? 49 : 36, i === chosen ? '#fffdf8' : jade, 600)
      + text(x, 565, h, 47, i === chosen ? accent : muted, i === chosen ? 700 : 400);
  }).join('');
  add(yearWords[chosen], 'relative_year', line(780,440,1535,440,muted,10,true) + nodes
    + text(1120,656,'0 = año actual',48,muted) + text(1130,770,words.get(yearWords[chosen]).spanish.split(';')[0],49,accent,600),
  'Línea de tiempo relativa: el año actual es 0, desplazamientos enteros de años. El punto y nombre resaltados identifican el término.');
}
add('年','year_length',Array.from({length:12},(_,i)=>{
  const x=820+(i%4)*164,y=310+Math.floor(i/4)*118;
  return rect(x,y,130,88,'#e6eee5',muted,12)+text(x+65,y+61,i+1,45);
}).join('') + text(1130,790,'12 meses',65,accent,600), 'Doce casillas numeradas representan los doce meses de un año; no es un año concreto.');
for (const [h, chosen] of [['昨天',0],['明天',2],['现在',1]]) {
  const labels = h === '现在' ? ['antes','ahora','después'] : ['ayer','hoy','mañana'];
  add(h,'relative_time',line(830,450,1535,450,muted,10,true)+labels.map((label,i)=>{
    const x=850+i*280;
    return circle(x,450,i===chosen?66:42,i===chosen?accent:light,i===chosen?accent:muted)
      +text(x,566,label,52,i===chosen?accent:jade,i===chosen?700:400);
  }).join('') + text(1130,725,h==='现在'?'este momento':'hoy = referencia',48,muted),
  'Secuencia relativa de tres momentos. La flecha avanza hacia el futuro y el término estudiado está resaltado.');
}
add('工作日','working_week', ['L','M','X','J','V','S','D'].map((day,i)=>{
  const x=785+i*100;return rect(x,355,82,120,i<5?jade:'#e6eee5',i<5?jade:muted,14)+text(x+41,436,day,50,i<5?'#fffdf8':muted,600);
}).join('') + line(825,535,1225,535,accent,12)+text(1130,660,'Ejemplo: lunes a viernes',43,jade)
  + text(1130,738,'días de trabajo',57,accent,600), 'Una semana laboral habitual, marcada como ejemplo para no afirmar que sábado o domingo nunca puedan ser laborables.');
for (const [h,hour,label] of [['上午',9,'09:00 · mañana'],['中午',12,'12:00 · mediodía'],['下午',15,'15:00 · tarde']]) {
  add(h,'time_of_day',clock(1130,450,hour,1.4)+text(1130,690,label,55,accent,600)+text(1130,776,'hora de ejemplo',43,muted),
    'Reloj analógico y hora de ejemplo para distinguir mañana, mediodía y tarde, sin inventar límites horarios rígidos.');
}
for (const [h,near] of [['这儿',true],['那儿',false]]) {
  const pin=(x,y,active)=>path(`M${x} ${y+75} C${x-90} ${y-15} ${x-55} ${y-100} ${x} ${y-100} C${x+55} ${y-100} ${x+90} ${y-15} ${x} ${y+75} Z`,active?accent:light,active?accent:muted,7)+circle(x,y-43,19,active?'#fffdf8':muted,active?'#fffdf8':muted,0);
  add(h,'deictic_location',person(830,465,0.85)+pin(1010,465,near)+pin(1390,465,!near)
    +line(860,390,near?970:1350,350,accent,10,true)+text(830,714,'yo',47,muted)
    +text(1010,635,'cerca',46,near?accent:muted)+text(1390,635,'lejos',46,!near?accent:muted),
    'La persona fija el punto de referencia del hablante. Flecha y pin resaltado indican aquí, cerca, o allí, lejos.');
}

for (const h of Object.keys(grammarExamples)) {
  const p = example(h, grammarExamples[h]);
  let art = '', tail = footer(p), explanation = '';
  if (h === '很') {
    art = circle(960,480,93,'#fffdf8')+circle(960,480,67,'#f0c8a8',accent,6)
      +path('M930 330 Q905 300 930 265 M985 330 Q960 300 985 265','none',muted,7)
      +[0,1,2].map(i=>rect(1190+i*80,500-i*65,55,80+i*65,i<2?jade:accent,i<2?jade:accent,10)).join('');
    tail = footer(p,{gloss:'muy rico'}); explanation='En 很好吃, el grado alto acompaña una valoración de sabor. No se afirma que 很 siempre tenga énfasis fuerte.';
  } else if(h === '太') {
    art=line(825,460,1440,460,muted,13,true)+circle(970,460,40,jade,jade,0)+circle(1360,460,60,accent,accent,0)
      +text(970,565,'不太',57,jade,600)+text(1360,565,'太',65,accent,700)+text(1360,650,'grado alto',43,accent);
    tail=footer(p,{gloss:'no tan cansado'}); explanation='Contrasta el grado alto 太 con la negación 不太 del ejemplo existente, sin atribuir una frase nueva al corpus.';
  } else if(h === '在') {
    art=path('M850 420 L1125 250 L1400 420 M905 395 V650 H1345 V395','none',muted,12)+person(1125,460,0.85)
      +line(810,545,985,545,accent,12,true);
    tail=footer(p,{gloss:'está presente'}); explanation='Persona presente dentro de un lugar y flecha de localización. 在 se muestra como presencia, según 林娜在。';
  } else if(h === '是') {
    art=person(900,410,1.1)+line(1020,470,1190,470,accent,12,true)+rect(1250,355,230,230)
      +path('M1285 410 L1365 375 L1445 410 L1365 445 Z','#f0c8a8')+text(1365,535,'学生',61,jade,600);
    tail=footer(p,{gloss:'es estudiante'}); explanation='Flecha de identificación entre una persona y la categoría estudiante. Se evita representar 是 como ubicación.';
  } else if(h === '刚') {
    art=line(820,460,1470,460,muted,12,true)+circle(1280,460,37,accent,accent,0)+circle(1400,460,20,jade,jade,0)
      +text(880,565,'antes',44,muted)+text(1260,365,'recién',53,accent,600)+text(1400,565,'ahora',44,jade)
      +line(1270,385,1280,410,accent,9,true);
    explanation='Hecho situado inmediatamente antes del ahora. La proximidad visual distingue recién de un pasado remoto.';
  } else if(h === '还') {
    art=cup(900,405,0.8)+text(1135,535,'+',110,accent,600)+rect(1280,435,165,115,'#f0c8a8',jade,22)
      +line(1310,465,1410,465,accent,5)+line(1310,495,1410,495,accent,5);
    tail=text(1130,732,'我要咖啡，还要点心。',55)+text(1130,793,'Wǒ yào kāfēi,',43,muted)
      +text(1130,846,'hái yào diǎnxin.',43,muted)+text(1130,910,'y además…',45,accent,600);
    explanation='Suma explícita de café y bocadillo: 还 con el sentido aditivo registrado, no la lectura huán ni un simple gesto ambiguo.';
  } else if(h === '晚') {
    art=clock(910,430,9,0.82)+clock(1360,430,10,0.82)+line(1050,430,1220,430,accent,11,true)
      +text(910,590,'21:00',54,muted)+text(1360,590,'22:00',58,accent,600)+text(910,655,'previsto',40,muted)+text(1360,655,'más tarde',40,accent);
    tail=footer(p,{gloss:'tarde en el tiempo'}); explanation='Compara una hora prevista con otra posterior para distinguir 晚 de 下午. Horas editoriales de ejemplo.';
  } else if(h === '会') {
    art=circle(1050,515,105,'#fffdf8')+path('M970 510 Q1050 570 1130 510','#f0c8a8')
      +line(1080,440,1250,285,jade,12)+line(1110,455,1280,295,jade,12)
      +path('M1290 525 L1335 575 L1440 435','none',accent,25);
    tail=footer(p,{gloss:'habilidad aprendida'}); explanation='Palillos sobre un cuenco y comprobación de capacidad: saber usar palillos, que es el ejemplo registrado.';
  } else if(h === '一下') {
    art=rect(860,320,520,245,'#e6eee5',jade,45)+path('M970 565 L955 635 L1065 565',light)
      +[0,1,2].map(i=>circle(1030+i*80,440,17,jade,jade,0)).join('')+text(1130,680,'petición breve',49,accent,600);
    // Exact opening of the recorded longer sentence; full source example stays in the recipe.
    tail=footer(p,{hanzi:'你说一下',pinyin:'Nǐ shuō yíxià',gloss:'cuéntame un momento'});
    explanation='Burbuja de habla breve y apertura literal del ejemplo 你说一下，你家有几口人？. 一下 suaviza la petición, sin fijar una duración en segundos.';
  } else if(h === '死') {
    art=person(900,395,1.15)+path('M872 397 L887 403 M913 403 L928 397','none',muted,6)
      +[0,1,2,3].map(i=>rect(1115+i*80,560-i*68,55,80+i*68,i===3?accent:light,i===3?accent:muted,10)).join('')
      +text(1260,675,'al extremo',45,accent,600);
    tail=footer(p,{gloss:'muerto de cansancio'}); explanation='Persona cansada y escala máxima: 死 intensifica 累 en el ejemplo, no significa una muerte literal aquí.';
  } else if(h === '真') {
    art=rect(925,330,410,260,'#e6eee5',jade,45)+text(1130,512,'好！',105,jade,600)
      +line(855,345,900,375,accent,13)+line(860,490,900,490,accent,13)+line(1360,375,1410,345,accent,13)+line(1360,490,1410,490,accent,13);
    tail=footer(p,{gloss:'¡de verdad!'}); explanation='Énfasis afirmativo sobre 好: 真好, verdaderamente bien. No se confunde con solo una sonrisa o una marca de verdadero/falso.';
  }
  add(h,'grammar_in_context',art+tail,explanation,p);
}

await mkdir(directory,{recursive:true});
const current = JSON.parse(await readFile('data/lessons123-pedagogy-media.json','utf8').catch(()=>'[]'));
const entries=[], receipts=[], prompts=[];
for (const recipe of recipes) {
  const title=text(1130,174,recipe.hanzi,80,jade,600)+text(1130,242,recipe.pinyin,49,muted);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1618" height="1000" viewBox="0 0 1618 1000"><title>${esc(recipe.hanzi+' · '+recipe.pinyin)}</title><desc>${esc(recipe.explanation)}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${accent}"/></marker></defs><g font-family="Arial Unicode MS,Arial,sans-serif">${title}${recipe.content}</g></svg>\n`;
  const recipeRecord={...recipe};delete recipeRecord.content;
  const prompt=`Crear un diagrama SVG didáctico original para ${recipe.hanzi} (${recipe.pinyin}): ${recipe.spanish}. ${recipe.explanation} Usar flechas claras, alto contraste, Hanzi y pinyin exactos del corpus. Lienzo transparente 1618 × 1000; contenido en la mitad derecha y texto legible al mostrar la tarjeta a 400 px. No utilizar como pregunta de quiz por imagen.${recipe.exampleHanzi ? ` Contexto registrado: ${recipe.exampleHanzi} / ${recipe.examplePinyin}.` : ''}`;
  const filename=`${recipe.hanzi.codePointAt(0).toString(16)}-${hash(svg).slice(0,12)}`;
  const svgPath=`${directory}/${filename}.svg`;
  const bytes=await sharp(Buffer.from(svg)).webp({quality:90,alphaQuality:100}).toBuffer();
  const src=`/images/vocabulary/lessons123-pedagogy/${filename}.webp`;
  const sha256=hash(bytes);
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(const i of [0,info.width-1,(info.height-1)*info.width,info.width*info.height-1]) if(data[i*4+3]!==0) throw new Error('Opaque diagram corner');
  for(let y=0;y<info.height;y++) for(let x=0;x<700;x++) if(data[(y*info.width+x)*4+3]!==0) throw new Error(`Text safe zone violated: ${recipe.hanzi}`);
  const prior=current.find(entry=>entry.wordId===recipe.wordId&&entry.sha256===sha256);
  const status=approve?'approved':prior?.status??'pending_review';
  const entry={wordId:recipe.wordId,sense:recipe.spanish,hintType:'image',src,alt:`${recipe.hanzi} (${recipe.pinyin}): ${recipe.explanation}`,description:`Diagrama didáctico para ${recipe.hanzi}: ${recipe.explanation}`,status,presentation:'transparent-cutout',visualMode:'visual_grammar',imageQuizEligible:false,ambiguityRisk:'high',width:1618,height:1000,sha256,promptSha256:hash(prompt),model:'native-svg-diagram',quality:'vector-authored-webp',review:status==='approved'?'Inspección visual del modelo a tamaño de tarjeta: texto, flechas, sentido y alfa. Sin revisión humana independiente.':'Pendiente de inspección visual.',provenance:'Diagrama editorial original; flechas y pinyin autorizados por el usuario. Recetas en docs/lessons123-pedagogy-recipes.json.'};
  if(check){
    if(await readFile(svgPath,'utf8')!==svg || hash(await readFile(`public${src}`))!==sha256)throw new Error(`Stale diagram: ${recipe.hanzi}`);
  }else{
    await writeFile(svgPath,svg);await writeFile(`public${src}`,bytes);
  }
  entries.push(entry);receipts.push({...recipeRecord,svg:svgPath,src,bytes:bytes.length,sha256,promptSha256:entry.promptSha256});
  prompts.push({wordId:recipe.wordId,hanzi:recipe.hanzi,pinyin:recipe.pinyin,prompt,status,reason:recipe.explanation});
}
const manifest=JSON.stringify(entries,null,2)+'\n';
const promptDocument=JSON.stringify({schema_version:1,entries:prompts},null,2)+'\n';
if(check){
  if(await readFile('data/lessons123-pedagogy-media.json','utf8')!==manifest)throw new Error('Stale pedagogy media manifest');
  if(await readFile('docs/lessons123-pedagogy-prompts.json','utf8')!==promptDocument)throw new Error('Stale pedagogy prompts');
}else{
  await writeFile('data/lessons123-pedagogy-media.json',manifest);
  await writeFile('docs/lessons123-pedagogy-prompts.json',promptDocument);
  await writeFile('docs/lessons123-pedagogy-recipes.json',JSON.stringify({schema_version:1,batch:'ming-lessons123-pedagogy-20261104',method:'Original native SVG diagrams, rasterized offline to WebP. No photo editing. No paid services.',source:'data/lessons123-public.json',authorization:'User expressly requested pedagogical images with arrows and pinyin; this overrides the former no-text photograph standard for these diagrams.',typography:'Arial Unicode MS with Arial fallback; render on the same host for byte-identical WebP.',quiz_policy:'All diagrams are reading aids; none is an image-only quiz prompt.',entries:receipts},null,2)+'\n');
}
console.log(JSON.stringify({diagrams:entries.length,approved:entries.filter(e=>e.status==='approved').length,bytes:receipts.reduce((sum,r)=>sum+r.bytes,0)}));
