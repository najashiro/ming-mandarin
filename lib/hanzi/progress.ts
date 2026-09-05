import type { CharacterEntry, HanziStageId } from '@/data/types';
import type { HanziLearningState, HanziLocalProgress, HanziProgressEntry, HanziProgressMap, HanziSkillDimension } from './types';

export const HANZI_MASTERY_THRESHOLD = 80;
const WEAK_DIMENSION_THRESHOLD = 50;
const LOW_STABILITY_THRESHOLD = 1;
const dimensions: HanziSkillDimension[] = ['recognition', 'stroke_order', 'writing'];

export type LocalHanziProgressMap = Record<string, HanziLocalProgress>;

function localEntries(characterId: string, local: LocalHanziProgressMap) {
  return dimensions.map((dimension) => local[`${characterId}:${dimension}`]).filter(Boolean);
}

export function hasHanziEvidence(characterId: string, progress?: HanziProgressEntry, local: LocalHanziProgressMap = {}) {
  return Object.values(progress?.dimensions ?? {}).some((item) => (item?.exposures ?? 0) > 0)
    || localEntries(characterId, local).some((item) => item.attempts > 0 || (item.studyExposures ?? 0) > 0);
}

export function classifyHanziLearningState(
  characterId: string,
  progress?: HanziProgressEntry,
  local: LocalHanziProgressMap = {},
  now = new Date(),
): HanziLearningState {
  const values = dimensions.map((dimension) => progress?.dimensions[dimension]);
  const localValues = localEntries(characterId, local);
  const hasEvidence = hasHanziEvidence(characterId, progress, local);
  if (!hasEvidence && !progress?.openErrors) return 'new';

  if (values.every((item) => item && item.mastery >= HANZI_MASTERY_THRESHOLD)) return 'mastered';

  const due = values.some((item) => item?.nextReviewAt && new Date(item.nextReviewAt) <= now);
  const weakWriting = (['stroke_order', 'writing'] as const).some((dimension) => {
    const item = progress?.dimensions[dimension];
    return item && item.exposures > 0 && item.mastery < WEAK_DIMENSION_THRESHOLD;
  });
  const unstable = values.some((item) => item && item.exposures > 0 && item.nextReviewAt && item.stability < LOW_STABILITY_THRESHOLD);
  if ((progress?.openErrors ?? 0) > 0 || due || weakWriting || unstable || localValues.some((item) => item.mistakes > 0)) return 'review';
  return 'learning';
}

export function hanziMasteryAverage(progress?: HanziProgressEntry) {
  const values = dimensions.map((dimension) => progress?.dimensions[dimension]?.mastery).filter((value): value is number => typeof value === 'number');
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function summarizeHanziStages(characters: CharacterEntry[], progress: HanziProgressMap, local: LocalHanziProgressMap = {}) {
  return [1, 2, 3, 4, 5, 6].map((stage) => {
    const members = characters.filter((character) => character.primaryStage === stage);
    return {
      stage: stage as HanziStageId,
      total: members.length,
      studied: members.filter((character) => hasHanziEvidence(character.id, progress[character.id], local)).length,
      mastered: members.filter((character) => classifyHanziLearningState(character.id, progress[character.id], local) === 'mastered').length,
    };
  });
}

export function recommendHanziCharacters(characters: CharacterEntry[], progress: HanziProgressMap, limit = 5, now = new Date()) {
  const states = new Map(characters.map((character) => [character.id, classifyHanziLearningState(character.id, progress[character.id], {}, now)]));
  const currentStage = ([1, 2, 3, 4, 5, 6] as HanziStageId[]).find((stage) => characters
    .filter((character) => character.primaryStage === stage)
    .some((character) => states.get(character.id) !== 'mastered')) ?? 6;
  const rank = (character: CharacterEntry) => {
    const state = states.get(character.id);
    const entry = progress[character.id];
    if (state === 'review') return (entry?.openErrors ? 0 : 1) + hanziMasteryAverage(entry) / 1000;
    if (state === 'learning' && character.primaryStage === currentStage) return 10 + hanziMasteryAverage(entry) / 1000;
    if (state === 'new' && character.primaryStage === currentStage) return 20;
    if (state === 'new') return 30 + (character.primaryStage ?? 6);
    if (state === 'learning') return 40 + (character.primaryStage ?? 6);
    return 50 + hanziMasteryAverage(entry) / 1000;
  };
  return [...characters].sort((left, right) => rank(left) - rank(right)).slice(0, limit);
}
