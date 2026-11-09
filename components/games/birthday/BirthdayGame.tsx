'use client';
import { useState } from 'react';
import type { CurriculumScope } from '@/data/types';
import { birthdayRounds } from '@/data/lesson5-games';
import { cleanChinese } from '@/data/games-curriculum';
import { shuffledBlockOrder } from '@/lib/games-session';
import { Hanzi } from '@/components/Hanzi';
import { useGameAudio } from '../shared/useGameAudio';
import { PhraseReinforcement, GameAudioRetry } from '../shared/PhraseReinforcement';
import { GameProgress, GameResult, useGameSession } from '../shared/GameSession';
import { AnswerBlocks } from '../shared/AnswerBlocks';
import { ProductionAnswer } from '../shared/ProductionAnswer';

export function BirthdayGame({ scope }: { scope: CurriculumScope }) {
  const session = useGameSession('cumpleanos', scope, birthdayRounds.length);
  if (session.finished) return <GameResult score={session.score} total={session.total} unresolved={session.unresolved} firstPassScore={session.firstPassScore} initialTotal={session.initialTotal} onRestart={session.restart}/>;
  return <div className="new-game birthday-game">
    <GameProgress level={session.level} onLevel={session.setLevel} round={session.round} total={session.total} retry={session.isRetry} disabled={session.result !== null}/>
    <BirthdayRound key={`${session.round}-${session.level}`} row={birthdayRounds[session.index]} level={session.level} result={session.result}
      onCheck={answer => session.check(cleanChinese(answer) === cleanChinese(birthdayRounds[session.index].hanzi), birthdayRounds[session.index].id, 'birthday-plan')}
      onNext={session.next}/>
  </div>;
}
function BirthdayRound({ row, level, result, onCheck, onNext }: {
  row: typeof birthdayRounds[number]; level: number; result: boolean | null; onCheck: (answer: string) => void; onNext: () => void;
}) {
  const audio = useGameAudio();
  const [answer, setAnswer] = useState('');
  const [order] = useState(() => shuffledBlockOrder(row.choices));
  return <>
    <section className="panel"><p className="eyebrow">ORGANIZA EL CUMPLEAÑOS</p><h3>{row.title}</h3><p style={{fontSize:'1.5rem'}}>{row.clue}</p><p>{row.instruction}</p><p className="ai-audio-note">Audio de práctica generado con IA.</p></section>
    {result === null ? <>
      {level === 1 ? <div className="dialogue-replies">{order.map(index => <button type="button" key={index} aria-pressed={answer === row.choices[index]} onClick={() => { audio.play(row.choices[index]); setAnswer(row.choices[index]); }}><Hanzi>{row.choices[index]}</Hanzi></button>)}</div>
        : level === 2 ? <AnswerBlocks blocks={row.tokens} onChange={setAnswer} onSelect={audio.play}/> : <ProductionAnswer value={answer} onChange={setAnswer}/>}
      <button type="button" className="button button-primary" disabled={!answer.trim()} onClick={() => { audio.play(row.hanzi, row.pinyin); onCheck(answer); }}>Comprobar</button>
    </> : <div className="panel" role="status"><h4>{result ? '¡Correcto!' : 'Revisa el modelo'}</h4>
      <PhraseReinforcement linked hanzi={row.hanzi} pinyin={row.pinyin} translation={row.spanish}/><p>{row.explanation}</p>
      <button type="button" className="button button-primary" onClick={onNext}>Continuar</button>
    </div>}
    <GameAudioRetry error={audio.error} retry={audio.retry}/>
  </>;
}
