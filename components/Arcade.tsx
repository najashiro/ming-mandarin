'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CharacterEntry, CurriculumScope, Exercise, ListeningEntry } from '@/data/types';
import { arcadeGames as games, getArcadeGamePath, isArcadeGameAvailable, type ArcadeGame, type ArcadeGameId } from '@/data/arcade-games';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { RetoMixto } from './RetoMixto';
import { StudyTools } from './games/StudyTools';
import { MingIcon, type MingIconName } from './MingIcon';
import { getStudyScopeLabel } from '@/lib/study-options';
import { TimeGame } from './games/time/TimeGame';
import { WorkbookGameLinks } from './games/workbook/WorkbookGameLinks';
import { GameShareButton } from './games/GameShareButton';
import './games/games.css';
import './games/catalog.css';
// These games randomize their first round; initialize it once in the browser,
// including when a shared URL opens the game without visiting the catalog first.
const BirthdayGame = dynamic(() => import('./games/birthday/BirthdayGame').then(module => module.BirthdayGame), { ssr: false, loading: GameLoading });
const ConversationGame = dynamic(() => import('./games/conversation/ConversationGame').then(module => module.ConversationGame), { ssr: false, loading: GameLoading });
const HanziLabGame = dynamic(() => import('./games/hanzi-lab/HanziLabGame').then(module => module.HanziLabGame), { ssr: false, loading: GameLoading });
const HideAndSeekGame = dynamic(() => import('./games/hide-and-seek/HideAndSeekGame').then(module => module.HideAndSeekGame));
const gameIcons: Record<string, MingIconName> = { conversation: 'chat', hanzi: 'write' };

function GameLoading() {
  return <p role="status">Cargando juego…</p>;
}

type Props = { exercises: Exercise[]; hanziCharacters: CharacterEntry[]; listeningEntries: ListeningEntry[]; scope: CurriculumScope; playerName:string; canCompete:boolean; initialGame?: ArcadeGameId };
export function Arcade({ hanziCharacters, listeningEntries, scope, playerName, canCompete, initialGame }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<ArcadeGameId | null>(initialGame ?? null);
  const [session, setSession] = useState(0);
  const game = selected === null ? null : games.find(item => item.id === selected);
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
  function play(item: ArcadeGame, launcher: HTMLButtonElement) {
    launcherRef.current = launcher;
    if (item.kind !== 'mixed') trackAnalyticsEvent('game_started', { contentId: item.id + ':' + scope });
    setSelected(item.id); setSession(value => value + 1);
  }
  function close() {
    setSelected(null);
    window.requestAnimationFrame(() => {
      if (launcherRef.current?.isConnected) launcherRef.current.focus();
      else rootRef.current?.querySelector<HTMLElement>('.game-catalog-heading')?.focus();
    });
  }
  return <div className="arcade-root" ref={rootRef}>
    <div className="arcade-catalog" hidden={Boolean(game)}>
    <WorkbookGameLinks scope={scope}/>
    <div className="game-catalog-heading shell" tabIndex={-1}><div><p className="eyebrow">ELIGE QUÉ QUIERES PRACTICAR</p><h2>Una habilidad, un reto.</h2><p>Responde a tu ritmo, revisa la solución y vuelve a intentarlo.</p></div><span className="game-scope-note"><MingIcon name="book" width="17" height="17"/>{getStudyScopeLabel(scope)}</span></div>
    <section className="game-grid ming-games-grid shell" aria-label="Juegos disponibles">{games.filter(item => isArcadeGameAvailable(item, scope)).map((item, index) => <article key={item.id} data-game={item.id}>
      <span className="game-skill-label">{item.skill}</span>
      <GameShareButton name={item.name} href={getArcadeGamePath(scope, item)}/>
      {item.cover ? <div className="game-thumbnail game-cover" aria-hidden="true"><Image src={item.cover} alt="" fill loading={index === 0 ? 'eager' : 'lazy'} sizes="(max-width: 440px) 100vw, (max-width: 700px) 50vw, 33vw"/></div> : <div className={`game-thumbnail game-symbol thumbnail-${item.kind}`} aria-hidden="true"><MingIcon name={gameIcons[item.kind] ?? 'games'}/><span>{item.skill}</span></div>}
      <h2>{item.name}</h2><p>{item.description}</p>
      {scope === 'l1-l2-l3-l4' && ['scene','conversation','story'].includes(item.kind) && <small className="game-coverage">Con contenido de las lecciones 1–3</small>}
      {item.kind === 'vocabulary' || item.kind === 'directions' ? <Link prefetch={false} className="game-play" href={getArcadeGamePath(scope, item)}>Jugar <MingIcon name="arrow" width="18" height="18"/></Link> : <button className="game-play" type="button" onClick={event => play(item, event.currentTarget)}>Jugar <MingIcon name="arrow" width="18" height="18"/></button>}
    </article>)}</section><StudyTools entries={listeningEntries}/></div>
    <section id="arena" className="arcade-arena shell" tabIndex={-1} hidden={!game} aria-label={game ? "Juego: " + game.name : undefined}>{game && <div className="game-session-context"><span>{getStudyScopeLabel(scope)}</span><span>{game.skill}</span></div>}{!game ? null : game.kind === 'mixed' ? <RetoMixto key={scope} scope={scope} onClose={close}/> : <div className="new-game-shell" key={`${scope}-${selected}-${session}`}><header><div><h2>{game.name}</h2><p className="game-objective">{game.description}</p></div><button type="button" onClick={close}>Cerrar</button></header>
      {game.kind === 'conversation' && <ConversationGame scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'hanzi' && <HanziLabGame scope={scope} characters={hanziCharacters}/>}
      {game.kind === 'hide-and-seek' && <HideAndSeekGame/>}
      {game.kind === 'birthday' && <BirthdayGame scope={scope}/>}
      {game.kind === 'time' && <TimeGame playerName={playerName} canCompete={canCompete}/>}
    </div>}</section>
  </div>;
}
