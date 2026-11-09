import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Native vector authoring. This script never edits or generates raster artwork.
// Flag geometry is vendored at its original proportions; runtime has no third-party requests.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const corpus = JSON.parse(await fs.readFile(path.join(root, 'data/lessons123-public.json'), 'utf8'));
const words = new Map(corpus.vocabulary.map(word => [word.hanzi, word]));
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
const esc = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const directory = 'public/images/vocabulary/lessons123-geography';
const color = {ink:'#173b32',jade:'#466451',soft:'#e6eee5',line:'#759384',orange:'#b34424'};
const revision = 'c09927e63705529bbf59ca6684cd9b23225dddad';
const flagRefs = {
 fr: ['https://www.elysee.fr/la-presidence/le-drapeau-francais'],
 de: ['https://www.bundestag.de/en/parliament/symbols/flag','https://www.gesetze-im-internet.de/flaggano_1996/i_.html'],
 ca: ['https://www.canada.ca/en/canadian-heritage/services/flag-canada-description.html'],
 gb: ['https://www.college-of-arms.gov.uk/resources/union-flag-faqs','https://www.royal.uk/union-jack'],
 au: ['https://peo.gov.au/understand-our-parliament/parliament-house/national-symbols-in-parliament-house'],
 ru: ['https://rostransnadzor.gov.ru/news/2923'],
 jp: ['https://www.cao.go.jp/en/flag_anthem'],
 kr: ['https://www.mois.go.kr/eng/sub/a03/nationalSymbol/screen.do'],
 th: ['https://www.thailand.go.th/page/flag'],
 in: ['https://knowindia.india.gov.in/my-india-my-pride/indian-tricolor.php'],
 eg: ['https://sis.gov.eg/en/egypt/basic-information/'],
 ar: ['https://www.casarosada.gob.ar/nuestro-pais/simbolos-nacionales','https://www.argentina.gob.ar/pais/simbolos/bandera'],
 us: ['https://www.usa.gov/flag','https://www.uscis.gov/sites/default/files/document/lesson-plans/Symbols_Celebrations_handouts.pdf'],
};
const specs = [
 ...[['法国','fr'],['德国','de'],['加拿大','ca'],['英国','gb'],['澳大利亚','au'],['俄罗斯','ru'],['日本','jp'],['韩国','kr'],['泰国','th'],['印度','in'],['埃及','eg'],['阿根廷','ar']].map(([hanzi,flag]) => ({hanzi,flag,kind:'country'})),
 {hanzi:'美国人',flag:'us',kind:'nationality'}, {hanzi:'俄罗斯人',flag:'ru',kind:'nationality'},
 ...['北京','上海','西安','广州'].map(hanzi => ({hanzi,kind:'city'})),
 ...[['英语','English'],['法语','Français'],['德语','Deutsch'],['俄语','Русский'],['日语','日本語'],['西班牙语','Español'],['韩语','한국어'],['意大利语','Italiano']].map(([hanzi,endonym])=>({hanzi,endonym,kind:'language'})),
 {hanzi:'语言',kind:'languages'}, {hanzi:'外语',kind:'foreign-language'},
 {hanzi:'方言',kind:'regional-language'}, {hanzi:'北京人',kind:'city-origin'},
];
const label = (text,x,y,size,fill=color.ink,weight=500) => `<text x="${x}" y="${y}" text-anchor="middle" fill="${fill}" font-size="${size}" font-weight="${weight}">${esc(text)}</text>`;
const rect = (x,y,w,h,fill,stroke='none',radius=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="7"/>`;
const header = word => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1618 1000" width="1618" height="1000" role="img" aria-labelledby="geo-title"><title id="geo-title">${esc(word.hanzi)} · ${esc(word.pinyin)} · ${esc(word.spanish)}</title><g font-family="'PingFang SC','Noto Sans CJK SC','Microsoft YaHei',Arial,sans-serif">`;
const footer = '</g></svg>\n';
function caption(word,y=770) {
 return label(word.hanzi,1120,y,word.hanzi.length>4?82:98)+label(word.pinyin,1120,y+102,word.pinyin.length>15?54:64,color.jade,400);
}
async function flag(code,x=790,y=240,maxW=670,maxH=420) {
 const raw = await fs.readFile(path.join(root,`scripts/assets/geography-flags/${code}.svg`),'utf8');
 if (/<(?:script|foreignObject|image)\b|\bon\w+\s*=|(?:href|xlink:href)="(?:https?:|\/\/|data:)/i.test(raw)) throw new Error(`Nonlocal or executable flag markup: ${code}`);
 const match=raw.match(/viewBox="([^"]+)"/); if(!match)throw new Error(`Flag viewBox missing: ${code}`);
 const [,,w,h]=match[1].split(/\s+/).map(Number);const scale=Math.min(maxW/w,maxH/h); const width=w*scale,height=h*scale;
 const dx=x+(maxW-width)/2,dy=y+(maxH-height)/2;
 // Native proportions and geometry are preserved, including the 11-point maple leaf,
 // Australian stars, Indian Chakra, Korean trigrams and 50 US stars.
 const nested=raw.replace(/<svg\b/,`<svg x="${dx}" y="${dy}" width="${width}" height="${height}"`).replace(/<\?xml[^>]*\?>/g,'');
 return {markup:nested+rect(dx,dy,width,height,'none','#bac6bd'),source_sha256:sha(raw),source_url:`https://raw.githubusercontent.com/hampusborgos/country-flags/${revision}/svg/${code}.svg`,ratio:w/h};
}
function bubble(text,{x=800,y=260,w=640,h=330,size=98}={}) {
 return `<path d="M ${x+50} ${y} H ${x+w-50} Q ${x+w} ${y} ${x+w} ${y+50} V ${y+h-50} Q ${x+w} ${y+h} ${x+w-50} ${y+h} H ${x+155} L ${x+75} ${y+h+75} V ${y+h} H ${x+50} Q ${x} ${y+h} ${x} ${y+h-50} V ${y+50} Q ${x} ${y} ${x+50} ${y} Z" fill="${color.soft}" stroke="${color.line}" stroke-width="8"/>`+label(text,x+w/2,y+h/2+size*.34,size);
}
async function save(file,content){
 const dest=path.join(root,file);
 if(check){if(await fs.readFile(dest,'utf8')!==content)throw new Error(`Stale generated geography artifact: ${file}`);}
 else {await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,content);}
}
const media=[],prompts=[],evidence=[];
for (const spec of specs){
 const word=words.get(spec.hanzi);if(!word)throw new Error(`Unknown curriculum entry: ${spec.hanzi}`);
 let drawing='',flagEvidence=null;
 if(spec.kind==='country'){
  flagEvidence=await flag(spec.flag);drawing=flagEvidence.markup+caption(word);
 }else if(spec.kind==='nationality'){
  flagEvidence=await flag(spec.flag,845,195,555,300);
  drawing=flagEvidence.markup+`<circle cx="1120" cy="570" r="46" fill="${color.jade}"/><path d="M 1040 692 Q 1040 620 1120 620 Q 1200 620 1200 692" fill="${color.jade}"/>`+caption(word,805);
 }else if(spec.kind==='city'){
  drawing=rect(790,180,660,490,'none',color.line,50)+label('中国',1120,300,88)+label('Zhōngguó',1120,370,56,color.jade,400)+
   `<path d="M1120 632 C 1098 600 1046 545 1046 494 A74 74 0 1 1 1194 494 C1194 545 1142 600 1120 632Z" fill="${color.orange}"/><circle cx="1120" cy="494" r="29" fill="#fffdf8"/>`+caption(word,800);
 }else if(spec.kind==='language'){
  const size=spec.endonym.length>7?84:100;drawing=bubble(spec.endonym,{size})+caption(word,805);
 }else if(spec.kind==='regional-language'){
  drawing=rect(965,100,310,170,color.soft,color.line,35)+label('语言',1120,180,68)+label('yǔyán',1120,237,40,color.jade,400)+
   `<path d="M1120 285 V330 H950 V410 M1120 330 H1290 V410" fill="none" stroke="${color.line}" stroke-width="10" stroke-linejoin="round"/><path d="M930 390 L950 414 L970 390 M1270 390 L1290 414 L1310 390" fill="none" stroke="${color.line}" stroke-width="10" stroke-linejoin="round"/>`+
   bubble('',{x:800,y:420,w:300,h:150})+bubble('',{x:1140,y:420,w:300,h:150})+
   [950,1290].map(x=>`<path d="M${x-55} 505 H${x-35} L${x-20} 462 L${x} 546 L${x+20} 462 L${x+35} 505 H${x+55}" fill="none" stroke="${color.jade}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`).join('')+
   label('地区 A',950,707,47)+label('dìqū A',950,754,35,color.jade,400)+label('地区 B',1290,707,47)+label('dìqū B',1290,754,35,color.jade,400)+caption(word,865);
 }else if(spec.kind==='city-origin'){
  drawing=rect(870,150,500,205,color.soft,color.line,40)+label('北京',1120,255,88)+label('Běijīng',1120,322,52,color.jade,400)+
   `<path d="M1120 380 V480 M1090 450 L1120 483 L1150 450" fill="none" stroke="${color.orange}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="1120" cy="567" r="54" fill="${color.jade}"/><path d="M1020 730 Q1020 630 1120 630 Q1220 630 1220 730Z" fill="${color.jade}"/>`+caption(word,850);
 }else{
  drawing=bubble(spec.kind==='languages'?'你好':'Hola',{x:800,y:195,w:440,h:220,size:82})+bubble('Hello',{x:1000,y:435,w:440,h:220,size:82})+caption(word,835);
 }
 const svg=header(word)+drawing+footer;const slug=word.hanzi.split('').map(c=>c.codePointAt(0).toString(16)).join('-');const hash=sha(svg);const name=`${slug}-${hash.slice(0,12)}.svg`;
 await save(`${directory}/${name}`,svg);
 const prompt=spec.flag?`Diagrama vectorial educativo para ${word.hanzi} (${word.pinyin}, ${word.spanish}): bandera ${spec.flag.toUpperCase()} auténtica, geometría y proporción originales de country-flags ${revision}, cotejada con fuentes oficiales; ${spec.kind==='nationality'?'silueta humana neutra debajo, sin inferir apariencia étnica; ':''}etiquetas grandes Hanzi y pinyin. Fondo transparente, composición a la derecha con espacio libre a la izquierda. No usar como pregunta de imagen porque el texto da la respuesta.`:
 `Diagrama vectorial educativo para ${word.hanzi} (${word.pinyin}, ${word.spanish}): ${spec.kind==='city'?'pin de ubicación dentro de un recuadro rotulado 中国 / Zhōngguó, sin inventar monumentos ni posiciones en un mapa':spec.kind==='city-origin'?'recuadro 北京 / Běijīng con flecha hacia una figura humana neutra para expresar procedencia, sin inferir apariencia':spec.kind==='regional-language'?'recuadro 语言 / yǔyán con ramas hacia dos regiones genéricas A y B, identificadas como 地区 / dìqū, y burbujas de voz; sin inventar pronunciaciones dialectales':spec.kind==='language'?`burbuja de habla rotulada ${spec.endonym}, sin equiparar lengua a nacionalidad`:'dos burbujas de habla con muestras escritas de idiomas, sin banderas'}; Hanzi y pinyin grandes debajo. Fondo transparente, composición a la derecha con espacio libre a la izquierda. No usar como pregunta de imagen porque el texto da la respuesta.`;
 const entry={wordId:word.id,sense:word.spanish,hintType:'image',src:`/images/vocabulary/lessons123-geography/${name}`,alt:`${word.hanzi}, ${word.pinyin}: ${word.spanish}. ${spec.flag?'Bandera identificada con su nombre.':spec.kind==='city'?'Ubicación indicada dentro de China.':spec.kind==='city-origin'?'Pekín unido por una flecha a una figura humana para indicar procedencia.':spec.kind==='regional-language'?'Una lengua se ramifica en formas de habla de dos regiones.':'Idioma indicado mediante una burbuja de habla.'}`,description:`Apoyo visual rotulado para ${word.hanzi}`,status:'approved',presentation:'transparent-cutout',visualMode:'visual_grammar',imageQuizEligible:false,ambiguityRisk:'low',width:1618,height:1000,sha256:hash,promptSha256:sha(prompt),model:'native-svg',quality:'reviewed',review:'Revisión del modelo: identidad, etiquetas, pinyin, proporciones y transparencia. Diagrama con texto, excluido del quiz visual. Sin revisión humana independiente.',provenance:spec.flag?`SVG vectorial compuesto localmente; bandera country-flags ${revision}, dominio público declarado por su repositorio. Fuentes oficiales en docs/lessons123-geography-sources.json.`:'SVG original de Míng; etiquetas tomadas del corpus activo; diagrama de apoyo editorial.'};
 media.push(entry);prompts.push({wordId:word.id,prompt,promptSha256:sha(prompt),kind:spec.kind,status:'approved'});
 evidence.push({wordId:word.id,kind:spec.kind,flag_code:spec.flag??null,source_refs:spec.flag?flagRefs[spec.flag]:[],...(flagEvidence?{asset_source_url:flagEvidence.source_url,asset_source_sha256:flagEvidence.source_sha256,native_flag_ratio:flagEvidence.ratio}:{}),pedagogy:spec.kind==='language'?'An endonym identifies the language without claiming a one-to-one relation with a country.':spec.kind==='city'?'Schematic country containment, not a map or a claim about coordinates.':spec.kind==='nationality'?'Nationality is specified by the label and flag; no physical stereotypes.':'Labels resolve identity; no image quiz.'});
}
await save('data/lessons123-geography-media.json',JSON.stringify(media,null,2)+'\n');
await save('docs/lessons123-geography-prompts.json',JSON.stringify({schema_version:1,batch:'ming-l123-geography-20261104',entries:prompts},null,2)+'\n');
await save('docs/lessons123-geography-sources.json',JSON.stringify({schema_version:1,review_date:'2026-11-04',method:'Native SVG composition using vendored flag vectors at their original proportions. Flag features compared with primary government references; all resulting images visually inspected. No bitmap editing or generated flags.',vector_source:{repository:'https://github.com/hampusborgos/country-flags',commit:revision,license:'Public domain flag designs, as stated in the upstream README',license_statement:'https://github.com/hampusborgos/country-flags#accurate-country-flags'},entries:evidence},null,2)+'\n');
console.log(`${check?'Verified':'Generated'} ${media.length} transparent geography/language SVGs; image quiz disabled.`);
