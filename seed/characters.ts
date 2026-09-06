import curriculum from '@/data/lesson1-hanzi.json' with { type: 'json' };
import manifest from '@/public/hanzi-data/manifest.json' with { type: 'json' };
import type {
  CharacterEntry,
  CharacterWord,
  HanziSourceCode,
  HanziSourceRole,
  HanziUnitDefinition,
  HanziUnitId,
  LessonNumber,
  SourceRef,
} from '@/data/types';
import { normalizePinyin } from '@/lib/pinyin';

type CharacterMeta = readonly [pinyin: string, meaning: string];
type RawUnit = Omit<HanziUnitDefinition, 'characters'> & Record<HanziSourceRole, string>;

const metadata: Record<string, CharacterMeta> = {
  一:['yī','uno'],二:['èr','dos'],三:['sān','tres'],四:['sì','cuatro'],五:['wǔ','cinco'],六:['liù','seis'],七:['qī','siete'],八:['bā','ocho'],九:['jiǔ','nueve'],十:['shí','diez'],百:['bǎi','cien'],千:['qiān','mil'],
  你:['nǐ','tú'],我:['wǒ','yo'],他:['tā','él'],好:['hǎo','bueno; bien'],老:['lǎo','mayor; en 老师'],师:['shī','maestro; profesor'],早:['zǎo','temprano; mañana'],上:['shàng','arriba; en la mañana'],午:['wǔ','mediodía'],下:['xià','abajo; después'],晚:['wǎn','tarde; noche'],安:['ān','paz; tranquilo'],再:['zài','de nuevo'],见:['jiàn','ver'],
  叫:['jiào','llamarse'],什:['shén','qué; en 什么'],么:['me','sílaba neutra en 什么 / 怎么'],请:['qǐng','por favor; invitar'],问:['wèn','preguntar'],名:['míng','nombre'],字:['zì','carácter; palabra'],姓:['xìng','apellido'],认:['rèn','reconocer'],识:['shi','conocer; en 认识'],高:['gāo','alto'],兴:['xìng','ánimo; en 高兴'],也:['yě','también'],很:['hěn','muy'],您:['nín','usted'],
  在:['zài','estar; encontrarse'],吗:['ma','partícula interrogativa'],进:['jìn','entrar'],坐:['zuò','sentarse'],谢:['xiè','agradecer'],最:['zuì','más; el máximo'],近:['jìn','cerca; reciente'],怎:['zěn','cómo'],样:['yàng','forma; manera'],忙:['máng','ocupado'],呢:['ne','partícula interrogativa'],不:['bù','no; negación'],太:['tài','demasiado; muy'],困:['kùn','tener sueño'],渴:['kě','tener sed'],饿:['è','tener hambre'],累:['lèi','estar cansado'],
  陈:['chén','Chen; apellido'],们:['men','plural de pronombres'],这:['zhè','este; esta'],是:['shì','ser'],谁:['shéi','quién'],朋:['péng','amigo; en 朋友'],友:['yǒu','amigo'],刚:['gāng','recién'],到:['dào','llegar'],北:['běi','norte'],京:['jīng','capital'],贵:['guì','honorable; caro'],哪:['nǎ','cuál'],国:['guó','país'],人:['rén','persona'],学:['xué','estudiar'],习:['xí','practicar'],汉:['hàn','chino; Han'],语:['yǔ','lengua'],美:['měi','bello; Estados Unidos'],中:['zhōng','centro; China'],秘:['bì','en 秘鲁'],鲁:['lǔ','Lu; en 秘鲁'],
  英:['yīng','inglés; Inglaterra'],德:['dé','virtud; Alemania'],法:['fǎ','método; Francia'],日:['rì','día; Japón'],本:['běn','origen; clasificador'],西:['xī','oeste'],班:['bān','clase; grupo'],牙:['yá','diente'],加:['jiā','añadir; Canadá'],拿:['ná','tomar; Canadá'],大:['dà','grande'],墨:['mò','tinta; México'],哥:['gē','hermano mayor; México'],澳:['ào','Australia'],利:['lì','beneficio'],亚:['yà','Asia'],会:['huì','saber; poder'],说:['shuō','hablar; decir'],俄:['é','Rusia'],韩:['hán','Corea'],
  点:['diǎn','punto; un poco'],心:['xīn','corazón'],吃:['chī','comer'],爸:['bà','papá'],海:['hǎi','mar'],喜:['xǐ','gustar; alegría'],欢:['huan','gustar; en 喜欢'],米:['mǐ','arroz'],饭:['fàn','comida; arroz'],妈:['mā','mamá'],面:['miàn','harina; fideos'],条:['tiáo','tira; clasificador'],饺:['jiǎo','empanadilla'],子:['zi','sufijo nominal; hijo'],包:['bāo','envolver; bollo'],小:['xiǎo','pequeño'],看:['kàn','mirar; ver'],那:['nà','ese; esa'],都:['dōu','todos; ambos'],要:['yào','querer; pedir'],和:['hé','y; con'],王:['wáng','Wang; rey'],云:['yún','nube; Yun'],
  喝:['hē','beber'],水:['shuǐ','agua'],茶:['chá','té'],咖:['kā','café; sonido'],啡:['fēi','café; sonido'],可:['kě','poder; en 可乐'],乐:['lè','alegría; en 可乐'],牛:['niú','vaca'],奶:['nǎi','leche; abuela'],饮:['yǐn','beber; bebida'],料:['liào','material; bebida'],果:['guǒ','fruta'],汁:['zhī','jugo'],
  家:['jiā','familia; hogar'],有:['yǒu','tener; haber'],几:['jǐ','cuántos'],口:['kǒu','boca; clasificador familiar'],的:['de','partícula posesiva'],照:['zhào','foto; iluminar'],片:['piàn','lámina; parte'],做:['zuò','hacer'],工:['gōng','trabajo'],作:['zuò','hacer; trabajo'],医:['yī','medicina'],生:['shēng','nacer; estudiante'],弟:['dì','hermano menor'],共:['gòng','en total'],个:['gè','clasificador general'],两:['liǎng','dos antes de clasificador'],姐:['jiě','hermana mayor'],还:['hái','además; todavía'],妹:['mèi','hermana menor'],没:['méi','no tener'],狗:['gǒu','perro'],贝:['bèi','Beibei; concha'],张:['zhāng','clasificador de objetos planos'],
  爷:['yé','abuelo'],外:['wài','exterior; materno'],公:['gōng','abuelo; público'],婆:['pó','abuela'],姥:['lǎo','abuela materna'],猫:['māo','gato'],只:['zhī','clasificador de animales'],
  真:['zhēn','realmente'],漂:['piào','bonito; en 漂亮'],亮:['liàng','luminoso; bonito'],女:['nǚ','mujer; hija'],儿:['ér','hijo; sufijo'],今:['jīn','actual; hoy'],年:['nián','año'],岁:['suì','años de edad'],天:['tiān','día; cielo'],钢:['gāng','acero; en 钢琴'],琴:['qín','instrumento de cuerda; piano'],课:['kè','clase; lección'],孩:['hái','niño; hijo'],啊:['a','partícula modal'],陆:['lù','Lu; tierra firme'],雨:['yǔ','lluvia; Yu'],平:['píng','llano; Ping'],爱:['ài','amar; encantador'],男:['nán','hombre; masculino'],帅:['shuài','guapo'],餐:['cān','comida'],厅:['tīng','salón'],去:['qù','ir'],找:['zhǎo','buscar'],弹:['tán','tocar un instrumento'],
};

const rawUnits = curriculum.units as RawUnit[];
const roles: HanziSourceRole[] = ['core', 'teacherExtension', 'support'];
const uniqueCharacters = (value: string) => [...new Set([...value])];

export const hanziUnits: HanziUnitDefinition[] = rawUnits.map((unit) => ({
  id: unit.id,
  lesson: unit.lesson,
  text: unit.text,
  title: unit.title,
  shortTitle: unit.shortTitle,
  chinese: unit.chinese,
  description: unit.description,
  characters: [...new Set(roles.flatMap((role) => uniqueCharacters(unit[role])))],
}));
export const hanziUnitIds = hanziUnits.map((unit) => unit.id);
export function isHanziUnitId(value: string): value is HanziUnitId { return hanziUnitIds.includes(value as HanziUnitId); }

// Alias conservado para no romper enlaces internos; sus IDs son ahora 1.1–3.2.
export const hanziStages = hanziUnits;

function sourceFor(unitId: HanziUnitId, role: HanziSourceRole, hanzi: string): SourceRef {
  if (unitId === '1.1') {
    if (role === 'core') return { type:'textbook', file:'Libro Basico 1 - Lección 1 y 2 课本内容.pdf', pdfPage:45, printedPage:44, note:'Lección 1 · Texto 1' };
    if ('一二三四五六七八九十百千'.includes(hanzi)) return { type:'hanzi_worksheet', file:'Hanzi Leccion 1.2 - Ciclo 1 - Junio a Julio 2026 Instituto Confucio.pdf', pdfPage:'百千'.includes(hanzi)?2:1, note:'Soporte previo: números' };
    if (hanzi === '您') return { type:'class_presentation', file:'1.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 你最近怎么样.pdf', pdfPage:20, note:'Forma cortés enseñada en clase' };
    return { type:'hanzi_worksheet', file:'Hanzi Leccion 1.1 - Ciclo 1 - Junio a Julio 2026 Instituto Confucio.pdf', pdfPage:1, note:'Soporte previo: saludos' };
  }
  if (unitId === '1.2') return role === 'teacherExtension'
    ? { type:'class_presentation', file:'1.1 Presentación Curso Ciclo 1 - Junio a Julio 2026 你最近怎么样.pdf', pdfPage:21, note:'Estados personales enseñados por el profesor' }
    : { type:'textbook', file:'Libro Basico 1 - Lección 1 y 2 课本内容.pdf', pdfPage:47, printedPage:46, note:'Lección 1 · Texto 2' };
  if (unitId === '2.1') return role === 'teacherExtension'
    ? { type:'class_presentation', file:'2.1 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你是哪国人？.pdf', pdfPage:'会说俄韩'.includes(hanzi)?22:14, note:'Países e idiomas trabajados en clase' }
    : { type:'textbook', file:'Libro Basico 1 - Lección 1 y 2 课本内容.pdf', pdfPage:65, printedPage:64, note:'Lección 2 · Texto 1' };
  if (unitId === '2.2') return role === 'teacherExtension'
    ? { type:'class_presentation', file:'2.2 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你是哪国人啊？.pdf', pdfPage:'果汁'.includes(hanzi)?26:24, note:'Bebidas trabajadas en clase' }
    : { type:'textbook', file:'Libro Basico 1 - Lección 1 y 2 课本内容.pdf', pdfPage:68, printedPage:67, note:'Lección 2 · Texto 2' };
  if (unitId === '3.1') return role === 'teacherExtension'
    ? { type:'class_presentation', file:'3.1 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你家有几口人？.pdf.pdf', pdfPage:'猫只'.includes(hanzi)?24:12, note:'Familia y animales trabajados en clase' }
    : { type:'textbook', file:'Libro Basico 1 - Lección 3 - Nimen jia you jĩ kou rén.pdf', pdfPage:2, note:'Lección 3 · Texto 1' };
  return role === 'teacherExtension'
    ? (hanzi === '弹'
      ? { type:'textbook', file:'Libro Basico 1 - Lección 3 - Nimen jia you jĩ kou rén.pdf', pdfPage:24, note:'Actividad explícita: 弹钢琴' }
      : { type:'class_presentation', file:'3.1 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你家有几口人？.pdf.pdf', pdfPage:'去餐厅'.includes(hanzi)?43:42, note:'Extensión explícita de clase' })
    : { type:'textbook', file:'Libro Basico 1 - Lección 3 - Nimen jia you jĩ kou rén.pdf', pdfPage:5, note:'Lección 3 · Texto 2' };
}

const textbook = (pdfPage: number, printedPage: number): SourceRef => ({
  type:'textbook', file:'Libro Basico 1 - Lección 1 y 2 课本内容.pdf', pdfPage, printedPage,
});

const auditedMetadata: Record<string, { radical: string; components: string[]; source: SourceRef }> = {
  叫:{radical:'口',components:['口','丩'],source:textbook(60,59)},姓:{radical:'女',components:['女','生'],source:textbook(60,59)},么:{radical:'丿',components:['丿','厶'],source:textbook(60,59)},名:{radical:'口',components:['夕','口'],source:textbook(61,60)},最:{radical:'曰',components:['曰','耳','又'],source:textbook(61,60)},近:{radical:'辶',components:['斤','辶'],source:textbook(61,60)},认:{radical:'讠',components:['讠','人'],source:textbook(61,60)},识:{radical:'讠',components:['讠','只'],source:textbook(61,60)},样:{radical:'木',components:['木','羊'],source:textbook(61,60)},进:{radical:'辶',components:['井','辶'],source:textbook(61,60)},坐:{radical:'土',components:['人','人','土'],source:textbook(61,60)},你:{radical:'亻',components:['亻','尔'],source:textbook(58,57)},好:{radical:'女',components:['女','子'],source:textbook(46,45)},我:{radical:'戈',components:['手','戈'],source:textbook(46,45)},
};

const contexts: CharacterWord[] = [
  {hanzi:'你好',pinyin:'nǐ hǎo',translation:'hola',stage:'1.1',href:'/lesson/1/dialogues'},
  {hanzi:'老师',pinyin:'lǎoshī',translation:'profesor/a',stage:'1.1',href:'/lesson/1/vocabulary'},
  {hanzi:'早上好',pinyin:'zǎoshang hǎo',translation:'buenos días',stage:'1.1',href:'/lesson/1/dialogues'},
  {hanzi:'再见',pinyin:'zàijiàn',translation:'adiós',stage:'1.1',href:'/lesson/1/dialogues'},
  {hanzi:'什么',pinyin:'shénme',translation:'qué',stage:'1.1',href:'/lesson/1/vocabulary'},
  {hanzi:'请问',pinyin:'qǐngwèn',translation:'permítame preguntar',stage:'1.1',href:'/lesson/1/dialogues'},
  {hanzi:'认识',pinyin:'rènshi',translation:'conocer',stage:'1.1',href:'/lesson/1/vocabulary'},
  {hanzi:'高兴',pinyin:'gāoxìng',translation:'contento/a',stage:'1.1',href:'/lesson/1/dialogues'},
  {hanzi:'最近',pinyin:'zuìjìn',translation:'recientemente',stage:'1.2',href:'/lesson/1/vocabulary'},
  {hanzi:'怎么样',pinyin:'zěnmeyàng',translation:'cómo; qué tal',stage:'1.2',href:'/lesson/1/vocabulary'},
];

type Occurrence = { unit: RawUnit; role: HanziSourceRole };
const order = [...new Set(rawUnits.flatMap((unit) => roles.flatMap((role) => uniqueCharacters(unit[role]))))];

export const canonicalCharacters: CharacterEntry[] = order.map((hanzi, curricularOrder) => {
  const occurrences: Occurrence[] = rawUnits.flatMap((unit) => roles
    .filter((role) => uniqueCharacters(unit[role]).includes(hanzi))
    .map((role) => ({ unit, role })));
  const introduced = occurrences[0];
  const item = metadata[hanzi];
  const technical = manifest[hanzi as keyof typeof manifest];
  if (!item) throw new Error(`Falta metadata curricular para ${hanzi}.`);
  if (!technical?.available) throw new Error(`Faltan datos de trazos para ${hanzi}.`);
  const audited = auditedMetadata[hanzi];
  const sources = occurrences.map(({unit,role}) => sourceFor(unit.id,role,hanzi));
  if (audited) sources.push(audited.source);
  return {
    id:`c-${hanzi}`,
    lessonId:`lesson-${introduced.unit.lesson}`,
    hanzi,
    pinyin:normalizePinyin(item[0]),
    meaning:item[1],
    strokeCount:technical.strokeCount,
    radical:audited?.radical ?? '',
    components:audited?.components ?? [],
    recognitionRequired:true,
    writingRequired:true,
    source:sources[0],
    sources,
    sourceGroups:[...new Set(occurrences.map(({unit}) => unit.id))] as HanziSourceCode[],
    primaryStage:introduced.unit.id,
    introducedIn:introduced.unit.id,
    appearsIn:[...new Set(occurrences.map(({unit}) => unit.id))],
    sourceRole:introduced.role,
    curricularOrder,
    curricular:true,
    radicalAudited:Boolean(audited),
    componentsAudited:Boolean(audited),
    words:contexts.filter((context) => context.hanzi.includes(hanzi)),
  };
});

export const hanziSourceGroups: Record<HanziSourceCode, string[]> = Object.fromEntries(
  hanziUnits.map((unit) => [unit.id, unit.characters]),
) as Record<HanziSourceCode, string[]>;

export function charactersForUnits(unitIds: HanziUnitId[]) {
  const selected = new Set(unitIds);
  return canonicalCharacters.filter((character) => character.appearsIn.some((unit) => selected.has(unit)));
}

export function charactersIntroducedInLessons(lessons: LessonNumber[]) {
  const selected = new Set(lessons);
  return canonicalCharacters.filter((character) => selected.has(Number(character.introducedIn[0]) as LessonNumber));
}

export const lesson1Characters = charactersForUnits(['1.1','1.2']);
export const lesson2Characters = charactersForUnits(['2.1','2.2']);
export const lesson3Characters = charactersForUnits(['3.1','3.2']);

const legacy = (hanzi:string,pinyin:string,meaning:string): CharacterEntry => ({
  id:`c-${hanzi}`,lessonId:'lesson-1-supplementary',hanzi,pinyin:normalizePinyin(pinyin),meaning,
  strokeCount:manifest[hanzi as keyof typeof manifest]?.strokeCount ?? 0,radical:'',components:[],
  recognitionRequired:true,writingRequired:false,source:textbook(60,59),sources:[textbook(60,59)],sourceGroups:[],primaryStage:'1.1',
  introducedIn:'1.1',appearsIn:[],sourceRole:'support',curricularOrder:Number.MAX_SAFE_INTEGER,curricular:false,radicalAudited:false,componentsAudited:false,words:[],
});

export const legacyCharacters: CharacterEntry[] = [
  legacy('力','lì','fuerza'),legacy('言','yán','discurso'),legacy('木','mù','madera'),legacy('羊','yáng','oveja'),legacy('井','jǐng','pozo'),legacy('土','tǔ','tierra'),legacy('林','lín','bosque'),
];

// Mantiene IDs históricos `c-字`; el currículo visible usa canonicalCharacters.
export const characters: CharacterEntry[] = [...canonicalCharacters,...legacyCharacters];
