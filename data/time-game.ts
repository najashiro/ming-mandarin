export type TimeToken = { hanzi: string; pinyin: string; category: 'number' | 'time-unit' | 'structure' };
export const timeTokens: TimeToken[] = [
  ['一','yī','number'],['二','èr','number'],['两','liǎng','number'],['三','sān','number'],['四','sì','number'],['五','wǔ','number'],['六','liù','number'],['七','qī','number'],['八','bā','number'],['九','jiǔ','number'],['十','shí','number'],['零','líng','number'],
  ['点','diǎn','time-unit'],['分','fēn','time-unit'],['半','bàn','time-unit'],['刻','kè','time-unit'],['差','chà','structure'],
].map(([hanzi,pinyin,category]) => ({hanzi,pinyin,category:category as TimeToken['category']}));

// Provisional rules from the approved game specification. Audit against the hours lesson when supplied.
export const timeCurriculum = {
  sourceTag: 'hours-game-spec-v2; pending-hours-lesson-audit',
  allowErDian: false,
  allowOmittedZero: true,
  allowLeadingZero: true,
  allowThreeQuarter: true,
  allowCha: true,
  mastery: { half: 1, quarter: 2, threeQuarter: 2, cha: 2 },
} as const;

/** Regla compartida por la Ayuda y las respuestas del juego de la hora. */
export const canOmitMinuteFen = (minute: number) => minute > 10 && minute <= 59;

export const minuteHelpCards = [
  { range: '1–9 min', pattern: '零 + número + 分', example: '两点零五分', pinyin: 'liǎng diǎn líng wǔ fēn', note: 'Mantén 分.' },
  { range: '10 min', pattern: '十分', example: '两点十分', pinyin: 'liǎng diǎn shí fēn', note: '分 es obligatorio.' },
  { range: '11–59 min', pattern: 'número + (分)', example: '两点十二分 / 两点十二', pinyin: 'liǎng diǎn shí èr fēn / liǎng diǎn shí èr', note: 'Ambas formas son correctas.' },
] as const;

export const optionalFenExamples = [
  { minute: 11, full: '两点十一分', short: '两点十一', fullPinyin: 'liǎng diǎn shí yī fēn', shortPinyin: 'liǎng diǎn shí yī' },
  { minute: 12, full: '两点十二分', short: '两点十二', fullPinyin: 'liǎng diǎn shí èr fēn', shortPinyin: 'liǎng diǎn shí èr' },
  { minute: 20, full: '两点二十分', short: '两点二十', fullPinyin: 'liǎng diǎn èr shí fēn', shortPinyin: 'liǎng diǎn èr shí' },
  { minute: 25, full: '两点二十五分', short: '两点二十五', fullPinyin: 'liǎng diǎn èr shí wǔ fēn', shortPinyin: 'liǎng diǎn èr shí wǔ' },
  { minute: 55, full: '两点五十五分', short: '两点五十五', fullPinyin: 'liǎng diǎn wǔ shí wǔ fēn', shortPinyin: 'liǎng diǎn wǔ shí wǔ' },
] as const;

export const timeHelp = [
  ['点','diǎn','hora / «en punto»'],['分','fēn','minuto(s)'],['一刻','yí kè','un cuarto de hora = 15 minutos'],['半','bàn','media hora = 30 minutos'],['差','chà','faltar para llegar a la hora siguiente'],
];
