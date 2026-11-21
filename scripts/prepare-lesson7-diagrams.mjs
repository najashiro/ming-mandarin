// Native educational diagrams, following the project's approved diagram style.
// Transparent vector masters; all labeled diagrams are excluded from image quizzes.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const read=async file=>JSON.parse(await readFile(file,'utf8'));
const request=await read('docs/lesson7-media-request.json');
const manifest=await read('docs/lesson7-image-prompts.json');
const lesson=await read('data/lesson7-public.json');
const ink='#315848', pale='#e1eae2', accent='#b34424', gold='#bd913c';
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const text=(x,y,value,size=44,color=ink)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial, PingFang SC, sans-serif" font-size="${size}" font-weight="500" fill="${color}">${esc(value)}</text>`;
const path=(d,color=ink,width=12,fill='none')=>`<path d="${d}" stroke="${color}" stroke-width="${width}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`;
const rect=(x,y,w,h,fill=pale,stroke=ink)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="10"/>`;
const circle=(x,y,r,fill=pale)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${ink}" stroke-width="10"/>`;
const arrow=(x1,y1,x2,y2)=>path(`M ${x1} ${y1} L ${x2} ${y2}`,accent,15)+path(`M ${x2-24} ${y2-22} L ${x2} ${y2} L ${x2-24} ${y2+22}`,accent,15);
const check=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${path('M 0 45 L 38 82 L 120 0',ink,19)}</g>`;
const person=(x,y)=>`<g transform="translate(${x} ${y})">${circle(0,0,40)}${path('M -65 155 L -52 75 Q 0 42 52 75 L 65 155',ink,14)}${path('M -28 155 V 235 M 28 155 V 235')}</g>`;
const bubble=(x,y,w,h)=>path(`M ${x+20} ${y} H ${x+w-20} Q ${x+w} ${y} ${x+w} ${y+20} V ${y+h-20} Q ${x+w} ${y+h} ${x+w-20} ${y+h} H ${x+85} L ${x+42} ${y+h+38} L ${x+46} ${y+h} H ${x+20} Q ${x} ${y+h} ${x} ${y+h-20} V ${y+20} Q ${x} ${y} ${x+20} ${y} Z`,ink,9,pale);
const shirt=(x,y,scale=1,fill=pale)=>`<g transform="translate(${x} ${y}) scale(${scale})">${path('M 0 50 L 65 0 Q 100 42 135 0 L 200 50 L 165 108 L 145 90 V 250 H 55 V 90 L 35 108 Z',ink,9,fill)}</g>`;
const label=value=>text(360,660,value,value.length>23?32:value.length>17?37:44);
const plans={
  老板:{kind:'owner',caption:'propietario de la tienda'},想:{kind:'want',caption:'querer / pensar'},买:{kind:'trade',buy:true,caption:'comprar'},卖:{kind:'trade',buy:false,caption:'vender'},
  哪里:{kind:'modesty',caption:'respuesta de modestia'},斤:{kind:'weight',caption:'1 斤 = 500 g'},
  块:{kind:'money',a:'1 元',b:'1 块',caption:'nombre coloquial'},元:{kind:'money',a:'1 元',b:'1 块',caption:'nombre formal'},
  角:{kind:'money',a:'1 元',b:'10 角',caption:'1 角 = 0,1 元'},毛:{kind:'money',a:'1 角',b:'1 毛',caption:'nombre coloquial'},
  分:{kind:'money',a:'1 元',b:'100 分',caption:'1 分 = 0,01 元'},人民币:{kind:'currency',caption:'moneda china'},
  问题:{kind:'question',caption:'pregunta / problema'},怎么:{kind:'question',caption:'¿cómo?'},
  便宜:{kind:'cheap',caption:'precio bajo'},打折:{kind:'discount',caption:'8 折: pagar el 80 %'},
  找:{kind:'change',caption:'dar el cambio'},找钱:{kind:'change',caption:'dar el cambio'},
  再:{kind:'again',caption:'de nuevo'},件:{kind:'classifier',caption:'una prenda'},员:{kind:'suffix',caption:'persona que realiza un trabajo'},
  当然:{kind:'yes',caption:'por supuesto'},没问题:{kind:'yes',caption:'no hay problema'},
  合适:{kind:'fit',caption:'queda bien'},不错:{kind:'good',caption:'bastante bien'},错:{kind:'wrong',caption:'incorrecto'},
  黑色:{kind:'color',color:'#22252a',caption:'negro'},黑:{kind:'color',color:'#22252a',caption:'negro'},
  绿色:{kind:'color',color:'#4e8b4e',caption:'verde'},绿:{kind:'color',color:'#4e8b4e',caption:'verde'},
  白色:{kind:'color',color:'#fffefa',caption:'blanco'},红色:{kind:'color',color:'#c44535',caption:'rojo'},
  些:{kind:'some',caption:'algunos / unas'},称呼:{kind:'address',caption:'cómo llamar a alguien'},
  大号:{kind:'size',large:true,caption:'talla grande'},小号:{kind:'size',large:false,caption:'talla pequeña'},
};
function draw(plan) {
  let art='';
  switch(plan.kind) {
    case 'color': art=circle(360,315,178,plan.color); break;
    case 'money': art=circle(360,190,105,'#ead6a1')+text(360,211,plan.a,63)+text(360,365,'=',78,accent)+rect(130,425,460,115)+text(360,504,plan.b,70); break;
    case 'currency': art=[['1 元',115,240],['5 元',245,170],['10 元',375,100]].map(([t,x,y])=>rect(x,y,220,300,'#ead6a1')+text(x+110,y+175,t,49)).join('')+text(360,550,'人民币',65); break;
    case 'weight': art=rect(145,350,430,190)+path('M 125 320 H 595 M 230 320 L 265 220 H 455 L 490 320')+rect(230,390,260,100,'#fffdf8')+text(360,461,'500 g',64)+path('M 330 220 V 150 H 390 V 220'); break;
    case 'change': art=text(360,195,'60 − 52 = 8',78)+text(180,300,'paga',38)+text(530,300,'precio',38)+arrow(155,380,565,380)+circle(360,500,78,'#ead6a1')+text(360,522,'8 元',49); break;
    case 'cheap': art=shirt(105,160,.8)+shirt(445,160,.8)+text(185,435,'¥10',63)+text(525,435,'¥100',63)+check(135,490,.9); break;
    case 'discount': art=rect(125,135,470,390,'#ead6a1')+text(360,265,'¥100',72)+path('M 225 220 L 495 275',accent,12)+text(360,440,'¥80',105)+text(360,575,'8 折',66); break;
    case 'classifier': art=shirt(245,155,1.15)+text(360,540,'一件衬衫',65); break;
    case 'suffix': art=person(360,290)+text(360,150,'售货 + 员',65)+text(360,590,'actividad → persona',37); break;
    case 'question': art=bubble(160,140,400,290)+text(360,345,'?',165,accent); break;
    case 'yes': art=bubble(145,125,430,310)+check(260,220,1.65); break;
    case 'good': art=circle(360,320,175)+path('M 280 290 h 1 M 440 290 h 1',ink,23)+path('M 270 365 Q 360 450 450 365',ink,14); break;
    case 'wrong': art=circle(360,315,175)+path('M 270 225 L 450 405 M 450 225 L 270 405',accent,25); break;
    case 'fit': art=rect(170,120,380,420,'none')+shirt(250,190,1.1)+check(490,510,.65); break;
    case 'some': art=[200,360,520].map((x,i)=>circle(x,300+i%2*40,60,'#d9b09a')+path(`M ${x} ${240+i%2*40} q 5 -35 30 -40`,ink,8)).join('')+text(360,530,'…',100,accent); break;
    case 'size': art=[.65,.95,1.25].map((scale,i)=>shirt(45+i*205,180,scale,i===(plan.large?2:0)?'#c5d9c8':pale)+text(110+i*235,555,['S','M','L'][i],60,i===(plan.large?2:0)?accent:ink)).join(''); break;
    case 'modesty': art=bubble(55,110,310,150)+text(210,207,'elogio',48)+bubble(365,330,310,160)+text(520,425,'qué va…',45)+person(180,350)+arrow(400,200,560,250); break;
    case 'address': art=person(150,320)+bubble(255,95,400,180)+text(455,205,'¿Cómo le llamo?',39)+rect(335,405,260,135)+text(465,495,'王老师',60); break;
    case 'want': art=person(230,330)+circle(330,275,13)+circle(375,230,22)+bubble(400,100,220,145)+text(510,195,'quiero…',42); break;
    case 'owner': art=rect(370,220,240,260)+path('M 350 220 L 490 115 L 630 220')+person(150,265)+arrow(240,370,340,370)+text(490,555,'tienda',42); break;
    case 'trade': art=person(130,245)+shirt(475,250,.9)+text(360,185,'¥',90,gold)+(plan.buy?arrow(210,230,500,230)+path('M 485 500 H 235 L 260 475 M 235 500 L 260 525',accent,15):path('M 500 230 H 210 L 235 205 M 210 230 L 235 255',accent,15)+arrow(235,500,485,500))+text(130,590,plan.buy?'cliente':'vendedor',38); break;
    case 'again': art=circle(360,335,125)+text(360,358,'1 → 2',63)+path('M 200 195 A 220 220 0 1 1 145 435 M 200 195 L 150 185 M 200 195 L 190 145',accent,18); break;
    default: throw new Error(`Unknown diagram ${plan.kind}`);
  }
  return art+label(plan.caption);
}
await mkdir('output/imagegen/lesson7',{recursive:true});
for (const requestWord of request.missingImages) {
  if (manifest.entries.some(row=>row.wordId===requestWord.id && row.kind==='photo')) continue;
  const word=lesson.vocabulary.find(row=>row.id===requestWord.id),plan=plans[word.hanzi];
  if (!plan) throw new Error(`Missing explicit visual plan: ${word.hanzi}`);
  const slug=`diagram-${createHash('sha256').update(word.id).digest('hex').slice(0,10)}`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720">${draw(plan)}</svg>`;
  const master=`output/imagegen/lesson7/${slug}.png`;
  await writeFile(`output/imagegen/lesson7/${slug}.svg`,svg);
  await sharp(Buffer.from(svg)).png().toFile(master);
  const entry={wordId:word.id,hanzi:word.hanzi,pinyin:word.pinyin,spanish:word.spanish,slug,kind:'diagram',master,status:'generated',model:'deterministic-svg',plan,prompt:`Diagrama editorial ${plan.kind}: ${plan.caption}. ${JSON.stringify(plan)}. Fondo transparente; estilo jade de Míng; sin elegibilidad para quiz por imagen.`};
  const index=manifest.entries.findIndex(row=>row.wordId===word.id);
  if(index>=0)manifest.entries[index]=entry;else manifest.entries.push(entry);
}
await writeFile('docs/lesson7-image-prompts.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Diagrams: ${manifest.entries.filter(row=>row.kind==='diagram').length}`);
