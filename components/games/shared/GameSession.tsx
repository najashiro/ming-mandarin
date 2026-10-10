'use client';
import { useRef, useState } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import type { CurriculumScope } from '@/data/types';
import { gameEventId, retryQueue, sessionOrder } from '@/lib/games-session';

export function useGameSession(game: string, scope: CurriculumScope, size: number) {
  const [round, setRound] = useState(0);
  const [order, setOrder] = useState(() => sessionOrder(size));
  const [level, setLevel] = useState(1);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [retries, setRetries] = useState<number[]>([]);
  const [unresolved, setUnresolved] = useState<number[]>([]);
  const answered = useRef(false);
  const total = Math.min(size, 6);
  const position = round < total ? round : retries[round - total] ?? 0;
  const index = order[position] ?? 0;
  const finished = round >= total + retries.length;
  function check(correct: boolean, contentId: string, mode = '') {
    if (answered.current) return false;
    answered.current = true;
    setResult(correct);
    setUnresolved(values => correct ? values.filter(value => value !== position) : values.includes(position) ? values : [...values, position]);
    if (correct) setScore(value => value + 1);
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
    setOrder(sessionOrder(size)); setRound(0); setResult(null); setScore(0);
    setRetries([]); setUnresolved([]); answered.current = false;
    trackAnalyticsEvent('game_started', { contentId: `${game}:${scope}` });
  }
  return { round, index, level, setLevel, result, check, next, restart, score, finished, unresolved: unresolved.length, total: total + retries.length };
}
type PracticeMode = { level: number; label: string };
const defaultModes: PracticeMode[] = [{ level: 1, label: 'Reconocer' }, { level: 2, label: 'Construir' }, { level: 3, label: 'Producir' }];
export function GameProgress({ level, onLevel, round, total, disabled = false, modes = defaultModes }: { level: number; onLevel: (level: number) => void; round: number; total: number; disabled?: boolean; modes?: PracticeMode[] }) {
  return <div className="game-progress">{modes.length > 1 && <nav aria-label="Forma de practicar">{modes.map(mode => <button disabled={disabled} key={mode.level} aria-pressed={level === mode.level} onClick={() => onLevel(mode.level)}>{mode.label}</button>)}</nav>}<small>{Math.min(round + 1, total)} / {total}</small><progress aria-label="Avance de la sesión" max={total || 1} value={round}/></div>;
}
export function GameResult({ score, total, unresolved, onRestart }: { score: number; total: number; unresolved: number; onRestart: () => void }) {
  return <div className="game-result" role="status"><h3>Sesión completada</h3><p>{score} aciertos en {total} intentos.</p><p>{unresolved ? `${unresolved} ${unresolved === 1 ? 'elemento necesita' : 'elementos necesitan'} más práctica. Puedes volver a intentarlo a tu ritmo.` : 'Has respondido correctamente a todos los elementos al menos una vez.'}</p><button type="button" className="button button-primary" onClick={onRestart}>Volver a practicar</button></div>;
}
