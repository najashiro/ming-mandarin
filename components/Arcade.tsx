'use client';
import { useEffect, useRef, useState } from 'react';
import type { CharacterEntry, CurriculumScope, Exercise, ListeningEntry } from '@/data/types';
import { arcadeGames as games } from '@/data/arcade-games';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { RetoMixto } from './RetoMixto';
import { LiveSceneGame } from './games/live-scene/LiveSceneGame';
import { ConversationGame } from './games/conversation/ConversationGame';
import { HanziLabGame } from './games/hanzi-lab/HanziLabGame';
import { StoryDetective } from './games/story-detective/StoryDetective';
import { StudyTools } from './games/StudyTools';
import { Person } from './games/live-scene/SceneCard';
import { Hanzi } from './Hanzi';
import { TimeGame } from './games/time/TimeGame';
import './games/games.css';

type Props = { exercises: Exercise[]; hanziCharacters: CharacterEntry[]; listeningEntries: ListeningEntry[]; scope: CurriculumScope; playerName:string; canCompete:boolean; initialGame?: 'reto-mixto' };
export function Arcade({ hanziCharacters, listeningEntries, scope, playerName, canCompete, initialGame }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(() => initialGame ? 0 : null);
  const [shareStatus, setShareStatus] = useState('');
  const [session, setSession] = useState(0);
  const game = selected === null ? null : games[selected];
  useEffect(() => {
    rootRef.current?.setAttribute('data-hydrated', 'true');
    if (!initialGame) return;
    const frame = window.requestAnimationFrame(() => document.getElementById('arena')?.scrollIntoView({ behavior: 'auto', block: 'start' }));
    return () => window.cancelAnimationFrame(frame);
  }, [initialGame]);
  function play(index: number) {
    if (games[index].kind !== 'mixed') trackAnalyticsEvent('game_started', { contentId: `${games[index].id}:${scope}` });
    setSelected(index); setSession(value => value + 1);
    document.getElementById('arena')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
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


  return <div className="arcade-root" ref={rootRef}>
    <section className="game-grid ming-games-grid shell">{games.map((item, index) => <article key={item.id} data-game={item.id}>
      <span>{String(index + 1).padStart(2, '0')}</span>
      {item.kind === 'mixed' && <button className="game-share-button" type="button" onClick={() => void shareMixedChallenge()} aria-label="Compartir Reto Mixto" title="Compartir Reto Mixto" data-share-path={`/study/${scope}/games?game=reto-mixto`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.3 10.8 7.4-4.6m-7.4 7 7.4 4.6"/></svg></button>}
      <div className={`game-thumbnail thumbnail-${item.kind}`} aria-hidden="true">{item.kind === 'time' ? <span>◷</span> : item.kind === 'hanzi' ? <Hanzi>字</Hanzi> : item.kind === 'story' ? <span>▤ ⌕</span> : <><Person index={index}/><span>{item.kind === 'mixed' ? '✦' : item.kind === 'conversation' ? '•••' : '＋'}</span></>}</div>
      <h2>{item.name}</h2><p>{item.description}</p><small>{item.skill}</small>
      {item.kind === 'mixed' && <span className="game-share-status" role="status" aria-live="polite">{shareStatus}</span>}
      <button type="button" onClick={() => play(index)}>Jugar →</button>
    </article>)}</section><StudyTools entries={listeningEntries}/>
    <section id="arena" className="arcade-arena shell">{!game ? <div><p className="eyebrow">JUEGOS MÍNG</p><h2>Elige tu experiencia</h2><p>Escucha, observa, conversa, escribe y lee.</p></div> : game.kind === 'mixed' ? <RetoMixto scope={scope} onClose={() => setSelected(null)}/> : <div className="new-game-shell" key={`${selected}-${session}`}><header className={game.kind==='time'?'time-shell-header':undefined}>{game.kind!=='time'&&<h2>{game.name}</h2>}<button onClick={() => setSelected(null)}>Cerrar</button></header>
      {game.kind === 'scene' && <LiveSceneGame scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'conversation' && <ConversationGame scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'hanzi' && <HanziLabGame scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'story' && <StoryDetective scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'time' && <TimeGame playerName={playerName} canCompete={canCompete}/>}
    </div>}</section>
  </div>;
}
