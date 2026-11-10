import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';
import manifest from '@/data/hide-and-seek-audio.json';
import { hideTextAudio, hideLocationAudio, hideRoundAudio, hideQuestion, hideQuestionAudio, hideFeedback, hideFeedbackAudio } from '@/lib/hide-and-seek-audio';
import { hideClue, hideLevels, locations, positions } from '@/lib/hide-and-seek';

describe('Escondites: pronunciación y ayudas', () => {
  it('tiene grabaciones MP3 reales para todos los textos chinos de la interfaz', () => {
    expect(manifest.clips).toHaveLength(29);
    expect(new Set(manifest.clips.map(clip => clip.input)).size).toBe(manifest.clips.length);
    for (const clip of manifest.clips) {
      expect(statSync(`public/audio/hide-and-seek/${clip.file}`).size).toBeGreaterThan(1024);
      expect(hideTextAudio(clip.input)).toBe(`/audio/hide-and-seek/${clip.file}`);
      expect(clip.expectedPinyin).toMatch(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/);
    }
    for (const text of ['它在哪儿？', '桌子', '在', '不在']) expect(hideTextAudio(text)).toMatch(/\.mp3$/);
  });
  it('nombra al animal de cada nivel al preguntar, con su propia grabación', () => {
    const names = ['兔子', '狗', '猫', '乌龟'];
    hideLevels.forEach((level, index) => {
      const round = { level: index, target: 'above' as const, excluded: null, options: [] };
      const question = hideQuestion(round);
      expect(question.hanzi).toBe(`${names[index]}在哪儿？`);
      expect(question.spanish).toBe(`¿Dónde está ${level.animal === 'turtle' ? 'la' : 'el'} ${level.name}?`);
      expect(hideQuestionAudio(round)).toBe(hideTextAudio(question.hanzi));
      expect(question.hanzi).not.toContain('它');
    });
  });
  it('distingue acierto, error con otro intento y error final en la voz', () => {
    expect(hideFeedback(true).hanzi).toBe('答对了！');
    expect(hideFeedback(false, true).hanzi).toBe('答错了，再试试！');
    expect(hideFeedback(false).hanzi).toBe('答错了。');
    for (const [correct, retry] of [[true, false], [true, true], [false, true], [false, false]]) {
      expect(hideFeedbackAudio(correct, retry)).toBe(hideTextAudio(hideFeedback(correct, retry).hanzi));
    }
    expect(new Set([hideFeedbackAudio(true), hideFeedbackAudio(false, true), hideFeedbackAudio(false)]).size).toBe(3);
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
