import type { CharacterEntry, CurriculumScope, Exercise, GrammarPoint, HanziStageId, LessonNumber, SentenceEntry, SourceRef, VocabularyEntry } from '@/data/types';
import { lesson1Characters, hanziStages as lesson1HanziStages } from '@/seed/characters';
import { exercises as lesson1Exercises } from '@/seed/exercises';
import { grammarPoints as lesson1Grammar } from '@/seed/grammar';
import { sentences as lesson1Sentences } from '@/seed/sentences';
import { vocabulary as lesson1Vocabulary } from '@/seed/vocabulary';

export const scopeDefinitions: Record<CurriculumScope, { label: string; shortLabel: string; lessonIds: LessonNumber[]; title: string; description: string }> = {
  l1: { label: 'Lección 1', shortLabel: 'L1', lessonIds: [1], title: '你最近怎么样？', description: 'Saludos, identidad y estados personales.' },
  l2: { label: 'Lección 2', shortLabel: 'L2', lessonIds: [2], title: '你是哪国人？', description: 'Nacionalidad, lenguas, presentaciones y comida.' },
  l3: { label: 'Lección 3', shortLabel: 'L3', lessonIds: [3], title: '你家有几口人？', description: 'Familia, profesiones, clasificadores y edad.' },
  'l1-l2': { label: 'Lecciones 1 + 2', shortLabel: 'L1 + L2', lessonIds: [1, 2], title: 'Repaso acumulativo L1 + L2', description: 'Integra identidad, estados, nacionalidad, lenguas y comida.' },
  'l1-l2-l3': { label: 'Lecciones 1 + 2 + 3', shortLabel: 'L1 + L2 + L3', lessonIds: [1, 2, 3], title: 'Repaso acumulativo L1 + L2 + L3', description: 'Todo el corpus auditado del curso hasta la Lección 3.' },
};

export const curriculumScopes = Object.keys(scopeDefinitions) as CurriculumScope[];
export function isCurriculumScope(value: string): value is CurriculumScope { return curriculumScopes.includes(value as CurriculumScope); }

const presentation = (lesson: 2 | 3, pdfPage: number): SourceRef => ({
  type: 'class_presentation',
  file: lesson === 2
    ? '2.1 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你是哪国人？.pdf'
    : '3.1 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你家有几口人？.pdf.pdf',
  pdfPage,
});

const presentation22 = (pdfPage: number): SourceRef => ({
  type: 'class_presentation', file: '2.2 Presentación Curso Ciclo 2 - Agosto a Setiembre 2026 你是哪国人啊？.pdf', pdfPage,
});

const textbook3 = (pdfPage: number, printedPage?: number): SourceRef => ({
  type: 'textbook', file: 'Libro Basico 1 - Lección 3 - Nimen jia you jĩ kou rén.pdf', pdfPage, printedPage,
});

type VocabTuple = readonly [hanzi: string, pinyin: string, translation: string, grammaticalType: string, source: SourceRef, category?: VocabularyEntry['category'], example?: string];
const vocab = (lesson: 2 | 3, rows: readonly VocabTuple[]): VocabularyEntry[] => rows.map(([hanzi, pinyin, translation, grammaticalType, source, category = 'core', example]) => ({
  id: `v-${hanzi}`, hanzi, pinyin: pinyin.normalize('NFC'), translation, grammaticalType, source, category, isCore: category === 'core', example,
}));

export const lesson2Vocabulary = vocab(2, [
  ['老师','lǎoshī','profesor/a','sustantivo',presentation(2,8),'core','陈老师好！'],
  ['你们','nǐmen','ustedes; vosotros/as','pronombre',presentation(2,8)],
  ['早上','zǎoshang','por la mañana','sustantivo temporal',presentation(2,8)],
  ['这','zhè','este; esta; esto','pronombre demostrativo',presentation(2,8)],
  ['是','shì','ser','verbo',presentation(2,8),'core','这是我朋友。'],
  ['朋友','péngyou','amigo/a','sustantivo',presentation(2,8)],
  ['刚','gāng','acabar de; recién','adverbio',presentation(2,8)],
  ['到','dào','llegar','verbo',presentation(2,8)],
  ['贵姓','guìxìng','¿cuál es su apellido?','expresión cortés',presentation(2,10)],
  ['哪','nǎ','cuál; qué','pronombre interrogativo',presentation(2,10)],
  ['国','guó','país','sustantivo',presentation(2,10)],
  ['人','rén','persona; habitante','sustantivo',presentation(2,10)],
  ['学习','xuéxí','estudiar; aprender','verbo',presentation(2,10)],
  ['汉语','Hànyǔ','lengua china; mandarín','sustantivo',presentation(2,10)],
  ['再见','zàijiàn','adiós; hasta luego','expresión',presentation(2,10)],
  ['美国','Měiguó','Estados Unidos','nombre propio',presentation(2,12)],
  ['北京','Běijīng','Pekín','nombre propio',presentation(2,12)],
  ['陈','Chén','Chen (apellido)','nombre propio',presentation(2,12),'name'],
  ['中国','Zhōngguó','China','nombre propio',presentation(2,14)],
  ['秘鲁','Bìlǔ','Perú','nombre propio',presentation(2,14)],
  ['英国','Yīngguó','Reino Unido','nombre propio',presentation(2,14)],
  ['德国','Déguó','Alemania','nombre propio',presentation(2,14)],
  ['法国','Fǎguó','Francia','nombre propio',presentation(2,14)],
  ['日本','Rìběn','Japón','nombre propio',presentation(2,14)],
  ['西班牙','Xībānyá','España','nombre propio',presentation(2,14)],
  ['加拿大','Jiānádà','Canadá','nombre propio',presentation(2,16),'supplementary'],
  ['墨西哥','Mòxīgē','México','nombre propio',presentation(2,16),'supplementary'],
  ['澳大利亚','Àodàlìyà','Australia','nombre propio',presentation(2,16),'supplementary'],
  ['会','huì','saber; poder (habilidad)','verbo modal',presentation(2,22)],
  ['说','shuō','hablar; decir','verbo',presentation(2,22)],
  ['英语','Yīngyǔ','inglés','sustantivo',presentation(2,22)],
  ['法语','Fǎyǔ','francés','sustantivo',presentation(2,22)],
  ['德语','Déyǔ','alemán','sustantivo',presentation(2,22)],
  ['俄语','Éyǔ','ruso','sustantivo',presentation(2,22)],
  ['日语','Rìyǔ','japonés','sustantivo',presentation(2,22)],
  ['西班牙语','Xībānyáyǔ','español','sustantivo',presentation(2,22)],
  ['韩语','Hányǔ','coreano','sustantivo',presentation(2,22)],
  ['看','kàn','mirar; ver','verbo',presentation22(7)],
  ['那','nà','ese; esa; aquello','pronombre demostrativo',presentation22(7)],
  ['都','dōu','todos; ambos','adverbio',presentation22(7)],
  ['要','yào','querer; pedir','verbo modal',presentation22(7)],
  ['上海','Shànghǎi','Shanghái','nombre propio',presentation22(7)],
  ['王小云','Wáng Xiǎoyún','Wang Xiaoyun','nombre propio',presentation22(7),'name'],
  ['饺子','jiǎozi','empanadilla china hervida','sustantivo',presentation22(9)],
  ['包子','bāozi','bollo chino relleno al vapor','sustantivo',presentation22(9)],
  ['大','dà','grande','adjetivo',presentation22(9)],
  ['小','xiǎo','pequeño/a','adjetivo',presentation22(9)],
  ['和','hé','y; con','conjunción',presentation22(9)],
  ['米饭','mǐfàn','arroz cocido','sustantivo',presentation22(9)],
  ['面条','miàntiáo','fideos','sustantivo',presentation22(9)],
  ['喜欢','xǐhuan','gustar','verbo',presentation22(9)],
  ['吃','chī','comer','verbo',presentation22(9)],
  ['点心','diǎnxin','dim sum; bocadillo','sustantivo',presentation22(9)],
  ['好吃','hǎochī','sabroso/a','adjetivo',presentation22(9)],
  ['喝','hē','beber','verbo',presentation22(24)],
  ['咖啡','kāfēi','café','sustantivo',presentation22(24)],
  ['茶','chá','té','sustantivo',presentation22(24)],
  ['水','shuǐ','agua','sustantivo',presentation22(24)],
  ['可乐','kělè','refresco de cola','sustantivo',presentation22(24)],
  ['牛奶','niúnǎi','leche','sustantivo',presentation22(24)],
  ['饮料','yǐnliào','bebida','sustantivo',presentation22(24)],
  ['面包','miànbāo','pan','sustantivo',presentation22(26)],
  ['果汁','guǒzhī','jugo de fruta','sustantivo',presentation22(26)],
]);

export const lesson3Vocabulary = vocab(3, [
  ['家','jiā','familia; hogar','sustantivo',presentation(3,7)], ['有','yǒu','tener; haber','verbo',presentation(3,7)],
  ['几','jǐ','cuántos/as','pronombre interrogativo',presentation(3,7)], ['口','kǒu','clasificador para miembros de familia','clasificador',presentation(3,7)],
  ['的','de','partícula posesiva/atributiva','partícula estructural',presentation(3,7)], ['照片','zhàopiàn','fotografía','sustantivo',presentation(3,7)],
  ['做','zuò','hacer; dedicarse a','verbo',presentation(3,7)], ['工作','gōngzuò','trabajo; trabajar','sustantivo / verbo',presentation(3,7)],
  ['医生','yīshēng','médico/a','sustantivo',presentation(3,7)], ['弟弟','dìdi','hermano menor','sustantivo',presentation(3,7)],
  ['哥哥','gēge','hermano mayor','sustantivo',presentation(3,7)], ['一共','yígòng','en total','adverbio',presentation(3,7)],
  ['个','gè','clasificador general','clasificador',presentation(3,7)], ['两','liǎng','dos (antes de clasificador)','numeral',presentation(3,7)],
  ['姐姐','jiějie','hermana mayor','sustantivo',presentation(3,7)], ['还','hái','además; también','adverbio',presentation(3,7)],
  ['谁','shéi','quién','pronombre interrogativo',presentation(3,7)], ['妹妹','mèimei','hermana menor','sustantivo',presentation(3,7)],
  ['没有','méiyǒu','no tener; no haber','verbo negativo',presentation(3,7)], ['没','méi','no (con 有)','adverbio negativo',presentation(3,7)],
  ['狗','gǒu','perro','sustantivo',presentation(3,7)], ['贝贝','Bèibei','Beibei (nombre del perro)','nombre propio',presentation(3,7),'name'],
  ['爸爸','bàba','papá; padre','sustantivo',presentation(3,12)], ['妈妈','māma','mamá; madre','sustantivo',presentation(3,12)],
  ['爷爷','yéye','abuelo paterno','sustantivo',presentation(3,12)], ['奶奶','nǎinai','abuela paterna','sustantivo',presentation(3,12)],
  ['外公','wàigōng','abuelo materno','sustantivo',presentation(3,12)], ['外婆','wàipó','abuela materna','sustantivo',presentation(3,12)],
  ['姥姥','lǎolao','abuela materna (uso norteño)','sustantivo',presentation(3,13),'teacher_supplement'], ['姥爷','lǎoye','abuelo materno (uso norteño)','sustantivo',presentation(3,13),'teacher_supplement'],
  ['真','zhēn','realmente','adverbio',textbook3(4)], ['漂亮','piàoliang','bonito/a','adjetivo',textbook3(4)],
  ['张','zhāng','clasificador para objetos planos','clasificador',textbook3(4)], ['女儿','nǚʼér','hija','sustantivo',textbook3(4)],
  ['今年','jīnnián','este año','sustantivo temporal',textbook3(4)], ['年','nián','año','sustantivo',textbook3(4)],
  ['岁','suì','años de edad','clasificador de edad',textbook3(4)], ['今天','jīntiān','hoy','sustantivo temporal',textbook3(4)],
  ['天','tiān','día; cielo','sustantivo',textbook3(4)], ['钢琴','gāngqín','piano','sustantivo',textbook3(4)],
  ['课','kè','clase; lección','sustantivo',textbook3(4)], ['孩子','háizi','niño/a; hijo/a','sustantivo',textbook3(4)],
  ['啊','a','partícula modal','partícula',textbook3(4)], ['晚上','wǎnshang','por la noche','sustantivo temporal',textbook3(4)],
  ['陆雨平','Lù Yǔpíng','Lu Yuping','nombre propio',textbook3(4),'name'],
]);

const sentence = (lesson: 2 | 3, id: string, hanzi: string, pinyin: string, translation: string, grammarTags: string[], source: SourceRef, difficulty: SentenceEntry['difficulty'] = 2): SentenceEntry => ({
  id: `s-l${lesson}-${id}`, hanzi, pinyin: pinyin.normalize('NFC'), translation, tokens: hanzi.replace(/[，。？！]/g, ' ').trim().split(/\s+/), grammarTags, difficulty, source,
});

export const lesson2Sentences: SentenceEntry[] = [
  sentence(2,'morning','陈老师，早上好！','Chén lǎoshī, zǎoshang hǎo!','¡Profesor Chen, buenos días!',['saludo'],presentation(2,8),1),
  sentence(2,'introduce','这是我朋友，他刚到北京。','Zhè shì wǒ péngyou, tā gāng dào Běijīng.','Este es mi amigo; acaba de llegar a Pekín.',['是','刚'],presentation(2,8),3),
  sentence(2,'surname','请问，您贵姓？','Qǐngwèn, nín guìxìng?','Disculpe, ¿cuál es su apellido?',['interrogativa','cortesía'],presentation(2,10),2),
  sentence(2,'nationality','你是哪国人？','Nǐ shì nǎ guó rén?','¿De qué país eres?',['是','哪'],presentation(2,10),2),
  sentence(2,'american','我是美国人。','Wǒ shì Měiguó rén.','Soy estadounidense.',['是'],presentation(2,10),1),
  sentence(2,'study','我在北京学习汉语。','Wǒ zài Běijīng xuéxí Hànyǔ.','Estudio chino en Pekín.',['在','orden'],presentation(2,10),3),
  sentence(2,'languages','我会说汉语和西班牙语。','Wǒ huì shuō Hànyǔ hé Xībānyáyǔ.','Sé hablar chino y español.',['会','和'],presentation(2,22),3),
  sentence(2,'parents','我爸爸妈妈都是上海人。','Wǒ bàba māma dōu shì Shànghǎi rén.','Mi padre y mi madre son ambos de Shanghái.',['都','是'],presentation22(9),3),
  sentence(2,'likes','我喜欢吃米饭和面条。','Wǒ xǐhuan chī mǐfàn hé miàntiáo.','Me gusta comer arroz y fideos.',['喜欢','和'],presentation22(9),2),
  sentence(2,'which','那是什么？','Nà shì shénme?','¿Qué es eso?',['什么','是'],presentation22(9),1),
  sentence(2,'baozi','这是包子，那是饺子。','Zhè shì bāozi, nà shì jiǎozi.','Esto es baozi y aquello es jiaozi.',['这','那','是'],presentation22(9),2),
  sentence(2,'want-both','包子和饺子我都要。','Bāozi hé jiǎozi wǒ dōu yào.','Quiero tanto baozi como jiaozi.',['都','要','和'],presentation22(9),3),
  sentence(2,'drink','你喝茶还是咖啡？','Nǐ hē chá háishi kāfēi?','¿Bebes té o café?',['elección'],presentation22(24),3),
];

export const lesson3Sentences: SentenceEntry[] = [
  sentence(3,'how-many','你家有几口人？','Nǐ jiā yǒu jǐ kǒu rén?','¿Cuántas personas hay en tu familia?',['有','几','口'],presentation(3,7),2),
  sentence(3,'four','我家有四口人。','Wǒ jiā yǒu sì kǒu rén.','En mi familia somos cuatro.',['有','口'],presentation(3,7),1),
  sentence(3,'photo','这是我家的照片。','Zhè shì wǒ jiā de zhàopiàn.','Esta es una foto de mi familia.',['的','是'],presentation(3,7),2),
  sentence(3,'work-father','你爸爸做什么工作？','Nǐ bàba zuò shénme gōngzuò?','¿En qué trabaja tu padre?',['什么','做'],presentation(3,7),2),
  sentence(3,'doctor','我爸爸是医生。','Wǒ bàba shì yīshēng.','Mi padre es médico.',['是'],presentation(3,7),1),
  sentence(3,'not-younger','他不是我弟弟，是我哥哥。','Tā bú shì wǒ dìdi, shì wǒ gēge.','No es mi hermano menor, sino mi hermano mayor.',['不是','的-omitido'],presentation(3,7),3),
  sentence(3,'six','我家一共有六个人。','Wǒ jiā yígòng yǒu liù ge rén.','En mi familia hay seis personas en total.',['一共','个'],presentation(3,7),2),
  sentence(3,'two-sisters','我有两个姐姐。','Wǒ yǒu liǎng ge jiějie.','Tengo dos hermanas mayores.',['两','个','有'],presentation(3,7),2),
  sentence(3,'who-else','你家还有谁？','Nǐ jiā hái yǒu shéi?','¿Quién más hay en tu familia?',['还','谁','有'],presentation(3,7),2),
  sentence(3,'no-sister','我没有妹妹。','Wǒ méiyǒu mèimei.','No tengo hermana menor.',['没有'],presentation(3,7),1),
  sentence(3,'dog','贝贝是我们家的狗。','Bèibei shì wǒmen jiā de gǒu.','Beibei es el perro de nuestra familia.',['是','的'],presentation(3,7),3),
  sentence(3,'pretty','这张照片真漂亮。','Zhè zhāng zhàopiàn zhēn piàoliang.','Esta foto es realmente bonita.',['张','真'],textbook3(4),2),
  sentence(3,'daughter-age','你女儿今年几岁？','Nǐ nǚʼér jīnnián jǐ suì?','¿Cuántos años tiene tu hija este año?',['几','岁'],textbook3(4),2),
  sentence(3,'piano','她今天晚上有钢琴课。','Tā jīntiān wǎnshang yǒu gāngqín kè.','Esta noche ella tiene clase de piano.',['tiempo','有'],textbook3(4),3),
];

const grammar = (lesson: 2 | 3, slug: string, title: string, pattern: string, explanation: string, examples: string[], source: SourceRef): GrammarPoint => ({
  id: `g-l${lesson}-${slug}`, slug: `l${lesson}-${slug}`, title, pattern, explanation, examples, source,
});

export const lesson2Grammar: GrammarPoint[] = [
  grammar(2,'shi','是 / 不是 · Identificar','A + 是 / 不是 + B','是 relaciona una entidad con su identidad o categoría; 不 va delante de 是 para negar.',['我是秘鲁人。','他不是老师。'],presentation(2,28)),
  grammar(2,'interrogatives','什么、谁、哪 · Preguntas abiertas','Sujeto + verbo + palabra interrogativa','La palabra interrogativa ocupa el lugar de la información desconocida; no se añade 吗.',['你是哪国人？','那是什么？'],presentation(2,30)),
  grammar(2,'ye-dou','也 / 都 · Inclusión','Sujeto + 也 / 都 + predicado','也 añade un caso; 都 reúne dos o más referentes y va antes del predicado.',['我也学习汉语。','我爸爸妈妈都是上海人。'],presentation22(18)),
  grammar(2,'he','和 · Coordinación','A + 和 + B','和 une nombres o grupos nominales; no sustituye todos los usos discursivos de “y”.',['米饭和面条','汉语和西班牙语'],presentation22(20)),
  grammar(2,'xihuan','喜欢 · Preferencias','Sujeto + 喜欢 + verbo / nombre','喜欢 puede ir delante de una actividad o de un alimento.',['我喜欢吃饺子。','我喜欢咖啡。'],presentation22(22)),
  grammar(2,'yao','要 / 不要 · Pedir','Sujeto + 要 / 不要 + objeto','要 expresa elección o deseo en pedidos sencillos.',['我要茶。','我不要咖啡。'],presentation22(24)),
  grammar(2,'hui','会 · Habilidad aprendida','Sujeto + 会 + verbo','会 señala una capacidad aprendida, como hablar una lengua.',['我会说汉语。','他不会说法语。'],presentation(2,22)),
  grammar(2,'gang','刚 · Acción reciente','Sujeto + 刚 + verbo','刚 se coloca inmediatamente antes del verbo para indicar que algo acaba de ocurrir.',['他刚到北京。'],presentation(2,8)),
];

export const lesson3Grammar: GrammarPoint[] = [
  grammar(3,'you','有 / 没有 · Posesión y existencia','Sujeto / lugar + 有 + objeto','没有 es la negación fija de 有. La forma 不有 no se usa en este patrón.',['我家有四口人。','我没有妹妹。'],presentation(3,20)),
  grammar(3,'de','的 · Posesión','Poseedor + 的 + sustantivo','的 marca posesión. Con familiares cercanos, hogar o trabajo puede omitirse cuando la relación es clara.',['我家的照片','我爸爸'],presentation(3,22)),
  grammar(3,'classifiers','口、个、张 · Clasificadores','Número / demostrativo + clasificador + nombre','口 cuenta miembros de familia, 个 es general y 张 se usa con objetos planos como fotografías.',['四口人','两个人','这张照片'],presentation(3,24)),
  grammar(3,'liang','两 · Dos antes de clasificador','两 + clasificador + nombre','Antes de un clasificador se usa normalmente 两, no 二.',['两个姐姐','两口人'],presentation(3,26)),
  grammar(3,'question-words','谁 / 几 · Información desconocida','谁 / 几 ocupa la posición de la respuesta','谁 pregunta por identidad y 几 por una cantidad pequeña o edad.',['你家还有谁？','你女儿几岁？'],presentation(3,28)),
  grammar(3,'hai','还 · Además','Sujeto + 还 + verbo / predicado','还 introduce otra persona, cosa o acción y aparece antes del verbo.',['我还有两个姐姐。','你家还有谁？'],presentation(3,30)),
  grammar(3,'age','今年…岁 · Edad','Sujeto + 今年 + número + 岁','La edad se expresa sin 是 entre el sujeto y el número.',['她今年八岁。'],textbook3(8)),
];

type CharacterMeta = readonly [hanzi: string, pinyin: string, meaning: string, strokeCount: number];
const l2CharacterMeta: CharacterMeta[] = [
  ['早','zǎo','temprano',6],['上','shàng','arriba; mañana',3],['刚','gāng','recién',6],['到','dào','llegar',8],['朋','péng','amigo (en 朋友)',8],['友','yǒu','amigo',4],['老','lǎo','profesor (en 老师)',6],['师','shī','maestro',6],['学','xué','estudiar',8],['生','shēng','persona; nacer',5],['这','zhè','este',7],['是','shì','ser',9],['那','nà','ese',6],['您','nín','usted',11],['贵','guì','honorable',9],['姓','xìng','apellido',8],['哪','nǎ','cuál',9],['国','guó','país',8],['人','rén','persona',2],['习','xí','practicar',3],['汉','hàn','chino; Han',5],['语','yǔ','lengua',9],['再','zài','de nuevo',6],['见','jiàn','ver',4],['北','běi','norte',5],['京','jīng','capital',8],['中','zhōng','centro; China',4],['秘','bì','secreto; en 秘鲁',10],['鲁','lǔ','Lu; en 秘鲁',12],['美','měi','bello; Estados Unidos',9],
  ['看','kàn','mirar',9],['都','dōu','todos',10],['要','yào','querer',9],['大','dà','grande',3],['小','xiǎo','pequeño',3],['和','hé','y; con',8],['喜','xǐ','gustar; alegría',12],['欢','huan','gustar (en 喜欢)',6],['吃','chī','comer',6],['包','bāo','envolver; bollo',5],['子','zi','sufijo nominal',3],['饺','jiǎo','empanadilla',9],['米','mǐ','arroz',6],['饭','fàn','comida; arroz',7],['面','miàn','harina; fideos',9],['条','tiáo','tira; clasificador',7],['点','diǎn','punto; un poco',9],['心','xīn','corazón',4],['好','hǎo','bueno',6],['喝','hē','beber',12],['水','shuǐ','agua',4],['茶','chá','té',9],['咖','kā','café (sonido)',8],['啡','fēi','café (sonido)',11],['可','kě','poder; cola',5],['乐','lè','alegría; cola',5],['果','guǒ','fruta',8],['汁','zhī','jugo',5],['爸','bà','papá',8],['妈','mā','mamá',6],
];
const l3CharacterMeta: CharacterMeta[] = [
  ['家','jiā','familia; hogar',10],['有','yǒu','tener',6],['几','jǐ','cuántos',2],['口','kǒu','boca; clasificador familiar',3],['的','de','partícula posesiva',8],['照','zhào','foto; iluminar',13],['片','piàn','lámina; parte',4],['做','zuò','hacer',11],['工','gōng','trabajo',3],['作','zuò','hacer; trabajo',7],['医','yī','medicina',7],['生','shēng','persona; nacer',5],['一','yī','uno',1],['共','gòng','en total',6],['个','gè','clasificador general',3],['两','liǎng','dos',7],['姐','jiě','hermana mayor',8],['还','hái','además',7],['谁','shéi','quién',10],['没','méi','no tener',7],['狗','gǒu','perro',8],['爸','bà','papá',8],['妈','mā','mamá',6],['哥','gē','hermano mayor',10],['弟','dì','hermano menor',7],['妹','mèi','hermana menor',8],['张','zhāng','clasificador de objetos planos',7],
];

const makeStages = (lesson: 2 | 3, rows: CharacterMeta[]) => Array.from({ length: 6 }, (_, index) => {
  const start = Math.floor(rows.length * index / 6); const end = Math.floor(rows.length * (index + 1) / 6);
  return { id: (index + 1) as HanziStageId, title: `Etapa ${index + 1}`, shortTitle: ['Base','Identidad','Lengua','Comida','Acciones','Integración'][index], chinese: ['基','人','语','食','动','合'][index], description: `Bloque progresivo ${index + 1} de la Lección ${lesson}.`, characters: rows.slice(start, end).map(([hanzi]) => hanzi) };
});

export const lesson2HanziStages = makeStages(2, l2CharacterMeta);
export const lesson3HanziStages = makeStages(3, l3CharacterMeta);
const characterSource = (lesson: 2 | 3, page: number): SourceRef => ({ type: 'hanzi_worksheet', file: lesson === 2 ? (page <= 2 ? 'Hanzi Leccion 2.1 - Ciclo 2 - Agosto a Setiembre 2026 Instituto Confucio.pdf' : 'Hanzi Leccion 2.2 - Ciclo 2 - Agosto a Setiembre 2026 Instituto Confucio.pdf') : 'Hanzi Leccion 3.1 - Ciclo 2 - Agosto a Setiembre 2026 Instituto Confucio.pdf', pdfPage: lesson === 2 && page > 2 ? page - 2 : page });
const makeCharacters = (lesson: 2 | 3, rows: CharacterMeta[], stages: ReturnType<typeof makeStages>): CharacterEntry[] => rows.map(([hanzi,pinyin,meaning,strokeCount], index) => ({
  id: `c-${hanzi}`, lessonId: `lesson-${lesson}`, hanzi, pinyin, meaning, strokeCount, radical: '', components: [], recognitionRequired: true, writingRequired: true,
  source: characterSource(lesson, lesson === 2 ? (index < 30 ? (index < 15 ? 1 : 2) : (index < 45 ? 3 : 4)) : Math.min(3, Math.floor(index / 10) + 1)),
  sources: [characterSource(lesson, lesson === 2 ? (index < 30 ? (index < 15 ? 1 : 2) : (index < 45 ? 3 : 4)) : Math.min(3, Math.floor(index / 10) + 1))],
  sourceGroups: [], primaryStage: stages.find((stage) => stage.characters.includes(hanzi))?.id, curricular: true, radicalAudited: false, componentsAudited: false,
  words: [...lesson2Vocabulary, ...lesson3Vocabulary].filter((word) => word.hanzi.includes(hanzi)).slice(0, 6).map((word) => ({ hanzi: word.hanzi, pinyin: word.pinyin, translation: word.translation, stage: stages.find((stage) => stage.characters.includes(hanzi))?.id ?? 1 })),
}));

export const lesson2Characters = makeCharacters(2, l2CharacterMeta, lesson2HanziStages);
export const lesson3Characters = makeCharacters(3, l3CharacterMeta, lesson3HanziStages);

function makeLessonExercises(lesson: 2 | 3, words: VocabularyEntry[], chars: CharacterEntry[], sentences: SentenceEntry[], grammarPoints: GrammarPoint[]): Exercise[] {
  const meanings = words.filter((word) => word.category !== 'name').map((word, index): Exercise => ({
    id: `l${lesson}-meaning-${word.id}`, type: 'choice', prompt: `¿Qué significa ${word.hanzi}?`, answer: word.translation.split(';')[0],
    options: [word.translation.split(';')[0], ...[1,7,13].map((offset) => words[(index + offset) % words.length].translation.split(';')[0])],
    explanation: `${word.hanzi} se lee ${word.pinyin} y significa “${word.translation}”.`, rule: 'Recupera el significado antes de mirar el pinyin.', itemId: word.id, dimension: 'meaning', difficulty: 1, source: word.source,
  }));
  const pinyin = words.filter((word) => word.category !== 'name').map((word): Exercise => ({
    id: `l${lesson}-pinyin-${word.id}`, type: 'pinyin', prompt: `Escribe el pinyin con tono de ${word.hanzi}.`, answer: word.pinyin,
    explanation: `${word.hanzi} se escribe ${word.pinyin}.`, rule: 'Conserva las marcas tonales.', itemId: word.id, dimension: 'pinyin', difficulty: 3, source: word.source,
  }));
  const hanzi = chars.map((character): Exercise => ({ id: `l${lesson}-hanzi-${character.id}`, type: 'hanzi', prompt: `¿Cuántos trazos tiene ${character.hanzi}?`, answer: String(character.strokeCount), options: Array.from(new Set([character.strokeCount, character.strokeCount + 1, Math.max(1, character.strokeCount - 1), character.strokeCount + 2])).map(String), explanation: `${character.hanzi} tiene ${character.strokeCount} trazos.`, rule: 'Cuenta cada trazo continuo una vez.', itemId: character.id, dimension: 'hanzi', difficulty: 2, source: character.source }));
  const production = sentences.slice(0, 10).map((item, index): Exercise => ({ id: `l${lesson}-sentence-${index + 1}`, type: index % 2 ? 'dialogue' : 'order', prompt: index % 2 ? item.translation : `Escribe en chino: ${item.translation}`, answer: item.hanzi.replace(/[。？！]/g,''), explanation: `${item.hanzi} · ${item.pinyin}`, rule: item.grammarTags.join(' · '), itemId: item.id, dimension: index % 2 ? 'production' : 'grammar', difficulty: item.difficulty, source: item.source }));
  const rules = grammarPoints.map((point, index): Exercise => ({ id: `l${lesson}-grammar-${index + 1}`, type: 'pinyin', prompt: `Completa un ejemplo del patrón: ${point.pattern}`, answer: point.examples[0].replace(/[。？！]/g,''), explanation: point.explanation, rule: point.pattern, itemId: point.id, dimension: 'grammar', difficulty: 3, source: point.source }));
  return [...meanings, ...pinyin, ...production, ...rules, ...hanzi];
}

export const lesson2Exercises = makeLessonExercises(2, lesson2Vocabulary, lesson2Characters, lesson2Sentences, lesson2Grammar);
export const lesson3Exercises = makeLessonExercises(3, lesson3Vocabulary, lesson3Characters, lesson3Sentences, lesson3Grammar);

const lessonData = {
  1: { vocabulary: lesson1Vocabulary, sentences: lesson1Sentences, grammar: lesson1Grammar, characters: lesson1Characters, stages: lesson1HanziStages, exercises: lesson1Exercises },
  2: { vocabulary: lesson2Vocabulary, sentences: lesson2Sentences, grammar: lesson2Grammar, characters: lesson2Characters, stages: lesson2HanziStages, exercises: lesson2Exercises },
  3: { vocabulary: lesson3Vocabulary, sentences: lesson3Sentences, grammar: lesson3Grammar, characters: lesson3Characters, stages: lesson3HanziStages, exercises: lesson3Exercises },
};

const uniqueBy = <T,>(items: T[], key: (item: T) => string) => [...new Map(items.map((item) => [key(item), item])).values()];
export function getCurriculum(scope: CurriculumScope) {
  const definition = scopeDefinitions[scope];
  const selected = definition.lessonIds.map((lessonId) => lessonData[lessonId]);
  const vocabulary = uniqueBy(selected.flatMap((item) => item.vocabulary), (item) => item.id);
  const sentences = uniqueBy(selected.flatMap((item) => item.sentences), (item) => item.id);
  const grammar = uniqueBy(selected.flatMap((item) => item.grammar), (item) => item.id);
  const characters = uniqueBy(selected.flatMap((item) => item.characters), (item) => item.id);
  const exercises = uniqueBy(selected.flatMap((item) => item.exercises), (item) => item.id);
  const stages = definition.lessonIds.length === 1 ? selected[0].stages : makeStages(3, characters.map((item) => [item.hanzi,item.pinyin,item.meaning,item.strokeCount] as CharacterMeta));
  return { scope, definition, vocabulary, sentences, grammar, characters, exercises, stages };
}

export const allCurriculumExercises = uniqueBy([lesson1Exercises, lesson2Exercises, lesson3Exercises].flat(), (item) => item.id);
export const allCurriculumCharacters = uniqueBy([lesson1Characters, lesson2Characters, lesson3Characters].flat(), (item) => item.id);
export function exerciseForId(id: string) { return allCurriculumExercises.find((item) => item.id === id); }
