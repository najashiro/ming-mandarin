import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { arcadeGames } from '@/data/arcade-games';
import { curriculumScopes, getCurriculum } from '@/seed/curriculum';
import { cleanChinese, gamesContent, sentenceBlocks, storiesForScope } from '@/data/games-curriculum';
import { gameEventId, parseGameEventId, retryQueue, sessionOrder } from '@/lib/games-session';
import { hanziGlyphHref, resolveHanziGlyph } from '@/lib/hanzi/navigation';
import baseline from '../fixtures/reto-mixto-baseline.json';

describe('seis experiencias curriculares', () => {
  it('mantiene Reto Mixto primero y añade el juego de horas', () => {
    expect(arcadeGames.map(game => game.id)).toEqual(['reto-mixto','escena-viva','conversacion','hanzi-lab','historia-detective','hora','vocabulario-mix']);
  });
  it('conserva el contenido del motor, datos y visuales de Reto Mixto', () => {
    for (const [path, hash] of Object.entries(baseline)) expect(createHash('sha256').update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')).digest('hex'),path).toBe(hash);
  });
  for (const scope of curriculumScopes) it(`${scope}: contenido trazable y construcción sin introducir palabras`, () => {
    const content = gamesContent(scope);
    const allowed = new Map(getCurriculum(scope).sentences.map(sentence => [sentence.id,sentence]));
    expect(content.scenes.length).toBeGreaterThan(1);
    expect(content.conversations.length).toBeGreaterThan(1);
    for (const scene of content.scenes) {
      expect(scene).toMatchObject(allowed.get(scene.id)!);
      expect(cleanChinese(sentenceBlocks(scene).join(''))).toBe(cleanChinese(scene.hanzi));
      expect(scene.source.file).toMatch(/\.pdf$/);
      expect(scene.pinyin).toBe(scene.pinyin.normalize('NFC'));
      expect(scene.pinyin).toMatch(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/);
    }
    for (const conversation of content.conversations) {
      expect(content.definition.lessonIds).toContain(conversation.lesson);
      expect(conversation.source.file).toBeTruthy();
      expect(conversation.answer.audioSrc).toMatch(/\.mp3$/);
    }
    for (const story of storiesForScope(scope)) {
      expect(story.scenes.length).toBeGreaterThanOrEqual(3);
      expect(story.scenes.length).toBeLessThanOrEqual(5);
      for (const scene of story.scenes) expect(allowed.has(scene.id)).toBe(true);
      for (const id of story.evidence) expect(story.scenes.some(scene => scene.id === id)).toBe(true);
    }
  });
  it('L1 no incorpora escenas ni historias L3', () => {
    expect(gamesContent('l1').scenes.some(scene => scene.id.startsWith('s-l3'))).toBe(false);
    expect(storiesForScope('l1').some(story => story.lesson === 3)).toBe(false);
  });
  it('los reintentos son finitos y no repiten inmediatamente el último ejercicio', () => {
    for (let total = 2; total <= 6; total++) for (let mask = 0; mask < 2 ** total; mask++) {
      let retries: number[] = [];
      for (let index = 0; index < total; index++) if (mask & (1 << index)) retries = retryQueue(retries,index,total);
      const deck = [...Array.from({length:total},(_,index) => index),...retries];
      expect(deck.length).toBeLessThanOrEqual(total * 2 + 1);
      expect(deck.some((id,index) => index > 0 && id === deck[index-1])).toBe(false);
    }
  });
  it('muestrea el corpus completo sin duplicados, manteniendo la primera recomendación', () => {
    const order = sessionOrder(20, () => 0.1);
    expect(order[0]).toBe(0);
    expect(new Set(order).size).toBe(20);
    expect(order.slice(0,6).some(index => index >= 6)).toBe(true);
  });
  it('preserva modalidad, nivel, scope y contenido en la analítica persistida', () => {
    const value = gameEventId('hanzi-lab','l2',3,'Audio','c-海');
    expect(value.length).toBeLessThan(120);
    expect(parseGameEventId(value)).toEqual({ game:'hanzi-lab',scope:'l2',difficulty_level:3,modality:'Audio',content_id:'c-海' });
  });
  it('enlaza a un carácter exacto con foco y reutiliza el motor de escritura', () => {
    expect(hanziGlyphHref('海')).toBe('/study/l2/hanzi?character=%E6%B5%B7&focus=glyph');
    expect(resolveHanziGlyph('点')).toMatchObject({kind:'curricular',character:'点'});
    expect(resolveHanziGlyph('海')).toMatchObject({kind:'curricular',character:'海'});
    for(const character of [...'分零半刻差']) expect(resolveHanziGlyph(character)).toMatchObject({kind:'supplementary',character});
    expect(resolveHanziGlyph('龘')).toMatchObject({kind:'unavailable',character:'龘'});
    expect(resolveHanziGlyph('../分')).toMatchObject({kind:'unavailable'});
    expect(getCurriculum('l2').characters.filter(item=>item.hanzi==='点')).toHaveLength(1);
    const source = readFileSync('components/games/hanzi-lab/HanziLabGame.tsx','utf8');
    expect(source).toContain('HanziWriterStage');
    expect(source).toContain('componentsAudited');
    expect(source).toContain('radicalAudited');
    expect(source).not.toContain('new Audio');
  });
  it('retira el dictado del reloj sin retirar su reproducción de audio',()=>{
    const source=readFileSync('components/games/time/TimeGame.tsx','utf8');
    expect(source).not.toMatch(/SpeechRecognition|webkitSpeechRecognition|Dictar|Micrófono/);
    expect(source).toContain('playTimeAudio');
    expect(source).toContain('stopTimeAudio');
    expect(source).toContain('time-controls');
  });
});
