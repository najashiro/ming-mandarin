import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';
import manifest from '@/data/hide-and-seek-audio.json';
import language from '@/data/hide-and-seek-language.json';
import lesson5 from '@/data/lesson5-public.json';
import lessons123 from '@/data/lessons123-public.json';
import { hideTextAudio, hideLocationAudio, hideRoundAudio, hideQuestion, hideQuestionAudio, hideFeedback, hideFeedbackAudio, hideAnimal, hideAnimalAudio } from '@/lib/hide-and-seek-audio';
import { hideClue, hideLevels, locations, positions } from '@/lib/hide-and-seek';

describe('Escondites: pronunciación y ayudas', () => {
  it('tiene grabaciones MP3 reales para todos los textos chinos de la interfaz', () => {
    expect(manifest.clips).toHaveLength(27);
    expect(new Set(manifest.clips.map(clip => clip.input)).size).toBe(manifest.clips.length);
    for (const clip of manifest.clips) {
      expect(statSync(`public/audio/hide-and-seek/${clip.file}`).size).toBeGreaterThan(1024);
      expect(hideTextAudio(clip.input)).toBe(`/audio/hide-and-seek/${clip.file}`);
      expect(clip.expectedPinyin).toMatch(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/);
    }
    for (const text of ['它在哪儿？', '桌子', '在', '不在']) expect(hideTextAudio(text)).toMatch(/\.mp3$/);
  });
  it('nombra al animal de cada nivel al preguntar, con su propia grabación', () => {
    const names = ['兔', '狗', '猫', '老鼠'];
    hideLevels.forEach((level, index) => {
      const round = { level: index, target: 'above' as const, excluded: null, options: [] };
      const question = hideQuestion(round);
      expect(question.hanzi).toBe(`${names[index]}在哪儿？`);
      expect(question.spanish).toBe(`¿Dónde está el ${level.name}?`);
      expect(hideQuestionAudio(round)).toBe(hideTextAudio(question.hanzi));
      expect(question.hanzi).not.toContain('它');
    });
  });
  it('usa únicamente las respuestas del corpus para aciertos y errores', () => {
    expect(hideFeedback(true).hanzi).toBe('对！');
    expect(hideFeedback(false).hanzi).toBe('不对。');
    for (const correct of [true, false]) {
      expect(hideFeedbackAudio(correct)).toBe(hideTextAudio(hideFeedback(correct).hanzi));
    }
    expect(new Set([hideFeedbackAudio(true), hideFeedbackAudio(false)]).size).toBe(2);
    expect(hideFeedback(false).pinyin).toBe('Bú duì.');
    expect(statSync(`public${hideFeedbackAudio(true)}`).size).toBeGreaterThan(1024);
  });
  it('reutiliza la pronunciación aislada de animales ya presentes antes de L6', () => {
    for (const level of hideLevels) {
      const animal = hideAnimal(level.animal);
      const word = [...lesson5.vocabulary, ...lessons123.vocabulary].find(item => item.id === animal.vocabularyId);
      expect(word?.hanzi).toBe(animal.hanzi);
      expect(word?.pinyin).toBe(animal.pinyin);
      expect(animal.sourceLesson).toBeLessThan(6);
      expect(hideAnimalAudio(level.animal)).toBe(animal.audioSrc);
      expect(hideTextAudio(animal.hanzi)).toBe(animal.audioSrc);
      expect(statSync(`public${animal.audioSrc}`).size).toBeGreaterThan(1024);
    }
    expect(Object.values(language.animals).map(animal => animal.hanzi)).toEqual(['兔', '狗', '猫', '老鼠']);
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
