import { describe, it, expect } from 'vitest';
import lesson6 from '@/data/lesson6-public.json';
import corpus from '@/data/corpus-v21-public.json';
import language from '@/data/directions-language.json';
import { statSync } from 'node:fs';
import { cardinalWords, directionMissions, directionWords, findTile, headingFor, hintWord, journeyStars, moveJourney, parseProgress, pointKey, rescueJourney, safeRoute, startJourney, type Heading, type MapMission, type Point } from '@/data/directions-game';

// Independent graph traversal checks map geometry, including stars before arrival.
function reachable(mission: MapMission, from: Point, blockGoal = false) {
  const visited = new Set<string>(), queue = [from];
  while (queue.length) {
    const p = queue.shift()!, tile = mission.grid[p.y]?.[p.x];
    if (!tile || '#X'.includes(tile) || (blockGoal && tile === 'G') || visited.has(pointKey(p))) continue;
    visited.add(pointKey(p));
    for (const [x,y] of [[0,1],[0,-1],[1,0],[-1,0]]) queue.push({x:p.x+x,y:p.y+y});
  }
  return visited;
}

describe('direcciones: recorrido y aprendizaje', () => {
  it('cada lectura del juego tiene pinyin, español y un MP3 publicado no vacío', () => {
    const readings = language.entries as Record<string,{hanzi:string;pinyin:string;spanish:string;audioSrc:string}>;
    const required = [...Object.keys(directionWords),'地图','北','林娜','大为','好。','等一下，你说什么？','等一下！','我在这儿。','谢谢你。','好，谢谢你。','谢谢你，再见！','图书馆在哪儿？'];
    for (const mission of directionMissions) required.push(mission.destination,mission.landmark.hanzi,`你好，请问${mission.destination}在哪儿？`);
    for(const text of required) {
      expect(readings[text],text).toBeDefined();
      expect(readings[text].pinyin,text).not.toBe('');expect(readings[text].spanish,text).not.toBe('');
      expect(readings[text].audioSrc).toMatch(/^\/audio\/.+\.mp3$/);
      expect(statSync(`public${readings[text].audioSrc}`).size,text).toBeGreaterThan(1024);
    }
  });
  it('usa palabras, pinyin y edificios presentes en el corpus L1–L6', () => {
    for (const [word, entry] of Object.entries(directionWords)) expect(lesson6.vocabulary.find(v=>v.hanzi===word)?.pinyin,word).toBe(entry.pinyin);
    for (const mission of directionMissions) for (const word of [mission.destination,mission.landmark.hanzi]) {
      expect([...lesson6.vocabulary,...corpus.vocabulary].some(v=>v.hanzi===word),word).toBe(true);
    }
  });
  for (const mission of directionMissions) {
    it(`${mission.id}: destino, rescate y dos estrellas accesibles sin caídas`, () => {
      expect(mission.grid).toHaveLength(9);
      expect(mission.grid.every(row=>row.length===9 && /^[#.SCGX*]+$/.test(row))).toBe(true);
      for (const unique of ['S','G','C']) expect(mission.grid.join('').split(unique).length-1).toBe(1);
      expect(mission.grid.join('').split('*').length-1).toBe(2);
      expect(mission.grid.join('').includes('X')).toBe(true);
      const from=findTile(mission,'S'), all=reachable(mission,from), beforeGoal=reachable(mission,from,true);
      expect(all.has(pointKey(findTile(mission,'G')))).toBe(true);
      for (let y=0;y<9;y++) for (let x=0;x<9;x++) if ('*C'.includes(mission.grid[y][x])) expect(beforeGoal.has(pointKey({x,y})),`${x},${y}`).toBe(true);
      let state=startJourney(mission), guard=0;
      while (state.status==='playing' && guard++<100) {
        const word=hintWord(mission,state); expect(word).not.toBeNull();
        state=moveJourney(mission,state,word!);
      }
      expect(state.status).toBe('won'); expect(state.mistakes).toBe(0); expect(state.hearts).toBe(3);
    });
  }
  it('distingue puntos cardinales de izquierda y derecha según las cuatro orientaciones', () => {
    for (const heading of [0,1,2,3] as Heading[]) {
      expect(headingFor('北边',heading,false)).toBe(0);
      expect(headingFor('东边',heading,false)).toBe(1);
      expect(headingFor('前边',heading,true)).toBe(heading);
      expect(headingFor('右边',heading,true)).toBe((heading+1)%4);
      expect(headingFor('左边',heading,true)).toBe((heading+3)%4);
      expect(headingFor('后边',heading,true)).toBe((heading+2)%4);
    }
    expect(()=>headingFor('左边',0,false)).toThrow();
  });
  it('un muro conserva posición, orientación y vidas; impide el bonus sin errores', () => {
    const mission=directionMissions[0], initial=startJourney(mission), next=moveJourney(mission,initial,'南边');
    expect(next.position).toEqual(initial.position); expect(next.heading).toBe(initial.heading);
    expect(next.hearts).toBe(3); expect(next.mistakes).toBe(1); expect(next.last).toBe('wall');
    expect(journeyStars({...next,status:'won'},false)).toBe(1);
  });
  it('rescata desde el último campamento, conserva estrellas y bloquea órdenes tras caer', () => {
    const mission=directionMissions[0]; let state=startJourney(mission);
    for (const heading of safeRoute(mission,state.position,findTile(mission,'C'))) state=moveJourney(mission,state,cardinalWords[heading]);
    expect(state.last).toBe('checkpoint'); const checkpoint=state.position, facing=state.heading;
    // Walk from C (4,5) to the hole (5,3), avoiding the wall at (4,3).
    for (const word of ['东边','北边','北边'] as const) state=moveJourney(mission,state,word);
    expect(state.status).toBe('fallen'); expect(state.hearts).toBe(2);
    expect(moveJourney(mission,state,'东边')).toBe(state);
    state=rescueJourney(state); expect(state.position).toEqual(checkpoint); expect(state.heading).toBe(facing);
    for(let attempt=0;attempt<2;attempt++) {
      for (const word of ['东边','北边','北边'] as const) state=moveJourney(mission,state,word);
      if(attempt===0) state=rescueJourney(state);
    }
    expect(state.status).toBe('lost'); expect(state.hearts).toBe(0); expect(rescueJourney(state)).toBe(state);
  });
  it('no permite repetir estrellas y distingue ayuda de orientación independiente', () => {
    const mission=directionMissions[0];let state=startJourney(mission);
    for(const word of ['东边','东边','东边','西边','东边'] as const) state=moveJourney(mission,state,word);
    expect(state.collected).toHaveLength(1);
    for(const heading of safeRoute(mission,state.position,{x:3,y:1})) state=moveJourney(mission,state,cardinalWords[heading]);
    for(const heading of safeRoute(mission,state.position)) state=moveJourney(mission,state,cardinalWords[heading]);
    expect(journeyStars(state,false)).toBe(3);expect(journeyStars(state,true)).toBe(2);
    expect(moveJourney(mission,state,'北边')).toBe(state);
  });
  it('tolera progreso inválido y descarta puntuaciones o IDs ajenos', () => {
    expect(parseProgress('{invalid')).toEqual({version:1,best:{}});
    expect(parseProgress(JSON.stringify({version:1,best:{library:3,canteen:8,bank:-1,university:'3',gym:2.5,unknown:3}}))).toEqual({version:1,best:{library:3}});
    expect(parseProgress(JSON.stringify({version:2,best:{library:3}}))).toEqual({version:1,best:{}});
  });
});
