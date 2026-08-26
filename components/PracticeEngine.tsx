'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Exercise } from '@/data/types';
import { SpeakButton } from './SpeakButton';

type Result = { correct: boolean; mastery: number; xp: number; feedback: { given: string; expected: string; why: string; rule: string; next: string } };

export function PracticeEngine({ exercises, title = 'Práctica guiada' }: { exercises: Exercise[]; title?: string }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState<'know' | 'doubt' | 'unknown'>('doubt');
  const startedAt = useRef(0);
  useEffect(()=>{startedAt.current=Date.now();},[]);
  const exercise = exercises[index % exercises.length];
  const ordered = useMemo(() => answer.trim().split(/\s+/).filter(Boolean), [answer]);

  if (!exercise) return <p>No hay ejercicios en este conjunto.</p>;

  function choose(value: string) { if (!result) setAnswer(value.replace(/[。？?]/g, '')); }
  function addToken(token: string) { if (!result) setAnswer((current) => `${current} ${token}`.trim()); }

  async function submit() {
    if (!answer.trim()) { setError('Escribe o selecciona una respuesta.'); return; }
    setBusy(true); setError('');
    const payload={ exerciseId: exercise.id, answer, responseMs: Date.now() - startedAt.current, selfRating: rating };
    try {
      const response = await fetch('/api/practice', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const body = await response.json() as Result & { error?: string };
      if (!response.ok) throw Object.assign(new Error(body.error ?? 'No se pudo guardar.'),{status:response.status});
      setResult(body);
    } catch (cause) {
      const networkFailure=!('status' in (cause as object))&&(!navigator.onLine||cause instanceof TypeError);
      if(networkFailure){const queue=JSON.parse(localStorage.getItem('ming-offline-attempts')??'[]') as unknown[];localStorage.setItem('ming-offline-attempts',JSON.stringify([...queue,payload]));const clean=(value:string)=>value.toLowerCase().replace(/[\s。！？?!,，]/g,'');const correct=clean(answer)===clean(exercise.answer);setResult({correct,mastery:0,xp:0,feedback:{given:answer,expected:exercise.answer,why:exercise.explanation,rule:exercise.rule,next:'Intento guardado en este dispositivo; se sincronizará al recuperar conexión.'}});}else setError(cause instanceof Error ? cause.message : 'No se pudo guardar.');
    }
    finally { setBusy(false); }
  }

  function next() { setIndex((value) => value + 1); setAnswer(''); setResult(null); setError(''); startedAt.current = Date.now(); }

  const canSpeak = exercise.dimension === 'audio' || exercise.type === 'tone' || exercise.type === 'dialogue';
  return <section className="practice-card" aria-live="polite">
    <div className="practice-top"><div><p className="eyebrow">SESIÓN · {index + 1}/{exercises.length}</p><h2>{title}</h2></div><span className="difficulty">Dificultad {exercise.difficulty}/5</span></div>
    <div className="progress-track"><i style={{ width: `${((index + (result ? 1 : 0)) / exercises.length) * 100}%` }} /></div>
    {canSpeak && <SpeakButton text={exercise.prompt.replace(/^.*?:\s*/, '')} />}
    <p className="question">{exercise.prompt}</p>
    {exercise.type === 'order' && <><div className="token-bank">{exercise.options?.map((option) => <button key={option} type="button" onClick={() => addToken(option)}>{option}</button>)}</div><div className="answer-line">{ordered.length ? ordered.map((item, i) => <span key={`${item}-${i}`}>{item}</span>) : <em>Toca los bloques en el orden correcto</em>}<button type="button" className="clear-button" onClick={() => setAnswer('')}>Borrar</button></div></>}
    {exercise.options && exercise.type !== 'order' ? <div className="option-grid">{exercise.options.map((option) => <button className={answer === option.replace(/[。？?]/g, '') ? 'selected' : ''} key={option} type="button" onClick={() => choose(option)}>{option}</button>)}</div> : exercise.type !== 'order' && <label className="answer-input"><span>Tu respuesta</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={exercise.type === 'pinyin' ? 'Escribe pinyin con marcas tonales' : 'Escribe en chino'} disabled={Boolean(result)} /></label>}
    {!result && <div className="self-rating" role="group" aria-label="Seguridad antes de responder">{([['know','Lo sé'],['doubt','Dudé'],['unknown','No lo sabía']] as const).map(([value,label]) => <button type="button" className={rating === value ? 'selected' : ''} onClick={() => setRating(value)} key={value}>{label}</button>)}</div>}
    {error && <p className="form-error">{error} {error.includes('sesión') && <Link href="/login?returnTo=/lesson/1/daily">Iniciar sesión</Link>}</p>}
    {result ? <div className={result.correct ? 'feedback correct' : 'feedback incorrect'}><h3>{result.correct ? `正确 · +${result.xp} XP` : '再试一次 · Revisemos'}</h3><p><b>Tu respuesta:</b> {result.feedback.given}</p><p><b>Respuesta:</b> {result.feedback.expected}</p><p>{result.feedback.why}</p><p className="rule-note">Regla: {result.feedback.rule}</p><small>{result.feedback.next} · dominio {result.mastery}%</small><button className="button button-primary" type="button" onClick={next}>{index + 1 === exercises.length ? 'Repetir sesión' : 'Siguiente'} →</button></div> : <button className="button button-dark" type="button" disabled={busy} onClick={submit}>{busy ? 'Comprobando…' : 'Comprobar'}</button>}
  </section>;
}
