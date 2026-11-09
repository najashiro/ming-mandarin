'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { stopMandarinAudio } from '@/components/SpeakButton';
import { hideLocationAudio, hideRoundAudio } from '@/lib/hide-and-seek-audio';
import { chooseHideSpot, hideClue, hideLevels, HIDE_GOAL, locations, nextHideRound, positions, startHideGame, type HidePosition, type HideState } from '@/lib/hide-and-seek';
import { AnimalArt, GardenBackdrop, HidingPlace, PicnicTable } from './HideArtwork';
import { HideChinese } from './HideChinese';
import './hide-and-seek.css';

const shortMeanings: Record<HidePosition, string> = { above: 'encima', below: 'debajo', left: 'izquierda', right: 'derecha', behind: 'detrás', front: 'delante' };
function Confetti() {
  return <div className="hide-confetti" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <i key={i} style={{ left: `${i * 5}%`, animationDelay: `${(i % 5) * .13}s`, background: ['#dfaf4b','#759d77','#e19b86','#fff5cf'][i % 4] }}/>)}</div>;
}

export function HideAndSeekGame() {
  const [game, setGame] = useState<HideState | null>(null);
  const [showAids, setShowAids] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [sound, setSound] = useState(false);
  const [audioSession, setAudioSession] = useState(0);
  const [automaticVoice, setAutomaticVoice] = useState(true);
  const [slowVoice, setSlowVoice] = useState(false);
  const [voiceBlocked, setVoiceBlocked] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const gameRootRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const round = game?.round;
  const clueAudio = useMemo(() => round ? hideRoundAudio(round) : [], [round]);
  const rate = slowVoice ? 0.75 : 1;
  useEffect(() => () => { void audioRef.current?.close().catch(() => {}); }, []);
  useEffect(() => { if (game && game.status !== 'searching') resultRef.current?.focus({ preventScroll: true }); }, [game]);

  function chime(success: boolean) {
    if (!sound) return;
    try {
      const context = audioRef.current ?? new AudioContext(); audioRef.current = context;
      void context.resume().catch(() => {});
      (success ? [523.25, 659.25, 783.99] : [293.66, 261.63]).forEach((note, i) => {
        const oscillator = context.createOscillator(), gain = context.createGain(), start = context.currentTime + i * .09;
        oscillator.type = 'sine'; oscillator.frequency.value = note;
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.055, start + .015); gain.gain.exponentialRampToValueAtTime(.001, start + .22);
        oscillator.connect(gain); gain.connect(context.destination); oscillator.start(start); oscillator.stop(start + .23);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch { /* Optional game effects never block Mandarin playback. */ }
  }
  function focusRound() { requestAnimationFrame(() => { focusRef.current?.focus({ preventScroll: true }); gameRootRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }); }
  function start() { stopMandarinAudio(); setAudioSession(value => value + 1); setVoiceBlocked(false); setGame(startHideGame()); setConfirmRestart(false); setShowGuide(false); focusRound(); }
  function choose(spot: HidePosition) {
    if (!game) return;
    const next = chooseHideSpot(game, spot); if (next === game) return;
    stopMandarinAudio(); chime(next.status === 'found' || next.status === 'won');
    setGame(current => current ? chooseHideSpot(current, spot) : current);
    if (next.status === 'searching') focusRef.current?.focus({ preventScroll: true });
  }
  function advance() {
    if (!game) return;
    stopMandarinAudio(); setVoiceBlocked(false); setGame(nextHideRound(game)); focusRound();
  }
  const settings = <div className="hide-settings" aria-label="Ayudas para todo el juego">
    <button type="button" className="hide-aids-toggle" aria-pressed={showAids} onClick={() => setShowAids(value => !value)}><span aria-hidden="true">Aa</span> Pinyin y traducción <span className="hide-toggle-indicator" aria-hidden="true"/></button>
    <div className="hide-audio-settings"><button type="button" aria-pressed={slowVoice} onClick={() => { stopMandarinAudio(); setSlowVoice(value => !value); }} title="Velocidad del audio" aria-label={slowVoice ? 'Activar velocidad normal' : 'Activar audio lento'}>{slowVoice ? '0,75×' : '1×'}</button><label><input type="checkbox" checked={automaticVoice} onChange={event => { stopMandarinAudio(); setAutomaticVoice(event.target.checked); setVoiceBlocked(false); }}/>Voz automática</label></div>
  </div>;

  if (!game) return <div className="hide-game hide-welcome">{settings}<div className="hide-intro">
    <div className="hide-intro-art"><GardenBackdrop/><div className="hide-intro-animal"><AnimalArt animal="rabbit"/></div><div className="hide-intro-bush"><HidingPlace position="front" open={false}/></div><div className="hide-floating-word hide-word-one"><HideChinese text="它在哪儿？" pinyin="Tā zài nǎr?" spanish="¿Dónde está?" aids={showAids} rate={rate}/></div><span className="hide-garden-stamp">EL JARDÍN DE LOS ESCONDITES</span></div>
    <div className="hide-intro-copy"><p className="hide-eyebrow">UNA AVENTURA DE LA LECCIÓN 06</p><h3>Escucha. Observa.<br/><em>Encuentra a tu amigo.</em></h3><p>Escucha la pista en chino y elige un escondite. Puedes tocar cualquier palabra u oración china para volver a escucharla.</p><div className="hide-rules"><span><b>2</b> intentos por ronda</span><span><b>4</b> amigos por descubrir</span><span><b>100</b> puntos para ganar</span></div><p className="hide-score-rule">Primer intento: +10 · Segundo intento: +5.<br/>Activa «Pinyin y traducción» cuando necesites ayuda.</p><button type="button" className="hide-primary" onClick={start}>¡Vamos a buscar! <span aria-hidden="true">↗</span></button><span className="hide-no-rush">Sin cronómetro · Voz en mandarín generada por IA.</span></div>
  </div></div>;

  const level = hideLevels[game.round.level], clue = hideClue(game.round);
  const resolved = game.status !== 'searching', won = game.status === 'won', remaining = 2 - game.guesses.length;
  const nextLevel = hideLevels[game.round.level + 1];
  const unlocked = game.status === 'found' && nextLevel && game.score >= nextLevel.minimum;
  return <div ref={gameRootRef} className={`hide-game hide-active hide-level-${game.round.level}${showAids ? ' with-aids' : ''}`}>
    {settings}
    <div className="hide-dashboard">
      <div className="hide-level-label"><span className="hide-level-number">0{game.round.level + 1}</span><div><span className="hide-eyebrow">{level.title}</span><strong>Busca {level.animal === 'turtle' ? 'a la' : 'al'} {level.name}</strong></div></div>
      <div className="hide-score"><div><span>Tu aventura</span><strong data-testid="hide-score">{game.score}<small> / {HIDE_GOAL}</small></strong></div><div className="hide-progress" role="progressbar" aria-label="Puntos de la aventura" aria-valuenow={game.score} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${game.score}%` }}/>{[25,50,75].map(n=><span key={n} style={{left:`${n}%`}}/>)}</div></div>
      <div className="hide-tools"><button type="button" aria-pressed={sound} onClick={() => setSound(value => !value)} aria-label={sound ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido'} title="Efectos del juego; la voz se controla por separado">♪</button><button type="button" onClick={() => setConfirmRestart(true)}>Reiniciar</button></div>
    </div>
    {confirmRestart && <div className="hide-restart" role="group" aria-label="Confirmar reinicio"><p>¿Empezar una aventura nueva? Tu marcador volverá a cero.</p><button type="button" className="hide-primary" onClick={start}>Sí, empezar de nuevo</button><button type="button" onClick={() => setConfirmRestart(false)}>Seguir jugando</button></div>}
    <div className="hide-play-layout">
      <div className="hide-scene-column"><div className="hide-scene-heading"><span>EL JARDÍN DE LOS ESCONDITES</span><span>Ronda {game.roundNumber + 1}</span></div>
        <div className="hide-scene" role="group" aria-label="Escondites alrededor de la mesa" aria-describedby="hide-perspective">
          <GardenBackdrop/><PicnicTable/>
          <div className="hide-scene-table-label"><HideChinese text="桌子" pinyin="zhuōzi" spanish="mesa" aids={showAids} rate={rate}/></div>
          {game.round.options.map((spot, index) => {
            const isTarget = resolved && spot === game.round.target, tried = game.guesses.includes(spot);
            return <button key={`${game.roundNumber}-${spot}`} type="button" className={`hide-spot hide-spot-${spot}${isTarget ? ' is-revealed' : ''}${tried && !isTarget ? ' is-empty' : ''}`} onClick={() => choose(spot)} disabled={resolved || tried} aria-label={`Buscar ${locations[spot].hanzi}: escondite ${index + 1}`} data-spot={spot}>
              {isTarget && <span className="hide-found-animal"><AnimalArt animal={level.animal}/></span>}<HidingPlace position={spot} open={isTarget}/><span className="hide-spot-pin" aria-hidden="true">{isTarget ? '✓' : tried ? '×' : index + 1}</span>
            </button>;
          })}
          {(game.status === 'found' || won) && <Confetti/>}
        </div>
        <div className="hide-location-options" aria-label="Ubicaciones en chino">{game.round.options.map((spot, index) => <div key={spot} className={`hide-location-option${resolved && spot === game.round.target ? ' is-answer' : ''}`}>
          <button className="hide-location-number" type="button" onClick={() => choose(spot)} disabled={resolved || game.guesses.includes(spot)} aria-label={`Elegir escondite ${index + 1}: ${locations[spot].hanzi}`}>{index + 1}</button>
          <HideChinese text={locations[spot].hanzi} pinyin={locations[spot].pinyin} spanish={shortMeanings[spot]} aids={showAids} audioSrc={hideLocationAudio(spot)} rate={rate}/>
        </div>)}</div>
        <p id="hide-perspective" className="hide-perspective">Toca un escondite o su número para elegir. Pulsa los caracteres para escuchar su pronunciación.</p>
        <div className="hide-collection" aria-label="Amigos de la aventura">{hideLevels.map((item, index) => <div key={item.animal} className={game.score >= item.minimum ? 'is-unlocked' : ''}><AnimalArt animal={item.animal}/><span>{item.name}<small>{game.collection[item.animal] > 0 ? `${game.collection[item.animal]} ${game.collection[item.animal] === 1 ? 'encontrado' : 'encontrados'}` : game.score >= item.minimum ? '¡Desbloqueado!' : `${item.minimum} puntos`}</small></span><span className="hide-collection-check" aria-hidden="true">{game.collection[item.animal] ? '✓' : `0${index + 1}`}</span></div>)}</div>
      </div>
      <aside className="hide-clue-panel" aria-label="Pistas y resultado">
        <div className="hide-clue-top"><span className="hide-eyebrow">{game.round.excluded ? 'ESCUCHA LAS DOS PISTAS' : 'ESCUCHA LA PISTA'}</span><span className="hide-lives" aria-label={`${remaining} ${remaining === 1 ? 'intento restante' : 'intentos restantes'}`}><span aria-hidden="true">{remaining > 0 ? '♥' : '♡'} {remaining > 1 ? '♥' : '♡'}</span></span></div>
        <div className="hide-question" role="heading" aria-level={3} tabIndex={-1} ref={focusRef}><HideChinese text="它在哪儿？" pinyin="Tā zài nǎr?" spanish="¿Dónde está?" aids={showAids} rate={rate}/></div>
        <div className="hide-clue-text" data-testid="hide-clue"><HideChinese key={`${audioSession}-${game.roundNumber}`} text={clue.hanzi.replace(/。(?=.)/g, '。\n')} pinyin={clue.pinyin.replace(/\. /g, '.\n')} spanish={clue.spanish} aids={showAids} audioSrc={clueAudio} rate={rate} autoPlayKey={automaticVoice ? `${audioSession}-${game.roundNumber}` : undefined} onBlocked={() => setVoiceBlocked(true)}/></div>
        {voiceBlocked && <p className="hide-voice-notice" role="status">Pulsa la pista o su icono de audio para escucharla.</p>}
        <p className="hide-audio-note">Pulsa la oración para volver a escucharla.<br/><small>Voz en mandarín generada por IA.</small></p>
        <div className="hide-feedback" ref={resultRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true">
          {game.status === 'searching' ? game.guesses.length === 0 ? <><b>¿Ya sabes dónde se esconde?</b><p>Elige un lugar del jardín. Tienes dos intentos.</p></> : <div className="hide-hint"><b>Por aquí no está… ¡Te queda un intento!</b><p>Escucha otra vez. Puedes activar pinyin y traducción arriba.</p></div> : <>
            <span className={`hide-result-badge ${game.status === 'missed' ? 'is-missed' : ''}`}>{game.status === 'missed' ? 'Un escondite muy astuto' : `¡Lo encontraste! +${game.earned}`}</span>
            <HideChinese text={locations[game.round.target].hanzi} pinyin={locations[game.round.target].pinyin} spanish={locations[game.round.target].meaning} aids={showAids} rate={rate}/>
            {game.status === 'missed' && <p>Ahora puedes ver su escondite. Escucha la palabra y vuelve a intentarlo.</p>}
            {game.streak >= 2 && <p className="hide-streak">✦ ¡{game.streak} aciertos seguidos al primer intento!</p>}
            {unlocked && <p className="hide-unlock">¡Nuevo amigo! Ahora se esconde {nextLevel.animal === 'turtle' ? 'la' : 'el'} {nextLevel.name}.</p>}
          </>}
        </div>
        {resolved && !won && <button type="button" className="hide-primary" onClick={advance}>{unlocked ? `¡Buscar ${nextLevel.animal === 'turtle' ? 'a la' : 'al'} ${nextLevel.name}!` : 'Siguiente escondite'} <span aria-hidden="true">→</span></button>}
        {won && <div className="hide-victory"><span className="hide-victory-star" aria-hidden="true">✦</span><h3>¡Maestro del escondite!</h3><p>100 puntos y un jardín lleno de amigos.</p><div><span><b>{game.found}</b> encuentros</span><span><b>{game.bestStreak}</b> mejor racha</span></div><button type="button" className="hide-primary" onClick={start}>Jugar otra aventura ↗</button></div>}
        <button className="hide-guide-toggle" type="button" aria-expanded={showGuide} aria-controls="hide-guide" onClick={() => setShowGuide(value => !value)}>{showGuide ? 'Cerrar' : 'Abrir'} cuaderno de pistas <span aria-hidden="true">{showGuide ? '−' : '+'}</span></button>
        {showGuide && <div className="hide-guide" id="hide-guide"><p>Escucha las palabras y fíjate en la negación.</p><div className="hide-grammar-pair"><HideChinese text="在" pinyin="zài" spanish="está en" aids={showAids} rate={rate}/><HideChinese text="不在" pinyin="bú zài" spanish="no está en" aids={showAids} rate={rate}/></div>{positions.map(spot => <HideChinese key={spot} text={locations[spot].hanzi} pinyin={locations[spot].pinyin} spanish={locations[spot].meaning} aids={showAids} rate={rate}/>)}</div>}
      </aside>
    </div><div className="hide-footer"><span>LECCIÓN 06 · UBICACIONES</span><span>+10 al primero · +5 al segundo · dos intentos por ronda</span></div>
  </div>;
}
