'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { SpeakButton } from '@/components/SpeakButton';
import type { CurriculumScope } from '@/data/types';
import { hasMandarinAudio } from '@/lib/mandarin-audio';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { PANDA_WORLDS, QUEST_STORAGE_KEY, answerQuest, continueQuest, createQuest, emptyQuestProgress, getActiveChallenge, getQuestStars, getQuestWorld, isWorldUnlocked, moveQuest, parseQuestProgress, recordQuestCompletion, serializeQuestProgress, type Direction, type GateId, type QuestState, type WorldId } from '@/lib/panda-quest';
import { PandaLandscape, PandaSprite, QuestTileArt } from './PandaArt';
import './panda-quest.css';

const directionKeys: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
const controls: { direction: Direction; label: string; arrow: string }[] = [
  { direction: 'up', label: 'Mover arriba', arrow: '↑' }, { direction: 'left', label: 'Mover izquierda', arrow: '←' },
  { direction: 'down', label: 'Mover abajo', arrow: '↓' }, { direction: 'right', label: 'Mover derecha', arrow: '→' },
];
const lessonTopics = ['Saludos e identidad', 'Países y encuentros', 'Familia y profesiones', 'Horas y actividades'];

export function PandaQuest({ scope }: { scope: CurriculumScope }) {
  const [quest, setQuest] = useState<QuestState | null>(null);
  const questRef = useRef<QuestState | null>(null);
  const [progress, setProgress] = useState(emptyQuestProgress);
  const [ready, setReady] = useState(false);
  const [saveWarning, setSaveWarning] = useState('');
  const [showPinyin, setShowPinyin] = useState(true);
  const [notice, setNotice] = useState('');
  const boardRef = useRef<HTMLDivElement>(null);
  const encounterRef = useRef<HTMLHeadingElement>(null);
  const world = quest ? getQuestWorld(quest.worldId) : null;
  const challenge = quest ? getActiveChallenge(quest) : undefined;
  useEffect(() => {
    queueMicrotask(() => {
      try { setProgress(parseQuestProgress(localStorage.getItem(QUEST_STORAGE_KEY))); }
      catch { setSaveWarning('El navegador no permite guardar. Puedes jugar durante esta sesión.'); }
      setReady(true);
    });
  }, []);
  useEffect(() => { if (challenge) encounterRef.current?.focus(); }, [challenge]);
  function focusBoard() { requestAnimationFrame(() => boardRef.current?.focus({ preventScroll: true })); }
  function updateQuest(next: QuestState) { questRef.current = next; setQuest(next); }
  function start(worldId: WorldId) {
    if (!ready || !isWorldUnlocked(worldId, progress)) return;
    updateQuest(createQuest(worldId));
    setNotice('Sigue el sendero. Acércate a una puerta para hablar con su guardián.');
    trackAnalyticsEvent('game_started', { contentId: `panda-quest:world-${worldId}:${scope}` });
    focusBoard();
  }
  function move(direction: Direction) {
    const current = questRef.current;
    if (!current) return;
    const next = moveQuest(current, direction);
    if (next === current) {
      if (!current.activeGate && !current.completed) setNotice('Hay bambú cerrado en esa dirección. Prueba otro camino.');
      return;
    }
    updateQuest(next);
    setNotice(next.collected.length > current.collected.length ? '¡Bambú encontrado! Sigue explorando.' : next.activeGate ? 'Un guardián espera tu respuesta para abrir el paso.' : `Panda en fila ${next.position.y + 1}, columna ${next.position.x + 1}.`);
    if (next.completed) {
      const saved = recordQuestCompletion(progress, next);
      setProgress(saved);
      try { localStorage.setItem(QUEST_STORAGE_KEY, serializeQuestProgress(saved)); }
      catch { setSaveWarning('Completaste el mundo, pero el navegador no pudo guardar el avance.'); }
      trackAnalyticsEvent('game_completed', { contentId: `panda-quest:world-${next.worldId}:${scope}` });
    }
  }
  function answer(optionId: string) {
    const current = questRef.current;
    if (!current) return;
    const next = answerQuest(current, optionId);
    if (next === current) return;
    updateQuest(next);
    trackAnalyticsEvent('exercise_completed', { contentId: `panda-quest:${getActiveChallenge(current)?.id}`, correct: next.feedback?.correct });
  }
  function continueAdventure() {
    const current = questRef.current;
    if (!current) return;
    const next = continueQuest(current);
    updateQuest(next);
    if (!next.activeGate) { setNotice('¡Paso abierto! Busca el siguiente guardián o llega al portal de salida.'); focusBoard(); }
    else requestAnimationFrame(() => encounterRef.current?.focus());
  }
  function onBoardKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const direction = directionKeys[event.key];
    if (direction) { event.preventDefault(); move(direction); }
  }
  function backToWorlds() { questRef.current = null; setQuest(null); }

  if (!quest || !world) return <section className="panda-quest pq-menu" aria-label="Panda Quest">
    <div className="pq-hero"><div className="pq-hero-copy"><span className="pq-eyebrow">UNA AVENTURA EN MANDARÍN</span><h3>Un pequeño panda.<br/>Un gran camino.</h3><p>El bosque ha cerrado sus puertas. Ayuda a nuestro panda a volver a casa: explora, conversa y abre cada paso con lo que sabes de chino.</p><div className="pq-tags"><span>4 mundos</span><span>Lecciones acumulativas</span><span>A tu ritmo</span></div></div><PandaLandscape className="pq-landscape"/></div>
    <div className="pq-route-heading"><div><span className="pq-eyebrow">TU EXPEDICIÓN</span><h3>De un saludo a una aventura</h3></div><span>{progress.completedWorlds.length} / 4 mundos</span></div>
    <div className="pq-worlds">{PANDA_WORLDS.map(item => {
      const unlocked = isWorldUnlocked(item.id, progress), stars = progress.bestStars[item.id] ?? 0;
      return <button type="button" key={item.id} className={`pq-world pq-world-${item.id}`} disabled={!ready || !unlocked} onClick={() => start(item.id)} aria-label={`${stars ? 'Repetir' : 'Explorar'} mundo ${item.id}: ${item.name}`}>
        <span className="pq-world-top"><span className="pq-world-number">{String(item.id).padStart(2, '0')}</span><span>{stars ? '★'.repeat(stars) : unlocked ? 'Disponible' : 'Bloqueado'}</span></span><strong>{item.name}</strong><span>{lessonTopics[item.id - 1]}</span><small>{item.id === 1 ? 'Lección 1' : `Lecciones 1–${item.id} · acumulativo`}</small><span className="pq-world-action">{stars ? 'Volver a explorar ↗' : unlocked ? 'Entrar al bosque →' : `Completa el mundo ${item.id - 1}`}</span>
      </button>;
    })}</div>
    <div className="pq-how"><p><b>01 · Explora</b><span>Muévete con las flechas, WASD o los controles de pantalla.</span></p><p><b>02 · Conversa</b><span>Resuelve los retos de los guardianes para abrir las puertas.</span></p><p><b>03 · Regresa</b><span>Llega al portal y desbloquea el siguiente mundo.</span></p></div>
    <p className="pq-save-note" role="status">{saveWarning || 'Tu avance se guarda en este navegador. Cada nueva expedición cambia los retos.'}</p>
  </section>;

  if (quest.completed) return <section className="panda-quest pq-finish" aria-label="Mundo completado"><PandaLandscape className="pq-finish-art"/><span className="pq-eyebrow">MUNDO {world.id} COMPLETADO</span><h3>{world.id === 4 ? '¡El panda ha vuelto a casa!' : '¡Un paso más hacia casa!'}</h3><div className="pq-stars" aria-label={`${getQuestStars(quest)} de 3 estrellas`}>{'★'.repeat(getQuestStars(quest))}<span>{'☆'.repeat(3 - getQuestStars(quest))}</span></div><p>{world.id === 4 ? 'Has reunido las cuatro lecciones en una sola aventura.' : `Ya puedes explorar el mundo ${world.id + 1} con lo aprendido hasta ahora.`}</p><div className="pq-result-stats"><span><b>{quest.clearedGates.length}</b>puertas abiertas</span><span><b>{quest.collected.length}</b>bambús encontrados</span><span><b>{quest.mistakes}</b>reintentos</span></div><p className="pq-star-note">3 estrellas sin errores · 2 con hasta 2 errores · 1 por completar. El bambú es opcional.</p><div className="pq-result-actions">{world.id < 4 && <button type="button" className="button-primary" onClick={() => start((world.id + 1) as WorldId)}>Explorar mundo {world.id + 1} →</button>}<button type="button" onClick={() => start(world.id)}>Repetir mundo</button><button type="button" onClick={backToWorlds}>Ver mundos</button></div><p className="pq-save-note" role="status">{saveWarning || 'Avance guardado en este navegador.'}</p></section>;

  return <section className={`panda-quest pq-playing pq-biome-${world.id}`} aria-label={`Panda Quest · mundo ${world.id}`}>
    <div className="pq-play-top"><div><span className="pq-eyebrow">MUNDO {world.id} · {world.id === 1 ? 'LECCIÓN 1' : `LECCIONES 1–${world.id}`}</span><h3>{world.name}</h3></div><button type="button" onClick={backToWorlds}>Ver mundos</button></div>
    <div className="pq-hud"><span><b>{quest.clearedGates.length}/{world.gateIds.length}</b> puertas abiertas</span><span><b>{quest.collected.length}</b> bambú</span><span>Destino: el portal <span aria-hidden="true">⌂</span></span></div>
    <div className="pq-play-layout"><div className="pq-board-column">
      <div className="pq-board" ref={boardRef} tabIndex={0} role="group" aria-label={`Laberinto. Panda en fila ${quest.position.y + 1}, columna ${quest.position.x + 1}. Usa las flechas o WASD para moverte.`} onKeyDown={onBoardKey} data-position={`${quest.position.x},${quest.position.y}`} data-world={world.id} style={{ gridTemplateColumns: `repeat(${world.map[0].length}, minmax(0, 1fr))` }}>
        {world.map.flatMap((row, y) => [...row].map((tile, x) => {
          const isGate = world.gateIds.includes(tile as GateId), cleared = isGate && quest.clearedGates.includes(tile as GateId), bamboo = tile === 'b' && !quest.collected.includes(`${x},${y}`);
          return <div aria-hidden="true" className={`pq-tile ${tile === '#' ? 'pq-wall' : 'pq-path'} ${isGate ? 'pq-gate-tile' : ''} ${cleared ? 'pq-cleared' : ''} ${tile === 'E' ? 'pq-exit' : ''}`} key={`${x},${y}`}>{tile === '#' ? <QuestTileArt kind="tree"/> : isGate && !cleared ? <><QuestTileArt kind="gate"/><span className="pq-gate-letter">{tile}</span></> : bamboo ? <QuestTileArt kind="bamboo"/> : tile === 'E' ? <QuestTileArt kind="exit"/> : cleared ? <span className="pq-open-mark">✦</span> : null}</div>;
        }))}
        <div className="pq-player" aria-hidden="true" style={{ width: `${100 / world.map[0].length}%`, height: `${100 / world.map.length}%`, left: `${quest.position.x * 100 / world.map[0].length}%`, top: `${quest.position.y * 100 / world.map.length}%` }}><PandaSprite/></div>
      </div>
      <div className="pq-map-footer"><span><i className="pq-legend-gate"/>Guardián</span><span><i className="pq-legend-exit"/>Salida</span><span>Bambú opcional</span></div>
      <div className="pq-navigation"><div className="pq-dpad" aria-label="Controles de movimiento">{controls.map(control => <button key={control.direction} type="button" className={`pq-direction-${control.direction}`} aria-label={control.label} disabled={Boolean(quest.activeGate)} onClick={() => move(control.direction)}>{control.arrow}</button>)}</div><p>Flechas o WASD<br/><small>También puedes tocar los controles.</small></p></div>
      <p className="pq-notice" role="status">{notice}</p>
    </div><aside className="pq-encounter" data-challenge={challenge?.id} aria-label={challenge ? 'Reto del guardián' : 'Tu misión'}>
      {challenge ? <><span className="pq-eyebrow">PUERTA {quest.activeGate} · LECCIÓN {challenge.lesson}</span><h4 ref={encounterRef} tabIndex={-1}>{challenge.kind === 'conversation' ? 'El guardián quiere conversar' : challenge.kind === 'sentence' ? 'Completa el acertijo' : 'Descifra el mensaje'}</h4><p>{challenge.prompt}</p><div className="pq-speech"><strong><Hanzi>{challenge.chinese}</Hanzi></strong>{showPinyin && <span className="pq-reading">{challenge.pinyin}</span>}{hasMandarinAudio(challenge.chinese) && <SpeakButton text={challenge.chinese} compact/>}</div><label className="pq-pinyin-toggle"><input type="checkbox" checked={showPinyin} onChange={event => setShowPinyin(event.target.checked)}/> Mostrar pinyin</label>
        <div className="pq-options">{challenge.options.map(option => <button type="button" key={option.id} data-option={option.id} aria-pressed={quest.feedback?.optionId === option.id} disabled={Boolean(quest.feedback)} onClick={() => answer(option.id)} className={quest.feedback?.optionId === option.id ? (quest.feedback.correct ? 'pq-answer-correct' : 'pq-answer-retry') : ''}><span>{option.chinese ? <Hanzi>{option.chinese}</Hanzi> : option.label}</span>{option.chinese && showPinyin && option.pinyin && <small>{option.pinyin}</small>}</button>)}</div>
        {quest.feedback && <div className={`pq-feedback ${quest.feedback.correct ? 'pq-correct' : 'pq-retry'}`} role="status"><b>{quest.feedback.correct ? '¡Muy bien! El camino se abre.' : 'Todavía no. Lee la pista e inténtalo otra vez.'}</b><p><Hanzi>{challenge.explanation}</Hanzi></p><button type="button" className="button-primary" onClick={continueAdventure}>{quest.feedback.correct ? 'Abrir paso →' : 'Volver a intentarlo'}</button></div>}
      </> : <div className="pq-mission"><div className="pq-companion"><PandaSprite/></div><span className="pq-eyebrow">JUNTOS HASTA CASA</span><h4>{quest.clearedGates.length === world.gateIds.length ? '¡Busca el portal!' : 'Sigue el sendero'}</h4><p>{quest.clearedGates.length === world.gateIds.length ? 'Los guardianes ya te han abierto todas las puertas. Lleva al panda hasta la salida.' : 'Acércate a una puerta roja. Cada guardián te propondrá un reto de chino para dejarte pasar.'}</p><div className="pq-gate-checklist">{world.gateIds.map(gate => <span key={gate} className={quest.clearedGates.includes(gate) ? 'is-open' : ''}>{quest.clearedGates.includes(gate) ? '✓' : '○'} Puerta {gate}</span>)}</div><p className="pq-hint">Sin cronómetro. Puedes equivocarte, aprender y volver a intentarlo.</p></div>}
    </aside></div>
  </section>;
}
