/** Míng adaptation. Lexical evidence and source distinctions: docs/directions-game.md. */
export type Heading = 0 | 1 | 2 | 3; // north, east, south, west
export type Point = { x: number; y: number };
export type DirectionWord = '北边' | '东边' | '南边' | '西边' | '前边' | '右边' | '后边' | '左边';
export const directionWords: Record<DirectionWord, { pinyin: string; spanish: string }> = {
  北边: { pinyin: 'běibian', spanish: 'norte' }, 东边: { pinyin: 'dōngbian', spanish: 'este' },
  南边: { pinyin: 'nánbian', spanish: 'sur' }, 西边: { pinyin: 'xībian', spanish: 'oeste' },
  前边: { pinyin: 'qiánbian', spanish: 'delante del personaje' }, 右边: { pinyin: 'yòubian', spanish: 'a su derecha' },
  后边: { pinyin: 'hòubian', spanish: 'detrás del personaje' }, 左边: { pinyin: 'zuǒbian', spanish: 'a su izquierda' },
};
export const vectors: readonly Point[] = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
export const cardinalWords: readonly DirectionWord[] = ['北边', '东边', '南边', '西边'];
export const relativeWords: readonly DirectionWord[] = ['前边', '右边', '后边', '左边'];
export type MapMission = {
  id: string; title: string; subtitle: string; destination: string; meaning: string;
  caller: string; theme: 'campus' | 'sunset' | 'night'; relative: boolean; heading: Heading;
  grid: readonly string[]; landmark: { at: Point; hanzi: string; kind: 'gate' | 'shop' | 'home' };
};
export const directionMissions: readonly MapMission[] = [
  { id: 'library', title: 'Un nuevo comienzo', subtitle: 'Una llamada desde el campus', destination: '图书馆', meaning: 'biblioteca', caller: '林娜', theme: 'campus', relative: false, heading: 0,
    grid: ['#########','#..*...G#','#.###.#.#','#...#X..#','###.#.#.#','#...C...#','#.#.###.#','#S..*...#','#########'], landmark: { at: { x: 1, y: 7 }, hanzi: '校门', kind: 'gate' } },
  { id: 'canteen', title: 'La hora del almuerzo', subtitle: 'El camino corto tiene sorpresa', destination: '食堂', meaning: 'comedor', caller: '大为', theme: 'campus', relative: false, heading: 1,
    grid: ['#########','#S..#..G#','#.#.#.#.#','#*#...#.#','#.###X#.#','#...C...#','#.###.#.#','#...*...#','#########'], landmark: { at: { x: 1, y: 1 }, hanzi: '教学楼', kind: 'home' } },
  { id: 'bank', title: 'Un pequeño desvío', subtitle: 'Encuentra la ruta entre los jardines', destination: '银行', meaning: 'banco', caller: '林娜', theme: 'sunset', relative: false, heading: 3,
    grid: ['#########','#G..#..*#','#.#.#.#.#','#.#...#.#','#.##X##.#','#...C...#','###.#.#.#','#*....#S#','#########'], landmark: { at: { x: 7, y: 7 }, hanzi: '超市', kind: 'shop' } },
  { id: 'university', title: 'Al otro lado de la ciudad', subtitle: 'La universidad te espera', destination: '大学', meaning: 'universidad', caller: '大为', theme: 'sunset', relative: false, heading: 0,
    grid: ['#########','#*..G...#','#.#####.#','#...X...#','#.#.#.#.#','#.#.C.#.#','#.#.###.#','#S....*.#','#########'], landmark: { at: { x: 1, y: 7 }, hanzi: '饭馆', kind: 'shop' } },
  { id: 'gym', title: 'Ponte en sus zapatos', subtitle: 'Ahora importa hacia dónde mira', destination: '体育馆', meaning: 'gimnasio', caller: '林娜', theme: 'night', relative: true, heading: 1,
    grid: ['#########','#S..#..*#','#.#.#.#.#','#.#.C...#','#.###X#.#','#*....#.#','#.#####.#','#.....G.#','#########'], landmark: { at: { x: 1, y: 1 }, hanzi: '图书馆', kind: 'home' } },
  { id: 'dorm', title: 'La última llamada', subtitle: 'Regreso a casa bajo las estrellas', destination: '宿舍楼', meaning: 'residencia', caller: '大为', theme: 'night', relative: true, heading: 2,
    grid: ['#########','#G..#..S#','#.#.#.#.#','#.#...#*#','#.##X##.#','#...C...#','#.###.#.#','#*......#','#########'], landmark: { at: { x: 7, y: 1 }, hanzi: '教学楼', kind: 'home' } },
];
export function samePoint(a: Point, b: Point) { return a.x === b.x && a.y === b.y; }
export function pointKey(p: Point) { return `${p.x},${p.y}`; }
export function tileAt(mission: MapMission, p: Point) { return mission.grid[p.y]?.[p.x] ?? '#'; }
export function findTile(mission: MapMission, tile: string): Point {
  for (let y = 0; y < mission.grid.length; y++) {
    const x = mission.grid[y].indexOf(tile);
    if (x !== -1) return { x, y };
  }
  throw new Error(`Missing ${tile} in ${mission.id}`);
}
export function headingFor(word: DirectionWord, heading: Heading, relative: boolean): Heading {
  const index = (relative ? relativeWords : cardinalWords).indexOf(word);
  if (index < 0) throw new Error('Direction does not belong to this mission');
  return ((index + (relative ? heading : 0)) % 4) as Heading;
}
export type Journey = {
  position: Point; checkpoint: Point; heading: Heading; checkpointHeading: Heading;
  hearts: number; moves: number; mistakes: number; collected: string[]; visited: string[];
  status: 'playing' | 'fallen' | 'lost' | 'won'; last: 'start' | 'walk' | 'wall' | 'fall' | 'checkpoint' | 'star' | 'arrived' | 'rescue';
};
export function startJourney(mission: MapMission): Journey {
  const start = findTile(mission, 'S');
  return { position: start, checkpoint: start, heading: mission.heading, checkpointHeading: mission.heading,
    hearts: 3, moves: 0, mistakes: 0, collected: [], visited: [pointKey(start)], status: 'playing', last: 'start' };
}
export function moveJourney(mission: MapMission, state: Journey, word: DirectionWord): Journey {
  if (state.status !== 'playing') return state;
  const heading = headingFor(word, state.heading, mission.relative);
  const delta = vectors[heading], position = { x: state.position.x + delta.x, y: state.position.y + delta.y };
  const tile = tileAt(mission, position);
  const next = { ...state, moves: state.moves + 1 };
  // A blocked instruction does not rotate the character or consume a rescue.
  if (tile === '#') return { ...next, last: 'wall', mistakes: state.mistakes + 1 };
  if (tile === 'X') return { ...next, position, heading, hearts: state.hearts - 1, mistakes: state.mistakes + 1,
    status: state.hearts === 1 ? 'lost' : 'fallen', last: 'fall' };
  const key = pointKey(position), newStar = tile === '*' && !state.collected.includes(key);
  return { ...next, position, heading, visited: Array.from(new Set([...state.visited, key])),
    collected: newStar ? [...state.collected, key] : state.collected,
    checkpoint: tile === 'C' ? position : state.checkpoint,
    checkpointHeading: tile === 'C' ? heading : state.checkpointHeading,
    status: tile === 'G' ? 'won' : 'playing',
    last: tile === 'G' ? 'arrived' : tile === 'C' ? 'checkpoint' : newStar ? 'star' : 'walk' };
}
export function rescueJourney(state: Journey): Journey {
  return state.status === 'fallen' ? { ...state, position: state.checkpoint, heading: state.checkpointHeading, status: 'playing', last: 'rescue' } : state;
}
/** BFS ignores holes. Used for an explicitly requested hint and reachability validation. */
export function safeRoute(mission: MapMission, from: Point, to = findTile(mission, 'G')): Heading[] {
  const queue: { point: Point; path: Heading[] }[] = [{ point: from, path: [] }];
  const seen = new Set([pointKey(from)]);
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    if (samePoint(current.point, to)) return current.path;
    vectors.forEach((delta, heading) => {
      const point = { x: current.point.x + delta.x, y: current.point.y + delta.y }, key = pointKey(point);
      if (!seen.has(key) && !['#', 'X'].includes(tileAt(mission, point))) {
        seen.add(key); queue.push({ point, path: [...current.path, heading as Heading] });
      }
    });
  }
  return [];
}
export function hintWord(mission: MapMission, state: Journey): DirectionWord | null {
  const next = safeRoute(mission, state.position)[0];
  return next === undefined ? null : mission.relative ? relativeWords[(next - state.heading + 4) % 4] : cardinalWords[next];
}
export function journeyStars(state: Journey, usedHelp: boolean) {
  return state.status !== 'won' ? 0 : 1 + Number(state.mistakes === 0 && !usedHelp) + Number(state.collected.length === 2);
}
export type SavedJourney = { version: 1; best: Record<string, number> };
export const progressKey = 'ming-directions-v1';
export function parseProgress(raw: string | null): SavedJourney {
  const best: Record<string, number> = {};
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (value && typeof value === 'object' && 'version' in value && value.version === 1 && 'best' in value && value.best && typeof value.best === 'object') {
      for (const mission of directionMissions) {
        const score = (value.best as Record<string, unknown>)[mission.id];
        if (typeof score === 'number' && Number.isInteger(score) && score >= 1 && score <= 3) best[mission.id] = score;
      }
    }
  } catch { /* A private browser or invalid save must not block play. */ }
  return { version: 1, best };
}
