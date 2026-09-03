'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ExamQuestion, ExamSection } from '@/seed/exam';
import type { CurriculumScope } from '@/data/types';
import { scopeDefinitions } from '@/seed/curriculum';
import { SpeakButton } from './SpeakButton';

type PublicQuestion = Omit<ExamQuestion, 'answer'>;
type ExamResult = {
  score: number;
  sectionScores: Record<ExamSection, number>;
  review: { id: string; section: ExamSection; correct: boolean }[];
  durationSeconds: number;
};

const labels: Record<ExamSection, string> = {
  listening: 'Comprensión auditiva', pinyin: 'Pinyin y tonos', vocabulary: 'Vocabulario', grammar: 'Gramática',
  dialogue: 'Diálogo', reading: 'Lectura', hanzi: 'Hanzi', communication: 'Comunicación',
};

export function ExamClient({ scope = 'l1' }: { scope?: CurriculumScope }) {
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function start() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/exam/start', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scope }) });
      const body = await response.json() as { error?: string; sessionId: string; questions: PublicQuestion[] };
      if (!response.ok) throw new Error(body.error ?? 'No se pudo iniciar.');
      setSessionId(body.sessionId); setQuestions(body.questions);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo iniciar.'); }
    finally { setBusy(false); }
  }

  async function submit() {
    if (Object.keys(answers).length < questions.length && !confirm('Faltan respuestas. ¿Enviar de todos modos?')) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/exam/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sessionId, answers }) });
      const body = await response.json() as ExamResult & { error?: string };
      if (!response.ok) throw new Error(body.error ?? 'No se pudo enviar.');
      setResult(body);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo enviar.'); }
    finally { setBusy(false); }
  }

  if (result) return <section className="exam-result">
    <p className="eyebrow">RESULTADO VERIFICADO EN SERVIDOR</p>
    <strong>{result.score}<small>/100</small></strong>
    <h2>{result.score === 100 ? `${scopeDefinitions[scope].shortLabel} · Dominio perfecto` : result.score >= 70 ? 'Buen avance' : 'Hay conceptos que conviene repasar'}</h2>
    <div className="score-grid">{Object.entries(result.sectionScores).map(([section, score]) => <span key={section}><b>{score}</b>{labels[section as ExamSection]}</span>)}</div>
    <p className="rule-note">Tu mejor puntuación contará en el ranking solo si activas la participación desde tu perfil.</p>
    <button type="button" onClick={() => { setResult(null); setQuestions([]); setAnswers({}); }}>Intentar de nuevo</button>
  </section>;

  if (!questions.length) return <section className="exam-intro">
    <div><p className="eyebrow">EXAMEN FINAL · 100 PUNTOS</p><h2>Demuestra lo aprendido</h2><p>20 preguntas · 8 competencias. Las respuestas se califican en el servidor y el cliente no puede alterar la nota.</p></div>
    <div className="exam-weights">{Object.values(labels).map((label) => <span key={label}>{label}</span>)}</div>
    {error && <p className="form-error">{error} <Link href={`/login?returnTo=${encodeURIComponent(scope === 'l1' ? '/lesson/1/exam' : `/study/${scope}/exam`)}`}>Iniciar sesión</Link></p>}
    <button className="button button-primary" disabled={busy} type="button" onClick={start}>{busy ? 'Preparando…' : 'Comenzar examen'}</button>
  </section>;

  return <section className="exam-form">
    <div className="practice-top"><div><p className="eyebrow">EXAMEN EN CURSO</p><h2>{Object.keys(answers).length}/{questions.length} respondidas</h2></div><span>100 puntos</span></div>
    {questions.map((question, index) => <article className="exam-question" key={question.id}>
      <small>{index + 1} · {labels[question.section]} · {question.points} pt</small><p>{question.prompt}</p>
      {question.audioText && <SpeakButton text={question.audioText}/>} {question.options ? <div className="option-grid">{question.options.map((option) => <label className={answers[question.id] === option ? 'selected' : ''} key={option}><input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((value) => ({ ...value, [question.id]: option }))}/>{option}</label>)}</div> : <input value={answers[question.id] ?? ''} onChange={(event) => setAnswers((value) => ({ ...value, [question.id]: event.target.value }))} placeholder="Escribe tu respuesta"/>}
    </article>)}
    {error && <p className="form-error">{error}</p>}
    <button className="button button-dark" disabled={busy} type="button" onClick={submit}>{busy ? 'Calificando…' : 'Enviar examen'}</button>
  </section>;
}
