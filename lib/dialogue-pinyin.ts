import { normalizePinyin, stripPinyinTones } from '@/lib/pinyin';

const hanzi = /^\p{Script=Han}$/u;
// Pinyin separates an onsetless a/o/e with an apostrophe. Inside a word, n, ng
// and the erhua suffix r end the syllable unless the next vowel needs that onset.
const syllablePattern = /(?:[zcs]h|[bpmfdtnlgkhjqxrzcswy])?[aeiou]+(?:ng(?![aeiou])|n(?![aeiou]))?(?:r(?![aeiou]))?/gy;
const numeral = /^(?:ling|yi|er|liang|san|si|wu|liu|qi|ba|jiu|shi|bai|qian|wan)+$/u;

function splitWord(word: string): string[] {
  if (/^\d+$/u.test(word)) return [word];
  const plain = stripPinyinTones(word);
  const parts = Array.from(plain.matchAll(syllablePattern));
  if (parts.map(part => part[0]).join('') !== plain) return [];
  // Take the spelling, case and tones from the published line.
  return parts.map(part => word.slice(part.index, part.index + part[0].length));
}

/** One contextual reading per code point, with the shared syllable on both glyphs of erhua. */
export function dialoguePinyinByCharacter(text: string, pinyin: string): (string | undefined)[] {
  const glyphs = Array.from(text);
  const empty = glyphs.map(() => undefined);
  const readings: (string | undefined)[] = [...empty];
  // Splitting at spaces, apostrophes and punctuation preserves explicit boundaries like nǚ’ér.
  const words = (normalizePinyin(pinyin).match(/\p{Script=Latin}+|\d+/gu) ?? []).map(splitWord);
  if (words.some(word => !word.length)) return empty;
  let word = 0;
  let syllable = 0;
  for (let index = 0; index < glyphs.length; index++) {
    const glyph = glyphs[index];
    if (/^\d$/u.test(glyph)) {
      let number = glyph;
      while (/^\d$/u.test(glyphs[index + 1] ?? '')) number += glyphs[++index];
      // An address such as 35号 has a whole spoken number (sānshíwǔ) before hào.
      const spoken = words[word]?.join('');
      if (syllable || !spoken || (spoken !== number && !numeral.test(stripPinyinTones(spoken)))) return empty;
      word++;
      continue;
    }
    if (!hanzi.test(glyph)) continue;
    const reading = words[word]?.[syllable];
    if (!reading || /^\d/u.test(reading)) return empty;
    readings[index] = reading;
    const plain = stripPinyinTones(reading);
    if (plain.endsWith('r') && plain !== 'er') {
      if (glyphs[index + 1] !== '儿') return empty;
      readings[++index] = reading;
    }
    if (++syllable === words[word].length) {
      word++;
      syllable = 0;
    }
  }
  return word === words.length ? readings : empty;
}
