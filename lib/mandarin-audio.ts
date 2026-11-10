import lesson5Audio from '@/data/lesson5-audio.json';
import lesson5Available from '@/data/lesson5-audio-available.json';
import lesson4Audio from '@/data/lesson4-audio.json';
import lesson4Available from '@/data/lesson4-audio-available.json';
import lesson4LanguageAliases from '@/data/lesson4-audio-aliases.json';
import manifest from '@/data/mandarin-audio.json';
import pronunciation from '@/data/pronunciation.json';
import availableMandarin from '@/data/mandarin-audio-available.json';
import gameAudio from '@/data/game-audio.json';
import gameAudioAvailable from '@/data/game-audio-available.json';
import hanziAudio from '@/data/hanzi-audio.json';
import hanziAudioAvailable from '@/data/hanzi-audio-available.json';
import { timeTokens } from '@/data/time-game';
import { timeAudioFile } from './time-audio-key.mjs';

const normalizeMandarin = (value: string) => value.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
const clipsByText = new Map<string, string>();
const lesson4ByText = new Map<string, string>();
const clipsByReading = new Map<string, string>();
// Older PDF transcriptions used breve for third tone, IPA ɡ for Latin g,
// and Greek ὺ for ù. These are spelling repairs, not pronunciation aliases:
// preserve every tone, neutral syllable, vowel and final consonant.
const normalizeRecordedPinyin = (value: string) => value.normalize('NFC').toLowerCase()
  .replace(/ɡ/g, 'g').replace(/ὺ/g, 'ù')
  .normalize('NFD').replace(/([aeiou])\u0306/g, '$1\u030c').normalize('NFC')
  .replace(/[\s'’ʼ.,!?]/g, '');
const readingKey = (text: string, pinyin: string) => `${normalizeMandarin(text)}:${normalizeRecordedPinyin(pinyin)}`;
const availableFiles = new Set(availableMandarin.files);

for (const clip of pronunciation.clips) {
  clipsByText.set(normalizeMandarin(clip.input), `/audio/pinyin/${clip.file}`);
  clipsByReading.set(readingKey(clip.input, clip.expectedPinyin), `/audio/pinyin/${clip.file}`);
}

for (const clip of manifest.clips) {
  if (availableFiles.has(clip.file)) {
    clipsByText.set(normalizeMandarin(clip.input), `/audio/mandarin/${clip.file}`);
    clipsByReading.set(readingKey(clip.input, clip.expectedPinyin), `/audio/mandarin/${clip.file}`);
  }
}

for (const clip of lesson4Audio.clips) {
  if (!(lesson4Available.files as string[]).includes(clip.file)) continue;
  const src = `/audio/mandarin/${clip.file}`;
  // Keep established generic readings. Explicit readings disambiguate L4.
  lesson4ByText.set(normalizeMandarin(clip.input), src);
  if (clip.expectedPinyin && !clipsByReading.has(readingKey(clip.input, clip.expectedPinyin))) clipsByReading.set(readingKey(clip.input, clip.expectedPinyin), src);
}

// Existing recordings retain aliases for newly completed passage pinyin and
// reviewed orthographic corrections. Never relax polyphonic word lookup.
for (const alias of lesson4LanguageAliases.aliases) {
  const clip = lesson4Audio.clips.find(candidate => candidate.id === alias.clipId);
  if (!clip || !(lesson4Available.files as string[]).includes(clip.file)) continue;
  const exactText = normalizeMandarin(clip.input) === normalizeMandarin(alias.hanzi);
  const reviewedPronounCorrection = alias.mode === 'reviewed_passage_pronoun_correction'
    && alias.sourceInput === clip.input && alias.sourcePinyin === clip.expectedPinyin
    && normalizeRecordedPinyin(alias.pinyin) === normalizeRecordedPinyin(clip.expectedPinyin)
    && normalizeMandarin(clip.input).replace(/他/g, '她') === normalizeMandarin(alias.hanzi).replace(/他/g, '她');
  if (!exactText && !reviewedPronounCorrection) continue;
  clipsByReading.set(readingKey(alias.hanzi, alias.pinyin), `/audio/mandarin/${clip.file}`);
}

for (const clip of lesson5Audio.clips) {
  if (!(lesson5Available.files as string[]).includes(clip.file)) continue;
  const src = `/audio/mandarin/${clip.file}`;
  lesson4ByText.set(normalizeMandarin(clip.input), src);
  if (clip.expectedPinyin) clipsByReading.set(readingKey(clip.input, clip.expectedPinyin), src);
}

for (const clip of gameAudio.clips) {
  if (!(gameAudioAvailable.files as string[]).includes(clip.file)) continue;
  const src = `/audio/mandarin/${clip.file}`;
  // Add only verified missing game clips; retain existing pronunciation choices.
  if (!clipsByText.has(normalizeMandarin(clip.input)) && !lesson4ByText.has(normalizeMandarin(clip.input))) {
    clipsByText.set(normalizeMandarin(clip.input), src);
  }
  if (clip.expectedPinyin && !clipsByReading.has(readingKey(clip.input, clip.expectedPinyin))) {
    clipsByReading.set(readingKey(clip.input, clip.expectedPinyin), src);
  }
}

// Isolated-character recordings are indexed by their exact documented reading.
// Never substitute a neutral syllable or a different reading of a homograph.
for (const clip of hanziAudio.clips) {
  if (!(hanziAudioAvailable.files as string[]).includes(clip.file)) continue;
  const src = `/audio/mandarin/${clip.file}`;
  if (!clipsByReading.has(readingKey(clip.input, clip.expectedPinyin))) clipsByReading.set(readingKey(clip.input, clip.expectedPinyin), src);
  if (!clipsByText.has(normalizeMandarin(clip.input)) && !lesson4ByText.has(normalizeMandarin(clip.input))) clipsByText.set(normalizeMandarin(clip.input), src);
}

export function audioForMandarinText(text: string, pinyin?: string): string | undefined {
  if (pinyin) return clipsByReading.get(readingKey(text, pinyin));
  const clean=normalizeMandarin(text);
  const recorded=clipsByText.get(clean);
  if(recorded)return recorded;
  if(clean==='现在几点')return `/audio/mandarin/${timeAudioFile('现在几点？','q')}`;
  if(text.startsWith('现在')&&text.length>2)return `/audio/mandarin/${timeAudioFile(text,'s')}`;
  if(timeTokens.some(token=>token.hanzi===text))return `/audio/mandarin/${timeAudioFile(text,'t')}`;
  return lesson4ByText.get(clean);
}

export function hasMandarinAudio(text: string): boolean {
  return Boolean(audioForMandarinText(text));
}

export { normalizeMandarin };
