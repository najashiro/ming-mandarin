import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';
import manifest from '@/data/hide-and-seek-audio.json';
import { hideTextAudio, hideLocationAudio, hideRoundAudio } from '@/lib/hide-and-seek-audio';
import { hideClue, locations, positions } from '@/lib/hide-and-seek';

describe('Escondites: pronunciación y ayudas', () => {
  it('tiene grabaciones MP3 reales para todos los textos chinos de la interfaz', () => {
    expect(manifest.clips).toHaveLength(22);
    expect(new Set(manifest.clips.map(clip => clip.input)).size).toBe(22);
    for (const clip of manifest.clips) {
      expect(statSync(`public/audio/hide-and-seek/${clip.file}`).size).toBeGreaterThan(1024);
      expect(hideTextAudio(clip.input)).toBe(`/audio/hide-and-seek/${clip.file}`);
      expect(clip.expectedPinyin).toMatch(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/);
    }
    for (const text of ['它在哪儿？', '桌子', '在', '不在']) expect(hideTextAudio(text)).toMatch(/\.mp3$/);
  });
  it('reproduce cada pista completa y ambas frases del nivel final en el orden mostrado', () => {
    for (const target of positions) {
      expect(hideLocationAudio(target)).toBe(hideTextAudio(locations[target].hanzi));
      const positive = hideTextAudio(`它在桌子${locations[target].hanzi}。`);
      expect(hideRoundAudio({ level: 0, target, excluded: null, options: [target] })).toEqual([positive]);
      for (const excluded of positions.filter(spot => spot !== target)) {
        const round = { level: 3, target, excluded, options: [target, excluded] };
        expect(hideRoundAudio(round)).toEqual([hideTextAudio(`它不在桌子${locations[excluded].hanzi}。`), positive]);
        expect(hideClue(round).spanish).toBe(`No está ${locations[excluded].meaning}. Está ${locations[target].meaning}.`);
      }
    }
  });
});
