import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = async file => JSON.parse(await readFile(new URL(file, root), 'utf8'));
const lesson = await read('data/lesson6-public.json');
const historical = await read('data/corpus-v21-public.json');
const vocabulary = new Map([...historical.vocabulary, ...lesson.vocabulary].map(word => [word.hanzi, word]));
const normalize = text => text.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
const reading = text => text.normalize('NFC').toLowerCase().replace(/[\s.,!?，。！？'’]/g, '');
const recordings = [];
for (const [file, directory] of [['mandarin-audio', 'mandarin'], ['lesson4-audio','mandarin'], ['lesson5-audio','mandarin'], ['directions-reused-audio','hide-and-seek']]) {
  for (const clip of (await read(`data/${file}.json`)).clips) {
    const audioSrc = `/audio/${directory}/${clip.file}`;
    if (existsSync(new URL(`public${audioSrc}`, root))) recordings.push({...clip, audioSrc});
  }
}
const labels = ['北边','东边','南边','西边','前边','右边','后边','左边','图书馆','食堂','银行','大学','体育馆','宿舍楼','教学楼','校门','超市','饭馆','地图','北','林娜','大为'];
const conciseSpanish = { 北边:'norte', 东边:'este', 南边:'sur', 西边:'oeste', 前边:'delante', 后边:'detrás', 左边:'izquierda', 右边:'derecha', 体育馆:'gimnasio', 宿舍楼:'residencia', 教学楼:'edificio de aulas', 校门:'entrada del campus', 林娜:'Lin Na', 大为:'Dawei' };
const entries = {};
for (const hanzi of labels) {
  const word = vocabulary.get(hanzi);
  if (!word) throw new Error(`Falta vocabulario documentado: ${hanzi}`);
  entries[hanzi] = {hanzi,pinyin:word.pinyin,spanish:conciseSpanish[hanzi] ?? word.spanish};
}
const phrases = [
  ['好。','Hǎo.','Bien.'],
  ['等一下，你说什么？','Děng yíxià, nǐ shuō shénme?','Espera un momento, ¿qué has dicho?'],
  ['等一下！','Děng yíxià!','¡Espera un momento!'],
  ['我在这儿。','Wǒ zài zhèr.','Estoy aquí.'],
  ['谢谢你。','Xièxie nǐ.','Gracias.'],
  ['好，谢谢你。','Hǎo, xièxie nǐ.','Bien, gracias.'],
  ['谢谢你，再见！','Xièxie nǐ, zàijiàn!','¡Gracias, adiós!'],
  ['图书馆在哪儿？','Túshūguǎn zài nǎr?','¿Dónde está la biblioteca?'],
];
for (const place of ['图书馆','食堂','银行','大学','体育馆','宿舍楼']) {
  const word = entries[place];
  const article = ['食堂','银行','体育馆'].includes(place) ? 'el' : 'la';
  phrases.push([`你好，请问${place}在哪儿？`, `Nǐ hǎo, qǐngwèn ${word.pinyin} zài nǎr?`, `Hola, disculpa, ¿dónde está ${article} ${word.spanish}?`]);
}
for (const [hanzi,pinyin,spanish] of phrases) entries[hanzi]={hanzi,pinyin,spanish};
const clips=[];
for (const entry of Object.values(entries)) {
  const existing = recordings.find(clip=>normalize(clip.input)===normalize(entry.hanzi) && reading(clip.expectedPinyin)===reading(entry.pinyin));
  if (existing) { entry.audioSrc=existing.audioSrc; entry.audioOrigin='reused'; continue; }
  const id=`directions-${createHash('sha256').update(`${entry.hanzi}:${entry.pinyin}`).digest('hex').slice(0,16)}`;
  entry.audioSrc=`/audio/directions/${id}.mp3`; entry.audioOrigin='generated';
  clips.push({id,file:`${id}.mp3`,input:entry.hanzi,expectedPinyin:entry.pinyin,lessonId:6,
    instructions:`Pronuncia una sola vez. Lectura de referencia; no la leas como letras: ${entry.pinyin}. Respeta los tonos y las sílabas neutras. En los locativos 边 se pronuncia bian neutro. En 一下, yíxià. Voz amable y natural de una llamada, clara para principiantes.`});
}
const outputs=[
  ['data/directions-language.json',{version:1,origin:'ming_game_adaptation',entries}],
  ['data/directions-audio.json',{version:1,origin:'ming_game_adaptation',voiceDisclosure:'Voz generada por IA',clips}],
];
for (const [file,value] of outputs) {
  const content=JSON.stringify(value,null,2)+'\n';
  if(process.argv.includes('--check')) { if(await readFile(new URL(file,root),'utf8')!==content) throw new Error(`Proyección desactualizada: ${file}`); }
  else await writeFile(new URL(file,root),content);
}
console.log(`Direcciones: ${Object.keys(entries).length} textos; ${Object.keys(entries).length-clips.length} audios reutilizados; ${clips.length} clips del juego.`);
