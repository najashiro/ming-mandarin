import manifest from '@/data/mandarin-audio.json';
import pronunciation from '@/data/pronunciation.json';

const normalizeMandarin = (value: string) => value.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
const clipsByText = new Map<string, string>();

for (const clip of pronunciation.clips) {
  clipsByText.set(normalizeMandarin(clip.input), `/audio/pinyin/${clip.file}`);
}

for (const clip of manifest.clips) {
  clipsByText.set(normalizeMandarin(clip.input), `/audio/mandarin/${clip.file}`);
}

export function audioForMandarinText(text: string): string | undefined {
  return clipsByText.get(normalizeMandarin(text));
}

export function hasMandarinAudio(text: string): boolean {
  return clipsByText.has(normalizeMandarin(text));
}

export { normalizeMandarin };
