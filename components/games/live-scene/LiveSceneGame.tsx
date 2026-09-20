'use client';
import { useState } from 'react';
import { Hanzi, hanziInputClass } from '@/components/Hanzi';
import { gamesContent, cleanChinese, sentenceBlocks } from '@/data/games-curriculum';
import type { CurriculumScope, CharacterEntry } from '@/data/types';
import { SceneCard } from './SceneCard';
import { AnswerBlocks } from '../shared/AnswerBlocks';
import { GameFeedback } from '../shared/GameFeedback';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';

export function LiveSceneGame({ scope, characters }: { scope: CurriculumScope; characters: CharacterEntry[] }) {
  const pool = gamesContent(scope).scenes;
  const session = useGameSession('escena-viva', scope, pool.length);
  const [answer, setAnswer] = useState('');
  const item = pool[session.index];
  if (!item) return <p>No hay escenas en este alcance.</p>;
  if (session.finished) return <GameResult score={session.score} total={session.total}/>;
  const blocks = sentenceBlocks(item);
  const choices = [...new Set([item.hanzi, ...pool.filter(other => other.id !== item.id).map(other => other.hanzi)])].slice(0, 4).sort();
  return <div className="new-game live-game"><GameProgress level={session.level} onLevel={level => { session.setLevel(level); setAnswer(''); }} round={session.round} total={session.total}/><SceneCard key={item.id} kind={item.kind} count={item.count} sentenceId={item.id}/><h3>{item.instruction}</h3>{session.level === 3 && <p>{item.translation}</p>}
    {session.result === null && <>{session.level === 1 ? <div className="scene-options">{choices.map(choice => <button key={choice} aria-pressed={answer === choice} onClick={() => setAnswer(choice)}><Hanzi>{choice}</Hanzi></button>)}</div> : session.level === 2 ? <AnswerBlocks key={`${session.round}-${session.level}`} blocks={blocks} onChange={setAnswer}/> : <input aria-label="Tu respuesta" className={hanziInputClass(answer)} value={answer} onChange={event => setAnswer(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && answer.trim()) session.check(cleanChinese(answer) === cleanChinese(item.hanzi), item.id); }}/>}<button className="button button-primary" disabled={!answer.trim()} onClick={() => session.check(cleanChinese(answer) === cleanChinese(item.hanzi), item.id)}>Comprobar</button></>}
    {session.result !== null && <><GameFeedback correct={session.result} hanzi={item.hanzi} pinyin={item.pinyin} meaning={item.translation} characters={characters} hint={`Fíjate en el orden: ${blocks.join(' · ')}`}/><button onClick={() => { session.next(); setAnswer(''); }}>Continuar</button></>}
  </div>;
}
