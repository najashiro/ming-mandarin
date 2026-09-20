'use client';
import { useState } from 'react';
import { Hanzi, hanziInputClass } from '@/components/Hanzi';
import { SpeakButton } from '@/components/SpeakButton';
import { gamesContent, cleanChinese } from '@/data/games-curriculum';
import type { CurriculumScope, CharacterEntry } from '@/data/types';
import { Person } from '../live-scene/SceneCard';
import { AnswerBlocks } from '../shared/AnswerBlocks';
import { GameFeedback } from '../shared/GameFeedback';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';

export function ConversationGame({ scope, characters }: { scope: CurriculumScope; characters: CharacterEntry[] }) {
  const pool = gamesContent(scope).conversations;
  const session = useGameSession('conversacion', scope, pool.length);
  const [answer, setAnswer] = useState('');
  const [inverse, setInverse] = useState(false);
  const item = pool[session.index];
  if (!item) return <p>No hay diálogos en este alcance.</p>;
  if (session.finished) return <GameResult score={session.score} total={session.total}/>;
  const target = inverse ? item.prompt : item.answer;
  const spoken = inverse ? item.answer : item.prompt;
  const choices = [...new Set([target.hanzi, ...pool.filter(other => other.id !== item.id).map(other => inverse ? other.promptHanzi : other.answerHanzi)])].slice(0,4).sort();
  function check() { session.check(cleanChinese(answer) === cleanChinese(target.hanzi) || (!inverse && item.acceptedResponses.some(value => cleanChinese(value) === cleanChinese(answer))), item.id, inverse ? 'question' : 'response'); }
  return <div className="new-game conversation-game"><GameProgress level={session.level} onLevel={level => { session.setLevel(level); setAnswer(''); }} round={session.round} total={session.total}/><label className="inverse-toggle"><input type="checkbox" checked={inverse} disabled={session.result !== null} onChange={event => { setInverse(event.target.checked); setAnswer(''); }}/> Invertir: formula la intervención anterior</label><div className="dialogue-stage"><div className="dialogue-speaker"><Person/><div className="dialogue-bubble"><Hanzi>{spoken.hanzi}</Hanzi><SpeakButton text={spoken.hanzi}/></div></div><div className="dialogue-speaker learner"><Person index={1}/><div className="dialogue-bubble"><small>Tu turno · {inverse ? 'Pregunta o saludo anterior' : 'Respuesta'}</small><p><Hanzi>{answer || '…'}</Hanzi></p></div></div></div><p>Representa este papel: {target.meaningEs}</p>
    {session.result === null && <>{session.level === 1 ? <div className="dialogue-replies">{choices.map(choice => <button key={choice} aria-pressed={answer === choice} onClick={() => setAnswer(choice)}><Hanzi>{choice}</Hanzi></button>)}</div> : session.level === 2 ? <AnswerBlocks key={`${session.round}-${session.level}-${inverse}`} blocks={target.tokens ?? [...cleanChinese(target.hanzi)]} onChange={setAnswer}/> : <input aria-label="Tu intervención" className={hanziInputClass(answer)} value={answer} onChange={event => setAnswer(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && answer.trim()) check(); }}/>}<button className="button button-primary" disabled={!answer.trim()} onClick={check}>Responder</button></>}
    {session.result !== null && <><GameFeedback correct={session.result} hanzi={target.hanzi} pinyin={target.pinyin} meaning={target.meaningEs} characters={characters} hint="Relaciona la palabra interrogativa con la información de la respuesta."/><button onClick={() => { session.next(); setAnswer(''); }}>Continuar conversación</button></>}
  </div>;
}
