'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterEntry, Exercise } from '@/data/types';
import { SpeakButton } from './SpeakButton';
import { HanziArcade } from './hanzi/HanziArcade';

const games = [
  ['Flashcards 8 direcciones','Recupera hanzi, pinyin, audio y significado.','meaning'],
  ['Memory Match','Forma parejas entre representaciones.','meaning'],
  ['Speed Match','Responde tantas tarjetas como puedas.','pinyin'],
  ['¿Quién es quién?','Investiga a los personajes del diálogo.','reading'],
  ['Estados visuales','Construye frases sobre estados.','production'],
  ['Constructor de oraciones','Ordena los bloques con precisión.','grammar'],
  ['Tren de palabras','Haz salir el tren con el orden correcto.','grammar'],
  ['Encuentra el error','Corrige una estructura de la lección.','grammar'],
  ['Primer encuentro','Completa una presentación.','production'],
  ['¿Cómo has estado?','Elige una respuesta natural.','production'],
  ['Escucha y selecciona','Identifica lo que oyes.','tone'],
  ['Verdadero o falso','Comprueba una afirmación auditiva.','reading'],
  ['Dictado de pinyin','Escribe con marca tonal.','pinyin'],
  ['Dictado de palabras','Recupera el hanzi por su sonido.','meaning'],
  ['Diálogo + comprensión','Escucha y localiza un hecho.','reading'],
  ['Shadowing','Escucha a 0.7×, 0.85× o 1× y repite.','tone'],
  ['Z–C–S Radar','Distingue las tres iniciales.','tone'],
  ['Serpiente S','Sigue solamente las sílabas con s.','tone'],
  ['C aspirada','Reconoce la expulsión de aire.','tone'],
  ['Dojo de trazos','Cuenta trazos de caracteres.','hanzi'],
  ['Constructor de caracteres','Une componentes respaldados.','hanzi'],
  ['Radical Lab','Identifica radicales y componentes.','hanzi'],
  ['Hanzi Reveal','Adivina el carácter pronto.','hanzi'],
  ['Reading Detective','Encuentra la evidencia del texto.','reading'],
  ['Formular preguntas','Crea la pregunta para la respuesta.','production'],
  ['Unir diálogos','Empareja pregunta y respuesta.','production'],
  ['Sopa de caracteres','Localiza palabras estudiadas.','meaning'],
  ['Boss Battle','Diez retos mezclados; un error no reinicia.','all'],
] as const;

export function Arcade({ exercises, hanziCharacters }: { exercises: Exercise[]; hanziCharacters: CharacterEntry[] }) {
  const rootRef=useRef<HTMLDivElement>(null);
  const [selected,setSelected]=useState<number|null>(null); const [round,setRound]=useState(0); const [answer,setAnswer]=useState(''); const [score,setScore]=useState(0); const [message,setMessage]=useState('');
  useEffect(()=>{rootRef.current?.setAttribute('data-hydrated','true');},[]);
  const pool=useMemo(()=>selected===null?[]:exercises.filter((item)=>games[selected][2]==='all'||item.dimension===games[selected][2]),[selected,exercises]);
  const exercise=pool[round%Math.max(1,pool.length)]??exercises[round%exercises.length];
  function play(index:number){setSelected(index);setRound(0);setAnswer('');setScore(0);setMessage('');document.getElementById('arena')?.scrollIntoView({behavior:'smooth'});}
  function check(){const clean=(value:string)=>value.toLowerCase().replace(/[\s。！？?.,]/g,''); const ok=clean(answer)===clean(exercise.answer);setScore(v=>v+(ok?1:0));setMessage(ok?'正确 · ¡Acierto!':`Pista: ${exercise.rule}`);setTimeout(()=>{setRound(v=>v+1);setAnswer('');setMessage('');},900);}
  return <div className="arcade-root" ref={rootRef}><section className="game-grid shell">{games.map(([name,description],index)=><article key={name}><span>{String(index+1).padStart(2,'0')}</span><h2>{name}</h2><p>{description}</p><button type="button" onClick={()=>play(index)}>Jugar →</button></article>)}</section><section id="arena" className="arcade-arena shell">{selected===null?<div><p className="eyebrow">28 JUEGOS FUNCIONALES</p><h2>Elige un reto</h2><p>Cada juego usa exclusivamente el corpus auditado de la Lección 1.</p></div>:<><div className="practice-top"><div><p className="eyebrow">RONDA {round+1}</p><h2>{games[selected][0]}</h2></div><b>{score} aciertos</b></div>{selected>=19&&selected<=22?<><HanziArcade characters={hanziCharacters} key={`${selected}-${round}`} gameIndex={selected} round={round} onScore={()=>setScore(value=>value+1)}/><div className="arena-actions"><button type="button" onClick={()=>setRound(value=>value+1)}>Otro carácter</button><button type="button" onClick={()=>setSelected(null)}>Cerrar</button></div></>:<>{['tone','audio'].includes(exercise.dimension)&&<SpeakButton text={exercise.answer}/>}<p className="question">{exercise.prompt}</p>{exercise.options?<div className="option-grid">{exercise.options.map(option=><button type="button" className={answer===option?'selected':''} onClick={()=>setAnswer(option)} key={option}>{option}</button>)}</div>:<input className="arcade-input" value={answer} onChange={(e)=>setAnswer(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&check()} placeholder="Tu respuesta"/>}{message&&<p className="rule-note">{message}</p>}<div className="arena-actions"><button className="button button-primary" type="button" onClick={check}>Comprobar</button><button type="button" onClick={()=>setSelected(null)}>Cerrar</button></div></>}</>}</section></div>;
}
