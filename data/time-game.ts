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

export const TIME_CHALLENGE_SECONDS = 240;
export const TIME_RULES_VERSION = 3;
export type TimeRuleMode = 'normal' | 'hard';

export const minuteHelpCards = [
  { range: '1–10 min', forms: [
    { label: '1–9', pattern: '点 + 零 + número + 分', example: '两点零五分', pinyin: 'liǎng diǎn líng wǔ fēn' },
    { label: '10', pattern: '点 + 十分', example: '两点十分', pinyin: 'liǎng diǎn shí fēn' },
  ], note: '分 se mantiene.' },
  { range: '11–59 min', forms: [
    { label: '', pattern: '点 + número + (分)', example: '两点十二分 / 两点十二', pinyin: 'liǎng diǎn shí èr fēn / liǎng diǎn shí èr' },
  ], note: '分 puede omitirse.' },
] as const;
