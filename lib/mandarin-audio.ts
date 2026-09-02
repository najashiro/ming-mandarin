import manifest from '@/data/mandarin-audio.json';

const normalizeMandarin = (value: string) => value.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
const clipsByText = new Map(manifest.clips.map((clip) => [normalizeMandarin(clip.input), clip]));

export function audioForMandarinText(text: string): string | undefined {
  const clip = clipsByText.get(normalizeMandarin(text));
  return clip ? `/audio/mandarin/${clip.file}` : undefined;
}

export function hasMandarinAudio(text: string): boolean {
  return clipsByText.has(normalizeMandarin(text));
}

export { normalizeMandarin };
