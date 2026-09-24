import manifest from '@/data/mandarin-audio.json';
import pronunciation from '@/data/pronunciation.json';
import availableMandarin from '@/data/mandarin-audio-available.json';
import { timeTokens } from '@/data/time-game';
import { timeAudioFile } from './time-audio-key.mjs';

const normalizeMandarin = (value: string) => value.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
const clipsByText = new Map<string, string>();
const availableFiles = new Set(availableMandarin.files);

for (const clip of pronunciation.clips) {
  clipsByText.set(normalizeMandarin(clip.input), `/audio/pinyin/${clip.file}`);
}

for (const clip of manifest.clips) {
  if (availableFiles.has(clip.file)) clipsByText.set(normalizeMandarin(clip.input), `/audio/mandarin/${clip.file}`);
}

export function audioForMandarinText(text: string): string | undefined {
  const clean=normalizeMandarin(text);
  const recorded=clipsByText.get(clean);
  if(recorded)return recorded;
  if(clean==='现在几点')return `/audio/mandarin/${timeAudioFile('现在几点？','q')}`;
  if(text.startsWith('现在')&&text.length>2)return `/audio/mandarin/${timeAudioFile(text,'s')}`;
  if(timeTokens.some(token=>token.hanzi===text))return `/audio/mandarin/${timeAudioFile(text,'t')}`;
  return undefined;
}

export function hasMandarinAudio(text: string): boolean {
  return Boolean(audioForMandarinText(text));
}

export { normalizeMandarin };
