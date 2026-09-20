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

export const timeHelp = [
  ['点','diǎn','hora / «en punto»'],['分','fēn','minuto(s)'],['一刻','yí kè','un cuarto de hora = 15 minutos'],['半','bàn','media hora = 30 minutos'],['差','chà','faltar para llegar a la hora siguiente'],
];
