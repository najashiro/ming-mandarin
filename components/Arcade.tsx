'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CharacterEntry, CurriculumScope, Exercise, ListeningEntry } from '@/data/types';
import { arcadeGames as games } from '@/data/arcade-games';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { RetoMixto } from './RetoMixto';
import { LiveSceneGame } from './games/live-scene/LiveSceneGame';
import { ConversationGame } from './games/conversation/ConversationGame';
import { HanziLabGame } from './games/hanzi-lab/HanziLabGame';
import { StoryDetective } from './games/story-detective/StoryDetective';
import { StudyTools } from './games/StudyTools';
import { MingIcon, type MingIconName } from './MingIcon';
import { getStudyScopeLabel } from '@/lib/study-options';
import { TimeGame } from './games/time/TimeGame';
import { PandaQuest } from './games/panda-quest/PandaQuest';
import { PandaLandscape } from './games/panda-quest/PandaArt';
import './games/games.css';
import './games/catalog.css';
const gameIcons: Record<string, MingIconName> = { scene: 'sun', conversation: 'chat', hanzi: 'write', story: 'book' };

type Props = { exercises: Exercise[]; hanziCharacters: CharacterEntry[]; listeningEntries: ListeningEntry[]; scope: CurriculumScope; playerName:string; canCompete:boolean; initialGame?: 'reto-mixto' | 'hora' | 'panda-quest' };
export function Arcade({ hanziCharacters, listeningEntries, scope, playerName, canCompete, initialGame }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number | null>(() => initialGame ? games.findIndex(item => item.id === initialGame) : null);
  const [shareStatus, setShareStatus] = useState<{ game: 'reto-mixto' | 'hora'; message: string } | null>(null);
  const [session, setSession] = useState(0);
  const game = selected === null ? null : games[selected];
  useEffect(() => {
    rootRef.current?.setAttribute('data-hydrated', 'true');
    if (selected === null) return;
    const frame = window.requestAnimationFrame(() => {
      const arena = rootRef.current?.querySelector<HTMLElement>('#arena');
      arena?.focus({ preventScroll: true });
      arena?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selected, session, scope]);
  function play(index: number, launcher: HTMLButtonElement) {
    launcherRef.current = launcher;
    if (games[index].kind !== 'mixed') trackAnalyticsEvent('game_started', { contentId: games[index].id + ':' + scope });
    setSelected(index); setSession(value => value + 1);
  }
  function close() {
    setSelected(null);
    window.requestAnimationFrame(() => {
      if (launcherRef.current?.isConnected) launcherRef.current.focus();
      else rootRef.current?.querySelector<HTMLElement>('.game-catalog-heading')?.focus();
    });
  }
  async function shareGame(gameId: 'reto-mixto' | 'hora') {
    const url = new URL(`/study/${scope}/games?game=${gameId}`, window.location.origin).toString();
    const title = gameId === 'hora' ? '现在几点？ · Míng' : 'Reto Mixto · Míng';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus({ game: gameId, message: 'Enlace copiado' });
    } catch {
      window.prompt('Copia el enlace del juego:', url);
    }
  }


  return <div className="arcade-root" ref={rootRef}>
    <div className="arcade-catalog" hidden={Boolean(game)}>
    <div className="game-catalog-heading shell" tabIndex={-1}><div><p className="eyebrow">ELIGE QUÉ QUIERES PRACTICAR</p><h2>Una habilidad, un reto.</h2><p>Responde a tu ritmo, revisa la solución y vuelve a intentarlo.</p></div><span className="game-scope-note"><MingIcon name="book" width="17" height="17"/>{getStudyScopeLabel(scope)}</span></div>
    <section className="game-grid ming-games-grid shell" aria-label="Juegos disponibles">{games.map((item, index) => scope === 'l4' && ['scene','conversation','story'].includes(item.kind) ? null : <article key={item.id} data-game={item.id}>
      <span className="game-skill-label">{item.skill}</span>
      {(item.kind === 'mixed' || item.kind === 'time') && <button className="game-share-button" type="button" onClick={() => void shareGame(item.id)} aria-label={`Compartir ${item.name}`} title={`Compartir ${item.name}`} data-share-path={`/study/${scope}/games?game=${item.id}`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.3 10.8 7.4-4.6m-7.4 7 7.4 4.6"/></svg></button>}
      {item.kind === 'quest' ? <div className="game-thumbnail thumbnail-quest" aria-hidden="true"><PandaLandscape/></div> : item.cover ? <div className="game-thumbnail game-cover" aria-hidden="true"><Image src={item.cover} alt="" fill loading={index === 0 ? 'eager' : 'lazy'} sizes="(max-width: 440px) 100vw, (max-width: 700px) 50vw, 33vw"/></div> : <div className={`game-thumbnail game-symbol thumbnail-${item.kind}`} aria-hidden="true"><MingIcon name={gameIcons[item.kind] ?? 'games'}/><span>{item.skill}</span></div>}
      <h2>{item.name}</h2><p>{item.description}</p>
      {scope === 'l1-l2-l3-l4' && ['scene','conversation','story'].includes(item.kind) && <small className="game-coverage">Con contenido de las lecciones 1–3</small>}
      {(item.kind === 'mixed' || item.kind === 'time') && <span className="game-share-status" role="status" aria-live="polite">{shareStatus?.game === item.id ? shareStatus.message : ''}</span>}
      {item.kind === 'vocabulary' ? <Link prefetch={false} className="game-play" href={`/study/${scope}/games/vocabulary-mix`}>Jugar <MingIcon name="arrow" width="18" height="18"/></Link> : <button className="game-play" type="button" onClick={event => play(index, event.currentTarget)}>Jugar <MingIcon name="arrow" width="18" height="18"/></button>}
    </article>)}</section><StudyTools entries={listeningEntries}/></div>
    <section id="arena" className="arcade-arena shell" tabIndex={-1} hidden={!game} aria-label={game ? "Juego: " + game.name : undefined}>{game && <div className="game-session-context"><span>{getStudyScopeLabel(scope)}</span><span>{game.skill}</span></div>}{!game ? null : game.kind === 'mixed' ? <RetoMixto key={scope} scope={scope} onClose={close}/> : <div className="new-game-shell" key={`${scope}-${selected}-${session}`}><header><div><h2>{game.name}</h2><p className="game-objective">{game.description}</p></div><button type="button" onClick={close}>Cerrar</button></header>
      {game.kind === 'scene' && <LiveSceneGame scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'conversation' && <ConversationGame scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'hanzi' && <HanziLabGame scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'story' && <StoryDetective scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'time' && <TimeGame playerName={playerName} canCompete={canCompete}/>}
      {game.kind === 'quest' && <PandaQuest scope={scope}/>}
    </div>}</section>
  </div>;
}
