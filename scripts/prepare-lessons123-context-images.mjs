// Original vector teaching diagrams; preserve old photos for review history.
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
const hash = data => createHash('sha256').update(data).digest('hex');
const words = JSON.parse(await fs.readFile('data/lessons123-public.json','utf8')).vocabulary;
const media = JSON.parse(await fs.readFile('data/vocabulary-media.json','utf8'));
const text = (x,y,s,size=62,color='#244e41') => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${color}" font-family="Arial, PingFang SC, sans-serif">${s}</text>`;
const line = (x,y,x2,y2) => `<path d="M${x} ${y}L${x2} ${y2}" fill="none" stroke="#387661" stroke-width="12" marker-end="url(#arrow)"/>`;
const circle = (x,y,r=45,fill='#dbe8d7') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#387661" stroke-width="6"/>`;
const person = (x,y) => `${circle(x,y,34)}<path d="M${x-52} ${y+135}v-32q0-60 52-60t52 60v32" fill="#dbe8d7" stroke="#387661" stroke-width="7"/>`;
const box = (x,y,w,h,fill='#f5f8ef') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="#7a9c84" stroke-width="5"/>`;
const bubble = (label,py) => `${box(780,345,720,270)}<path d="M920 615l-50 50 100-50" fill="#f5f8ef" stroke="#7a9c84" stroke-width="5"/>${text(1140,465,label,88)}${text(1140,550,py,60)}`;
const recipes = [
 ['到','La flecha termina en el destino; contrasta el punto inicial y la llegada.',`${circle(850,470)}${line(910,470,1290,470)}${circle(1370,470,65,'#bdd8b6')}${text(850,600,'salida',50)}${text(1370,600,'destino',50)}${text(1370,500,'✓',65)}${text(1110,760,'llegar',68)}`],
 ['哪','Tres alternativas y un signo de pregunta que señala una elección.',[850,1120,1390].map((x,i)=>`${box(x-88,430,176,190,['#e7d2b6','#bbd6bf','#ccd9e5'][i])}${text(x,550,String(i+1),76)}`).join('')+text(1120,350,'¿cuál?',66)+line(1120,680,1120,610)],
 ['都','Todos los miembros de un conjunto están incluidos: tres de tres, marcados.',[850,1120,1390].map(x=>`${person(x,430)}${text(x,660,'✓',90)}`).join('')+text(1120,800,'3 / 3 · todos',65)],
 ['一点儿','Barra de cantidad con una pequeña parte resaltada; el resto queda vacío.',`${box(800,450,640,115)}${box(800,450,80,115,'#7cb38d')}${line(840,690,840,580)}${text(1120,350,'cantidad',62)}${text(1120,810,'un poco',70)}`],
 ['刚到','Secuencia de trayecto y llegada en el momento actual; señal explícita de ahora.',`${circle(830,450,34)}${line(890,450,1250,450)}${circle(1340,450,70,'#bad7b6')}${text(1340,475,'✓',72)}${text(830,570,'antes',54)}${text(1340,570,'ahora',54)}${text(1110,760,'acabar de llegar',62)}`],
 ['汉语','Bocadillo con un saludo chino y su pinyin; no usar una bandera para representar un idioma.',bubble('你好','Nǐ hǎo')+text(1140,800,'idioma chino',64)],
 ['约翰','Nombre del perro del diálogo, representado por un dibujo simbólico con etiqueta John; no es un retrato documental.',`<path d="M940 430q-110-130-130 20v180q20 80 100-30m390-170q110-130 130 20v180q-20 80-100-30" fill="#b98b5c" stroke="#70513d" stroke-width="7"/><ellipse cx="1115" cy="530" rx="190" ry="175" fill="#e9c89c" stroke="#70513d" stroke-width="7"/>${circle(1040,500,15,'#332f28')}${circle(1190,500,15,'#332f28')}<ellipse cx="1115" cy="580" rx="38" ry="26" fill="#4b3e33"/>${box(920,750,390,100)}${text(1115,820,'John',68)}${line(1350,800,1260,625)}`],
 ['有名','Muchas personas conocen la misma referencia: atención compartida hacia una estrella, sin monumento no verificado.',`${circle(1120,400,80,'#efdaaa')}${text(1120,430,'★',86)}${person(850,640)}${person(1120,700)}${person(1390,640)}${line(870,590,1040,440)}${line(1120,640,1120,500)}${line(1370,590,1200,440)}${text(1120,915,'muchos lo conocen',56)}`],
 ['系','Árbol universidad → tres departamentos, con el departamento central resaltado.',`${box(940,300,360,135)}${text(1120,390,'大学',74)}${line(1120,455,830,600)}${line(1120,455,1120,600)}${line(1120,455,1410,600)}${[830,1120,1410].map((x,i)=>box(x-105,640,210,145,i===1?'#c8dfc0':'#f5f8ef')+text(x,735,`系 ${i+1}`,64)).join('')}${text(1120,900,'departamento',62)}`],
 ['孔子学院','Institución de enseñanza de chino como edificio genérico y bocadillo 汉语; sin logotipo inventado ni atribución de sede.',`${box(820,470,600,360)}<path d="M790 470l330-160 330 160Z" fill="#e4d3b9" stroke="#7a9c84" stroke-width="6"/>${text(1120,550,'汉语',78)}${[880,1060,1240].map(x=>box(x,610,120,150,'#dce9e0')).join('')}${text(1120,915,'enseñar chino',60)}`],
];
const entries=[], prompts=[];
await fs.mkdir('public/images/vocabulary/lessons123-context',{recursive:true});
for (const [hanzi, purpose, drawing] of recipes) {
 const word=words.find(x=>x.hanzi===hanzi); const previous=media.find(x=>x.wordId===word.id);
 const prompt=`Diagrama pedagógico Míng de ${hanzi} (${word.pinyin}): ${purpose} Flechas y etiquetas legibles, fondo transparente; no utilizar como quiz de imagen porque incluye la respuesta.`;
 const header=hanzi==='孔子学院'?text(1120,170,'Kǒngzǐ',68)+text(1120,245,'Xuéyuàn',68):text(1120,210,word.pinyin,80);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1618" height="1000"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#387661"/></marker></defs>${header}${drawing}</svg>`;
 const bytes=await sharp(Buffer.from(svg)).webp({lossless:true}).toBuffer();const filename=`${hash(word.id).slice(0,10)}-${hash(bytes).slice(0,12)}`;
 await fs.writeFile(`public/images/vocabulary/lessons123-context/${filename}.svg`,svg);
 await fs.writeFile(`public/images/vocabulary/lessons123-context/${filename}.webp`,bytes);
 entries.push({...previous,wordId:word.id,sense:word.spanish,src:`/images/vocabulary/lessons123-context/${filename}.webp`,alt:purpose,description:purpose,status:'approved',sha256:hash(bytes),promptSha256:hash(prompt),model:'deterministic-svg',quality:'lossless',imageQuizEligible:false,review:'2026-11-04 · Revisión de diagrama por Codex, sin validación humana independiente.',provenance:'Diagrama editorial de aprendizaje, separado del contenido documental.'});
 prompts.push({wordId:word.id,prompt});
}
await fs.writeFile('data/lessons123-context-media.json',JSON.stringify(entries,null,2)+'\n');
await fs.writeFile('docs/lessons123-context-prompts.json',JSON.stringify({entries:prompts},null,2)+'\n');
console.log({diagrams:entries.length});
