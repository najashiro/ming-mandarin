export type PandaOption = {
  id: string;
  chinese?: string;
  pinyin?: string;
  label?: string;
};

export type PandaChallenge = {
  id: string;
  lesson: 1 | 2 | 3 | 4;
  kind: 'conversation' | 'meaning' | 'sentence';
  prompt: string;
  chinese: string;
  pinyin: string;
  options: PandaOption[];
  answerId: string;
  explanation: string;
  source: {
    file: string;
    id: string;
    evidenceRef: string;
    role: 'core_textbook' | 'supplementary_textbook' | 'classroom_extension' | 'preview_next_lesson';
  };
};

// Coverage: MING_KNOWLEDGE/index.json selects corpus 2.2.0, lessons 1–4.
// These are new practice questions grounded in canonical textbook records,
// not official workbook answers. All source IDs are active v2 PH IDs, resolved by
// MING_KNOWLEDGE/v2/query.py --phrase <Chinese>. evidenceRef selects the primary
// textbook witness; file identifies the active corpus manifest. Metadata stays
// internal. Only core textbook material is used, without mixing legacy/PPT variants.
// Sentence challenges replace one source token with ___; all other Chinese wording
// is preserved. Pinyin is a reading aid, and Spanish prompts supply story context.
export const PANDA_CHALLENGES: PandaChallenge[] = [
  {
    id: 'panda-l1-name', lesson: 1, kind: 'conversation',
    prompt: 'El guardián pregunta tu nombre. Preséntate como Ma Dawei.',
    chinese: '请问，你叫什么名字？',
    pinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?',
    options: [
      { id: 'a', chinese: '我叫马大为。', pinyin: 'Wǒ jiào Mǎ Dàwéi.' },
      { id: 'b', chinese: '他也很好。', pinyin: 'Tā yě hěn hǎo.' },
      { id: 'c', chinese: '认识你很高兴。', pinyin: 'Rènshi nǐ hěn gāoxìng.' },
    ],
    answerId: 'a',
    explanation: '我叫 + nombre sirve para presentarte: «Me llamo Ma Dawei». 什么名字 pregunta por el nombre.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-662568e447c8f935', evidenceRef: 'SRC-BOOK-01-02:p056', role: 'core_textbook' },
  },
  {
    id: 'panda-l1-greeting', lesson: 1, kind: 'meaning',
    prompt: 'La señal de entrada tiene este saludo. ¿Qué significa?',
    chinese: '你好！', pinyin: 'Nǐ hǎo!',
    options: [
      { id: 'a', label: 'Gracias.' },
      { id: 'b', label: '¡Hola!' },
      { id: 'c', label: 'Siéntate, por favor.' },
    ],
    answerId: 'b',
    explanation: '你好 es un saludo: «¡Hola!». 谢谢 significa «gracias» y 请坐, «siéntate, por favor».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-670d9743542cae3e', evidenceRef: 'SRC-BOOK-01-02:p045', role: 'core_textbook' },
  },
  {
    id: 'panda-l1-meeting', lesson: 1, kind: 'conversation',
    prompt: 'Un viajero se alegra de conocerte. Dile que tú también.',
    chinese: '认识你很高兴。', pinyin: 'Rènshi nǐ hěn gāoxìng.',
    options: [
      { id: 'a', chinese: '我姓宋，叫宋华。', pinyin: 'Wǒ xìng Sòng, jiào Sòng Huá.' },
      { id: 'b', chinese: '他也很好。', pinyin: 'Tā yě hěn hǎo.' },
      { id: 'c', chinese: '认识你我也很高兴。', pinyin: 'Rènshi nǐ wǒ yě hěn gāoxìng.' },
    ],
    answerId: 'c',
    explanation: '也 significa «también». 认识你我也很高兴 devuelve la cortesía: «También estoy encantado de conocerte».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-2f4c8cbba8f15bf3', evidenceRef: 'SRC-BOOK-01-02:p045', role: 'core_textbook' },
  },
  {
    id: 'panda-l1-wellbeing', lesson: 1, kind: 'conversation',
    prompt: 'El viajero pregunta cómo has estado. Responde que estás bien y devuelve la pregunta.',
    chinese: '你最近怎么样？', pinyin: 'Nǐ zuìjìn zěnmeyàng?',
    options: [
      { id: 'a', chinese: '我很好。你呢？', pinyin: 'Wǒ hěn hǎo. Nǐ ne?' },
      { id: 'b', chinese: '我叫马大为。', pinyin: 'Wǒ jiào Mǎ Dàwéi.' },
      { id: 'c', chinese: '认识你很高兴。', pinyin: 'Rènshi nǐ hěn gāoxìng.' },
    ],
    answerId: 'a',
    explanation: '我很好 expresa «estoy muy bien». 你呢 devuelve la pregunta: «¿Y tú?».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-ecfd3a421f57b8bd', evidenceRef: 'SRC-BOOK-01-02:p049', role: 'core_textbook' },
  },
  {
    id: 'panda-l1-surname', lesson: 1, kind: 'meaning',
    prompt: 'Lee la presentación del visitante. ¿Qué información da?',
    chinese: '我姓宋，叫宋华。', pinyin: 'Wǒ xìng Sòng, jiào Sòng Huá.',
    options: [
      { id: 'a', label: 'Se llama Ma Dawei.' },
      { id: 'b', label: 'Se apellida Song y se llama Song Hua.' },
      { id: 'c', label: 'Pregunta dónde está Lin Na.' },
    ],
    answerId: 'b',
    explanation: '姓 introduce el apellido, 宋. 叫 introduce el nombre, 宋华.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-8adb07789bff67a4', evidenceRef: 'SRC-BOOK-01-02:p045', role: 'core_textbook' },
  },
  {
    id: 'panda-l1-busy', lesson: 1, kind: 'meaning',
    prompt: 'Antes de abrir la puerta, el guardián dice esto. ¿Qué te cuenta y qué te pregunta?',
    chinese: '我很忙。你忙吗？', pinyin: 'Wǒ hěn máng. Nǐ máng ma?',
    options: [
      { id: 'a', label: 'Está muy bien y pregunta cómo te llamas.' },
      { id: 'b', label: 'No está muy ocupado y pregunta dónde estás.' },
      { id: 'c', label: 'Está muy ocupado y pregunta si tú estás ocupado.' },
    ],
    answerId: 'c',
    explanation: '忙 significa «ocupado». La primera oración cuenta su estado; 吗 convierte la segunda en una pregunta de sí o no.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-fd9e21b4265fa711', evidenceRef: 'SRC-BOOK-01-02:p048', role: 'core_textbook' },
  },
  {
    id: 'panda-l1-return-question', lesson: 1, kind: 'sentence',
    prompt: 'Completa la inscripción para decir: «Estoy muy bien. ¿Y tú?».',
    chinese: '我很好。你___？', pinyin: 'Wǒ hěn hǎo. Nǐ ___?',
    options: [
      { id: 'a', chinese: '呢', pinyin: 'ne' },
      { id: 'b', chinese: '很', pinyin: 'hěn' },
      { id: 'c', chinese: '不', pinyin: 'bù' },
    ],
    answerId: 'a',
    explanation: '我很好。你呢？ La partícula 呢 permite devolver una pregunta que ya se entiende por el contexto.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-e48c42bc76c441d6', evidenceRef: 'SRC-BOOK-01-02:p048', role: 'core_textbook' },
  },
  {
    id: 'panda-l2-country', lesson: 2, kind: 'conversation',
    prompt: 'El profesor pregunta tu nacionalidad. Responde como Ma Dawei, que es estadounidense y estudia chino.',
    chinese: '我姓陈。你是哪国人？', pinyin: 'Wǒ xìng Chén. Nǐ shì nǎ guó rén?',
    options: [
      { id: 'a', chinese: '这是点心。', pinyin: 'Zhè shì diǎnxin.' },
      { id: 'b', chinese: '我是美国人。我也学习汉语。陈老师，认识您很高兴。', pinyin: 'Wǒ shì Měiguó rén. Wǒ yě xuéxí Hànyǔ. Chén lǎoshī, rènshi nín hěn gāoxìng.' },
      { id: 'c', chinese: '我姓宋，叫宋华。', pinyin: 'Wǒ xìng Sòng, jiào Sòng Huá.' },
    ],
    answerId: 'b',
    explanation: '美国人 significa «estadounidense». 我也学习汉语 añade «yo también estudio chino».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-690ab0981fa200f9', evidenceRef: 'SRC-BOOK-01-02:p066', role: 'core_textbook' },
  },
  {
    id: 'panda-l2-food-name', lesson: 2, kind: 'conversation',
    prompt: 'En el puesto de comida, responde que esto es dim sum.',
    chinese: '小云，这是什么？', pinyin: 'Xiǎoyún, zhè shì shénme?',
    options: [
      { id: 'a', chinese: '老师，再见！', pinyin: 'Lǎoshī, zàijiàn!' },
      { id: 'b', chinese: '我是美国人。我也学习汉语。陈老师，认识您很高兴。', pinyin: 'Wǒ shì Měiguó rén. Wǒ yě xuéxí Hànyǔ. Chén lǎoshī, rènshi nín hěn gāoxìng.' },
      { id: 'c', chinese: '这是点心。', pinyin: 'Zhè shì diǎnxin.' },
    ],
    answerId: 'c',
    explanation: '这是什么 pregunta «¿qué es esto?». 这是点心 identifica el alimento: «Esto es dim sum».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-fd63f91d021e950d', evidenceRef: 'SRC-BOOK-01-02:p069', role: 'core_textbook' },
  },
  {
    id: 'panda-l2-tasty', lesson: 2, kind: 'conversation',
    prompt: 'El vendedor pregunta por el sabor. Contesta que los baozi y los jiaozi están ricos.',
    chinese: '包子好吃吗？', pinyin: 'Bāozi hǎochī ma?',
    options: [
      { id: 'a', chinese: '包子和饺子都很好吃。', pinyin: 'Bāozi hé jiǎozi dōu hěn hǎochī.' },
      { id: 'b', chinese: '老师，早上好！', pinyin: 'Lǎoshī, zǎoshang hǎo!' },
      { id: 'c', chinese: '这是马大为，他是我朋友，刚到北京。', pinyin: 'Zhè shì Mǎ Dàwéi, tā shì wǒ péngyou, gāng dào Běijīng.' },
    ],
    answerId: 'a',
    explanation: '好吃 describe un alimento rico. 和 une baozi y jiaozi; 都 indica que ambos están ricos.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-b13c3b5fbf4875af', evidenceRef: 'SRC-BOOK-01-02:p070', role: 'core_textbook' },
  },
  {
    id: 'panda-l2-baozi', lesson: 2, kind: 'meaning',
    prompt: 'El vendedor corrige una confusión. ¿Qué dice sobre el plato?',
    chinese: '这不是饺子，是包子。', pinyin: 'Zhè bú shì jiǎozi, shì bāozi.',
    options: [
      { id: 'a', label: 'Son jiaozi, no baozi.' },
      { id: 'b', label: 'No son jiaozi; son baozi.' },
      { id: 'c', label: 'Los baozi y los jiaozi son pequeños.' },
    ],
    answerId: 'b',
    explanation: '不是 niega la primera identificación. El plato es 包子, un bollo relleno al vapor.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-732b583c1bace49e', evidenceRef: 'SRC-BOOK-01-02:p072', role: 'core_textbook' },
  },
  {
    id: 'panda-l2-morning', lesson: 2, kind: 'meaning',
    prompt: 'Llega un mensaje para el profesor. ¿Cuál es su significado?',
    chinese: '老师，早上好！', pinyin: 'Lǎoshī, zǎoshang hǎo!',
    options: [
      { id: 'a', label: 'Profesor, hasta luego.' },
      { id: 'b', label: 'Profesor, ¿cuál es su apellido?' },
      { id: 'c', label: 'Profesor, ¡buenos días!' },
    ],
    answerId: 'c',
    explanation: '早上好 es el saludo de la mañana. 老师 significa «profesor» o «profesora».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-2c5108b99f0c00e3', evidenceRef: 'SRC-BOOK-01-02:p065', role: 'core_textbook' },
  },
  {
    id: 'panda-l2-order', lesson: 2, kind: 'meaning',
    prompt: 'Lee el pedido para abrir el puesto. ¿Qué quiere comer el visitante?',
    chinese: '好，我要饺子，也要包子。', pinyin: 'Hǎo, wǒ yào jiǎozi, yě yào bāozi.',
    options: [
      { id: 'a', label: 'Quiere jiaozi y también baozi.' },
      { id: 'b', label: 'Quiere solamente baozi.' },
      { id: 'c', label: 'Quiere arroz y fideos.' },
    ],
    answerId: 'a',
    explanation: '要 expresa lo que quiere. 也要 añade un segundo alimento: «también quiero baozi».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-c5cfe5e5b205152f', evidenceRef: 'SRC-BOOK-01-02:p070', role: 'core_textbook' },
  },
  {
    id: 'panda-l2-both', lesson: 2, kind: 'sentence',
    prompt: 'Completa para decir que ambos platos están ricos.',
    chinese: '包子和饺子___很好吃。', pinyin: 'Bāozi hé jiǎozi ___ hěn hǎochī.',
    options: [
      { id: 'a', chinese: '吗', pinyin: 'ma' },
      { id: 'b', chinese: '都', pinyin: 'dōu' },
      { id: 'c', chinese: '哪', pinyin: 'nǎ' },
    ],
    answerId: 'b',
    explanation: '包子和饺子都很好吃。 都 abarca los dos alimentos: «ambos».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-809344e864886f9c', evidenceRef: 'SRC-BOOK-01-02:p070', role: 'core_textbook' },
  },
  {
    id: 'panda-l3-family-size', lesson: 3, kind: 'conversation',
    prompt: 'La guardiana pregunta por tu familia. Responde que son cuatro.',
    chinese: '你们家有几口人？', pinyin: 'Nǐmen jiā yǒu jǐ kǒu rén?',
    options: [
      { id: 'a', chinese: '我爸爸是医生，妈妈是老师。', pinyin: 'Wǒ bàba shì yīshēng, māma shì lǎoshī.' },
      { id: 'b', chinese: '我没有妹妹，贝贝是我的小狗。', pinyin: 'Wǒ méiyǒu mèimei, Bèibei shì wǒ de xiǎogǒu.' },
      { id: 'c', chinese: '我们家有四口人。', pinyin: 'Wǒmen jiā yǒu sì kǒu rén.' },
    ],
    answerId: 'c',
    explanation: '几口人 pregunta cuántos miembros hay en la familia. 四口人 responde «cuatro personas».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-73edb201a1b0b88d', evidenceRef: 'SRC-BOOK-03:p002', role: 'core_textbook' },
  },
  {
    id: 'panda-l3-jobs', lesson: 3, kind: 'conversation',
    prompt: 'Responde que tu padre es médico y tu madre es profesora.',
    chinese: '你爸爸妈妈做什么工作？', pinyin: 'Nǐ bàba māma zuò shénme gōngzuò?',
    options: [
      { id: 'a', chinese: '我爸爸是医生，妈妈是老师。', pinyin: 'Wǒ bàba shì yīshēng, māma shì lǎoshī.' },
      { id: 'b', chinese: '我们家有四口人。', pinyin: 'Wǒmen jiā yǒu sì kǒu rén.' },
      { id: 'c', chinese: '这是我们家的照片。', pinyin: 'Zhè shì wǒmen jiā de zhàopiàn.' },
    ],
    answerId: 'a',
    explanation: '做什么工作 pregunta por la profesión. 医生 es «médico» y 老师 es «profesor».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-1f7e03d8c0052b68', evidenceRef: 'SRC-BOOK-03:p002', role: 'core_textbook' },
  },
  {
    id: 'panda-l3-brother', lesson: 3, kind: 'conversation',
    prompt: 'Miran una foto de tu hermano mayor. Corrige la pregunta del visitante.',
    chinese: '这是你弟弟吗？', pinyin: 'Zhè shì nǐ dìdi ma?',
    options: [
      { id: 'a', chinese: '我们家有四口人。', pinyin: 'Wǒmen jiā yǒu sì kǒu rén.' },
      { id: 'b', chinese: '这不是我弟弟。这是我哥哥。林娜，你们家有几口人？', pinyin: 'Zhè bú shì wǒ dìdi. Zhè shì wǒ gēge. Lín Nà, nǐmen jiā yǒu jǐ kǒu rén?' },
      { id: 'c', chinese: '我爸爸是医生，妈妈是老师。', pinyin: 'Wǒ bàba shì yīshēng, māma shì lǎoshī.' },
    ],
    answerId: 'b',
    explanation: '弟弟 es el hermano menor; 哥哥 es el hermano mayor. 不是 corrige la identificación.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-fb58d7bbfe7950bc', evidenceRef: 'SRC-BOOK-03:p002', role: 'core_textbook' },
  },
  {
    id: 'panda-l3-beibei', lesson: 3, kind: 'conversation',
    prompt: 'Responde como Lin Na: Beibei es tu perrito y no tienes hermana menor.',
    chinese: '贝贝是谁？是你妹妹吗？', pinyin: 'Bèibei shì shéi? Shì nǐ mèimei ma?',
    options: [
      { id: 'a', chinese: '我叫马大为。', pinyin: 'Wǒ jiào Mǎ Dàwéi.' },
      { id: 'b', chinese: '这是点心。', pinyin: 'Zhè shì diǎnxin.' },
      { id: 'c', chinese: '我没有妹妹，贝贝是我的小狗。', pinyin: 'Wǒ méiyǒu mèimei, Bèibei shì wǒ de xiǎogǒu.' },
    ],
    answerId: 'c',
    explanation: '没有 expresa «no tener». 小狗 significa «perrito»: Beibei es la mascota de Lin Na.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-1f5edf8ae05ca861', evidenceRef: 'SRC-BOOK-03:p003', role: 'core_textbook' },
  },
  {
    id: 'panda-l3-photo', lesson: 3, kind: 'meaning',
    prompt: 'Encuentras una foto con esta nota. ¿Qué está mostrando la persona?',
    chinese: '我们家有四口人。你看，这是我们家的照片。', pinyin: 'Wǒmen jiā yǒu sì kǒu rén. Nǐ kàn, zhè shì wǒmen jiā de zhàopiàn.',
    options: [
      { id: 'a', label: 'Una foto de su familia.' },
      { id: 'b', label: 'La profesión de su padre.' },
      { id: 'c', label: 'El nombre de su perrito.' },
    ],
    answerId: 'a',
    explanation: '照片 significa «foto». 我们家的 señala que la foto es de su familia.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-8dcc41f26397e990', evidenceRef: 'SRC-BOOK-03:p002', role: 'core_textbook' },
  },
  {
    id: 'panda-l3-age', lesson: 3, kind: 'meaning',
    prompt: 'El visitante hace una pregunta sobre la hija. ¿Qué desea saber?',
    chinese: '你女儿今年几岁？', pinyin: 'Nǐ nǚ’ér jīnnián jǐ suì?',
    options: [
      { id: 'a', label: 'Cuántas hijas tiene.' },
      { id: 'b', label: 'Cuántos años tiene su hija este año.' },
      { id: 'c', label: 'Qué bebida quiere su hija.' },
    ],
    answerId: 'b',
    explanation: '女儿 significa «hija», 今年 es «este año» y 几岁 pregunta la edad de una niña o un niño.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-40b8d75ef94972dd', evidenceRef: 'SRC-BOOK-03:p006', role: 'core_textbook' },
  },
  {
    id: 'panda-l3-classifier', lesson: 3, kind: 'sentence',
    prompt: 'Completa la frase para contar cuatro miembros de la familia.',
    chinese: '我们家有四___人。', pinyin: 'Wǒmen jiā yǒu sì ___ rén.',
    options: [
      { id: 'a', chinese: '张', pinyin: 'zhāng' },
      { id: 'b', chinese: '岁', pinyin: 'suì' },
      { id: 'c', chinese: '口', pinyin: 'kǒu' },
    ],
    answerId: 'c',
    explanation: '我们家有四口人。 口 cuenta miembros de la familia. 张 se usa con objetos planos y 岁 expresa años de edad.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-8ad755629d096248', evidenceRef: 'SRC-BOOK-03:p013', role: 'core_textbook' },
  },
  {
    id: 'panda-l4-tomorrow', lesson: 4, kind: 'conversation',
    prompt: 'Responde como Lin Na: mañana tienes muchas clases y estarás muy ocupada.',
    chinese: '林娜，你明天做什么？', pinyin: 'Lín Nà, nǐ míngtiān zuò shénme?',
    options: [
      { id: 'a', chinese: '我明天有很多课，特别忙。', pinyin: 'Wǒ míngtiān yǒu hěn duō kè, tèbié máng.' },
      { id: 'b', chinese: '差五分七点。', pinyin: 'Chà wǔ fēn qī diǎn.' },
      { id: 'c', chinese: '我们班一共有三十个人，有二十六个女生。', pinyin: 'Wǒmen bān yígòng yǒu sānshí ge rén, yǒu èrshíliù ge nǚshēng.' },
    ],
    answerId: 'a',
    explanation: '明天 significa «mañana», 课 es «clase» y 特别忙 expresa «especialmente ocupada».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-82628fd0167910d4', evidenceRef: 'SRC-BOOK-04:p002', role: 'core_textbook' },
  },
  {
    id: 'panda-l4-time', lesson: 4, kind: 'meaning',
    prompt: 'El guardián te dice la hora. ¿Qué reloj corresponde a su respuesta?',
    chinese: '差五分七点。', pinyin: 'Chà wǔ fēn qī diǎn.',
    options: [
      { id: 'a', label: '7:05 — las siete y cinco.' },
      { id: 'b', label: '6:55 — las siete menos cinco.' },
      { id: 'c', label: '7:50 — las siete y cincuenta.' },
    ],
    answerId: 'b',
    explanation: '差 se lee chà en este contexto y expresa lo que falta: faltan cinco minutos para las siete, 6:55.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-3f73ad768952c342', evidenceRef: 'SRC-BOOK-04:p005', role: 'core_textbook' },
  },
  {
    id: 'panda-l4-return', lesson: 4, kind: 'meaning',
    prompt: 'Lee la nota de Wang Xiaoyun. ¿A qué hora vuelve a la escuela?',
    chinese: '七点半我回学校，我们班有活动。',
    pinyin: 'Qī diǎn bàn wǒ huí xuéxiào, wǒmen bān yǒu huódòng.',
    options: [
      { id: 'a', label: 'A las 7:00.' },
      { id: 'b', label: 'A las 6:30.' },
      { id: 'c', label: 'A las 7:30.' },
    ],
    answerId: 'c',
    explanation: '七点半 son las siete y media. 回学校 significa «volver a la escuela».',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-f9131d33151602a9', evidenceRef: 'SRC-BOOK-04:p006', role: 'core_textbook' },
  },
  {
    id: 'panda-l4-class-size', lesson: 4, kind: 'conversation',
    prompt: 'Responde como Wang Xiaoyun: hay treinta personas en tu clase, veintiséis de ellas chicas.',
    chinese: '你们班一共有多少人？', pinyin: 'Nǐmen bān yígòng yǒu duōshao rén?',
    options: [
      { id: 'a', chinese: '我们班一共有三十个人，有二十六个女生。', pinyin: 'Wǒmen bān yígòng yǒu sānshí ge rén, yǒu èrshíliù ge nǚshēng.' },
      { id: 'b', chinese: '我学英语。', pinyin: 'Wǒ xué Yīngyǔ.' },
      { id: 'c', chinese: '我明天有很多课，特别忙。', pinyin: 'Wǒ míngtiān yǒu hěn duō kè, tèbié máng.' },
    ],
    answerId: 'a',
    explanation: '多少人 pregunta cuántas personas hay. 一共 significa «en total» y 三十 expresa treinta.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-59e0807490ecd436', evidenceRef: 'SRC-BOOK-04:p006', role: 'core_textbook' },
  },
  {
    id: 'panda-l4-only', lesson: 4, kind: 'meaning',
    prompt: 'El guardián describe su clase. ¿Qué afirma sobre los chicos?',
    chinese: '对。我们班只有四个男生。', pinyin: 'Duì. Wǒmen bān zhǐ yǒu sì gè nánshēng.',
    options: [
      { id: 'a', label: 'Hay cuatro chicas.' },
      { id: 'b', label: 'Solo hay cuatro chicos.' },
      { id: 'c', label: 'Hay cuarenta chicos.' },
    ],
    answerId: 'b',
    explanation: 'Aquí 只 se lee zhǐ y significa «solo». 四个男生 son cuatro chicos; no cuarenta.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-b287f138fe23a129', evidenceRef: 'SRC-BOOK-04:p006', role: 'core_textbook' },
  },
  {
    id: 'panda-l4-invitation', lesson: 4, kind: 'meaning',
    prompt: 'Antes de salir del laberinto, Lin Na hace una propuesta. ¿Cuál es?',
    chinese: '恐怕不行。我们一起练习口语吧。', pinyin: 'Kǒngpà bùxíng. Wǒmen yìqǐ liànxí kǒuyǔ ba.',
    options: [
      { id: 'a', label: 'Ir juntos al cine.' },
      { id: 'b', label: 'Volver a la escuela a las siete.' },
      { id: 'c', label: 'Practicar juntos conversación en chino.' },
    ],
    answerId: 'c',
    explanation: '一起 es «juntos», 练习 es «practicar» y 口语 es expresión oral. 吧 suaviza la propuesta.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-213c70ee5676dd8a', evidenceRef: 'SRC-BOOK-04:p003', role: 'core_textbook' },
  },
  {
    id: 'panda-l4-tired', lesson: 4, kind: 'sentence',
    prompt: 'Completa esta pregunta afirmativa-negativa: «¿Estás cansado?».',
    chinese: '你累___累？', pinyin: 'Nǐ lèi ___ lèi?',
    options: [
      { id: 'a', chinese: '不', pinyin: 'bu' },
      { id: 'b', chinese: '吧', pinyin: 'ba' },
      { id: 'c', chinese: '点', pinyin: 'diǎn' },
    ],
    answerId: 'a',
    explanation: '你累不累？ repite el adjetivo con 不 en medio: «¿cansado o no cansado?». Es una pregunta de sí o no.',
    source: { file: 'MING_KNOWLEDGE/v2/source-v22.json', id: 'PH-27db8c21e168930c', evidenceRef: 'SRC-BOOK-04:p002', role: 'core_textbook' },
  },
];
