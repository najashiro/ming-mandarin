export type HanziCharacterData = {
  strokes: string[];
  medians: Array<Array<[number, number]>>;
  radStrokes?: number[];
};

export type HanziManifestEntry = {
  available: boolean;
  strokeCount: number;
};

export type HanziPracticeMode = 'guided' | 'independent' | 'exam';
export type HanziSkillDimension = 'recognition' | 'stroke_order' | 'writing';

export type HanziAttemptPayload = {
  characterId: string;
  mode: HanziPracticeMode;
  skillDimension: HanziSkillDimension;
  completed: boolean;
  correctStrokes: number;
  mistakes: number;
  hintsUsed: number;
  durationMs: number;
  usedAnswer: boolean;
};

export type HanziLocalProgress = {
  attempts: number;
  completed: number;
  mistakes: number;
  lastPracticedAt: string;
};
