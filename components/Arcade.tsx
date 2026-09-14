'use client';
import { Hanzi, hanziInputClass } from '@/components/Hanzi';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterEntry, CurriculumScope, Exercise, ListeningEntry } from '@/data/types';
import { HanziArcade } from './hanzi/HanziArcade';
import { ListenAndRecognize } from './ListenAndRecognize';
import { SpeakButton } from './SpeakButton';
import { shuffleWithoutImmediateRepeat } from '@/lib/listen-recognize';
import { arcadeGames as games } from '@/data/arcade-games';
import { compareExerciseAnswer } from '@/lib/pinyin';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { RetoMixto } from './RetoMixto';

type Props = {
  exercises: Exercise[];
  hanziCharacters: CharacterEntry[];
  listeningEntries: ListeningEntry[];
  scope: CurriculumScope;
  initialGame?: 'reto-mixto';
};

export function Arcade({ exercises, hanziCharacters, listeningEntries, scope, initialGame }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(() => initialGame ? games.findIndex((item) => item.id === initialGame) : null);
  const [shareStatus, setShareStatus] = useState('');
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [listenSession, setListenSession] = useState<{ deck: ListeningEntry[]; audio: HTMLAudioElement | null }>({ deck: [], audio: null });
  const completionTracked = useRef(false);
  const game = selected === null ? null : games[selected];

  useEffect(() => {
    rootRef.current?.setAttribute('data-hydrated', 'true');
    if (!initialGame) return;
    const frame = window.requestAnimationFrame(() => document.getElementById('arena')?.scrollIntoView({ behavior: 'auto', block: 'start' }));
    return () => window.cancelAnimationFrame(frame);
  }, [initialGame]);
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
    completionTracked.current = false;
    if (games[index].kind !== 'mixed') trackAnalyticsEvent('game_started', { contentId: games[index].id });
    setSelected(index); setRound(0); setAnswer(''); setScore(0); setMessage('');
    document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function shareMixedChallenge() {
    const url = new URL(`/study/${scope}/games?game=reto-mixto`, window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Reto Mixto · Míng', url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Enlace copiado');
    } catch {
      window.prompt('Copia el enlace de Reto Mixto:', url);
    }
  }

  function check() {
    const ok = compareExerciseAnswer(exercise.type, answer, exercise.answer);
    trackAnalyticsEvent('exercise_completed', { contentId: `${game?.id ?? 'game'}:${exercise.id}`, correct: ok });
    completeGame();
    setScore((value) => value + (ok ? 1 : 0));
    setMessage(ok ? '正确 · ¡Acierto!' : `Pista: ${exercise.rule}`);
    window.setTimeout(() => { setRound((value) => value + 1); setAnswer(''); setMessage(''); }, 900);
  }

  function completeGame() {
    if (!game || completionTracked.current) return;
    completionTracked.current = true;
    trackAnalyticsEvent('game_completed', { contentId: game.id });
  }

  return <div className="arcade-root" ref={rootRef}>
    <section className="game-grid shell">{games.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, '0')}</span>{item.kind === 'mixed' && <button className="game-share-button" type="button" onClick={() => void shareMixedChallenge()} aria-label="Compartir Reto Mixto" title="Compartir Reto Mixto" data-share-path={`/study/${scope}/games?game=reto-mixto`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.3 10.8 7.4-4.6m-7.4 7 7.4 4.6"/></svg></button>}<h2>{item.name}</h2><p><Hanzi>{item.description}</Hanzi></p>{item.kind === 'mixed' && <span className="game-share-status" role="status" aria-live="polite">{shareStatus}</span>}<button type="button" onClick={() => play(index)}>Jugar →</button></article>)}</section>
    <section id="arena" className="arcade-arena shell">{!game ? <div><p className="eyebrow">{games.length} JUEGOS FUNCIONALES</p><h2>Elige un reto</h2><p>Cada juego usa exclusivamente el corpus del alcance seleccionado.</p></div> : <>
      {game.kind === 'mixed' ? <RetoMixto scope={scope} onClose={() => setSelected(null)} /> : game.kind === 'listen' || game.kind === 'hanzi-listen' ? <ListenAndRecognize entries={listenSession.deck} initialDeck={listenSession.deck} initialAudio={listenSession.audio} onClose={() => setSelected(null)} onComplete={(correct) => { trackAnalyticsEvent('exercise_completed', { contentId: `${game.id}:listening`, correct }); if (correct) completeGame(); }} /> : <>
        <div className="practice-top"><div><p className="eyebrow">RONDA {round + 1}</p><h2>{game.name}</h2></div><b>{score} aciertos</b></div>
        {game.kind === 'hanzi' && game.hanziIndex !== undefined ? <><HanziArcade characters={hanziCharacters} key={`${game.id}-${round}`} gameIndex={game.hanziIndex} round={round} onScore={() => setScore((value) => value + 1)} onComplete={completeGame} /><div className="arena-actions"><button type="button" onClick={() => setRound((value) => value + 1)}>Otro carácter</button><button type="button" onClick={() => setSelected(null)}>Cerrar</button></div></> : <>
          {['tone', 'audio'].includes(exercise.dimension) && <SpeakButton text={exercise.answer} />}
          <p className="question"><Hanzi>{exercise.prompt}</Hanzi></p>
          {exercise.options ? <div className="option-grid">{exercise.options.map((option) => <button type="button" className={answer === option ? 'selected' : ''} onClick={() => setAnswer(option)} key={option}><Hanzi>{option}</Hanzi></button>)}</div> : <input className={`arcade-input ${hanziInputClass(answer)}`} value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && check()} placeholder="Tu respuesta" />}
          {message && <p className="rule-note"><Hanzi>{message}</Hanzi></p>}
          <div className="arena-actions"><button className="button button-primary" type="button" onClick={check}>Comprobar</button><button type="button" onClick={() => setSelected(null)}>Cerrar</button></div>
        </>}
      </>}
    </>}</section>
  </div>;
}
