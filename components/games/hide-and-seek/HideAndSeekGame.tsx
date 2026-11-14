'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMandarinAudioPlayer } from '@/lib/use-mandarin-audio-player';
import { hideAnimal, hideFeedback, hideFeedbackAudio, hideLocationAudio, hideQuestion, hideQuestionAudio, hideRoundAudio } from '@/lib/hide-and-seek-audio';
import { chooseHideSpot, hideClue, hideLevels, HIDE_GOAL, HIDE_LIVES, locations, nextHideRound, startHideGame, type HidePosition, type HideState } from '@/lib/hide-and-seek';
import { AnimalArt, GardenBackdrop, HidingPlace, PicnicTable } from './HideArtwork';
import { HideChinese } from './HideChinese';
import './hide-and-seek.css';

const shortMeanings: Record<HidePosition, string> = { above: 'encima', below: 'debajo', left: 'izquierda', right: 'derecha', behind: 'detrás', front: 'delante' };

function Confetti() {
  return <div className="hide-confetti" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <i key={i} style={{ left: `${i * 5}%`, animationDelay: `${(i % 5) * .13}s`, background: ['#dfaf4b', '#759d77', '#e19b86', '#fff5cf'][i % 4] }}/>)}</div>;
}

export function HideAndSeekGame() {
  const [game, setGame] = useState<HideState | null>(null);
  const [showAids, setShowAids] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const helpId = useId();
  const voice = useMandarinAudioPlayer();
  const round = game?.round;
  const clueAudio = useMemo(() => round ? hideRoundAudio(round) : [], [round]);
  const focusRef = useRef<HTMLDivElement>(null);
  const gameRootRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game && game.status !== 'searching') resultRef.current?.focus({ preventScroll: true });
  }, [game]);

  function focusRound() {
    requestAnimationFrame(() => {
      focusRef.current?.focus({ preventScroll: true });
      gameRootRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }
  function speakRound(next: HideState) {
    voice.play([hideQuestionAudio(next.round), ...hideRoundAudio(next.round)]);
  }
  function start() {
    const next = startHideGame();
    speakRound(next);
    setShowHelp(false);
    setGame(next);
    focusRound();
  }
  function choose(spot: HidePosition) {
    if (!game) return;
    const next = chooseHideSpot(game, spot);
    if (next === game) return;
    const correct = next.status === 'found' || next.status === 'won';
    // A lost adventure still teaches the answer before an explicit restart.
    voice.play([hideFeedbackAudio(correct), ...(next.status === 'missed' ? hideRoundAudio(next.round) : [])]);
    setGame(next);
    if (next.status === 'searching') requestAnimationFrame(() => gameRootRef.current?.querySelector<HTMLButtonElement>('.hide-spot:not(:disabled)')?.focus({ preventScroll: true }));
  }
  function advance() {
    if (!game) return;
    const next = nextHideRound(game);
    if (next === game) return;
    speakRound(next);
    setGame(next);
    focusRound();
  }

  const settings = <div className="hide-settings">
    <button type="button" className="hide-aids-toggle" aria-pressed={showAids} onClick={() => setShowAids(value => !value)}>Pinyin y Esp. <span className="hide-toggle-indicator" aria-hidden="true"/></button>
  </div>;
  const footer = <div className="hide-footer"><span>LECCIÓN 06 · UBICACIONES</span><span>Voz en mandarín generada por IA.</span></div>;
  const welcomeQuestion = hideQuestion({ level: 0 });

  if (!game) return <div className="hide-game hide-welcome"><div className="hide-intro">
    <div className="hide-intro-art">
      <GardenBackdrop/>
      <div className="hide-intro-animal"><AnimalArt animal="rabbit"/></div>
      <div className="hide-intro-bush"><HidingPlace position="front" open={false}/></div>
      <div className="hide-floating-word hide-word-one"><HideChinese text={welcomeQuestion.hanzi} pinyin={welcomeQuestion.pinyin} spanish={welcomeQuestion.spanish} aids={showAids}/></div>
      <span className="hide-garden-stamp">EL JARDÍN DE LOS ESCONDITES</span>
    </div>
    <div className="hide-intro-copy">
      <p className="hide-eyebrow">UNA AVENTURA DE LA LECCIÓN 06</p>
      <h3>Escucha. Observa.<br/><em>Encuentra a tu amigo.</em></h3>
      <p>Escucha la pregunta y la pista en chino. Encuentra al animal en el jardín.</p>
      <div className="hide-rules"><span><b>{HIDE_LIVES}</b> vidas por aventura</span><span><b>4</b> amigos por descubrir</span><span><b>100</b> puntos para ganar</span></div>
      <p className="hide-score-rule">Primer intento: +10 · Segundo intento: +5.<br/>Las vidas no se recuperan al avanzar. El segundo error termina la aventura.</p>
      {settings}
      <button type="button" className="hide-primary" onClick={start}>¡Vamos a buscar! <span aria-hidden="true">↗</span></button>
      <span className="hide-no-rush">Sin cronómetro. Aprende a tu ritmo.</span>
    </div>
  </div>{footer}</div>;

  const level = hideLevels[game.round.level], clue = hideClue(game.round);
  const question = hideQuestion(game.round), questionAudio = hideQuestionAudio(game.round);
  const resolved = game.status !== 'searching', won = game.status === 'won', missed = game.status === 'missed';
  const remaining = game.lives;
  const correct = game.status === 'found' || won;
  const feedback = hideFeedback(correct);
  const nextLevel = hideLevels[game.round.level + 1];
  const unlocked = game.status === 'found' && nextLevel && game.score >= nextLevel.minimum;

  return <div ref={gameRootRef} className={`hide-game hide-active hide-level-${game.round.level}${showAids ? ' with-aids' : ''}`}>
    <div className="hide-dashboard">
      <div className="hide-score">
        <strong data-testid="hide-score">{game.score}<small> / {HIDE_GOAL}</small></strong>
        <div className="hide-progress" role="progressbar" aria-label="Puntos de la aventura" aria-valuenow={game.score} aria-valuemin={0} aria-valuemax={HIDE_GOAL}><i style={{ width: `${game.score}%` }}/></div>
      </div>
      <span className="hide-lives" role="img" aria-label={`${remaining} ${remaining === 1 ? 'vida restante' : 'vidas restantes'}`}><span aria-hidden="true">{remaining > 0 ? '♥' : '♡'} {remaining > 1 ? '♥' : '♡'}</span></span>
      {settings}
    </div>
    <div className="hide-play-layout">
      <aside className="hide-prompt-panel" aria-label="Pregunta y pista">
        <div className="hide-question" role="heading" aria-level={3} tabIndex={-1} ref={focusRef}><HideChinese text={question.hanzi} pinyin={question.pinyin} spanish={question.spanish} aids={showAids} audioSrc={questionAudio} speaking={voice.activeSource === questionAudio}/></div>
        <div className="hide-clue-text" data-testid="hide-clue"><HideChinese text={clue.hanzi.replace(/。(?=.)/g, '。\n')} pinyin={clue.pinyin.replace(/\. /g, '.\n')} spanish={clue.spanish} aids={showAids} audioSrc={clueAudio} speaking={voice.activeSource !== null && clueAudio.includes(voice.activeSource)}/></div>
        {(voice.blocked || voice.failed) && <button className="hide-voice-notice" type="button" onClick={() => speakRound(game)}>Escuchar pregunta y pista</button>}
      </aside>
      <div className="hide-scene-column">
        <div className="hide-scene" role="group" aria-label="Escondites alrededor de la mesa">
          <GardenBackdrop/><PicnicTable/>
          <div className="hide-scene-heading"><span>El jardín de los escondites</span><span>Ronda {game.roundNumber + 1}</span></div>
          <div className="hide-scene-table-label"><HideChinese text="桌子" pinyin="zhuōzi" spanish="mesa" aids={showAids}/></div>
          {game.round.options.map((spot, index) => {
            const isTarget = resolved && spot === game.round.target, tried = game.guesses.includes(spot);
            return <button key={`${game.roundNumber}-${spot}`} type="button" className={`hide-spot hide-spot-${spot}${isTarget ? ' is-revealed' : ''}${tried && !isTarget ? ' is-empty' : ''}`} onClick={() => choose(spot)} disabled={resolved || tried} aria-label={`Buscar ${locations[spot].hanzi}: escondite ${index + 1}`} data-spot={spot}>
              {isTarget && <span className="hide-found-animal"><AnimalArt animal={level.animal}/></span>}
              <HidingPlace position={spot} open={isTarget}/>
              <span className="hide-spot-pin" aria-hidden="true">{isTarget ? '✓' : tried ? '×' : index + 1}</span>
            </button>;
          })}
          <button type="button" className="hide-help-toggle" aria-expanded={showHelp} aria-controls={helpId} onClick={() => setShowHelp(value => !value)}><span aria-hidden="true">?</span> Help</button>
          {correct && <Confetti/>}
        </div>
        {showHelp && <div id={helpId} className="hide-location-options" aria-label="Ubicaciones en chino">{game.round.options.map((spot, index) => <div key={spot} className={`hide-location-option${resolved && spot === game.round.target ? ' is-answer' : ''}`}>
          <button className="hide-location-number" type="button" onClick={() => choose(spot)} disabled={resolved || game.guesses.includes(spot)} aria-label={`Elegir escondite ${index + 1}: ${locations[spot].hanzi}`}>{index + 1}</button>
          <HideChinese text={locations[spot].hanzi} pinyin={locations[spot].pinyin} spanish={shortMeanings[spot]} aids={showAids} audioSrc={hideLocationAudio(spot)}/>
        </div>)}</div>}
      </div>
      <aside className="hide-result-panel" aria-label="Resultado">
        <div className="hide-feedback hide-sr-only" role="status" aria-live="polite" aria-atomic="true">
          {game.guesses.length > 0 && `${feedback.hanzi} ${feedback.spanish} ${!resolved ? 'Te queda una vida.' : missed ? `Fin de la aventura. ${clue.spanish}` : `Has ganado ${game.earned} puntos.`}`}
        </div>
        {resolved && <div className="hide-round-outcome" ref={resultRef} tabIndex={-1}>
          {game.status === 'found' && <>
            <div className="hide-round-summary"><strong className="hide-earned">+{game.earned}</strong>{unlocked ? <span>¡Nuevo amigo desbloqueado!</span> : game.streak >= 2 ? <span>✦ {game.streak} aciertos seguidos</span> : <span>¡Lo encontraste!</span>}</div>
            <button type="button" className="hide-primary" onClick={advance}>Siguiente escondite <span aria-hidden="true">→</span></button>
          </>}
          {missed && <div className="hide-game-over"><h3>¡Vamos de nuevo!</h3><button type="button" className="hide-primary" onClick={start}>Volver a intentarlo <span aria-hidden="true">↗</span></button></div>}
          {won && <div className="hide-victory"><span className="hide-victory-star" aria-hidden="true">✦</span><h3>¡Maestro del escondite!</h3><p>100 puntos y un jardín lleno de amigos.</p><div><span><b>{game.found}</b> encuentros</span><span><b>{game.bestStreak}</b> mejor racha</span></div><button type="button" className="hide-primary" onClick={start}>Jugar otra aventura <span aria-hidden="true">↗</span></button></div>}
        </div>}
      </aside>
      <div className="hide-collection" aria-label="Amigos de la aventura">{hideLevels.map((item, index) => {
        const animal = hideAnimal(item.animal);
        const count = game.collection[item.animal];
        return <div key={item.animal} className={game.score >= item.minimum ? 'is-unlocked' : ''}>
          <AnimalArt animal={item.animal}/>
          <HideChinese text={animal.hanzi} pinyin={animal.pinyin} spanish={animal.spanish} aids={showAids} audioSrc={animal.audioSrc}/>
          <small>{count > 0 ? `${count} ${count === 1 ? 'encontrado' : 'encontrados'}` : game.score >= item.minimum ? 'Desbloqueado' : `${item.minimum} puntos`}</small>
          <span className="hide-collection-check" aria-hidden="true">{count ? '✓' : `0${index + 1}`}</span>
        </div>;
      })}</div>
    </div>{footer}
  </div>;
}
