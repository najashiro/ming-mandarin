import { describe, expect, it } from 'vitest';
import { PANDA_CHALLENGES } from '@/data/panda-quest';
import {
  PANDA_WORLDS, answerQuest, continueQuest, createQuest,
  emptyQuestProgress, getActiveChallenge, getQuestStars, getQuestTile,
  getQuestWorld, isWorldUnlocked, moveQuest, parseQuestProgress,
  recordQuestCompletion, serializeQuestProgress,
  type Direction, type Position, type QuestState, type WorldId,
} from '@/lib/panda-quest';

const directions: [Direction, number, number][] = [
  ['up', 0, -1], ['down', 0, 1], ['left', -1, 0], ['right', 1, 0],
];

function locate(worldId: WorldId, tile: string): Position {
  const map = getQuestWorld(worldId).map;
  const y = map.findIndex(row => row.includes(tile));
  return { x: map[y].indexOf(tile), y };
}

function route(worldId: WorldId, from: Position, to: Position, blockedTile?: string): Direction[] | undefined {
  const queue = [{ position: from, moves: [] as Direction[] }];
  const visited = new Set([`${from.x},${from.y}`]);
  while (queue.length) {
    const { position, moves } = queue.shift()!;
    if (position.x === to.x && position.y === to.y) return moves;
    for (const [direction, dx, dy] of directions) {
      const next = { x: position.x + dx, y: position.y + dy };
      const key = `${next.x},${next.y}`;
      const tile = getQuestTile(worldId, next);
      if (tile === '#' || tile === blockedTile || visited.has(key)) continue;
      visited.add(key);
      queue.push({ position: next, moves: [...moves, direction] });
    }
  }
  return undefined;
}

function walk(state: QuestState, moves: Direction[]): QuestState {
  for (const direction of moves) {
    state = moveQuest(state, direction);
    if (state.activeGate) {
      const challenge = getActiveChallenge(state)!;
      state = continueQuest(answerQuest(state, challenge.answerId));
    }
  }
  return state;
}

function finish(worldId: WorldId): QuestState {
  const state = createQuest(worldId, () => 0);
  return walk(state, route(worldId, state.position, locate(worldId, 'E'))!);
}

function firstGate(): QuestState {
  let state = createQuest(1, () => 0);
  for (const direction of route(1, state.position, locate(1, 'A'))!) {
    state = moveQuest(state, direction);
  }
  return state;
}

describe('Panda Quest maps and cumulative lessons', () => {
  it.each(PANDA_WORLDS)('world $id has a traversable exit and unavoidable gates', world => {
    expect(world.map).toHaveLength(9);
    expect(world.map.every(row => row.length === 11 && /^[#.SEABCDb]+$/.test(row))).toBe(true);
    expect([...world.map.join('')].filter(tile => tile === 'S')).toHaveLength(1);
    expect([...world.map.join('')].filter(tile => tile === 'E')).toHaveLength(1);
    const start = locate(world.id, 'S');
    const exit = locate(world.id, 'E');
    expect(route(world.id, start, exit)).toBeDefined();
    for (const gate of world.gateIds) {
      expect([...world.map.join('')].filter(tile => tile === gate)).toHaveLength(1);
      expect(route(world.id, start, exit, gate)).toBeUndefined();
    }
    const completed = finish(world.id);
    expect(completed).toMatchObject({ completed: true, position: exit, mistakes: 0 });
    expect(completed.clearedGates).toEqual(world.gateIds);
    expect(completed.steps).toBe(route(world.id, start, exit)!.length);
  });

  it.each(PANDA_WORLDS)('world $id samples every cumulative lesson without duplicate challenges', world => {
    for (const sample of [0, 0.2, 0.7, 0.999]) {
      const ids = Object.values(createQuest(world.id, () => sample).challengeIds);
      const lessons = ids.map(id => PANDA_CHALLENGES.find(challenge => challenge.id === id)!.lesson);
      expect(new Set(ids).size).toBe(world.gateIds.length);
      expect([...new Set(lessons)].sort()).toEqual(world.lessons);
      expect(lessons.every(lesson => lesson <= world.id)).toBe(true);
    }
    expect(createQuest(world.id, () => 0).challengeIds)
      .not.toEqual(createQuest(world.id, () => 0.99).challengeIds);
  });

  it('includes four playable worlds and rejects missing worlds', () => {
    expect(PANDA_WORLDS.map(world => world.id)).toEqual([1, 2, 3, 4]);
    expect(isWorldUnlocked(4, { version: 1, completedWorlds: [1, 2, 3], bestStars: {} })).toBe(true);
    expect(isWorldUnlocked(5, { version: 1, completedWorlds: [1, 2, 3, 4], bestStars: {} })).toBe(false);
    expect(() => createQuest(5 as WorldId)).toThrow(RangeError);
  });
});

describe('Panda Quest movement and feedback', () => {
  it('does not step into walls, out of bounds, or move while a challenge is open', () => {
    const initial = createQuest(1);
    expect(moveQuest(initial, 'up')).toBe(initial);
    expect(moveQuest(initial, 'left')).toBe(initial);
    expect(getQuestTile(1, { x: -1, y: 1 })).toBe('#');
    expect(getQuestTile(1, { x: 1, y: 99 })).toBe('#');
    const atGate = firstGate();
    expect(atGate.activeGate).toBe('A');
    expect(getQuestTile(1, atGate.position)).not.toBe('A');
    for (const [direction] of directions) expect(moveQuest(atGate, direction)).toBe(atGate);
    expect(continueQuest(atGate)).toBe(atGate);
  });

  it('requires a correct answer and explicit continue before crossing a gate', () => {
    const atGate = firstGate();
    const challenge = getActiveChallenge(atGate)!;
    const wrongId = challenge.options.find(option => option.id !== challenge.answerId)!.id;
    const wrong = answerQuest(atGate, wrongId);
    expect(wrong).toMatchObject({ mistakes: 1, feedback: { correct: false, optionId: wrongId } });
    expect(wrong.position).toEqual(atGate.position);
    expect(answerQuest(wrong, wrongId)).toBe(wrong);
    expect(answerQuest(wrong, challenge.answerId)).toBe(wrong);
    const retry = continueQuest(wrong);
    expect(retry).toMatchObject({ activeGate: 'A', feedback: null, clearedGates: [], mistakes: 1 });
    const correct = answerQuest(retry, challenge.answerId);
    expect(correct.clearedGates).toEqual([]);
    expect(correct.position).toEqual(atGate.position);
    expect(answerQuest(correct, challenge.answerId)).toBe(correct);
    const crossed = continueQuest(correct);
    expect(crossed).toMatchObject({ activeGate: null, feedback: null, clearedGates: ['A'], mistakes: 1 });
    expect(getQuestTile(1, crossed.position)).toBe('A');
    expect(crossed.steps).toBe(atGate.steps + 1);
    expect(continueQuest(crossed)).toBe(crossed);
    expect(atGate).toMatchObject({ mistakes: 0, clearedGates: [] });
  });

  it('ignores unknown answers and attempts made outside a challenge', () => {
    const initial = createQuest(1);
    expect(answerQuest(initial, 'a')).toBe(initial);
    const atGate = firstGate();
    expect(answerQuest(atGate, 'unknown')).toBe(atGate);
  });

  it('collects each bamboo only once even when revisiting', () => {
    const state = createQuest(1, () => 0);
    const bamboo = locate(1, 'b');
    const firstVisit = walk(state, route(1, state.position, bamboo)!);
    expect(firstVisit.collected).toEqual([`${bamboo.x},${bamboo.y}`]);
    const back = walk(firstVisit, route(1, bamboo, state.position)!);
    const secondVisit = walk(back, route(1, back.position, bamboo)!);
    expect(secondVisit.collected).toEqual(firstVisit.collected);
  });

  it('refuses the exit without all gates, and freezes completed adventures', () => {
    const completed = finish(1);
    const exit = completed.position;
    const [direction, dx, dy] = directions.find(([, x, y]) =>
      getQuestTile(1, { x: exit.x - x, y: exit.y - y }) !== '#')!;
    const missingGate = {
      ...completed, completed: false, clearedGates: ['A', 'B'] as QuestState['clearedGates'],
      position: { x: exit.x - dx, y: exit.y - dy },
    };
    expect(moveQuest(missingGate, direction)).toBe(missingGate);
    expect(moveQuest(completed, 'down')).toBe(completed);
    expect(answerQuest(completed, 'a')).toBe(completed);
  });
});

describe('Panda Quest saved progression', () => {
  it('unlocks worlds in order and retains the best replay result', () => {
    const empty = emptyQuestProgress();
    expect([1, 2, 3, 4].map(id => isWorldUnlocked(id, empty))).toEqual([true, false, false, false]);
    expect(recordQuestCompletion(empty, finish(2))).toEqual(empty);
    const first = recordQuestCompletion(empty, finish(1));
    expect(first).toEqual({ version: 1, completedWorlds: [1], bestStars: { 1: 3 } });
    expect(isWorldUnlocked(2, first)).toBe(true);
    expect(isWorldUnlocked(3, first)).toBe(false);
    expect(recordQuestCompletion(first, { ...finish(1), mistakes: 9 })).toEqual(first);
    const second = recordQuestCompletion(first, { ...finish(2), mistakes: 1 });
    expect(isWorldUnlocked(3, second)).toBe(true);
    expect(second.bestStars).toEqual({ 1: 3, 2: 2 });
    const third = recordQuestCompletion(second, { ...finish(3), mistakes: 4 });
    expect(third.bestStars).toEqual({ 1: 3, 2: 2, 3: 1 });
    expect(isWorldUnlocked(4, third)).toBe(true);
    const all = recordQuestCompletion(third, finish(4));
    expect(all.bestStars).toEqual({ 1: 3, 2: 2, 3: 1, 4: 3 });
    expect(parseQuestProgress(serializeQuestProgress(all))).toEqual(all);
  });

  it('does not save an unfinished, misplaced, or incompletely unlocked quest', () => {
    const empty = emptyQuestProgress();
    expect(recordQuestCompletion(empty, createQuest(1))).toEqual(empty);
    expect(recordQuestCompletion(empty, { ...finish(1), clearedGates: [] })).toEqual(empty);
    expect(recordQuestCompletion(empty, { ...finish(1), position: { x: 1, y: 1 } })).toEqual(empty);
    expect(getQuestStars(createQuest(1))).toBe(0);
  });

  it.each([null, '', '{', 'null', '[]', 'false', '{"version":2}', '{"version":1,"completedWorlds":true}',
    '{"version":1,"completedWorlds":[1],"bestStars":[]}'])('recovers safely from malformed data %s', raw => {
    expect(parseQuestProgress(raw)).toEqual(emptyQuestProgress());
  });

  it('sanitizes duplicates, gaps, extra worlds, and invalid star ratings', () => {
    expect(parseQuestProgress(JSON.stringify({
      version: 1, completedWorlds: [1, 1, 3, 5], bestStars: { 1: 99, 2: 3, 3: -1 },
    }))).toEqual({ version: 1, completedWorlds: [1], bestStars: { 1: 1 } });
    expect(parseQuestProgress(JSON.stringify({
      version: 1, completedWorlds: [2, 3], bestStars: { 2: 3, 3: 3 },
    }))).toEqual(emptyQuestProgress());
    expect(parseQuestProgress(JSON.stringify({
      version: 1, completedWorlds: [1, 2, 3, 5], bestStars: { 1: 2, 2: '3', 3: 1.5 },
    }))).toEqual({ version: 1, completedWorlds: [1, 2, 3], bestStars: { 1: 2, 2: 1, 3: 1 } });
  });
});
