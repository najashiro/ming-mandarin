import { PANDA_CHALLENGES, type PandaChallenge } from '@/data/panda-quest';

export type WorldId = 1 | 2 | 3 | 4;
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Position = { x: number; y: number };
export const QUEST_GATE_IDS = ['A', 'B', 'C', 'D'] as const;
export type GateId = (typeof QUEST_GATE_IDS)[number];
export const QUEST_STORAGE_KEY = 'ming-panda-quest-v1';

export type QuestWorld = {
  id: WorldId;
  name: string;
  subtitle: string;
  lessons: WorldId[];
  map: string[];
  gateIds: GateId[];
  gates: Partial<Record<GateId, string>>;
};

const gateLessons: Record<WorldId, WorldId[]> = {
  1: [1, 1, 1],
  2: [1, 2, 2],
  3: [1, 2, 3],
  4: [1, 2, 3, 4],
};

function chooseChallenges(worldId: WorldId, random: () => number) {
  const selected = new Set<string>();
  const challenges: Partial<Record<GateId, string>> = {};
  QUEST_GATE_IDS.slice(0, gateLessons[worldId].length).forEach((gate, index) => {
    const candidates = PANDA_CHALLENGES.filter(challenge =>
      challenge.lesson === gateLessons[worldId][index] && !selected.has(challenge.id));
    if (!candidates.length) throw new Error(`Faltan retos para el mundo ${worldId}`);
    const value = random();
    const safeRandom = Number.isFinite(value) ? Math.max(0, Math.min(value, 0.999999999)) : 0;
    const challenge = candidates[Math.floor(safeRandom * candidates.length)];
    selected.add(challenge.id);
    challenges[gate] = challenge.id;
  });
  return challenges;
}

// Each map is a tree: all its gates lie on the only route to the exit.
// Bamboo sits on optional branches, so exploration never blocks completion.
export const PANDA_WORLDS: QuestWorld[] = [
  {
    id: 1,
    name: 'Bosque de los saludos',
    subtitle: 'Saluda y encuentra la salida.',
    lessons: [1],
    gateIds: ['A', 'B', 'C'],
    map: [
      '###########',
      '#S......#b#',
      '#######A#.#',
      '#E#...#...#',
      '#.#.#.###.#',
      '#.#.#.B...#',
      '#.#C#######',
      '#........b#',
      '###########',
    ],
    gates: chooseChallenges(1, () => 0),
  },
  {
    id: 2,
    name: 'Valle de los encuentros',
    subtitle: 'Repasa los saludos y conoce a otros viajeros.',
    lessons: [1, 2],
    gateIds: ['A', 'B', 'C'],
    map: [
      '###########',
      '#S..#.B.#b#',
      '###.#.#.#.#',
      '#...#.#...#',
      '#.###.###.#',
      '#A....#C..#',
      '#######.###',
      '#E.......b#',
      '###########',
    ],
    gates: chooseChallenges(2, () => 0),
  },
  {
    id: 3,
    name: 'Templo de las presentaciones',
    subtitle: 'Usa todo lo aprendido para llegar al templo.',
    lessons: [1, 2, 3],
    gateIds: ['A', 'B', 'C'],
    map: [
      '###########',
      '#S#.....C.#',
      '#.#.#.###.#',
      '#.#.#...#.#',
      '#.#.###B#.#',
      '#.#..b#.#.#',
      '#.#####.#.#',
      '#.A.....#E#',
      '###########',
    ],
    gates: chooseChallenges(3, () => 0),
  },
  {
    id: 4,
    name: 'Cumbre de los viajeros',
    subtitle: 'Reúne las cuatro lecciones en una última aventura.',
    lessons: [1, 2, 3, 4],
    gateIds: ['A', 'B', 'C', 'D'],
    map: [
      '###########',
      '#S....#..D#',
      '#####.#.#.#',
      '#..b#A#.#.#',
      '#.###.#.#.#',
      '#.#...#C#.#',
      '#.#.###.#.#',
      '#..B....#E#',
      '###########',
    ],
    gates: chooseChallenges(4, () => 0),
  },
];
export const worlds = PANDA_WORLDS;

export type QuestState = {
  worldId: WorldId;
  position: Position;
  challengeIds: Partial<Record<GateId, string>>;
  clearedGates: GateId[];
  collected: string[];
  activeGate: GateId | null;
  feedback: { correct: boolean; optionId: string } | null;
  mistakes: number;
  steps: number;
  completed: boolean;
};

export function getQuestWorld(worldId: WorldId): QuestWorld {
  const world = PANDA_WORLDS.find(candidate => candidate.id === worldId);
  if (!world) throw new RangeError('Este mundo todavía no está disponible.');
  return world;
}

export function getQuestTile(worldId: WorldId, position: Position): string {
  return getQuestWorld(worldId).map[position.y]?.[position.x] ?? '#';
}

function findTile(worldId: WorldId, tile: string): Position {
  const map = getQuestWorld(worldId).map;
  const y = map.findIndex(row => row.includes(tile));
  if (y < 0) throw new Error(`Falta la casilla ${tile}`);
  return { x: map[y].indexOf(tile), y };
}

export function createQuest(worldId: WorldId, random: () => number = Math.random): QuestState {
  return {
    worldId,
    position: findTile(worldId, 'S'),
    challengeIds: chooseChallenges(worldId, random),
    clearedGates: [],
    collected: [],
    activeGate: null,
    feedback: null,
    mistakes: 0,
    steps: 0,
    completed: false,
  };
}

export function getActiveChallenge(state: QuestState): PandaChallenge | undefined {
  return state.activeGate
    ? PANDA_CHALLENGES.find(challenge => challenge.id === state.challengeIds[state.activeGate!])
    : undefined;
}

const vectors: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function isGate(tile: string): tile is GateId {
  return QUEST_GATE_IDS.some(gate => gate === tile);
}

export function moveQuest(state: QuestState, direction: Direction): QuestState {
  if (state.completed || state.activeGate) return state;
  const vector = vectors[direction];
  if (!vector) return state;
  const position = { x: state.position.x + vector.x, y: state.position.y + vector.y };
  const tile = getQuestTile(state.worldId, position);
  if (tile === '#') return state;
  if (isGate(tile) && !state.clearedGates.includes(tile)) {
    return { ...state, activeGate: tile, feedback: null };
  }
  if (tile === 'E' && !getQuestWorld(state.worldId).gateIds.every(gate => state.clearedGates.includes(gate))) return state;
  const key = `${position.x},${position.y}`;
  return {
    ...state,
    position,
    steps: state.steps + 1,
    completed: tile === 'E',
    collected: tile === 'b' && !state.collected.includes(key) ? [...state.collected, key] : state.collected,
  };
}

export function answerQuest(state: QuestState, optionId: string): QuestState {
  if (state.completed || state.feedback) return state;
  const challenge = getActiveChallenge(state);
  if (!challenge || !challenge.options.some(option => option.id === optionId)) return state;
  const correct = optionId === challenge.answerId;
  return {
    ...state,
    feedback: { correct, optionId },
    mistakes: state.mistakes + (correct ? 0 : 1),
  };
}

export function continueQuest(state: QuestState): QuestState {
  if (state.completed || !state.activeGate || !state.feedback) return state;
  if (!state.feedback.correct) return { ...state, feedback: null };
  return {
    ...state,
    position: findTile(state.worldId, state.activeGate),
    clearedGates: [...state.clearedGates, state.activeGate],
    activeGate: null,
    feedback: null,
    steps: state.steps + 1,
  };
}

export type QuestProgress = {
  version: 1;
  completedWorlds: WorldId[];
  bestStars: Partial<Record<WorldId, number>>;
};

export function emptyQuestProgress(): QuestProgress {
  return { version: 1, completedWorlds: [], bestStars: {} };
}

export function getQuestStars(state: QuestState): number {
  if (!state.completed) return 0;
  return state.mistakes === 0 ? 3 : state.mistakes <= 2 ? 2 : 1;
}

function normalizeProgress(value: unknown): QuestProgress {
  const empty = emptyQuestProgress();
  if (!value || typeof value !== 'object') return empty;
  const data = value as Partial<QuestProgress>;
  if (data.version !== 1 || !Array.isArray(data.completedWorlds)
    || !data.bestStars || typeof data.bestStars !== 'object' || Array.isArray(data.bestStars)) return empty;
  // Preserve only a consecutive progression. A corrupt save cannot skip a world.
  for (const world of PANDA_WORLDS) {
    if (!data.completedWorlds.includes(world.id)) break;
    empty.completedWorlds.push(world.id);
    const stars = data.bestStars[world.id];
    empty.bestStars[world.id] = Number.isInteger(stars) && stars! >= 1 && stars! <= 3 ? stars : 1;
  }
  return empty;
}

export function parseQuestProgress(raw: string | null): QuestProgress {
  if (!raw) return emptyQuestProgress();
  try { return normalizeProgress(JSON.parse(raw)); }
  catch { return emptyQuestProgress(); }
}

export function serializeQuestProgress(progress: QuestProgress): string {
  return JSON.stringify(normalizeProgress(progress));
}

export function isWorldUnlocked(worldId: number, progress: QuestProgress): boolean {
  if (worldId === 1) return true;
  if (worldId !== 2 && worldId !== 3 && worldId !== 4) return false;
  return normalizeProgress(progress).completedWorlds.includes((worldId - 1) as WorldId);
}

export function recordQuestCompletion(progress: QuestProgress, state: QuestState): QuestProgress {
  const saved = normalizeProgress(progress);
  if (!state.completed || getQuestTile(state.worldId, state.position) !== 'E'
    || !getQuestWorld(state.worldId).gateIds.every(gate => state.clearedGates.includes(gate))
    || !isWorldUnlocked(state.worldId, saved)) return saved;
  return {
    version: 1,
    completedWorlds: [...new Set([...saved.completedWorlds, state.worldId])].sort(),
    bestStars: {
      ...saved.bestStars,
      [state.worldId]: Math.max(saved.bestStars[state.worldId] ?? 0, getQuestStars(state)),
    },
  };
}
