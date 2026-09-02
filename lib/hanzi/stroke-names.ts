export type VerifiedStrokeName = { hanzi: string; pinyin: string };

// The compact sequences come from cnchar-order 3.2.6 (MIT). Codes that cnchar
// groups under more than one possible technical name are deliberately omitted
// from the catalog below, so the UI falls back to “Trazo N” instead of guessing.
const sequences: Record<string, string> = {
  一: 'j', 二: 'jj', 三: 'jjj', 四: 'fcsbj', 五: 'jfcj', 六: 'kjsk', 七: 'ju', 八: 'sl', 九: 'so', 十: 'jf', 百: 'jsfcjj', 千: 'sjf',
  你: 'sfsegsk', 我: 'sjgiysk', 他: 'sfrfu', 好: 'msjegj', 老: 'jfjssu', 师: 'fsjfrf', 早: 'fcjjjf', 上: 'fjj', 午: 'sjjf', 下: 'jfk', 晚: 'fcjjsefcjsu', 安: 'kdemsj', 再: 'jfrfjj', 见: 'fcsu',
  叫: 'fcjhf', 什: 'sfjf', 么: 'snk', 请: 'kpjjfjfrjj', 问: 'kfrfcj', 名: 'sekfcj', 字: 'kdeegj', 姓: 'msjsjjfj', 认: 'kpsl', 识: 'kpfcjsk', 高: 'kjfcjfrfcj', 兴: 'kksjsk', 也: 'rfu',
  在: 'jsfjfj', 吗: 'fcjczj', 进: 'jjsfkal', 坐: 'skskjfj', 谢: 'kpsfrjjjsjgk', 很: 'ssfcjjhsl', 忙: 'dkfkjb', 不: 'jsfk', 太: 'jslk', 最: 'fcjjjffjjiel', 近: 'ssjfkal', 怎: 'sjfjjdykk', 样: 'jfskksjjjf',
};

// Names and Hanyu Pinyin follow the Unicode CJK Strokes catalog. Ambiguous
// cnchar codes d/e/y are intentionally absent.
const catalog: Record<string, VerifiedStrokeName> = {
  a: { hanzi: '横折折撇', pinyin: 'héngzhézhépiě' },
  b: { hanzi: '竖弯', pinyin: 'shùwān' },
  c: { hanzi: '横折', pinyin: 'héngzhé' },
  f: { hanzi: '竖', pinyin: 'shù' },
  g: { hanzi: '竖钩', pinyin: 'shùgōu' },
  h: { hanzi: '竖提', pinyin: 'shùtí' },
  i: { hanzi: '提', pinyin: 'tí' },
  j: { hanzi: '横', pinyin: 'héng' },
  k: { hanzi: '点', pinyin: 'diǎn' },
  l: { hanzi: '捺', pinyin: 'nà' },
  m: { hanzi: '撇点', pinyin: 'piědiǎn' },
  n: { hanzi: '撇折', pinyin: 'piězhé' },
  o: { hanzi: '横斜钩', pinyin: 'héngxiégōu' },
  p: { hanzi: '横折提', pinyin: 'héngzhétí' },
  r: { hanzi: '横折钩', pinyin: 'héngzhégōu' },
  s: { hanzi: '撇', pinyin: 'piě' },
  u: { hanzi: '竖弯钩', pinyin: 'shùwāngōu' },
  z: { hanzi: '竖折折钩', pinyin: 'shùzhézhégōu' },
};

export function strokeNamesForCharacter(character: string, strokeCount: number): Array<VerifiedStrokeName | null> {
  const sequence = sequences[character];
  if (!sequence || [...sequence].length !== strokeCount) return Array.from({ length: strokeCount }, () => null);
  return [...sequence].map((code) => catalog[code] ?? null);
}
