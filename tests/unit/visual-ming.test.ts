import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import { publicExamplesForVocabulary } from '@/lib/vocabulary-examples';

const modes = new Set(['literal_photo', 'action_scene', 'concept_scene', 'visual_grammar', 'phrase_context', 'none']);
const fields = ['ambiguity_risk', 'image_quiz_eligible', 'image_support', 'visual_mode'];
const word = (hanzi: string) => corpus.vocabulary.find((row) => row.id === `v-${hanzi}`)!;

describe('visual_ming classification contract, not image availability', () => {
  it('classifies every published entry with only four public fields', () => {
    expect(corpus.vocabulary.length).toBeGreaterThan(0);
    for (const row of corpus.vocabulary) {
      const visual = row.visual_ming;
      expect(Object.keys(visual).sort()).toEqual(fields);
      expect(modes.has(visual.visual_mode)).toBe(true);
      expect(typeof visual.image_support).toBe('boolean');
      expect(typeof visual.image_quiz_eligible).toBe('boolean');
      expect(['low', 'medium', 'high']).toContain(visual.ambiguity_risk);
      expect(row.pinyin).toBeTruthy();
      expect(row.spanish).toBeTruthy();
    }
  });

  it('does not equate visual support with an image-only quiz', () => {
    for (const row of corpus.vocabulary) {
      const visual = row.visual_ming;
      if (['none', 'phrase_context', 'visual_grammar'].includes(visual.visual_mode)) {
        expect(visual.image_quiz_eligible).toBe(false);
      }
      if (visual.visual_mode === 'none') expect(visual.image_support).toBe(false);
      if (visual.image_quiz_eligible) {
        expect(visual.image_support).toBe(true);
        expect(visual.ambiguity_risk).not.toBe('high');
      }
    }
  });

  it('keeps literal objects distinct from conceptual pronouns', () => {
    for (const hanzi of ['猫', '狗', '米饭', '咖啡']) {
      expect(word(hanzi).visual_ming.visual_mode).toBe('literal_photo');
      expect(word(hanzi).visual_ming.image_quiz_eligible).toBe(true);
    }
    for (const hanzi of ['我', '你']) {
      expect(word(hanzi).visual_ming.visual_mode).toBe('concept_scene');
      expect(word(hanzi).visual_ming.ambiguity_risk).toBe('medium');
    }
    for (const hanzi of ['吃', '喝']) expect(word(hanzi).visual_ming.visual_mode).toBe('action_scene');
  });

  it('uses grammar/context for classifiers and intensifiers', () => {
    for (const hanzi of ['和', '只', '口', '张', '个', '本']) {
      expect(word(hanzi).visual_ming.visual_mode).toBe('visual_grammar');
      expect(word(hanzi).visual_ming.image_quiz_eligible).toBe(false);
    }
    for (const hanzi of ['真', '很', '太', '都', '也']) expect(word(hanzi).visual_ming.visual_mode).toBe('phrase_context');
    for (const hanzi of ['的', '吗', '呢', '了', '不']) expect(word(hanzi).visual_ming.visual_mode).toBe('none');
  });

  it('retains words without their own image in the catalog', () => {
    expect(word('吗').spanish).toBeTruthy();
    expect(word('马大为').visual_ming.visual_mode).toBe('none');
    expect(word('约翰').visual_ming.image_quiz_eligible).toBe(false);
    expect(word('汉语').visual_ming.visual_mode).toBe('phrase_context');
  });

  it('preserves global examples and curricular relationships', () => {
    expect(publicExamplesForVocabulary('v-猫').map((row) => row.hanzi)).toEqual([
      '一只猫', '你有小猫吗？', '我有两只小猫，他们很可爱。',
    ]);
    expect(word('中国').curriculumLinks.some((link) => link.lesson === 2 && link.list_type === 'supplementary_vocabulary')).toBe(true);
    expect(word('中国').curriculumLinks.some((link) => link.lesson === 3 && link.list_type === 'new_vocabulary')).toBe(true);
  });

  it('never exposes editorial rationale, generation prompts or ready-image claims', () => {
    const serialized = JSON.stringify(corpus.vocabulary.map((row) => row.visual_ming));
    expect(serialized).not.toMatch(/notes|review_status|method|source_id|prompt|asset|approved|width|height|layout/);
    expect(new Set(corpus.vocabulary.map((row) => row.id)).size).toBe(corpus.vocabulary.length);
  });
});
