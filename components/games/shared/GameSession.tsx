'use client';
import { useRef, useState } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import type { CurriculumScope } from '@/data/types';
import { gameEventId, retryQueue, sessionOrder } from '@/lib/games-session';

export function useGameSession(game: string, scope: CurriculumScope, size: number, options: { order?: 'sequential' | 'shuffle' } = {}) {
  const createOrder = () => options.order === 'sequential' ? Array.from({ length: size }, (_, index) => index) : sessionOrder(size);
  const [round, setRound] = useState(0);
  const [order, setOrder] = useState(createOrder);
  const [level, setLevel] = useState(1);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [firstPassScore, setFirstPassScore] = useState(0);
  const [assisted, setAssisted] = useState(0);
  const [retries, setRetries] = useState<number[]>([]);
  const [unresolved, setUnresolved] = useState<number[]>([]);
  const answered = useRef(false);
  const total = Math.min(size, 6);
  const position = round < total ? round : retries[round - total] ?? 0;
  const index = order[position] ?? 0;
  const finished = round >= total + retries.length;
  function check(correct: boolean, contentId: string, mode = '', usedHelp = false) {
    if (answered.current) return false;
    answered.current = true;
    setResult(correct);
    setUnresolved(values => correct ? values.filter(value => value !== position) : values.includes(position) ? values : [...values, position]);
    if (correct) {
      setScore(value => value + 1);
      if (round < total) setFirstPassScore(value => value + 1);
      if (usedHelp) setAssisted(value => value + 1);
    }
    else if (round < total && total > 1) setRetries(values => retryQueue(values, position, total));
    trackAnalyticsEvent('exercise_completed', { contentId: gameEventId(game, scope, level, mode, contentId), correct });
    return true;
  }
  function next() {
    if (!answered.current) return;
    if (round + 1 >= total + retries.length) trackAnalyticsEvent('game_completed', { contentId: `${game}:${scope}` });
    setRound(value => value + 1); setResult(null); answered.current = false;
  }
  function restart() {
    setOrder(createOrder()); setRound(0); setResult(null); setScore(0); setFirstPassScore(0); setAssisted(0);
    setRetries([]); setUnresolved([]); answered.current = false;
    trackAnalyticsEvent('game_started', { contentId: `${game}:${scope}` });
  }
  return { round, index, level, setLevel, result, check, next, restart, score, firstPassScore, assisted, initialTotal: total, isRetry: round >= total, finished, unresolved: unresolved.length, total: total + retries.length };
}
type PracticeMode = { level: number; label: string };
const defaultModes: PracticeMode[] = [{ level: 1, label: 'Reconocer' }, { level: 2, label: 'Construir' }, { level: 3, label: 'Producir' }];
export function GameProgress({ level, onLevel, round, total, disabled = false, modes = defaultModes, retry = false }: { level: number; onLevel: (level: number) => void; round: number; total: number; disabled?: boolean; modes?: PracticeMode[]; retry?: boolean }) {
  return <div className="game-progress">{modes.length > 1 && <nav aria-label="Forma de practicar">{modes.map(mode => <button disabled={disabled} key={mode.level} aria-pressed={level === mode.level} onClick={() => onLevel(mode.level)}>{mode.label}</button>)}</nav>}<small>{retry && 'Repaso · '}{Math.min(round + 1, total)} / {total}</small><progress aria-label="Avance de la sesión" max={total || 1} value={round}/></div>;
}
export function GameResult({ score, total, unresolved, onRestart, firstPassScore, initialTotal, assisted = 0 }: { score: number; total: number; unresolved: number; onRestart: () => void; firstPassScore?: number; initialTotal?: number; assisted?: number }) {
  return <div className="game-result" role="status"><h3>Sesión completada</h3>{firstPassScore !== undefined && initialTotal !== undefined && <p>{firstPassScore} de {initialTotal} al primer intento.</p>}<p>{score} aciertos en {total} intentos{initialTotal !== undefined && total > initialTotal ? ', incluidos los repasos' : ''}.</p>{assisted > 0 && <p>{assisted} {assisted === 1 ? 'acierto con ayuda' : 'aciertos con ayuda'}. Vuelve a practicar sin consultar el modelo.</p>}<p>{unresolved ? `${unresolved} ${unresolved === 1 ? 'elemento necesita' : 'elementos necesitan'} más práctica. Puedes volver a intentarlo a tu ritmo.` : 'Has respondido correctamente a todos los elementos al menos una vez.'}</p><button type="button" className="button button-primary" onClick={onRestart}>Volver a practicar</button></div>;
}
