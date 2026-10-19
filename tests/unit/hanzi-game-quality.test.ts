import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HiddenAudioButton } from '@/components/games/hanzi-lab/HiddenAudioButton';
import { HanziWriterStage } from '@/components/hanzi/HanziWriterStage';
import { gameWritingAttempt, hanziRecognitionChoices, meaningWithoutHanzi, writingHintShown } from '@/lib/games-hanzi-practice';
import { isSuccessfulHanziAttempt } from '@/lib/hanzi/mastery';
import { comparePinyin } from '@/lib/pinyin';

const target = { hanzi: '家', pinyin: 'jiā', meaning: 'familia; hogar', radical: '宀' };
const pool = [target,
  { hanzi: '加', pinyin: 'jiā', meaning: 'añadir', radical: '力' },
  { hanzi: '庭', pinyin: 'tíng', meaning: 'hogar', radical: '广' },
  { hanzi: '我', pinyin: 'wǒ', meaning: 'yo', radical: '戈' },
  { hanzi: '你', pinyin: 'nǐ', meaning: 'tú', radical: '亻' },
  { hanzi: '他', pinyin: 'tā', meaning: 'él', radical: '亻' },
  { hanzi: '好', pinyin: 'hǎo', meaning: 'bueno', radical: '女' },
  { hanzi: '人', pinyin: 'rén', meaning: 'persona', radical: '人' },
];

describe('calidad de la práctica Hanzi', () => {
  it('no ofrece homófonos auditivos ni significados equivalentes como distractores', () => {
    const audio = hanziRecognitionChoices(target, pool, 'Audio', () => 0);
    expect(audio).toContain('家');
    expect(audio).not.toContain('加');
    const semantic = hanziRecognitionChoices(target, pool, 'Significado', () => 0.99);
    expect(semantic).not.toContain('庭');
    expect(new Set(audio).size).toBe(audio.length);
    expect(audio).toHaveLength(4);
  });

  it('muestrea todo el corpus y mezcla la posición de la solución', () => {
    const left = hanziRecognitionChoices(target, pool, 'Audio', () => 0);
    const right = hanziRecognitionChoices(target, pool, 'Audio', () => 0.99);
    expect(new Set(left)).not.toEqual(new Set(right));
    expect(left.indexOf('家')).not.toBe(right.indexOf('家'));
    const radicals = hanziRecognitionChoices(target, pool, 'Radical', () => 0.2);
    expect(new Set(radicals).size).toBe(radicals.length);
  });

  it('el contexto español no descubre el Hanzi dentro de ejemplos', () => {
    expect(meaningWithoutHanzi('sílaba neutra en 什么 / 怎么')).toBe('sílaba neutra');
    expect(meaningWithoutHanzi('mayor; en 老师')).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it('el audio oculto tiene etiquetas neutrales y el motor mantiene su default', () => {
    const audio = renderToStaticMarkup(createElement(HiddenAudioButton, { src: '/audio/test.mp3', label: 'Escuchar carácter oculto' }));
    expect(audio).toContain('title="Escuchar carácter oculto"');
    expect(audio).toContain('aria-label="Escuchar carácter oculto"');
    const hidden = renderToStaticMarkup(createElement(HanziWriterStage, { character: '家', ariaLabel: 'Área para escribir el carácter' }));
    expect(hidden).not.toContain('家');
    const standard = renderToStaticMarkup(createElement(HanziWriterStage, { character: '家' }));
    expect(standard).toContain('Área de escritura para 家');
  });

  it('conserva duración y ayudas, y evalúa escritura con la regla de progreso existente', () => {
    const summary = { correctStrokes: 10, mistakes: 2, durationMs: 3210 };
    const guided = gameWritingAttempt('c-家', 'guided', summary, 1);
    expect(guided).toMatchObject({ durationMs: 3210, hintsUsed: 1, mode: 'guided', skillDimension: 'writing' });
    expect(isSuccessfulHanziAttempt(guided)).toBe(true);
    expect(isSuccessfulHanziAttempt(gameWritingAttempt('c-家', 'independent', summary, 0))).toBe(false);
    expect(isSuccessfulHanziAttempt(gameWritingAttempt('c-家', 'independent', { ...summary, mistakes: 1 }, 0))).toBe(true);
    expect(writingHintShown('guided', 1)).toBe(false);
    expect(writingHintShown('guided', 2)).toBe(true);
    expect(writingHintShown('independent', 3)).toBe(false);
    expect(writingHintShown('independent', 4)).toBe(true);
    expect(writingHintShown('exam', 8)).toBe(false);
  });

  it('acepta tonos numéricos y rechaza un tono diferente en el dictado', () => {
    expect(comparePinyin('JIA1', 'jiā')).toBe(true);
    expect(comparePinyin('ni3 hao3', 'nǐ hǎo')).toBe(true);
    expect(comparePinyin('jia2', 'jiā')).toBe(false);
  });
});
