import { describe, expect, it } from 'vitest';
import priorities from '@/data/vocabulary-mix-priorities.json';
import { getVocabularyMixPriority } from '@/lib/vocabulary-priorities';
import { getVocabularyMixSet, vocabularyMixScopes } from '@/lib/vocabulary';

describe('shared corpus priorities', () => {
  it('classifies every eligible word exactly once in every supported scope', () => {
    for (const scope of vocabularyMixScopes) {
      const eligible = getVocabularyMixSet(scope).map(word => word.id).sort();
      const ranked = priorities.scopes[scope];
      expect(Object.keys(ranked).sort()).toEqual(eligible);
      for (const id of eligible) {
        const priority = getVocabularyMixPriority(id, scope);
        expect(['core', 'consolidation', 'extension']).toContain(priority.group);
        expect(Number.isFinite(priority.score)).toBe(true);
        expect(priority.score).toBeGreaterThanOrEqual(0);
      }
    }
    expect(getVocabularyMixSet('l1-l2-l3-l4-l5-l6')).toHaveLength(520);
  });

  it('ranks repeated central dialogue words above less supported vocabulary', () => {
    expect(getVocabularyMixPriority('v-你', 'l1').group).toBe('core');
    expect(getVocabularyMixPriority('v-生日', 'l5').group).toBe('core');
    expect(getVocabularyMixPriority('v-图书馆', 'l6').group).toBe('core');
  });

  it('keeps missing observations neutral and has a bounded deterministic policy', () => {
    expect(getVocabularyMixPriority('not-yet-ranked', 'l1')).toEqual({ group: 'consolidation', score: 0 });
    expect(priorities.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    for (const scope of vocabularyMixScopes) {
      const ranked = Object.values(priorities.scopes[scope]);
      expect(ranked.filter(value => value.group === 'core')).toHaveLength(Math.ceil(ranked.length * .35));
      expect(ranked.every(value => value.score <= 105)).toBe(true);
    }
  });
});
