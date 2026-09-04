'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterEntry, Exercise, ListeningEntry } from '@/data/types';
import { HanziArcade } from './hanzi/HanziArcade';
import { ListenAndRecognize } from './ListenAndRecognize';
import { SpeakButton } from './SpeakButton';
import { shuffleWithoutImmediateRepeat } from '@/lib/listen-recognize';
import { arcadeGames as games } from '@/data/arcade-games';
import { comparePinyin, normalizeAnswer } from '@/lib/pinyin';

type Props = {
  exercises: Exercise[];
  hanziCharacters: CharacterEntry[];
  listeningEntries: ListeningEntry[];
};

export function Arcade({ exercises, hanziCharacters, listeningEntries }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [listenSession, setListenSession] = useState<{ deck: ListeningEntry[]; audio: HTMLAudioElement | null }>({ deck: [], audio: null });
  const game = selected === null ? null : games[selected];

  useEffect(() => { rootRef.current?.setAttribute('data-hydrated', 'true'); }, []);
  const pool = useMemo(() => !game?.dimension ? [] : exercises.filter((item) => game.dimension === 'all' || item.dimension === game.dimension), [game, exercises]);
  const exercise = pool[round % Math.max(1, pool.length)] ?? exercises[round % exercises.length];

  function play(index: number) {
    if (games[index].kind === 'listen' || games[index].kind === 'hanzi-listen') {
      const source = games[index].kind === 'hanzi-listen' ? listeningEntries.filter((item) => [...item.hanzi].length === 1) : listeningEntries;
      const deck = shuffleWithoutImmediateRepeat(source);
      const audio = deck[0] ? new Audio(deck[0].audioSrc) : null;
      if (audio) void audio.play().catch(() => undefined);
      setListenSession({ deck, audio });
    }
    setSelected(index); setRound(0); setAnswer(''); setScore(0); setMessage('');
    document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth' });
  }

  function check() {
    const ok = exercise.type === 'pinyin'
      ? comparePinyin(answer, exercise.answer, true)
      : normalizeAnswer(answer) === normalizeAnswer(exercise.answer);
    setScore((value) => value + (ok ? 1 : 0));
    setMessage(ok ? '正确 · ¡Acierto!' : `Pista: ${exercise.rule}`);
    window.setTimeout(() => { setRound((value) => value + 1); setAnswer(''); setMessage(''); }, 900);
  }

  return <div className="arcade-root" ref={rootRef}>
    <section className="game-grid shell">{games.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><h2>{item.name}</h2><p>{item.description}</p><button type="button" onClick={() => play(index)}>Jugar →</button></article>)}</section>
    <section id="arena" className="arcade-arena shell">{!game ? <div><p className="eyebrow">{games.length} JUEGOS FUNCIONALES</p><h2>Elige un reto</h2><p>Cada juego usa exclusivamente el corpus del alcance seleccionado.</p></div> : <>
      {game.kind === 'listen' || game.kind === 'hanzi-listen' ? <ListenAndRecognize entries={listenSession.deck} initialDeck={listenSession.deck} initialAudio={listenSession.audio} onClose={() => setSelected(null)} /> : <>
        <div className="practice-top"><div><p className="eyebrow">RONDA {round + 1}</p><h2>{game.name}</h2></div><b>{score} aciertos</b></div>
        {game.kind === 'hanzi' && game.hanziIndex !== undefined ? <><HanziArcade characters={hanziCharacters} key={`${game.id}-${round}`} gameIndex={game.hanziIndex} round={round} onScore={() => setScore((value) => value + 1)} /><div className="arena-actions"><button type="button" onClick={() => setRound((value) => value + 1)}>Otro carácter</button><button type="button" onClick={() => setSelected(null)}>Cerrar</button></div></> : <>
          {['tone', 'audio'].includes(exercise.dimension) && <SpeakButton text={exercise.answer} />}
          <p className="question">{exercise.prompt}</p>
          {exercise.options ? <div className="option-grid">{exercise.options.map((option) => <button type="button" className={answer === option ? 'selected' : ''} onClick={() => setAnswer(option)} key={option}>{option}</button>)}</div> : <input className="arcade-input" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && check()} placeholder="Tu respuesta" />}
          {message && <p className="rule-note">{message}</p>}
          <div className="arena-actions"><button className="button button-primary" type="button" onClick={check}>Comprobar</button><button type="button" onClick={() => setSelected(null)}>Cerrar</button></div>
        </>}
      </>}
    </>}</section>
  </div>;
}
