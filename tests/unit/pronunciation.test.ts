import { describe, expect, it } from 'vitest';
import pronunciation from '@/data/pronunciation.json';

describe('pronunciación grabada', () => {
  const clipIds = new Set(pronunciation.clips.map((clip) => clip.id));

  it('usa nombres únicos y archivos MP3 locales', () => {
    expect(clipIds.size).toBe(pronunciation.clips.length);
    expect(new Set(pronunciation.clips.map((clip) => clip.file)).size).toBe(pronunciation.clips.length);
    for (const clip of pronunciation.clips) {
      expect(clip.file).toMatch(/^[a-z0-9-]+\.mp3$/);
      expect(clip.input).toMatch(/[\u3400-\u9fff]/);
      expect(clip.expectedPinyin).toMatch(/[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/);
    }
  });

  it('conecta cada ejemplo visual con un clip conocido', () => {
    const references = [
      ...pronunciation.converterExamples.map((item) => item.clipId),
      ...pronunciation.tones.map((item) => item.clipId),
      ...pronunciation.initials.map((item) => item.clipId)
    ];
    for (const reference of references) expect(clipIds.has(reference)).toBe(true);
  });
});
