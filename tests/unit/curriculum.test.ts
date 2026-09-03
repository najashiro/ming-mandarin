import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import manifest from '@/data/mandarin-audio.json';
import pronunciation from '@/data/pronunciation.json';
import hanziManifest from '@/public/hanzi-data/manifest.json';
import { curriculumScopes, getCurriculum } from '@/seed/curriculum';
import { examQuestionsForScope } from '@/seed/exam';

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
});
