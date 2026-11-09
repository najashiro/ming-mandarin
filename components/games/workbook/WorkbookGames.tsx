'use client';

import { useEffect, useRef, useState } from 'react';
import type { CurriculumScope } from '@/data/types';
import type { WorkbookMode, WorkbookQuestion } from '@/lib/workbook-games';
import { checkWorkbookAnswer, createWorkbookRound, shuffleWorkbookOptions } from '@/lib/workbook-session';
import { shuffledBlockOrder } from '@/lib/games-session';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { getStudyScopeLabel } from '@/lib/study-options';
import { Hanzi } from '@/components/Hanzi';
import { MingIcon, type MingIconName } from '@/components/MingIcon';
import { SpeakButton } from '@/components/SpeakButton';
import { useGameAudio } from '../shared/useGameAudio';
import { PhraseReinforcement, GameAudioRetry } from '../shared/PhraseReinforcement';
import './workbook.css';

const modes: { id: WorkbookMode; title: string; action: string; description: string; skill: string; icon: MingIconName; color: string }[] = [
  { id: 'order', title: 'Constructor de frases', action: 'Ordena', description: 'Coloca cada pieza en su sitio y descubre cómo se construye una frase.', skill: 'Orden y estructura', icon: 'practice', color: 'sage' },
  { id: 'complete', title: 'El carácter que falta', action: 'Completa', description: 'Observa los detalles y elige el carácter que da sentido a la frase.', skill: 'Lectura y vocabulario', icon: 'book', color: 'sand' },
  { id: 'dialogue', title: 'Conecta la conversación', action: 'Conversa', description: 'Encuentra la respuesta que encaja y dale continuidad al diálogo.', skill: 'Comprensión y comunicación', icon: 'chat', color: 'peach' },
];

type Session = { id: number; mode: WorkbookMode; rounds: WorkbookQuestion[]; targeted: boolean };
type Props = { scope: CurriculumScope; questions: WorkbookQuestion[]; initialMode?: WorkbookMode };

export function WorkbookGames({ scope, questions, initialMode = 'order' }: Props) {
  const [mode, setMode] = useState<WorkbookMode>(initialMode);
  const [session, setSession] = useState<Session | null>(null);
  const sessionId = useRef(0);
  const active = modes.find(item => item.id === mode)!;
  const available = questions.filter(item => item.mode === mode);

  function start(pool = questions, targeted = false) {
    const rounds = createWorkbookRound(pool, mode, 6);
    if (!rounds.length) return;
    setSession({ id: ++sessionId.current, mode, rounds, targeted });
    trackAnalyticsEvent('game_started', { contentId: `workbook-${mode}:${scope}` });
  }

  return <div className="workbook-games shell" data-workbook-scope={scope}>
    <div className="workbook-intro">
      <div><p className="eyebrow">PRACTICA LO QUE APRENDISTE</p><h2>Elige cómo practicar</h2><p>Tres formas de pensar en mandarín. Prueba, descubre el porqué y vuelve a lo que necesitas.</p></div>
      <span className="workbook-scope"><MingIcon name="book" width="17" height="17"/>{getStudyScopeLabel(scope)}</span>
    </div>
    <nav className="workbook-mode-grid" aria-label="Juegos del cuaderno">
      {modes.map(item => {
        const count = questions.filter(question => question.mode === item.id).length;
        return <button className={`workbook-mode ${item.color}`} type="button" key={item.id} aria-pressed={mode === item.id} disabled={!count} onClick={() => { setMode(item.id); setSession(null); }}>
          <span className="workbook-mode-icon"><MingIcon name={item.icon}/></span>
          <span className="workbook-mode-copy"><span className="workbook-mode-skill">{item.skill}</span><strong>{item.title}</strong><span className="workbook-mode-description">{item.description}</span><small>{count} retos disponibles</small></span>
          <span className="workbook-mode-tick" aria-hidden="true">{mode === item.id ? '✓' : '↗'}</span>
        </button>;
      })}
    </nav>
    {session ? <WorkbookSession key={`${scope}-${session.id}`} scope={scope} session={session} title={active.title} onRestart={() => start()} onReview={pending => start(pending, true)}/> : <section className={`workbook-start ${active.color}`} aria-labelledby="workbook-start-title">
      <div className="workbook-start-art" aria-hidden="true"><span className="workbook-paper"><MingIcon name={active.icon}/><span/><span/><span/></span><span className="workbook-art-stamp">{active.action}</span></div>
      <div className="workbook-start-copy"><p className="eyebrow">UNA SESIÓN CORTA, A TU RITMO</p><h3 id="workbook-start-title">{active.title}</h3><p>{active.description}</p>
        <ul className="workbook-start-notes"><li><MingIcon name="check" width="17" height="17"/>{Math.min(6, available.length)} retos por sesión</li><li><MingIcon name="check" width="17" height="17"/>Pistas cuando las necesites</li><li><MingIcon name="check" width="17" height="17"/>Repaso de tus errores al final</li></ul>
        <button className="workbook-primary" type="button" disabled={!available.length} onClick={() => start()}>Empezar a jugar <MingIcon name="arrow" width="19" height="19"/></button>
        <p className="workbook-small">Sin cronómetro. Cada respuesta tiene una explicación.</p>
      </div>
    </section>}
    <p className="workbook-footnote">Actividades adaptadas de los libros de práctica. El resultado resume esta sesión. Audio de práctica generado con IA.</p>
  </div>;
}

type Attempt = { question: WorkbookQuestion; correct: boolean; helped: boolean; retry: boolean };

function WorkbookSession({ scope, session, title, onRestart, onReview }: { scope: CurriculumScope; session: Session; title: string; onRestart: () => void; onReview: (pending: WorkbookQuestion[]) => void }) {
  const [position, setPosition] = useState(0);
  const [retries, setRetries] = useState<WorkbookQuestion[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const [reviewIntro, setReviewIntro] = useState(false);
  const checked = useRef(false);
  const completed = useRef(false);
  const firstRounds = session.rounds.length;
  const retry = position >= firstRounds;
  const question = retry ? retries[position - firstRounds] : session.rounds[position];
  const total = firstRounds + retries.length;
  const finished = position >= total;
  const summaryRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (finished) {
      summaryRef.current?.focus({ preventScroll: true });
      summaryRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [finished]);
  useEffect(() => {
    if (reviewIntro) {
      reviewRef.current?.focus({ preventScroll: true });
      reviewRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [reviewIntro]);

  function check(answer: string, helped: boolean) {
    if (checked.current || !question) return;
    checked.current = true;
    const correct = checkWorkbookAnswer(question, answer);
    setResult(correct);
    setAttempts(current => [...current, { question, correct, helped, retry }]);
    if (!correct && !retry) setRetries(current => [...current, question]);
    trackAnalyticsEvent('exercise_completed', { contentId: `workbook-${session.mode}:${scope}:${question.id}`, correct });
  }

  function next() {
    if (!checked.current) return;
    if (position + 1 >= total && !completed.current) {
      completed.current = true;
      trackAnalyticsEvent('game_completed', { contentId: `workbook-${session.mode}:${scope}` });
    }
    checked.current = false;
    setResult(null);
    if (position + 1 === firstRounds && retries.length > 0) setReviewIntro(true);
    setPosition(current => current + 1);
  }

  if (finished) {
    const firstCorrect = attempts.filter(attempt => !attempt.retry && attempt.correct).length;
    const helped = attempts.filter(attempt => attempt.helped).length;
    const recovered = attempts.filter(attempt => attempt.retry && attempt.correct).length;
    const pending = session.rounds.filter(row => !attempts.some(attempt => attempt.question.id === row.id && attempt.correct));
    return <div className="workbook-summary" tabIndex={-1} ref={summaryRef} aria-labelledby="workbook-summary-title">
      <span className="workbook-summary-icon" aria-hidden="true"><MingIcon name={pending.length ? 'book' : 'check'} width="38" height="38"/></span>
      <p className="eyebrow">PASO A PASO, LO VAS CONSTRUYENDO</p><h3 id="workbook-summary-title">Sesión completada</h3>
      <p>Una oportunidad para reconocer lo que ya sabes y lo que conviene volver a practicar.</p>
      <div className="workbook-stats"><div><strong>{firstCorrect}<span> / {firstRounds}</span></strong><span>Al primer intento</span></div><div><strong>{helped}</strong><span>Intentos con pista</span></div><div><strong>{recovered}</strong><span>Recuperados en el repaso</span></div></div>
      <p className="workbook-summary-note">{pending.length ? `${pending.length} ${pending.length === 1 ? 'reto necesita' : 'retos necesitan'} más práctica. Puedes repasarlos ahora.` : 'Has respondido correctamente a todos los retos al menos una vez.'}</p>
      {helped > 0 && <p className="workbook-small">Los aciertos con pista también cuentan. Vuelve a intentarlo sin ayuda para comprobar qué recuerdas.</p>}
      <div className="workbook-summary-actions">{pending.length > 0 && <button className="workbook-primary" type="button" onClick={() => onReview(pending)}>Repasar pendientes <MingIcon name="arrow" width="18" height="18"/></button>}<button className={pending.length ? 'workbook-secondary' : 'workbook-primary'} type="button" onClick={onRestart}>Nueva sesión</button></div>
    </div>;
  }

  if (reviewIntro) return <div className="workbook-review-intro" tabIndex={-1} ref={reviewRef} aria-labelledby="workbook-review-title">
    <span className="workbook-summary-icon" aria-hidden="true"><MingIcon name="progress" width="38" height="38"/></span>
    <p className="eyebrow">UN SEGUNDO ENCUENTRO</p><h3 id="workbook-review-title">Ahora, recupera lo aprendido</h3>
    <p>Volverás a {retries.length === 1 ? 'un reto que te costó' : `${retries.length} retos que te costaron`}. Antes de empezar, piensa en la explicación que acabas de descubrir.</p>
    <p className="workbook-small">La respuesta volverá a estar oculta. Intenta recordarla antes de pedir una pista.</p>
    <button className="workbook-primary" type="button" onClick={() => setReviewIntro(false)}>Comenzar repaso <MingIcon name="arrow" width="18" height="18"/></button>
  </div>;

  return <section className="workbook-session" aria-label={title}>
    <div className="workbook-session-top"><span>{title}</span><span className={retry ? 'workbook-retry-badge' : 'workbook-round-label'}>{retry ? 'Repaso de errores' : session.targeted ? 'Repaso dirigido' : 'Tu sesión'} · {position + 1} / {total}</span></div>
    <progress className="workbook-progress" value={position} max={total} aria-label="Avance de la sesión"/>
    <WorkbookRound key={`${position}-${question.id}`} question={question} result={result} onCheck={check} onNext={next} last={position + 1 >= total} retry={retry}/>
  </section>;
}

function WorkbookRound({ question, result, onCheck, onNext, last, retry }: { question: WorkbookQuestion; result: boolean | null; onCheck: (answer: string, helped: boolean) => void; onNext: () => void; last: boolean; retry: boolean }) {
  const audio = useGameAudio();
  const model = question.modelHanzi ?? question.answer;
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const [tokenOrder] = useState(() => shuffledBlockOrder(question.tokens ?? []));
  const [options] = useState(() => shuffleWorkbookOptions(question.options ?? []));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const isOrder = question.mode === 'order';
  const tokens = question.tokens ?? [];
  const chosenAnswer = isOrder ? selected.map(index => tokens[index]).join('') : answer;
  const ready = isOrder ? tokens.length > 0 && selected.length === tokens.length : Boolean(answer);
  const answered = result !== null;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, []);
  useEffect(() => {
    if (answered) {
      feedbackRef.current?.focus({ preventScroll: true });
      feedbackRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [answered]);

  return <div className="workbook-round" data-question-id={question.id}>
    <div className="workbook-question-top"><span className="workbook-lesson">Lección {question.lesson}</span>{retry && <span className="workbook-retry-tip">Recuerda la explicación e inténtalo otra vez.</span>}</div>
    <h3 ref={headingRef} tabIndex={-1}>{question.prompt}</h3>
    {question.context && <div className={`workbook-context ${question.mode === 'dialogue' ? 'workbook-dialogue-context' : ''}`}>{question.mode === 'dialogue' && <span className="workbook-speaker" aria-hidden="true"><MingIcon name="chat" width="22" height="22"/></span>}<p><Hanzi>{question.context}</Hanzi></p>{question.mode === 'dialogue' && <SpeakButton text={question.context} compact autoPlayKey={question.id} ariaLabel={`Escuchar frase inicial: ${question.context}`}/>}</div>}
    <form onSubmit={event => { event.preventDefault(); if (ready && !answered) { audio.play(model, question.pinyin); onCheck(chosenAnswer, hint); } }}>
      {isOrder ? <div className="workbook-builder">
        <div className="workbook-answer-label"><span>Tu frase</span><button type="button" className="workbook-clear" disabled={!selected.length || answered} onClick={() => setSelected([])}>Vaciar</button></div>
        <div className="workbook-target" role="group" aria-label="Tu frase ordenada">{selected.length ? selected.map((index, position) => <button type="button" key={index} disabled={answered} onClick={() => setSelected(current => current.filter((_, item) => item !== position))} aria-label={`Quitar ${tokens[index]}`}><Hanzi>{tokens[index]}</Hanzi><span aria-hidden="true">×</span></button>) : <span className="workbook-target-placeholder">Toca las piezas en el orden que quieras.</span>}</div>
        <div className="workbook-token-tray" role="group" aria-label="Piezas disponibles">{tokenOrder.map(index => <button type="button" key={index} disabled={answered || selected.includes(index)} onClick={() => { audio.play(tokens[index]); setSelected(current => [...current, index]); }} aria-label={`Añadir ${tokens[index]}`}><Hanzi>{tokens[index]}</Hanzi></button>)}</div>
        {!answered && <p className="workbook-small">Puedes tocar una pieza de tu frase para devolverla.</p>}
      </div> : <div className="workbook-options" role="group" aria-label="Elige una respuesta">{options.map((option, index) => <button type="button" key={option} disabled={answered} aria-pressed={answer === option} onClick={() => { audio.play(option); setAnswer(option); }}><span className="workbook-option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><Hanzi>{option}</Hanzi><span className="workbook-option-selection" aria-hidden="true">{answer === option ? '✓' : ''}</span></button>)}</div>}
      {!answered && <><div className="workbook-round-actions"><button className="workbook-secondary workbook-hint-trigger" type="button" aria-expanded={hint} aria-controls="workbook-hint" onClick={() => setHint(true)} disabled={hint}><MingIcon name="sun" width="18" height="18"/>{hint ? 'Pista consultada' : 'Dame una pista'}</button><button type="submit" className="workbook-primary" disabled={!ready}>Comprobar <MingIcon name="check" width="19" height="19"/></button></div>{hint && <div className="workbook-hint" id="workbook-hint" role="status"><strong>Una pista para pensar</strong><p><Hanzi>{question.hint}</Hanzi></p><small>Este intento se registra con ayuda.</small></div>}</>}
    </form>
    <GameAudioRetry error={audio.error} retry={audio.retry}/>
    {answered && <div className={`workbook-feedback ${result ? 'correct' : 'incorrect'}`} ref={feedbackRef} tabIndex={-1} role="status">
      <strong className="workbook-feedback-title">{result ? '¡Bien pensado!' : 'Vamos a entenderlo'}</strong>
      {!result && <p className="workbook-feedback-lead">Esta es la respuesta esperada. La practicarás de nuevo{retry ? ' en otra sesión' : ' al final'}.</p>}
      <PhraseReinforcement hanzi={model} pinyin={question.pinyin} translation={question.translation}/>
      <div className="workbook-explanation"><span>¿Por qué?</span><p><Hanzi>{question.explanation}</Hanzi></p></div>
      <button className="workbook-primary" type="button" onClick={onNext}>{last ? 'Ver mi resultado' : 'Continuar'}<MingIcon name="arrow" width="19" height="19"/></button>
    </div>}
  </div>;
}
