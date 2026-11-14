import directions from '@/data/directions-language.json';
import excerpts from '@/data/reto-mixto-token-excerpts.json';
import type { RetoMixtoEntry } from '@/data/reto-mixto';
import { dialoguePinyinByCharacter } from './dialogue-pinyin';
import { audioForMandarinText } from './mandarin-audio';
import { normalizePinyinForComparison } from './pinyin';
import { isSilentRetoMixtoToken } from './reto-mixto';

const tokenExcerpts: Record<string, { src: string; pinyin: string }> = excerpts;
const directionWords: Record<string, { audioSrc: string; pinyin: string }> = directions.entries;

// These existing game recordings have no pinyin field in their source manifest.
const gamePhraseReadings: Record<string, string> = {
  一个: 'yíge', 生日蛋糕: 'shēngrì dàngāo', 你哥哥: 'nǐ gēge', 我的生日: 'wǒ de shēngrì',
  二十三号: 'èrshísān hào', 三十一号: 'sānshíyī hào', 一九八五年: 'yī jiǔ bā wǔ nián',
  好吗: 'hǎo ma', 八点: 'bā diǎn',
};

// Each sequence covers the whole tile and preserves names, numbers and words
// with an available recording. Never play a partly resolved sequence.
const recordedParts: Record<string, readonly string[]> = {
  汉西英: ['汉', '西', '英'],
  几号: ['几', '号'],
  二〇二〇年: ['二', '〇', '二', '〇', '年'],
  二十五日: ['二十五', '日'],
  八点二十五: ['八点', '二十五'],
  五号: ['五', '号'],
  我妹妹: ['我', '妹妹'],
  你的生日: ['你', '的', '生日'],
  几月: ['几', '月'],
  旁边: ['旁', '边'],
  办公楼: ['办', '公', '楼'],
  里边: ['里', '边'],
  对吗: ['对', '吗'],
};

function recording(text: string, pinyin: string) {
  const reading = normalizePinyinForComparison(pinyin);
  const excerpt = tokenExcerpts[text];
  if (excerpt && normalizePinyinForComparison(excerpt.pinyin) === reading) return excerpt.src;
  const word = directionWords[text];
  if (word && normalizePinyinForComparison(word.pinyin) === reading) return word.audioSrc;
  const recorded = audioForMandarinText(text.replaceAll('〇', '零'), reading);
  if (recorded) return recorded;
  const gameReading = gamePhraseReadings[text];
  if (gameReading && normalizePinyinForComparison(gameReading) === reading) return audioForMandarinText(text);
}

function spokenPinyin(text: string, readings: (string | undefined)[]) {
  // The alignment assigns one erhua syllable to both glyphs of, e.g., 哪儿.
  const glyphs = Array.from(text);
  return readings.filter((reading, i) => glyphs[i] !== '儿' || reading !== readings[i - 1]).join('');
}

export function retoMixtoTokenAudio(entry: Pick<RetoMixtoEntry, 'tokens' | 'pinyin'>, index: number): readonly string[] {
  const tokens = entry.tokens;
  const token = tokens?.[index];
  if (!tokens || !token || isSilentRetoMixtoToken(token)) return [];
  const readings = dialoguePinyinByCharacter(tokens.join(''), entry.pinyin);
  const start = Array.from(tokens.slice(0, index).join('')).length;
  const tokenReadings = readings.slice(start, start + Array.from(token).length);
  if (tokenReadings.some(reading => !reading)) return [];
  const clip = recording(token, spokenPinyin(token, tokenReadings));
  if (clip) return [clip];

  const sources: string[] = [];
  let offset = 0;
  for (const part of recordedParts[token] ?? []) {
    const end = offset + Array.from(part).length;
    const source = recording(part, spokenPinyin(part, tokenReadings.slice(offset, end)));
    if (!source) return [];
    sources.push(source);
    offset = end;
  }
  return sources;
}
