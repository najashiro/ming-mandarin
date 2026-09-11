'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { CurriculumScope, LessonNumber } from '@/data/types';
import { retoMixtoConversations, retoMixtoCorpus, type RetoMixtoEntry, type RetoMixtoMode } from '@/data/reto-mixto';
import { buildRetoMixtoDeck, insertRetry, retryQuestion, type RetoMixtoQuestion } from '@/lib/reto-mixto';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { PinyinText } from './PinyinText';

type Props = { scope: CurriculumScope; onClose: () => void };
type Phase = 'setup' | 'playing' | 'results';
type Feedback = 'correct' | 'incorrect' | null;
type Attempt = { question: RetoMixtoQuestion; correct: boolean };

const modeLabels: Record<RetoMixtoMode, string> = {
  'image-hanzi': 'Imagen → Hanzi',
  'hanzi-image': 'Hanzi → imagen',
  'audio-hanzi': 'Audio → Hanzi',
  'audio-image': 'Audio → imagen',
  'conversation-response': 'Conversación',
  'construct-response': 'Construir respuesta',
};

const selectionDefinitions = [
  { id: 'l1', label: 'L1', lessons: [1] },
  { id: 'l2', label: 'L2', lessons: [2] },
  { id: 'l3', label: 'L3', lessons: [3] },
  { id: 'l1-l2', label: 'L1 + L2', lessons: [1, 2] },
  { id: 'l1-l2-l3', label: 'L1 + L2 + L3', lessons: [1, 2, 3] },
] as const;

type SelectionId = typeof selectionDefinitions[number]['id'];

const lessonsByScope: Record<CurriculumScope, LessonNumber[]> = {
  l1: [1], l2: [2], l3: [3], 'l1-l2': [1, 2], 'l1-l2-l3': [1, 2, 3],
};

function normalizeChinese(value: string) {
  return value.normalize('NFC').replace(/[\s，。！？、；：“”‘’.,!?;:'"()]/g, '');
}

function shuffleIndexes(length: number) {
  const values = Array.from({ length }, (_, index) => index);
  for (let index = values.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [values[index], values[target]] = [values[target], values[index]];
  }
  if (length > 1 && values.every((value, index) => value === index)) values.push(values.shift()!);
  return values;
}

function modePrompt(mode: RetoMixtoMode) {
  if (mode === 'image-hanzi') return 'Elige la palabra que corresponde a la imagen.';
  if (mode === 'hanzi-image') return 'Elige la imagen que corresponde al Hanzi.';
  if (mode === 'audio-hanzi') return 'Escucha y elige lo que oyes.';
  if (mode === 'audio-image') return 'Escucha y elige la imagen correcta.';
  if (mode === 'conversation-response') return 'Elige una respuesta natural.';
  return 'Ordena los bloques para reconstruir la respuesta.';
}

export function RetoMixto({ scope, onClose }: Props) {
  const entriesById = useMemo(() => new Map(retoMixtoCorpus.map((entry) => [entry.id, entry])), []);
  const [phase, setPhase] = useState<Phase>('setup');
  const [selection, setSelection] = useState<SelectionId>(scope);
  const [roundCount, setRoundCount] = useState<10 | 20 | 30>(10);
  const [queue, setQueue] = useState<RetoMixtoQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [builtTokens, setBuiltTokens] = useState<number[]>([]);
  const [tokenOrder, setTokenOrder] = useState<number[]>([]);
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'unavailable'>('idle');
  const [maxStreak, setMaxStreak] = useState(0);
  const streakRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const advanceRun = useRef(0);

  const currentQuestion = queue[index];
  const currentEntry = currentQuestion ? entriesById.get(currentQuestion.entryId) : undefined;
  const currentConversation = currentQuestion?.conversationId
    ? retoMixtoConversations.find((conversation) => conversation.id === currentQuestion.conversationId)
    : undefined;
  const options = currentQuestion?.optionIds.map((id) => entriesById.get(id)).filter((entry): entry is RetoMixtoEntry => Boolean(entry)) ?? [];
  const allowedSelections = selectionDefinitions.filter((definition) => definition.lessons.every((lesson) => lessonsByScope[scope].includes(lesson)));

  useEffect(() => () => {
    advanceRun.current += 1;
    audioRef.current?.pause();
  }, []);

  async function playAudio(entry: RetoMixtoEntry, awaitEnd = false) {
    audioRef.current?.pause();
    if (!entry.audioSrc) {
      setAudioState('unavailable');
      return;
    }
    const audio = new Audio(entry.audioSrc);
    audioRef.current = audio;
    setAudioState('playing');
    try {
      const ended = new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('audio'));
      });
      await audio.play();
      if (awaitEnd) await ended;
      else void ended.then(() => setAudioState('idle')).catch(() => setAudioState('unavailable'));
    } catch {
      setAudioState('unavailable');
    }
    if (awaitEnd) setAudioState('idle');
  }

  function start(customDeck?: RetoMixtoQuestion[]) {
    const lessons = selectionDefinitions.find((definition) => definition.id === selection)?.lessons ?? lessonsByScope[scope];
    const deck = customDeck ?? buildRetoMixtoDeck(retoMixtoCorpus, retoMixtoConversations, [...lessons] as LessonNumber[], roundCount);
    const firstEntry = deck[0] ? entriesById.get(deck[0].entryId) : undefined;
    if (firstEntry?.audioSrc) {
      const unlock = new Audio(firstEntry.audioSrc);
      unlock.volume = 0;
      void unlock.play().then(() => { unlock.pause(); unlock.currentTime = 0; }).catch(() => undefined);
    }
    advanceRun.current += 1;
    setQueue(deck);
    setIndex(0);
    setAttempts([]);
    setFeedback(null);
    setSelectedOption('');
    setBuiltTokens([]);
    setTokenOrder(shuffleIndexes(firstEntry?.tokens?.length ?? 0));
    setAudioState('idle');
    setMaxStreak(0);
    streakRef.current = 0;
    setPhase('playing');
    trackAnalyticsEvent('game_started', { contentId: 'reto-mixto' });
  }

  function finish() {
    setPhase('results');
    setFeedback(null);
    trackAnalyticsEvent('game_completed', { contentId: 'reto-mixto' });
  }

  function advance() {
    if (index + 1 >= queue.length) finish();
    else {
      const nextEntry = entriesById.get(queue[index + 1].entryId);
      setFeedback(null);
      setSelectedOption('');
      setBuiltTokens([]);
      setTokenOrder(shuffleIndexes(nextEntry?.tokens?.length ?? 0));
      setAudioState('idle');
      setIndex((value) => value + 1);
    }
  }

  async function register(correct: boolean) {
    if (!currentQuestion || !currentEntry || feedback) return;
    const run = ++advanceRun.current;
    setAttempts((values) => [...values, { question: currentQuestion, correct }]);
    setFeedback(correct ? 'correct' : 'incorrect');
    trackAnalyticsEvent('exercise_completed', { contentId: `reto-mixto:${currentQuestion.mode}:${currentEntry.id}`, correct });
    if (correct) {
      streakRef.current += 1;
      setMaxStreak((value) => Math.max(value, streakRef.current));
      await playAudio(currentEntry, true);
      if (run !== advanceRun.current) return;
      window.setTimeout(() => { if (run === advanceRun.current) advance(); }, 320);
      return;
    }
    streakRef.current = 0;
    const reinforcement = retryQuestion(currentQuestion, retoMixtoCorpus, retoMixtoConversations);
    setQueue((values) => insertRetry(values, index, reinforcement));
  }

  function choose(entry: RetoMixtoEntry) {
    if (feedback) return;
    setSelectedOption(entry.id);
    void register(entry.id === currentEntry?.id);
  }

  function checkConstruction() {
    if (!currentEntry || feedback) return;
    const answer = builtTokens.map((tokenIndex) => currentEntry.tokens?.[tokenIndex] ?? '').join('');
    void register(normalizeChinese(answer) === normalizeChinese(currentEntry.hanzi));
  }

  function continueAfterError() {
    advanceRun.current += 1;
    advance();
  }

  function reviewErrors() {
    const unique = [...new Map(attempts.filter((attempt) => !attempt.correct).map((attempt) => [attempt.question.entryId, attempt.question])).values()];
    const review = unique.map((question) => retryQuestion(question, retoMixtoCorpus, retoMixtoConversations));
    start(review);
  }

  const correctCount = attempts.filter((attempt) => attempt.correct).length;
  const incorrectCount = attempts.length - correctCount;
  const percentage = attempts.length ? Math.round((correctCount / attempts.length) * 100) : 0;
  const breakdown = Object.entries(attempts.reduce<Partial<Record<RetoMixtoMode, { correct: number; total: number }>>>((summary, attempt) => {
    const item = summary[attempt.question.mode] ?? { correct: 0, total: 0 };
    item.total += 1;
    if (attempt.correct) item.correct += 1;
    summary[attempt.question.mode] = item;
    return summary;
  }, {})) as Array<[RetoMixtoMode, { correct: number; total: number }]>;
  const incorrectEntries = [...new Map(attempts.filter((attempt) => !attempt.correct).map((attempt) => {
    const entry = entriesById.get(attempt.question.entryId);
    return [attempt.question.entryId, entry] as const;
  })).values()].filter((entry): entry is RetoMixtoEntry => Boolean(entry));

  if (phase === 'setup') return <div className="mixed-challenge setup">
    <div className="mixed-heading"><div><p className="eyebrow">综合挑战 · RETO MIXTO</p><h2>Configura tu sesión</h2><p>Imagen, sonido, Hanzi y conversación en un solo desafío.</p></div><button type="button" onClick={onClose}>Cerrar</button></div>
    <fieldset><legend>Contenido</legend><div className="mixed-choice-row">{allowedSelections.map((definition) => <button className={selection === definition.id ? 'selected' : ''} type="button" onClick={() => setSelection(definition.id)} key={definition.id}>{definition.label}</button>)}</div></fieldset>
    <fieldset><legend>Número de rondas</legend><div className="mixed-choice-row">{([10, 20, 30] as const).map((count) => <button className={roundCount === count ? 'selected' : ''} type="button" onClick={() => setRoundCount(count)} key={count}>{count}</button>)}</div></fieldset>
    <button className="button button-primary mixed-start" type="button" onClick={() => start()}>Comenzar reto</button>
  </div>;

  if (phase === 'results') return <div className="mixed-challenge results">
    <p className="eyebrow">RESULTADO · RETO MIXTO</p><div className="mixed-result-score"><strong>{percentage}%</strong><span>{correctCount} de {attempts.length} respuestas correctas</span></div>
    <div className="mixed-kpis"><span><b>{correctCount}</b>Correctas</span><span><b>{incorrectCount}</b>Incorrectas</span><span><b>{maxStreak}</b>Mejor racha</span></div>
    <section><h3>Resultado por tipo</h3><div className="mixed-breakdown">{breakdown.map(([mode, value]) => <div key={mode}><span>{modeLabels[mode]}</span><b>{value.correct}/{value.total}</b></div>)}</div></section>
    {incorrectEntries.length > 0 && <section><h3>Para repasar</h3><div className="mixed-review-list">{incorrectEntries.map((entry) => <article key={entry.id}><strong>{entry.hanzi}</strong><span><PinyinText>{entry.pinyin}</PinyinText></span><small>{entry.meaningEs}</small></article>)}</div></section>}
    <div className="arena-actions">{incorrectEntries.length > 0 && <button className="button button-primary" type="button" onClick={reviewErrors}>Revisar errores</button>}<button type="button" onClick={() => start()}>Nueva sesión</button><button type="button" onClick={onClose}>Cerrar</button></div>
  </div>;

  if (!currentQuestion || !currentEntry) return <div className="mixed-challenge"><p>No hay contenido disponible para esta selección.</p><button type="button" onClick={() => setPhase('setup')}>Volver</button></div>;

  const isImagePrompt = currentQuestion.mode === 'image-hanzi';
  const isImageAnswer = currentQuestion.mode === 'hanzi-image' || currentQuestion.mode === 'audio-image';
  const isAudioPrompt = currentQuestion.mode === 'audio-hanzi' || currentQuestion.mode === 'audio-image';
  const isConstruction = currentQuestion.mode === 'construct-response';
  const isConversation = currentQuestion.mode === 'conversation-response' || currentQuestion.mode === 'construct-response';
  const availableTokenIndexes = tokenOrder.filter((tokenIndex) => !builtTokens.includes(tokenIndex));

  return <div className="mixed-challenge playing">
    <div className="mixed-progress-head"><div><p className="eyebrow">{modeLabels[currentQuestion.mode]}</p><h2>Ronda {index + 1} de {queue.length}</h2></div><button type="button" onClick={onClose}>Cerrar</button></div>
    <div className="progress-track"><i style={{ width: `${((index + (feedback ? 1 : 0)) / queue.length) * 100}%` }} /></div>
    <p className="mixed-prompt">{modePrompt(currentQuestion.mode)}</p>

    {isImagePrompt && currentEntry.imageSrc && <div className="mixed-prompt-image"><Image src={currentEntry.imageSrc} alt="Concepto visual de la pregunta" width={640} height={640} priority /></div>}
    {(currentQuestion.mode === 'hanzi-image') && <div className="mixed-prompt-hanzi" lang="zh-Hans">{currentEntry.hanzi}</div>}
    {isAudioPrompt && <button className={`audio-button mixed-audio ${audioState}`} type="button" onClick={() => void playAudio(currentEntry)} aria-label="Escuchar audio de la pregunta"><span aria-hidden="true">{audioState === 'playing' ? '■' : '▶'}</span> {audioState === 'playing' ? 'Sonando…' : 'Escuchar'}</button>}
    {isConversation && currentConversation && <div className="mixed-dialogue" lang="zh-Hans"><span>Míng</span><p>{currentConversation.promptHanzi}</p><strong>你</strong><p>……</p></div>}

    {!isConstruction && <div className={isImageAnswer ? 'mixed-image-options' : 'mixed-text-options'}>{options.map((entry, optionIndex) => <button className={`${selectedOption === entry.id ? 'selected ' : ''}${feedback && entry.id === currentEntry.id ? 'answer-correct' : ''}`} disabled={Boolean(feedback)} type="button" onClick={() => choose(entry)} key={entry.id}>{isImageAnswer && entry.imageSrc ? <Image src={entry.imageSrc} alt={`Opción visual ${optionIndex + 1}`} width={640} height={640} /> : <span lang="zh-Hans">{entry.hanzi}</span>}</button>)}</div>}

    {isConstruction && <div className="mixed-construction"><div className="mixed-built" aria-label="Respuesta construida">{builtTokens.length ? builtTokens.map((tokenIndex) => <button type="button" disabled={Boolean(feedback)} onClick={() => setBuiltTokens((values) => values.filter((value) => value !== tokenIndex))} key={tokenIndex}>{currentEntry.tokens?.[tokenIndex]}</button>) : <span>Toca los bloques en orden</span>}</div><div className="mixed-token-bank">{availableTokenIndexes.map((tokenIndex) => <button type="button" disabled={Boolean(feedback)} onClick={() => setBuiltTokens((values) => [...values, tokenIndex])} key={tokenIndex}>{currentEntry.tokens?.[tokenIndex]}</button>)}</div>{!feedback && <button className="button button-primary" disabled={!builtTokens.length} type="button" onClick={checkConstruction}>Comprobar</button>}</div>}

    <div aria-live="polite">{feedback === 'correct' && <div className="mixed-feedback correct"><b>✓ Correcto</b><span>Escucha la respuesta antes de continuar.</span></div>}{feedback === 'incorrect' && <div className="mixed-feedback incorrect"><b className="mixed-incorrect-title">✕ Incorrecto</b><p className="eyebrow">CORRECCIÓN</p><strong lang="zh-Hans">{currentEntry.hanzi}</strong><h3><PinyinText>{currentEntry.pinyin}</PinyinText></h3><p>{currentEntry.meaningEs}</p><div className="mixed-correction-actions"><button className="audio-button" type="button" onClick={() => void playAudio(currentEntry)} aria-label={`Escuchar pronunciación de ${currentEntry.hanzi}`} title={`Escuchar ${currentEntry.hanzi}`}><span aria-hidden="true">🔊</span> Escuchar</button>{currentEntry.hanziTargets.map((character) => <a href={`/study/l1-l2-l3/hanzi?character=${encodeURIComponent(character)}`} target="_blank" rel="noopener noreferrer" key={character}>Abrir {character} en Hanzi ↗</a>)}</div><button className="button button-primary" type="button" onClick={continueAfterError}>Continuar →</button></div>}</div>
  </div>;
}
