import type { CurriculumScope, LessonNumber, SourceRef } from '@/data/types';

export type WorkbookMode = 'order' | 'complete' | 'dialogue';

/** Learner-safe projection. Import this module from server components only;
 * client components may import these types with `import type`. */
export type WorkbookQuestion = {
  id: string;
  lesson: LessonNumber;
  mode: WorkbookMode;
  prompt: string;
  context?: string;
  answer: string;
  options?: string[];
  tokens?: string[];
  pinyin?: string;
  translation?: string;
  hint: string;
  explanation: string;
  acceptedAnswers?: string[];
};

export type WorkbookModeDefinition = {
  id: WorkbookMode;
  title: string;
  description: string;
  skill: string;
  glyph: string;
};

export const workbookModes: WorkbookModeDefinition[] = [
  { id: 'order', title: 'Constructor de frases', description: 'Pon cada bloque en su lugar y expresa una idea completa.', skill: 'Orden de palabras', glyph: '句' },
  { id: 'complete', title: 'El carácter que falta', description: 'Observa los detalles y elige el carácter que da sentido a la frase.', skill: 'Lectura y vocabulario', glyph: '字' },
  { id: 'dialogue', title: 'Conecta la conversación', description: 'Relaciona cada pregunta o saludo con la respuesta adecuada.', skill: 'Comprensión y diálogo', glyph: '话' },
];

type WorkbookEvidence = {
  source: SourceRef;
  sourceExerciseId: string;
  answerOrigin: 'ming_adaptation';
};

// Source text and printed pinyin are evidence, not an official answer key.
// Scoring, segmentation, Spanish scaffolding and explanations below are the
// explicit Míng adaptation made for these games. No original-listening task
// is scored, and no source records or existing progress IDs are overwritten.
const workbookFiles: Record<LessonNumber, string> = {
  1: 'Libro de Ejercicios Basico 1 - Lección 1 -2.pdf',
  2: 'Libro de Ejercicios Basico 1 - Lección 1 -2.pdf',
  3: 'Libro de Ejecicios Basico 1 - Lección 3 - Nimen jiã you jĩ kou rén.pdf',
  4: 'Libro de Ejercicios Basico 1 - Lección 4.pdf',
  5: 'Libro de Ejercicios Basico 3 - Lección 5 Zhù nĩ shêngrì kuàilè.pdf',
};

const questions: WorkbookQuestion[] = [];
export const workbookQuestionEvidence: Record<string, WorkbookEvidence> = {};

function add(question: WorkbookQuestion, pdfPage: number, sourceExerciseId: string) {
  questions.push(question);
  workbookQuestionEvidence[question.id] = {
    source: { type: 'workbook', file: workbookFiles[question.lesson], pdfPage },
    sourceExerciseId,
    answerOrigin: 'ming_adaptation',
  };
}

type OrderRow = [tokens: string[], answer: string, pinyin: string, translation: string, hint: string, explanation: string, acceptedAnswers?: string[]];
function addOrders(lesson: LessonNumber, page: number, exerciseId: string, rows: OrderRow[]) {
  rows.forEach(([tokens, answer, pinyin, translation, hint, explanation, acceptedAnswers], index) => add({
    id: `wb-l${lesson}-order-${index + 1}`, lesson, mode: 'order',
    prompt: 'Construye la frase con todos los bloques.', context: translation,
    tokens, answer, pinyin, translation, hint, explanation,
    ...(acceptedAnswers ? { acceptedAnswers } : {}),
  }, page, exerciseId));
}

addOrders(1, 6, 'EX-SRC-WB-01-02-006-write-9', [
  [['你', '叫', '什么', '名字'], '你叫什么名字？', 'Nǐ jiào shénme míngzi?', '¿Cómo te llamas?', 'Empieza por la persona a la que preguntas. Después va el verbo.', '你 es la persona y 叫 introduce el nombre. 什么名字 pregunta qué nombre tiene esa persona.'],
  [['认识你', '我', '也', '很', '高兴'], '认识你我也很高兴。', 'Rènshi nǐ wǒ yě hěn gāoxìng.', 'Yo también estoy muy contento de conocerte.', 'El bloque «conocerte» puede abrir la frase; también va antes de la valoración.', '认识你 presenta la situación. 我 también siente alegría: 也 va antes de 很高兴.', ['我认识你也很高兴。', '我也很高兴认识你。']],
  [['林娜', '最近', '怎么样'], '林娜最近怎么样？', 'Lín Nà zuìjìn zěnmeyàng?', '¿Cómo ha estado Lin Na últimamente?', 'Persona → últimamente → cómo está.', '最近 sitúa la pregunta en el tiempo y 怎么样 pregunta por el estado de Lin Na.', ['最近林娜怎么样？']],
  [['力波', '不', '太', '累'], '力波不太累。', 'Lìbō bú tài lèi.', 'Libo no está muy cansado.', 'Tras la persona, coloca la negación antes de «demasiado».', '不太累 significa «no muy cansado». 不 niega el conjunto 太累.'],
  [['他', '姓', '宋', '叫', '宋华'], '他姓宋，叫宋华。', 'Tā xìng Sòng, jiào Sòng Huá.', 'Su apellido es Song y se llama Song Hua.', 'Distingue el apellido del nombre completo.', '姓 introduce el apellido 宋; 叫 introduce el nombre 宋华.', ['他叫宋华，姓宋。']],
]);

addOrders(2, 14, 'EX-SRC-WB-01-02-014-write-9', [
  [['马大为', '是', '我朋友'], '马大为是我朋友。', 'Mǎ Dàwéi shì wǒ péngyou.', 'Ma Dawei es mi amigo.', 'Presenta primero a Ma Dawei y después su relación contigo.', '是 une la persona 马大为 con su identidad o relación: 我朋友.'],
  [['他', '也', '学习', '汉语'], '他也学习汉语。', 'Tā yě xuéxí Hànyǔ.', 'Él también estudia chino.', 'La palabra «también» se coloca antes de la acción.', '也 va antes de 学习. 汉语 es lo que estudia.'],
  [['我爸爸', '是', '北京人'], '我爸爸是北京人。', 'Wǒ bàba shì Běijīngrén.', 'Mi padre es de Pekín.', 'Persona → ser → procedencia.', '北京人 indica una persona de Pekín. 是 conecta esa procedencia con 我爸爸.'],
  [['我', '喜欢', '吃', '饺子', '和', '包子'], '我喜欢吃饺子和包子。', 'Wǒ xǐhuan chī jiǎozi hé bāozi.', 'Me gusta comer jiaozi y baozi.', 'Después de «me gusta» va la actividad y luego los dos alimentos.', '喜欢吃 expresa «gustar comer». 和 une 饺子 y 包子; ambos órdenes de la lista conservan el sentido.', ['我喜欢吃包子和饺子。']],
  [['面条儿', '和', '点心', '都', '很', '好吃'], '面条儿和点心都很好吃。', 'Miàntiáor hé diǎnxin dōu hěn hǎochī.', 'Los fideos y los bocadillos están muy ricos.', 'Nombra ambos alimentos antes de decir que los dos están ricos.', '都 se refiere a los dos alimentos y precede a 很好吃. 和 une los nombres.', ['点心和面条儿都很好吃。']],
]);

addOrders(3, 6, 'EX-SRC-WB-03-006-write-9', [
  [['陆雨平家', '有', '三', '口', '人'], '陆雨平家有三口人。', 'Lù Yǔpíng jiā yǒu sān kǒu rén.', 'En la familia de Lu Yuping hay tres personas.', 'Familia → tener → número → clasificador → personas.', '口 es el clasificador para contar miembros de una familia: 三口人.'],
  [['你哥哥', '做', '什么', '工作'], '你哥哥做什么工作？', 'Nǐ gēge zuò shénme gōngzuò?', '¿En qué trabaja tu hermano mayor?', 'Empieza por el hermano y termina con «qué trabajo».', '做什么工作 pregunta por la profesión. 什么 acompaña al nombre 工作.'],
  [['我', '一共', '有', '十', '张', '照片'], '我一共有十张照片。', 'Wǒ yígòng yǒu shí zhāng zhàopiàn.', 'Tengo diez fotografías en total.', '«En total» aparece antes de tener; el clasificador acompaña a las fotos.', '一共 resume la cantidad. 张 se coloca entre 十 y 照片.'],
  [['你女儿', '今年', '几', '岁'], '你女儿今年几岁？', 'Nǐ nǚ’ér jīnnián jǐ suì?', '¿Cuántos años tiene tu hija este año?', 'Persona → este año → cuántos → años de edad.', '几岁 pregunta la edad, especialmente de un niño. 今年 fija el año de referencia.', ['今年你女儿几岁？']],
  [['她', '晚上', '还', '有', '钢琴课'], '她晚上还有钢琴课。', 'Tā wǎnshang hái yǒu gāngqínkè.', 'Ella también tiene clase de piano por la noche.', 'El momento va antes de la acción; «además» va antes de tener.', '晚上 indica cuándo. 还 va delante de 有 para añadir otra clase.', ['晚上她还有钢琴课。']],
]);

addOrders(4, 6, 'L4-WB-04-06-02', [
  [['林娜', '累', '不', '累'], '林娜累不累？', 'Lín Nà lèi bu lèi?', '¿Está cansada Lin Na?', 'La pregunta repite el adjetivo con la negación en medio.', '累不累 es una pregunta afirmativo-negativa. Hay dos bloques 累 y ambos se usan.'],
  [['我', '上午', '八点', '有', '口语课'], '我上午八点有口语课。', 'Wǒ shàngwǔ bā diǎn yǒu kǒuyǔkè.', 'Tengo clase de conversación a las ocho de la mañana.', 'Mañana → hora; todo el momento se coloca antes de tener clase.', '上午八点 sitúa la clase. El tiempo puede ir después del sujeto o al principio; también puede aparecer 上午 antes del sujeto y 八点 después.', ['上午八点我有口语课。', '上午我八点有口语课。']],
  [['我们班', '明天', '中午', '有', '活动'], '我们班明天中午有活动。', 'Wǒmen bān míngtiān zhōngwǔ yǒu huódòng.', 'Nuestra clase tiene una actividad mañana al mediodía.', 'Ordena el tiempo de lo general a lo concreto.', '明天中午 significa «mañana al mediodía». 有活动 expresa que hay una actividad.', ['明天中午我们班有活动。', '明天我们班中午有活动。']],
  [['他们班', '有', '多少', '个', '学生'], '他们班有多少个学生？', 'Tāmen bān yǒu duōshao gè xuésheng?', '¿Cuántos estudiantes hay en su clase?', 'Después de tener coloca la cantidad interrogativa, el clasificador y el nombre.', '多少 pregunta la cantidad. 个 se coloca delante de 学生.'],
  [['晚上', '十点', '我', '回', '家'], '晚上十点我回家。', 'Wǎnshang shí diǎn wǒ huí jiā.', 'Vuelvo a casa a las diez de la noche.', 'Noche → hora; regresar → casa.', '晚上十点 es el momento y 回家 la acción. El sujeto puede ir antes del momento o entre 晚上 y 十点.', ['我晚上十点回家。', '晚上我十点回家。']],
]);

addOrders(5, 6, 'L5-task-24', [
  [['明天', '十月', '三十一号'], '明天十月三十一号。', 'Míngtiān Shíyuè sānshíyī hào.', 'Mañana es 31 de octubre.', 'En la fecha, el mes precede al día.', '十月 es octubre y 三十一号 es el día 31. Una fecha puede ser el predicado sin 是.'],
  [['我', '送', '她', '一个', '生日蛋糕'], '我送她一个生日蛋糕。', 'Wǒ sòng tā yí ge shēngrì dàngāo.', 'Le regalo a ella un pastel de cumpleaños.', 'Quién regala → regalar → quién recibe → regalo.', 'Con 送, la persona que recibe (她) va antes de la cosa regalada (一个生日蛋糕).'],
  [['她', '一九八五年', '出生'], '她一九八五年出生。', 'Tā yī jiǔ bā wǔ nián chūshēng.', 'Ella nació en 1985.', 'El año se coloca antes del verbo nacer.', '一九八五年 expresa el año dígito a dígito. 出生 significa nacer.', ['一九八五年她出生。']],
  [['他', '就', '是', '我哥哥'], '他就是我哥哥。', 'Tā jiù shì wǒ gēge.', 'Él es precisamente mi hermano mayor.', 'La palabra de énfasis va delante de ser.', '就 delante de 是 destaca que se trata precisamente de esa persona.'],
  [['陈老师', '教', '我们', '语法'], '陈老师教我们语法。', 'Chén lǎoshī jiāo wǒmen yǔfǎ.', 'El profesor Chen nos enseña gramática.', 'Quien enseña → enseñar → a quién → qué.', '教 se pronuncia jiāo aquí. Primero se indica a quién enseña (我们), después qué enseña (语法).'],
]);

type CompleteRow = [context: string, answer: string, distractor: string, hint: string, explanation: string, prompt?: string];
function addCompletions(lesson: LessonNumber, page: number, exerciseId: string, rows: CompleteRow[]) {
  rows.forEach(([context, answer, distractor, hint, explanation, prompt], index) => add({
    id: `wb-l${lesson}-complete-${index + 1}`, lesson, mode: 'complete',
    prompt: prompt ?? 'Elige el carácter que completa la frase.', context, answer,
    options: [answer, distractor], hint, explanation,
  }, page, exerciseId));
}

addCompletions(1, 4, 'EX-SRC-WB-01-02-004-write-5', [
  ['___姓宋。', '我', '或', 'La frase necesita una persona que tenga ese apellido.', '我姓宋 significa «Mi apellido es Song». 我 es el pronombre yo.'],
  ['认___你很高兴。', '识', '只', 'Busca el carácter que completa la palabra «conocer».', '认识 significa conocer. 认识你很高兴 expresa alegría al conocer a alguien.'],
  ['他___很忙。', '也', '它', 'La frase dice que él también está ocupado.', '也 significa también y va antes de 很忙. 它 es otro pronombre, no significa también.'],
  ['你最近___么样？', '怎', '乍', 'Estás formando la expresión que pregunta cómo está alguien.', '怎么样 pregunta cómo está alguien. 你最近怎么样？ se refiere a su estado últimamente.'],
  ['我不太忙。你___？', '呢', '吗', 'Después de contar tu situación, devuelves la misma pregunta.', '你呢？ significa «¿Y tú?». 呢 retoma el tema anterior sin repetir toda la pregunta.'],
]);

addCompletions(2, 12, 'EX-SRC-WB-01-02-012-write-5', [
  ['您好！___师。', '老', '考', 'El saludo se dirige a un profesor.', '老师 significa profesor o profesora. 老 es el primer carácter de esta palabra.'],
  ['你是___国人？', '哪', '那', 'Se pregunta de qué país es la persona.', '哪国人 pregunta la nacionalidad. 哪 es interrogativo; 那 señala algo o a alguien.'],
  ['我是___国人。', '美', '姜', 'La persona dice que es estadounidense.', '美国人 significa estadounidense. 美国 es Estados Unidos.'],
  ['马大为学___汉语。', '习', '刁', 'El verbo expresa estudiar o aprender.', '学习 significa estudiar. 马大为学习汉语 dice que Ma Dawei estudia chino.'],
  ['你___，那是饺子。', '看', '有', 'Invitas a alguien a mirar lo que estás señalando.', '你看 llama la atención: «Mira». La segunda parte identifica los 饺子.'],
]);

addCompletions(3, 4, 'EX-SRC-WB-03-004-write-5', [
  ['你们家有___口人？', '几', '儿', 'La pregunta busca saber cuántos miembros tiene la familia.', '几口人 pregunta cuántas personas hay en la familia. 口 es el clasificador.'],
  ['这是我们家的___片。', '照', '昭', 'La frase presenta una foto de la familia.', '照片 significa fotografía. El carácter inicial es 照.'],
  ['我爸爸是医___。', '生', '主', 'El padre trabaja como médico.', '医生 significa médico o médica. 生 completa el nombre de la profesión.'],
  ['我们家有___和咖啡。', '茶', '荼', 'Se nombran dos bebidas: una es el café.', '茶 es té. 茶和咖啡 significa «té y café». Observa el trazo que distingue las opciones.'],
  ['今___我们有英语课。', '天', '太', 'La frase sitúa la clase en el día de hoy.', '今天 significa hoy. 今天我们有英语课 dice que hoy tenemos clase de inglés.'],
]);

addCompletions(4, 4, 'L4-WB-04-04-02', [
  ['明天___午两点我有汉字课。', '下', '卞', 'La clase es a las dos de la tarde.', '下午 significa por la tarde. 两点 es la manera de expresar las dos en punto.'],
  ['五点___我回学校。', '半', '来', 'La hora indicada es cinco y media.', '五点半 significa cinco y media. 半 añade media hora a 五点.'],
  ['现在___十分六点。', '差', '羞', 'Se expresan los minutos que faltan para las seis.', '差十分六点 significa que faltan diez minutos para las seis: 5:50.'],
  ['我们班男生多，女生___。', '少', '小', 'Se comparan cantidades: muchos alumnos y pocas alumnas.', '多 y 少 expresan mucho y poco. 小 describe tamaño, no esta cantidad de estudiantes.', 'Completa la comparación entre muchas y pocas personas.'],
  ['我们一起___习口语吧。', '练', '炼', 'Se propone practicar conversación juntos.', '练习 significa practicar. 吧 convierte la frase en una sugerencia.'],
]);

addCompletions(5, 4, 'L5-task-20', [
  ['明天是你的___日。', '生', '主', 'Se habla de la celebración anual del nacimiento.', '生日 significa cumpleaños. 生 completa esa palabra.'],
  ['我们一起唱___。', '歌', '哥', 'El verbo es cantar; falta aquello que se canta.', '唱歌 significa cantar. 歌 es canción; 哥 forma parte de la palabra hermano mayor.'],
  ['我送他一___巧克力。', '盒', '合', 'El chocolate se regala dentro de una caja.', '一盒巧克力 es una caja de chocolate. 盒 indica la caja que se cuenta.'],
  ['你们好，___迎！', '欢', '吹', 'Después del saludo se da la bienvenida.', '欢迎 significa dar la bienvenida. 欢 es su primer carácter.'],
  ['来，咱们干___！', '杯', '怀', 'Es una invitación a brindar.', '干杯 es la expresión del brindis. 杯 significa vaso o copa dentro de esta expresión.'],
]);

type DialogueRow = [context: string, answer: string, hint: string, explanation: string, distractors?: string[], prompt?: string];
function addDialogues(lesson: LessonNumber, page: number, exerciseId: string, rows: DialogueRow[], offset = 0) {
  // Adapt ambiguous printed matching groups for independent questions. The
  // original simultaneous matching exercise constrains a pair by elimination;
  // an individual round must instead have one suitable answer without a hint.
  const options = rows.map(([, answer]) => answer);
  rows.forEach(([context, answer, hint, explanation, distractors, prompt], index) => add({
    id: `wb-l${lesson}-dialogue-${offset + index + 1}`, lesson, mode: 'dialogue',
    prompt: prompt ?? 'Elige la respuesta que continúa esta conversación.', context, answer,
    options: distractors ? [answer, ...distractors] : [...options], hint, explanation,
  }, page, exerciseId));
}

addDialogues(1, 4, 'EX-SRC-WB-01-02-004-write-6', [
  ['你好！', '你好！', 'Es un saludo breve: responde con otro saludo.', '你好 se usa tanto para saludar como para devolver el saludo.', undefined, 'Devuelve el saludo con otro saludo.'],
  ['请问，你叫什么名字？', '我姓林，叫林娜。', 'La pregunta pide el nombre de la persona.', '叫什么名字 pregunta el nombre. La respuesta indica el apellido 林 y el nombre 林娜.'],
  ['认识你很高兴。', '认识你我也很高兴。', 'Corresponde a la alegría de conocer a alguien.', '也 muestra que compartes el sentimiento: «Yo también estoy contento de conocerte».'],
]);
addDialogues(1, 4, 'EX-SRC-WB-01-02-004-write-6', [
  ['你累吗？', '我不太累。', 'La pregunta se refiere al cansancio.', '累 significa cansado. 不太累 responde «no muy cansado».', ['我姓林，叫林娜。', '你好！']],
  ['你最近怎么样？', '我很忙。', 'Cuenta cómo has estado últimamente.', '我很忙 cuenta que la persona está ocupada y responde a la pregunta sobre cómo ha estado.', ['我姓林，叫林娜。', '你好！']],
  ['我很忙。你呢？', '我也很忙。', 'La otra persona está ocupada y tú compartes ese estado.', '也 indica también. 你呢 devuelve la pregunta sobre la situación que se acaba de mencionar.', ['我姓林，叫林娜。', '你好！']],
], 3);

addDialogues(2, 12, 'EX-SRC-WB-01-02-012-write-6', [
  ['早上好，陈老师！', '早上好，大为！', 'Se está saludando por la mañana.', '早上好 significa buenos días. El profesor devuelve el saludo a Dawei.'],
  ['你是哪国人？', '我是加拿大人。', 'La respuesta debe indicar un país de procedencia.', '哪国人 pregunta la nacionalidad. 加拿大人 indica que la persona es canadiense.'],
  ['您贵姓？', '我姓林。', 'La pregunta cortés pide el apellido.', '贵姓 es una manera cortés de preguntar el apellido. 我姓林 responde que el apellido es Lin.'],
]);
addDialogues(2, 12, 'EX-SRC-WB-01-02-012-write-6', [
  ['那是包子吗？', '那不是包子，是饺子。', 'La respuesta comprueba si se ha identificado bien el alimento.', '不是 niega la identificación: no es baozi, sino jiaozi.', ['我姓林。', '早上好，大为！']],
  ['这是什么？', '这是点心。', 'Se pide identificar lo que está cerca.', '这是什么 pregunta «¿Qué es esto?». 这是点心 identifica el alimento.', ['我姓林。', '很好吃。']],
  ['面条儿好吃吗？', '很好吃。', 'La pregunta pide una valoración del sabor.', '好吃 significa sabroso. 很好吃 responde que los fideos están muy ricos.'],
], 3);

addDialogues(3, 4, 'EX-SRC-WB-03-004-write-6', [
  ['你爸爸做什么工作？', '他是老师。', 'Busca una profesión, no una cantidad ni un animal.', '做什么工作 pregunta en qué trabaja. 老师 es profesor o profesora.'],
  ['你们家有几口人？', '我们家有五口人。', 'La respuesta cuenta miembros de la familia.', '几口人 pregunta cuántas personas hay. 五口人 responde que son cinco.'],
  ['贝贝是谁？', '贝贝是我的小狗。', 'Se pregunta quién es Beibei.', '谁 pregunta por la identidad. La respuesta identifica a Beibei como el perrito de la persona.', ['我们家有五口人。', '我喝咖啡。']],
]);
addDialogues(3, 4, 'EX-SRC-WB-03-004-write-6', [
  ['她女儿今年几岁？', '十岁。', 'La pregunta pide la edad de su hija.', '几岁 pregunta la edad. 十岁 significa diez años.'],
  ['你明天晚上有课吗？', '没有。', 'La pregunta comprueba si tienes clase.', '有 se niega con 没有. Esta respuesta indica que no hay clase mañana por la noche.'],
  ['你喝什么？', '我喝咖啡。', 'Busca la opción que nombra una bebida.', '喝什么 pregunta qué bebes. 咖啡 es café.'],
], 3);

addDialogues(4, 4, 'L4-WB-04-04-03', [
  ['你明天几点有课？', '我明天上午十点有课。', 'La pregunta pide la hora de una clase.', '几点 pregunta la hora. 上午十点 responde «a las diez de la mañana».'],
  ['你今天晚上有没有时间？', '我没有时间。', 'La pregunta comprueba si tienes tiempo disponible.', '有没有 pregunta si se tiene algo o no. 没有时间 responde que no se tiene tiempo.'],
  ['你累不累？', '特别累。', 'La pregunta se refiere al cansancio.', '累不累 pregunta si se está cansado. 特别累 expresa estar especialmente cansado.'],
]);
addDialogues(4, 5, 'L4-WB-04-05-01', [
  ['你们班的女生多不多？', '不多。', 'Se pregunta si la cantidad de alumnas es grande.', '多不多 pregunta «¿son muchas?». 不多 responde que no son muchas.', ['差一刻八点。', '特别累。']],
  ['现在几点？', '差一刻八点。', 'Busca una expresión de hora.', '差一刻八点 significa que falta un cuarto de hora para las ocho: 7:45.'],
  ['你们班一共有多少人？', '二十八个人。', 'La pregunta pide el total de personas.', '一共 pide el total. 二十八个人 responde que son veintiocho personas.', undefined, 'Responde con el número total de personas.'],
], 3);

// L5 p4–5 was visually checked against the local workbook because its
// documentary exercise record summarizes, rather than transcribes, the pairs.
addDialogues(5, 4, 'L5-task-21', [
  ['你今年多大？', '我一九八五年出生，今年三十五岁。', 'La pregunta pide la edad; conserva el contexto temporal del libro.', 'La respuesta dice que nació en 1985 y tiene 35 años en el contexto del libro (2020). No se recalcula con la fecha actual.'],
  ['明天我们有一个聚会，你参加不参加？', '真不好意思，明天我没有时间。', 'Te han invitado a una reunión; busca una respuesta a esa invitación.', '不好意思 suaviza la negativa. 没有时间 explica por qué no puede asistir.'],
  ['你送他什么生日礼物？', '我送他三盒巧克力。', 'Se pregunta qué regalo le das.', '送他 indica a quién se regala. 三盒巧克力 son tres cajas de chocolate.'],
]);
addDialogues(5, 5, 'L5-task-21', [
  ['祝你生日快乐！', '谢谢！', 'Acaban de felicitarte por tu cumpleaños.', '谢谢 expresa agradecimiento por la felicitación.'],
  ['她教你什么？', '她教我说汉语。', 'La pregunta pide saber qué te enseña ella.', '教 se lee jiāo en este contexto. 教我说汉语 significa «me enseña a hablar chino».'],
  ['我来介绍一下，这是我妹妹林娜。', '林娜，你好！', 'Te presentan a Lin Na: dirígete a ella.', 'Después de la presentación, la respuesta saluda directamente a Lin Na.', undefined, 'Saluda a la persona que te acaban de presentar.'],
], 3);

/** Source references are deliberately excluded from data passed to the browser. */
export function getWorkbookQuestions(scope: CurriculumScope, mode?: WorkbookMode): WorkbookQuestion[] {
  const lessons = new Set(scope.split('-').map((part) => Number(part.slice(1))));
  return questions
    .filter((question) => lessons.has(question.lesson) && (!mode || question.mode === mode))
    .map((question) => ({
      ...question,
      ...(question.tokens ? { tokens: [...question.tokens] } : {}),
      ...(question.options ? { options: [...question.options] } : {}),
      ...(question.acceptedAnswers ? { acceptedAnswers: [...question.acceptedAnswers] } : {}),
    }));
}
