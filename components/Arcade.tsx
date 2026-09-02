'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterEntry, Exercise, ListeningEntry } from '@/data/types';
import { HanziArcade } from './hanzi/HanziArcade';
import { ListenAndRecognize } from './ListenAndRecognize';
import { SpeakButton } from './SpeakButton';
import { shuffleWithoutImmediateRepeat } from '@/lib/listen-recognize';

type Game = {
  id: string;
  name: string;
  description: string;
  dimension?: Exercise['dimension'] | 'all';
  kind?: 'listen' | 'hanzi';
  hanziIndex?: 19 | 20 | 21 | 22;
};

const games: Game[] = [
  { id: 'flashcards', name: 'Flashcards', description: 'Recupera hanzi, pinyin, audio y significado.', dimension: 'meaning' },
  { id: 'dictation', name: 'Dictado', description: 'Escribe el pinyin con su marca tonal.', dimension: 'pinyin' },
  { id: 'listen-recognize', name: 'Escucha y reconoce', description: 'Identifica el hanzi únicamente por su sonido.', kind: 'listen' },
  { id: 'memory', name: 'Memory Match', description: 'Forma parejas entre representaciones.', dimension: 'meaning' },
  { id: 'speed', name: 'Speed Match', description: 'Responde tantas tarjetas como puedas.', dimension: 'pinyin' },
  { id: 'who', name: '¿Quién es quién?', description: 'Investiga a los personajes del diálogo.', dimension: 'reading' },
  { id: 'states', name: 'Estados visuales', description: 'Construye frases sobre estados.', dimension: 'production' },
  { id: 'sentences', name: 'Constructor de oraciones', description: 'Ordena los bloques con precisión.', dimension: 'grammar' },
  { id: 'train', name: 'Tren de palabras', description: 'Haz salir el tren con el orden correcto.', dimension: 'grammar' },
  { id: 'error', name: 'Encuentra el error', description: 'Corrige una estructura de la lección.', dimension: 'grammar' },
  { id: 'meeting', name: 'Primer encuentro', description: 'Completa una presentación.', dimension: 'production' },
  { id: 'recent', name: '¿Cómo has estado?', description: 'Elige una respuesta natural.', dimension: 'production' },
  { id: 'listen-select', name: 'Escucha y selecciona', description: 'Identifica lo que oyes.', dimension: 'tone' },
  { id: 'true-false', name: 'Verdadero o falso', description: 'Comprueba una afirmación auditiva.', dimension: 'reading' },
  { id: 'word-dictation', name: 'Dictado de palabras', description: 'Recupera el hanzi por su sonido.', dimension: 'meaning' },
  { id: 'dialogue', name: 'Diálogo + comprensión', description: 'Escucha y localiza un hecho.', dimension: 'reading' },
  { id: 'shadowing', name: 'Shadowing', description: 'Escucha a 0.7×, 0.85× o 1× y repite.', dimension: 'tone' },
  { id: 'zcs', name: 'Z–C–S Radar', description: 'Distingue las tres iniciales.', dimension: 'tone' },
  { id: 'snake', name: 'Serpiente S', description: 'Sigue solamente las sílabas con s.', dimension: 'tone' },
  { id: 'aspiration', name: 'C aspirada', description: 'Reconoce la expulsión de aire.', dimension: 'tone' },
  { id: 'stroke-dojo', name: 'Dojo de trazos', description: 'Cuenta trazos de caracteres.', kind: 'hanzi', hanziIndex: 19 },
  { id: 'character-builder', name: 'Constructor de caracteres', description: 'Une componentes respaldados.', kind: 'hanzi', hanziIndex: 20 },
  { id: 'radical', name: 'Radical Lab', description: 'Identifica radicales y componentes.', kind: 'hanzi', hanziIndex: 21 },
  { id: 'reveal', name: 'Hanzi Reveal', description: 'Adivina el carácter pronto.', kind: 'hanzi', hanziIndex: 22 },
  { id: 'detective', name: 'Reading Detective', description: 'Encuentra la evidencia del texto.', dimension: 'reading' },
  { id: 'questions', name: 'Formular preguntas', description: 'Crea la pregunta para la respuesta.', dimension: 'production' },
  { id: 'join-dialogues', name: 'Unir diálogos', description: 'Empareja pregunta y respuesta.', dimension: 'production' },
  { id: 'word-search', name: 'Sopa de caracteres', description: 'Localiza palabras estudiadas.', dimension: 'meaning' },
  { id: 'boss', name: 'Boss Battle', description: 'Diez retos mezclados; un error no reinicia.', dimension: 'all' },
];

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
    if (games[index].kind === 'listen') {
      const deck = shuffleWithoutImmediateRepeat(listeningEntries);
      const audio = deck[0] ? new Audio(deck[0].audioSrc) : null;
      if (audio) void audio.play().catch(() => undefined);
      setListenSession({ deck, audio });
    }
    setSelected(index); setRound(0); setAnswer(''); setScore(0); setMessage('');
    document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth' });
  }

  function check() {
    const clean = (value: string) => value.toLowerCase().replace(/[\s。！？?.,]/g, '');
    const ok = clean(answer) === clean(exercise.answer);
    setScore((value) => value + (ok ? 1 : 0));
    setMessage(ok ? '正确 · ¡Acierto!' : `Pista: ${exercise.rule}`);
    window.setTimeout(() => { setRound((value) => value + 1); setAnswer(''); setMessage(''); }, 900);
  }

  return <div className="arcade-root" ref={rootRef}>
    <section className="game-grid shell">{games.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><h2>{item.name}</h2><p>{item.description}</p><button type="button" onClick={() => play(index)}>Jugar →</button></article>)}</section>
    <section id="arena" className="arcade-arena shell">{!game ? <div><p className="eyebrow">29 JUEGOS FUNCIONALES</p><h2>Elige un reto</h2><p>Cada juego usa exclusivamente el corpus auditado de la Lección 1.</p></div> : <>
      {game.kind === 'listen' ? <ListenAndRecognize entries={listeningEntries} initialDeck={listenSession.deck} initialAudio={listenSession.audio} onClose={() => setSelected(null)} /> : <>
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
