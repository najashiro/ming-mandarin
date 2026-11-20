import priorities from '@/data/vocabulary-mix-priorities.json' with { type: 'json' };
import type { CurriculumScope } from '@/data/types';

export type MixGroup = 'core' | 'consolidation' | 'extension';
export type VocabularyMixPriority = { group: MixGroup; score: number };

const scopes = priorities.scopes as Record<CurriculumScope, Record<string, VocabularyMixPriority>>;

/** Shared corpus policy only. Personal progress never participates in ranking. */
export function getVocabularyMixPriority(wordId: string, scope: CurriculumScope): VocabularyMixPriority {
  // Unknown additions stay in consolidation until the generated table is updated;
  // absence of corpus evidence must never silently mean "rare/difficult".
  return scopes[scope]?.[wordId] ?? { group: 'consolidation', score: 0 };
}
