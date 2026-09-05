import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import manifest from '@/data/mandarin-audio.json';
import pronunciation from '@/data/pronunciation.json';
import hanziManifest from '@/public/hanzi-data/manifest.json';
import { curriculumScopes, getCurriculum } from '@/seed/curriculum';
import { examQuestionsForScope } from '@/seed/exam';
import { normalizeAnswer } from '@/lib/pinyin';

const normalize = (value: string) => value.normalize('NFC').replace(/[^\u3400-\u9fff]/g, '');
const audioTexts = new Set([...pronunciation.clips, ...manifest.clips].map((clip) => normalize(clip.input)));

describe('arquitectura curricular L1–L3', () => {
  it('conserva el corpus histórico de L1 y separa cada alcance', () => {
    expect(getCurriculum('l1').vocabulary).toHaveLength(45);
    expect(getCurriculum('l1').characters).toHaveLength(52);
    expect(getCurriculum('l2').sentences.length).toBeGreaterThanOrEqual(12);
    expect(getCurriculum('l3').grammar.length).toBeGreaterThanOrEqual(7);
  });

  it.each(curriculumScopes)('%s no contiene IDs duplicados', (scope) => {
    const data = getCurriculum(scope);
    for (const items of [data.vocabulary, data.sentences, data.grammar, data.characters, data.exercises]) {
      expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    }
  });

  it.each(curriculumScopes)('%s genera 20 preguntas y 100 puntos', (scope) => {
    const questions = examQuestionsForScope('audit-seed', scope);
    expect(questions).toHaveLength(20);
    expect(questions.reduce((sum, item) => sum + item.points, 0)).toBe(100);
  });

  it('toda entrada reproducible tiene MP3 y cada Hanzi tiene trazos locales', () => {
    const data = getCurriculum('l1-l2-l3');
    const spoken = [...data.vocabulary.map((item) => item.hanzi), ...data.sentences.map((item) => item.hanzi), ...data.characters.map((item) => item.hanzi)];
    expect(spoken.filter((text) => !audioTexts.has(normalize(text)))).toEqual([]);
    expect(data.characters.filter((item) => !(item.hanzi in hanziManifest))).toEqual([]);
  });

  it('no contiene fallback curricular speechSynthesis', () => {
    expect(readFileSync('components/SpeakButton.tsx', 'utf8')).not.toContain('speechSynthesis');
  });

  it.each(['l1', 'l2', 'l3'] as const)('%s entrega todo el pinyin normalizado en NFC', (scope) => {
    const data = getCurriculum(scope);
    const values = [
      ...data.vocabulary.map((item) => item.pinyin),
      ...data.sentences.map((item) => item.pinyin),
      ...data.characters.map((item) => item.pinyin),
      ...data.characters.flatMap((item) => (item.words ?? []).map((word) => word.pinyin)),
    ];
    expect(values.every((value) => value === value.normalize('NFC'))).toBe(true);
    expect(values.some((value) => /[\u0300-\u036f]/u.test(value))).toBe(false);
  });

  it.each(['l1', 'l2', 'l3'] as const)('%s entrega significado canónico para cada microtarjeta Hanzi', (scope) => {
    const characters = getCurriculum(scope).characters;
    expect(characters.filter((character) => !character.meaning.trim())).toEqual([]);
  });

  it('conserva los significados curriculares de las microtarjetas L2', () => {
    const characters = getCurriculum('l2').characters;
    expect(characters.find((character) => character.hanzi === '早')?.meaning).toBe('temprano');
    expect(characters.find((character) => character.hanzi === '上')?.meaning).toBe('arriba; mañana');
    expect(characters.find((character) => character.hanzi === '朋')?.meaning).toBe('amigo (en 朋友)');
    expect(characters.find((character) => character.hanzi === '友')?.meaning).toBe('amigo');
  });

  it.each(curriculumScopes)('%s entrega bloques válidos y barajados para cada ejercicio order', (scope) => {
    const data = getCurriculum(scope);
    const sentences = new Map(data.sentences.map((item) => [item.id, item]));
    const orders = data.exercises.filter((exercise) => exercise.type === 'order');
    expect(orders.length).toBeGreaterThan(0);
    for (const exercise of orders) {
      const options = exercise.options ?? [];
      expect(options.length, exercise.id).toBeGreaterThanOrEqual(2);
      expect(options.every((option) => option.trim().length > 0), exercise.id).toBe(true);
      expect(normalizeAnswer(options.join('')), exercise.id).not.toBe(normalizeAnswer(exercise.answer));
      expect([...normalizeAnswer(options.join(''))].sort().join(''), exercise.id)
        .toBe([...normalizeAnswer(exercise.answer)].sort().join(''));

      const sourceSentence = sentences.get(exercise.itemId);
      if (sourceSentence) {
        expect([...options].sort(), exercise.id).toEqual([...sourceSentence.tokens].sort());
        expect(normalizeAnswer(sourceSentence.tokens.join('')), exercise.id).toBe(normalizeAnswer(exercise.answer));
      }
    }
  });

  it('segmenta y baraja pedagógicamente 陈老师，早上好！', () => {
    const data = getCurriculum('l2');
    const sentence = data.sentences.find((item) => item.id === 's-l2-morning');
    const exercise = data.exercises.find((item) => item.id === 'l2-sentence-1');
    expect(sentence?.tokens).toEqual(['陈老师', '早上好']);
    expect(exercise?.options).toEqual(['早上好', '陈老师']);
    expect(normalizeAnswer(sentence?.tokens.join('') ?? '')).toBe('陈老师早上好');
  });

  it('verifica señal PCM antes de transcribir sin inducir una respuesta', () => {
    const verifier = readFileSync('scripts/verify-pronunciation-audio.mjs', 'utf8');
    expect(verifier).toContain('minimumRms');
    expect(verifier).toContain('minimumPeak');
    expect(verifier).toContain('minimumActiveRatio');
    expect(verifier).toContain('SIN SEÑAL');
    expect(verifier).toContain('transcriptionEquivalents');
    expect(verifier).not.toContain("form.append('prompt'");
  });
});
