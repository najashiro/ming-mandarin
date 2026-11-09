'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cardinalWords, relativeWords, directionMissions, hintWord, journeyStars, moveJourney, parseProgress, progressKey, rescueJourney, startJourney, type DirectionWord, type SavedJourney } from '@/data/directions-game';
import type { CurriculumScope } from '@/data/types';
import { CallerAvatar, DirectionMap } from './DirectionMap';
import { DirectionLearningProvider, DirectionReadout, DirectionText, useDirectionLearning } from './DirectionLearning';
import './directions.css';

type Stage = 'welcome' | 'playing' | 'complete';
const callResponses = { start: '', walk: '好。', wall: '等一下，你说什么？', fall: '等一下！', checkpoint: '我在这儿。', star: '谢谢你。', arrived: '好，谢谢你。', rescue: '好。' };

export function DirectionsGame({ scope }: { scope: CurriculumScope }) {
  return <DirectionLearningProvider><DirectionsAdventure scope={scope}/></DirectionLearningProvider>;
}

function DirectionsAdventure({ scope }: { scope: CurriculumScope }) {
  const { showReading, toggleReading, play, stop } = useDirectionLearning();
  const [level, setLevel] = useState(0);
  const [stage, setStage] = useState<Stage>('welcome');
  const mission = directionMissions[level];
  const [journey, setJourney] = useState(() => startJourney(directionMissions[0]));
  const [progress, setProgress] = useState<SavedJourney>({ version: 1, best: {} });
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [help, setHelp] = useState(false);
  const [usedHelp, setUsedHelp] = useState(false);
  const [hint, setHint] = useState<DirectionWord | null>(null);
  const [history, setHistory] = useState<DirectionWord[]>([]);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Load browser-only progress after hydration; the server and first render agree.
    const frame = requestAnimationFrame(() => {
      try { setProgress(parseProgress(localStorage.getItem(progressKey))); }
      catch { setStorageAvailable(false); }
    });
    return () => { cancelAnimationFrame(frame); if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    if (journey.status === 'won' || journey.status === 'lost' || stage === 'complete') resultRef.current?.focus({ preventScroll: true });
  }, [journey.status, stage]);

  function begin(index: number) {
    if (timer.current) clearTimeout(timer.current);
    busyRef.current = false; setBusy(false);
    setLevel(index); setJourney(startJourney(directionMissions[index])); setStage('playing');
    setHistory([]); setHelp(false); setUsedHelp(showReading); setHint(null);
    play(`你好，请问${directionMissions[index].destination}在哪儿？`);
    requestAnimationFrame(() => { gameRef.current?.focus({ preventScroll: true }); gameRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' }); });
  }
  function send(word: DirectionWord) {
    if (busyRef.current || journey.status !== 'playing') return;
    play(word);
    busyRef.current = true; setBusy(true); setHint(null);
    const next = moveJourney(mission, journey, word);
    setJourney(next); setHistory(items => [...items.slice(-5), word]);
    if (next.status === 'won') {
      const saved: SavedJourney = { version: 1, best: { ...progress.best, [mission.id]: Math.max(progress.best[mission.id] ?? 0, journeyStars(next, usedHelp)) } };
      setProgress(saved);
      try { localStorage.setItem(progressKey, JSON.stringify(saved)); } catch { setStorageAvailable(false); }
    }
    timer.current = setTimeout(() => { busyRef.current = false; setBusy(false); }, 290);
  }
  function finish() { setStage('complete'); play('谢谢你，再见！'); }
  const words = mission.relative ? relativeWords : cardinalWords;
  // Choices are deliberately not laid out as a directional pad: read the characters.
  const choices = [words[(level + 1) % 4], words[(level + 3) % 4], words[level % 4], words[(level + 2) % 4]];
  const savedStars = Object.values(progress.best).reduce((sum, value) => sum + value, 0);
  const currentStars = journeyStars(journey, usedHelp);
  const nextUnfinished = directionMissions.findIndex(item => !progress.best[item.id]);
  const callText = journey.last === 'start' ? `你好，请问${mission.destination}在哪儿？` : callResponses[journey.last];
  const feedback = journey.last === 'wall' ? 'Hay un seto. Prueba otra dirección; no pierdes una vida.'
    : journey.last === 'fall' ? '¡Ups, una alcantarilla! La cuerda de rescate está lista.'
    : journey.last === 'checkpoint' ? 'Punto de rescate activado. Volverás aquí si te caes.'
    : journey.last === 'star' ? '¡Una estrella para el viaje! Sigue buscando el destino.'
    : journey.last === 'rescue' ? 'De vuelta en tierra firme. Mira el mapa y prueba otra ruta.'
    : mission.relative ? 'La punta naranja indica hacia dónde mira. Cada paso cambia su orientación.' : 'Norte arriba. Cada señal avanza una casilla del mapa.';

  return <div className="directions-game" ref={gameRef} tabIndex={-1} data-reading={showReading} data-stage={stage} data-status={journey.status} data-level={level}>
    <header className="directions-topbar"><Link href={`/study/${scope}/games`} className="directions-back">← Juegos Míng</Link><span className="directions-brand">MÍNG <i>EN LÍNEA</i></span><button type="button" className="directions-reading-toggle" aria-pressed={showReading} onClick={() => { toggleReading(); if (!showReading && stage === 'playing' && journey.status === 'playing') setUsedHelp(true); }}><span className="directions-toggle-track" aria-hidden="true"><i/></span><span>Pinyin + español</span></button><span className="directions-total" aria-label={`${savedStars} de 18 estrellas`}>✦ {savedStars}<small> / 18</small></span></header>
    {stage === 'welcome' ? <>
      <section className="directions-intro">
        <div className="directions-intro-copy"><p className="directions-kicker"><span/> UNA AVENTURA DE LA LECCIÓN 06</p><h1>Una llamada.<br/>Mil vueltas.<br/><em>Tú tienes el mapa.</em></h1><p>Tu amigo se ha perdido. Contesta, lee el mapa y guíalo usando solo caracteres chinos. Un paso en falso… ¡y toca rescate!</p>
          <button type="button" className="directions-primary" onClick={() => begin(nextUnfinished < 0 ? 0 : nextUnfinished)}><PhoneIcon/>{savedStars ? 'Continuar la aventura' : 'Contestar la llamada'}<span>↗</span></button>
          <div className="directions-intro-tags"><span>6 mapas</span><span>Sin cronómetro</span><span>Solo hanzi</span></div>
        </div>
        <div className="directions-intro-art"><DirectionMap mission={directionMissions[0]} journey={startJourney(directionMissions[0])} preview/><div className="directions-incoming"><div className="directions-avatar"><CallerAvatar/></div><div><small>LLAMADA ENTRANTE</small><DirectionReadout text="林娜" className="directions-preview-name"/><DirectionReadout text="图书馆在哪儿？" className="directions-preview-question"/></div><span className="directions-ring"><PhoneIcon/></span></div><span className="directions-art-note">Una buena dirección lo cambia todo.</span></div>
      </section>
      <section className="directions-how" aria-label="Cómo jugar"><div><b>01</b><h2>Lee el mapa</h2><p>Busca el edificio que te pide. El norte siempre está arriba.</p></div><div><b>02</b><h2>Envía una señal</h2><p>Elige una palabra china para avanzar una casilla. Las señales son ubicaciones abreviadas.</p></div><div><b>03</b><h2>Cuida a tu amigo</h2><p>Evita los agujeros, recoge estrellas y activa las tiendas de rescate.</p></div></section>
      <MissionPicker progress={progress} onSelect={begin}/>
    </> : stage === 'complete' ? <section className="directions-finale"><div className="directions-finale-art"><CallerAvatar/><span>✦</span><CallerAvatar alternate/></div><p className="directions-kicker">TODOS EN SU DESTINO</p><h1 ref={resultRef} tabIndex={-1}>¡Qué bueno tenerte al otro lado!</h1><DirectionReadout text="谢谢你，再见！" className="directions-chinese"/><p>Completaste las seis llamadas. Ganaste {savedStars} de 18 estrellas.</p><button type="button" className="directions-primary" onClick={() => { stop(); setStage('welcome'); }}>Volver a los mapas</button><MissionPicker progress={progress} onSelect={begin}/></section> : <>
      <section className="directions-mission-heading"><div><p className="directions-kicker">LLAMADA {String(level + 1).padStart(2, '0')} / 06 · {mission.relative ? 'DESDE SU PUNTO DE VISTA' : 'PUNTOS CARDINALES'}</p><h1>{mission.title}</h1><p>{mission.subtitle}</p></div><div className="directions-route-progress" aria-label={`Mapa ${level + 1} de 6`}>{directionMissions.map((item, index) => <span key={item.id} className={index === level ? 'active' : progress.best[item.id] ? 'done' : ''}/>)}</div></section>
      <div className="directions-play-layout">
        <section className="directions-map-panel" aria-label="Mapa del recorrido"><div className="directions-map-toolbar"><DirectionReadout text="地图" className="directions-map-title"/><DirectionReadout text="北" className="directions-compass-title"/><span className="directions-hearts" aria-label={`${journey.hearts} vidas restantes`}>{'♥'.repeat(journey.hearts)}<i>{'♡'.repeat(3 - journey.hearts)}</i></span></div><DirectionMap mission={mission} journey={journey}/><div className="directions-map-legend"><span><i className="legend-hole"/>Agujero</span><span><i className="legend-camp"/>Rescate</span><span className="directions-loot">✦ {journey.collected.length}/2</span><span>{journey.moves} pasos</span></div></section>
        <section className="directions-phone" aria-label="Llamada de ayuda"><div className="directions-call-status"><span/><span>EN LLAMADA</span><div className="directions-signal" aria-hidden="true"><i/><i/><i/><i/></div></div>
          <div className="directions-caller"><div className="directions-avatar"><CallerAvatar alternate={mission.caller === '大为'}/></div><div><DirectionReadout text={mission.caller} className="directions-caller-name"/><small className="directions-caller-note">Confía en ti para llegar</small></div><PhoneIcon/></div>
          <div className="directions-destination"><small>DESTINO</small><DirectionReadout text={mission.destination} className="directions-destination-name"/><span aria-hidden="true">⚑</span></div>
          <div className="directions-conversation" aria-live="polite" aria-atomic="true"><DirectionReadout text={callText} className="directions-bubble"/><p className="directions-feedback">{feedback}</p></div>
          {(journey.status === 'won' || journey.status === 'lost') ? <div className={`directions-result ${journey.status}`}>
            <h2 ref={resultRef} tabIndex={-1}>{journey.status === 'won' ? '¡Llegó gracias a ti!' : 'La llamada necesita otro intento'}</h2>
            {journey.status === 'won' ? <><div className="directions-award" aria-label={`${currentStars} estrellas de 3`}>{'★'.repeat(currentStars)}<span>{'☆'.repeat(3 - currentStars)}</span></div><p>{journey.moves} pasos · {journey.mistakes} tropiezos · {journey.collected.length}/2 estrellas recogidas</p><p className="directions-scoring">Una por llegar, otra por orientarte sin errores ni ayudas y otra por recoger las dos del mapa.</p><button type="button" className="directions-primary" onClick={() => level < directionMissions.length - 1 ? begin(level + 1) : finish()}>{level < directionMissions.length - 1 ? 'Siguiente llamada' : 'Terminar la aventura'}<span>↗</span></button></>
              : <><p>Se acabaron las tres vidas. Ya conoces los agujeros: vuelve a intentarlo.</p><button type="button" className="directions-primary" onClick={() => begin(level)}>Volver a llamar</button></>}
            <button type="button" className="directions-text-button" onClick={() => begin(level)}>Repetir este mapa</button>
          </div> : journey.status === 'fallen' ? <div className="directions-rescue"><span aria-hidden="true">🛟</span><h2>¡Te sacamos de ahí!</h2><p>Vuelves al último punto de rescate. Te quedan {journey.hearts} vidas.</p><button type="button" className="directions-primary" onClick={() => { setJourney(rescueJourney(journey)); setHint(null); play('好。'); }}>Lanzar la cuerda</button></div> : <div className="directions-controls">
            {mission.relative && <p className="directions-perspective">Mira la punta naranja: <strong>izquierda y derecha son las suyas.</strong> Al avanzar, mira hacia la nueva dirección.</p>}
            <div className="directions-controls-label"><span>TU SEÑAL</span><span>Una palabra, un paso</span></div>
            <div className="directions-choices">{choices.map(word => <button type="button" key={word} aria-label={word} disabled={busy} className={hint === word ? 'hinted' : ''} onClick={() => send(word)}><DirectionText text={word} icon/></button>)}</div>
            <div className="directions-transmission" aria-label="Últimas señales enviadas"><span>{busy ? 'Enviando…' : 'Últimas señales'}</span><div className="directions-history">{history.length ? history.slice(-4).map((word, index) => <DirectionReadout key={`${history.length}-${index}`} text={word}/>) : '—'}</div></div>
            <div className="directions-assists"><button type="button" aria-expanded={help} onClick={() => { setHelp(value => !value); setUsedHelp(true); }}>{help ? 'Cerrar vocabulario' : 'Consultar vocabulario'}</button><button type="button" disabled={busy} onClick={() => { const word = hintWord(mission, journey); setHint(word); setUsedHelp(true); if (word) play(word); }}>Pedir una pista</button></div>
            {hint && <p className="directions-hint" role="status">La siguiente señal segura es <DirectionReadout text={hint}/>. Solo se ilumina este paso.</p>}
            {help && <div className="directions-glossary"><p>Destino: {mission.meaning}. {mission.relative ? 'Las direcciones cambian con la orientación del personaje.' : 'Norte arriba, este a la derecha, sur abajo y oeste a la izquierda.'}</p>{words.map(word => <DirectionReadout key={word} text={word} forceReading/>)}<p>Las ayudas conservan tus avances; la estrella por orientarte sin ayuda queda para otro intento.</p></div>}
          </div>}
          <div className="directions-phone-footer"><button type="button" onClick={() => { stop(); setStage('welcome'); }}>Ver mapas</button><span>● Conexión estable</span></div>
        </section>
      </div>
    </>}
    <footer className="directions-footer"><span>Ubicaciones de L6 · Audio de práctica con voz generada por IA</span><span>{storageAvailable ? 'Estrellas guardadas en este navegador' : 'Almacenamiento no disponible: avances solo durante esta visita'}</span></footer>
  </div>;
}
function PhoneIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 3 4 5-3 3q2 4 6 6l3-3 5 4q0 4-4 3C9 19 5 15 3 7q-1-4 3-4Z"/></svg>; }
function MissionPicker({ progress, onSelect }: { progress: SavedJourney; onSelect: (index: number) => void }) {
  return <section className="directions-mission-picker" aria-labelledby="directions-maps-title"><div><p className="directions-kicker">UN MAPA, UNA HISTORIA</p><h2 id="directions-maps-title">Tu ruta de llamadas</h2></div><div className="directions-mission-grid">{directionMissions.map((mission, index) => {
    const unlocked = index === 0 || Boolean(progress.best[directionMissions[index - 1].id]);
    return <article key={mission.id} className="directions-mission-card" data-locked={!unlocked}>
      <span className="directions-mission-number">{String(index + 1).padStart(2, '0')}</span>
      <DirectionReadout text={mission.destination}/>
      <small>{mission.title}</small>
      <button type="button" className="directions-mission-start" disabled={!unlocked} onClick={() => onSelect(index)} aria-label={`${index + 1}. ${mission.title}${unlocked ? '' : ', completa el mapa anterior'}`}>{progress.best[mission.id] ? '★'.repeat(progress.best[mission.id]) + ' · Repetir' : unlocked ? 'Contestar ↗' : 'Por desbloquear'}</button>
    </article>;
  })}</div></section>;
}
