'use client';
import { useState } from 'react';
import { getListeningEntriesForScope } from '@/lib/lesson-content';
import { SpeakButton } from '@/components/SpeakButton';
import { Hanzi } from '@/components/Hanzi';
import type { CharacterEntry, CurriculumScope } from '@/data/types';
import { cleanChinese } from '@/data/games-curriculum';
import { normalizePinyin } from '@/lib/pinyin';
import { GameFeedback } from '../shared/GameFeedback';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';
import { AnswerBlocks } from '../shared/AnswerBlocks';

export function WordListening({ scope, characters }: { scope: CurriculumScope; characters: CharacterEntry[] }) {
  const allowed = new Set(characters.map(item => item.hanzi));
  const pool = getListeningEntriesForScope(scope).filter(item => [...item.hanzi].every(character => allowed.has(character)));
  const session = useGameSession('hanzi-lab',scope,pool.length);
  const [answer, setAnswer] = useState('');
  const [pinyin, setPinyin] = useState(false);
  const item = pool[session.index];
  if (!item) return <p>No hay audios para este alcance.</p>;
  if (session.finished) return <GameResult score={session.score} total={session.total}/>;
  return <div className="new-game"><GameProgress level={session.level} onLevel={level => { session.setLevel(level); setAnswer(''); }} round={session.round} total={session.total}/><div className="hanzi-focal"><div className="lab-glyph" aria-hidden="true">♫</div><SpeakButton key={session.round} text={item.hanzi} audioSrc={item.audioSrc} ariaLabel="Escuchar palabra oculta"/></div><label className="inverse-toggle"><input type="checkbox" checked={pinyin} onChange={event => { setPinyin(event.target.checked); setAnswer(''); }}/> Dictar pinyin con tonos</label>
    {session.result === null && <>{!pinyin ? session.level === 1 ? <div className="scene-options">{[...new Set([item.hanzi,...pool.filter(other => other.id !== item.id).slice(0,3).map(other => other.hanzi)])].sort().map(choice => <button key={choice} aria-pressed={answer === choice} onClick={() => setAnswer(choice)}><Hanzi>{choice}</Hanzi></button>)}</div> : <AnswerBlocks key={session.round} blocks={[...item.hanzi]} onChange={setAnswer}/> : <input aria-label="Dictado de pinyin" value={answer} onChange={event => setAnswer(event.target.value)}/>}<button disabled={!answer.trim()} onClick={() => session.check(pinyin ? normalizePinyin(answer).toLowerCase().replace(/\s/g,'') === normalizePinyin(item.pinyin).toLowerCase().replace(/\s/g,'') : cleanChinese(answer) === cleanChinese(item.hanzi),item.id,pinyin ? 'pinyin' : 'word-audio')}>Comprobar dictado</button></>}
    {session.result !== null && <><GameFeedback correct={session.result} hanzi={item.hanzi} pinyin={item.pinyin} meaning={item.translation} characters={characters}/><button onClick={() => { session.next(); setAnswer(''); }}>Siguiente palabra</button></>}
  </div>;
}
