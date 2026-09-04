const toneMarks: Record<string, string[]> = {
  a: ['ā', 'á', 'ǎ', 'à'], e: ['ē', 'é', 'ě', 'è'], i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'], u: ['ū', 'ú', 'ǔ', 'ù'], ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

const markedToPlain = new Map<string, { vowel: string; tone: number }>();
Object.entries(toneMarks).forEach(([vowel, marks]) => marks.forEach((mark, index) => markedToPlain.set(mark, { vowel, tone: index + 1 })));

export function normalizePinyin(value: string): string {
  return value.normalize('NFC');
}

export function normalizeUnicode(value: string): string {
  return normalizePinyin(value).trim().replace(/\s+/g, ' ');
}

export function numberedSyllableToMarked(raw: string): string {
  const match = normalizeUnicode(raw.toLowerCase()).match(/^([a-züv:]+)([0-5])$/i);
  if (!match) return raw;
  const syllable = match[1].replace(/u:|v/g, 'ü');
  const tone = Number(match[2]);
  if (tone === 0 || tone === 5) return syllable;

  const vowels = [...syllable].map((char, index) => ({ char, index })).filter(({ char }) => 'aeiouü'.includes(char));
  if (!vowels.length) return syllable;

  let target = vowels.find(({ char }) => char === 'a') ?? vowels.find(({ char }) => char === 'e');
  if (!target && syllable.includes('ou')) target = vowels.find(({ char }) => char === 'o');
  if (!target) target = vowels.at(-1);
  if (!target) return syllable;

  const marked = toneMarks[target.char]?.[tone - 1];
  return marked ? `${syllable.slice(0, target.index)}${marked}${syllable.slice(target.index + 1)}` : syllable;
}

export function numberedPinyinToMarked(value: string): string {
  return normalizeUnicode(value).replace(/([a-züv:]+)([0-5])/gi, (syllable) => numberedSyllableToMarked(syllable));
}

export function stripPinyinTones(value: string): string {
  return normalizeUnicode(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/v|u:/g, 'ü').normalize('NFC');
}

export function pinyinTone(value: string): number {
  for (const char of normalizeUnicode(value).toLowerCase()) {
    const marked = markedToPlain.get(char);
    if (marked) return marked.tone;
  }
  const numeric = value.match(/[1-5]/);
  return numeric ? Number(numeric[0]) : 5;
}

export function normalizePinyinForComparison(value: string): string {
  return numberedPinyinToMarked(normalizeUnicode(value).toLowerCase()).replace(/[\s\-'’ʼ]+/gu, '');
}

export function comparePinyin(given: string, expected: string, requireTone = true): boolean {
  const left = normalizePinyinForComparison(given);
  const right = normalizePinyinForComparison(expected);
  return requireTone ? left === right : stripPinyinTones(left) === stripPinyinTones(right);
}

export function normalizeAnswer(value: string): string {
  return normalizeUnicode(value).toLowerCase().replace(/[。！？?!,，]/g, '').replace(/\s+/g, '');
}

export function compareExerciseAnswer(type: string, given: string, expected: string): boolean {
  const expectsPinyin = type === 'pinyin' && /[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(expected);
  return expectsPinyin ? comparePinyin(given, expected, true) : normalizeAnswer(given) === normalizeAnswer(expected);
}
