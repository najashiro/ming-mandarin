'use client';

import { useEffect, useRef, useState } from 'react';
import { chooseHideSpot, hideClue, hideLevels, HIDE_GOAL, locations, nextHideRound, positions, startHideGame, type HidePosition, type HideState } from '@/lib/hide-and-seek';
import { AnimalArt, GardenBackdrop, HidingPlace, PicnicTable } from './HideArtwork';
import './hide-and-seek.css';

const spotNames: Record<HidePosition, string> = { above: 'Encima', below: 'Debajo', left: 'Izquierda', right: 'Derecha', behind: 'Detrás', front: 'Delante' };

function Confetti() {
  return <div className="hide-confetti" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <i key={i} style={{ left: `${i * 5}%`, animationDelay: `${(i % 5) * .13}s`, background: ['#dfaf4b','#759d77','#e19b86','#fff5cf'][i % 4] }}/>)}</div>;
}

export function HideAndSeekGame() {
  const [game, setGame] = useState<HideState | null>(null);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [sound, setSound] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const focusRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => { void audioRef.current?.close().catch(() => {}); }, []);
  useEffect(() => { if (game && game.status !== 'searching') resultRef.current?.focus({ preventScroll: true }); }, [game]);

  function chime(success: boolean) {
    if (!sound) return;
    try {
      const context = audioRef.current ?? new AudioContext();
      audioRef.current = context;
      void context.resume().catch(() => {});
      (success ? [523.25, 659.25, 783.99] : [293.66, 261.63]).forEach((note, i) => {
        const oscillator = context.createOscillator(), gain = context.createGain();
        const start = context.currentTime + i * .09;
        oscillator.type = 'sine'; oscillator.frequency.value = note;
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.055, start + .015); gain.gain.exponentialRampToValueAtTime(.001, start + .22);
        oscillator.connect(gain); gain.connect(context.destination); oscillator.start(start); oscillator.stop(start + .23);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch { /* Sound is optional; play remains available without Web Audio. */ }
  }
  function start() { setGame(startHideGame()); setShowPinyin(true); setConfirmRestart(false); setShowGuide(false); requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true })); }
  function choose(spot: HidePosition) {
    if (!game) return;
    const next = chooseHideSpot(game, spot);
    if (next === game) return;
    chime(next.status === 'found' || next.status === 'won');
    setGame(current => current ? chooseHideSpot(current, spot) : current);
  }
  function advance() {
    if (!game) return;
    const next = nextHideRound(game);
    if (next.round.level !== game.round.level) setShowPinyin(next.round.level < 2);
    setGame(next); requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true }));
  }

  if (!game) return <div className="hide-game hide-intro">
    <div className="hide-intro-art"><GardenBackdrop/><div className="hide-intro-animal"><AnimalArt animal="rabbit"/></div><div className="hide-intro-bush"><HidingPlace position="front" open={false}/></div><span className="hide-floating-word hide-word-one" lang="zh">在哪儿？</span><span className="hide-floating-word hide-word-two">¡Encuéntrame!</span><span className="hide-garden-stamp">EL JARDÍN DE LOS ESCONDITES</span></div>
    <div className="hide-intro-copy"><p className="hide-eyebrow">UNA AVENTURA DE LA LECCIÓN 06</p><h3>Pequeñas huellas.<br/><em>Grandes descubrimientos.</em></h3><p>Alguien se esconde en el jardín. Descifra la pista en chino, explora alrededor de la mesa y haz que salga de su escondite.</p>
      <div className="hide-rules"><span><b>2</b> intentos por ronda</span><span><b>4</b> amigos por descubrir</span><span><b>100</b> puntos para ganar</span></div>
      <p className="hide-score-rule">Primer intento: +10 · Segundo intento: +5.<br/>Si fallas los dos, descubres la respuesta y sigues jugando.</p>
      <button type="button" className="hide-primary" onClick={start}>¡Vamos a buscar! <span aria-hidden="true">↗</span></button><span className="hide-no-rush">Sin cronómetro. Aquí se aprende explorando.</span>
    </div>
  </div>;

  const level = hideLevels[game.round.level], clue = hideClue(game.round);
  const resolved = game.status !== 'searching', won = game.status === 'won';
  const remaining = 2 - game.guesses.length;
  const nextLevel = hideLevels[game.round.level + 1];
  const unlocked = game.status === 'found' && nextLevel && game.score >= nextLevel.minimum;
  return <div className={`hide-game hide-active hide-level-${game.round.level}`}>
    <div className="hide-dashboard">
      <div className="hide-level-label"><span className="hide-level-number">0{game.round.level + 1}</span><div><span className="hide-eyebrow">{level.title}</span><strong>Busca al {level.name}</strong></div></div>
      <div className="hide-score"><div><span>Tu aventura</span><strong data-testid="hide-score">{game.score}<small> / {HIDE_GOAL}</small></strong></div><div className="hide-progress" role="progressbar" aria-label="Puntos de la aventura" aria-valuenow={game.score} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${game.score}%` }}/>{[25,50,75].map(n=><span key={n} style={{left:`${n}%`}}/>)}</div></div>
      <div className="hide-tools"><button type="button" aria-pressed={sound} onClick={() => setSound(value => !value)} aria-label={sound ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido'}>{sound ? '♪ Sonido' : '♪ Sin sonido'}</button><button type="button" onClick={() => setConfirmRestart(true)}>Reiniciar</button></div>
    </div>
    {confirmRestart && <div className="hide-restart" role="group" aria-label="Confirmar reinicio"><p>¿Empezar una aventura nueva? Tu marcador volverá a cero.</p><button type="button" className="hide-primary" onClick={start}>Sí, empezar de nuevo</button><button type="button" onClick={() => setConfirmRestart(false)}>Seguir jugando</button></div>}
    <div className="hide-play-layout">
      <div className="hide-scene-column"><div className="hide-scene-heading"><span>EL JARDÍN DE LOS ESCONDITES</span><span>Ronda {game.roundNumber + 1}</span></div>
        <div className="hide-scene" role="group" aria-label="Escondites alrededor de la mesa" aria-describedby="hide-perspective">
          <GardenBackdrop/><PicnicTable/>
          <span className="hide-scene-table-label">桌子 <small>zhuōzi · mesa</small></span>
          {game.round.options.map(spot => {
            const isTarget = resolved && spot === game.round.target, tried = game.guesses.includes(spot);
            return <button key={`${game.roundNumber}-${spot}`} type="button" className={`hide-spot hide-spot-${spot}${isTarget ? ' is-revealed' : ''}${tried && !isTarget ? ' is-empty' : ''}`} onClick={() => choose(spot)} disabled={resolved || tried} aria-label={`Buscar ${locations[spot].meaning}`} data-spot={spot}>
              {isTarget && <span className="hide-found-animal"><AnimalArt animal={level.animal}/></span>}
              <HidingPlace position={spot} open={isTarget}/>
              <span className="hide-spot-pin" aria-hidden="true">{isTarget ? '✓' : tried ? '×' : '?'}</span>
              <span className="hide-spot-label">{spotNames[spot]}</span>
            </button>;
          })}
          {(game.status === 'found' || won) && <Confetti/>}
        </div><p id="hide-perspective" className="hide-perspective">Mira desde tu lado de la pantalla: <b>delante</b> está más cerca de ti; <b>detrás</b>, al otro lado de la mesa.</p>
        <div className="hide-collection" aria-label="Amigos de la aventura">{hideLevels.map((item, index) => <div key={item.animal} className={game.score >= item.minimum ? 'is-unlocked' : ''}><AnimalArt animal={item.animal}/><span>{item.name}<small>{game.collection[item.animal] > 0 ? `${game.collection[item.animal]} encontrados` : game.score >= item.minimum ? '¡Desbloqueado!' : `${item.minimum} puntos`}</small></span><span className="hide-collection-check" aria-hidden="true">{game.collection[item.animal] ? '✓' : `0${index + 1}`}</span></div>)}</div>
      </div>
      <aside className="hide-clue-panel" aria-label="Pistas y resultado">
        <div className="hide-clue-top"><span className="hide-eyebrow">{game.round.excluded ? 'LEE LAS DOS PISTAS' : 'SIGUE LA PISTA'}</span><span className="hide-lives" aria-label={`${remaining} intentos restantes`}><span aria-hidden="true">{remaining > 0 ? '♥' : '♡'} {remaining > 1 ? '♥' : '♡'}</span></span></div>
        <h3 tabIndex={-1} ref={focusRef}>¿Dónde está el {level.name}?</h3>
        <div className="hide-clue-text" lang="zh" data-testid="hide-clue">{game.round.excluded && <p className="hide-negative">它<span>不在</span>桌子{locations[game.round.excluded].hanzi}。</p>}<p>它在桌子<strong>{locations[game.round.target].hanzi}</strong>。</p></div>
        <button className="hide-pinyin-toggle" type="button" aria-pressed={showPinyin} onClick={() => setShowPinyin(value => !value)}>{showPinyin ? 'Ocultar pinyin' : 'Ver pinyin'}</button>
        {showPinyin && <p className="hide-pinyin" lang="zh-Latn">{clue.pinyin}</p>}
        <div className="hide-feedback" ref={resultRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true">
          {game.status === 'searching' ? game.guesses.length === 0 ? <><b>Toca un escondite del jardín.</b><p>Tienes dos intentos. ¡Busca las huellas!</p></> : <div className="hide-hint"><b>Por aquí no está… ¡Te queda un intento!</b><p>Pista extra: {clue.spanish}</p></div> : <>
            <span className={`hide-result-badge ${game.status === 'missed' ? 'is-missed' : ''}`}>{game.status === 'missed' ? 'Un escondite muy astuto' : `¡Lo encontraste! +${game.earned}`}</span>
            <p><strong lang="zh">{locations[game.round.target].hanzi}</strong> · {clue.spanish}</p>
            {game.status === 'missed' && <p>El {level.name} sale para enseñarte su escondite. La próxima es tuya.</p>}
            {game.streak >= 2 && <p className="hide-streak">✦ ¡{game.streak} aciertos seguidos al primer intento!</p>}
            {unlocked && <p className="hide-unlock">¡Nuevo amigo! Ahora se esconde el {nextLevel.name}. {nextLevel.description}</p>}
          </>}
        </div>
        {resolved && !won && <button type="button" className="hide-primary" onClick={advance}>{unlocked ? `¡Buscar al ${nextLevel.name}!` : 'Siguiente escondite'} <span aria-hidden="true">→</span></button>}
        {won && <div className="hide-victory"><span className="hide-victory-star" aria-hidden="true">✦</span><h3>¡Maestro del escondite!</h3><p>100 puntos y un jardín lleno de amigos.</p><div><span><b>{game.found}</b> encuentros</span><span><b>{game.bestStreak}</b> mejor racha</span></div><button type="button" className="hide-primary" onClick={start}>Jugar otra aventura ↗</button></div>}
        <button className="hide-guide-toggle" type="button" aria-expanded={showGuide} aria-controls="hide-guide" onClick={() => setShowGuide(value => !value)}>{showGuide ? 'Cerrar' : 'Abrir'} cuaderno de pistas <span aria-hidden="true">{showGuide ? '−' : '+'}</span></button>
        {showGuide && <div className="hide-guide" id="hide-guide"><p>La fórmula: <b lang="zh">它 + 在 + 桌子 + ubicación</b>.<br/>«Está…» · <span lang="zh">不在</span> significa «no está».</p>{positions.map(spot => <div key={spot}><strong lang="zh">{locations[spot].hanzi}</strong><span>{locations[spot].pinyin}<small>{locations[spot].meaning}</small></span></div>)}</div>}
      </aside>
    </div>
    <div className="hide-footer"><span>LECCIÓN 06 · 在 + LUGAR</span><span>+10 al primero · +5 al segundo · dos intentos por ronda</span></div>
  </div>;
}
