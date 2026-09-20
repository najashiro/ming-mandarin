'use client';
import { useRef, useState } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import type { CurriculumScope } from '@/data/types';
import { gameEventId, retryQueue, sessionOrder } from '@/lib/games-session';

export function useGameSession(game: string, scope: CurriculumScope, size: number) {
  const [round, setRound] = useState(0);
  const [order] = useState(() => sessionOrder(size));
  const [level, setLevel] = useState(1);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [retries, setRetries] = useState<number[]>([]);
  const answered = useRef(false);
  const total = Math.min(size, 6);
  const position = round < total ? round : retries[round - total] ?? 0;
  const index = order[position] ?? 0;
  const finished = round >= total + retries.length;
  function check(correct: boolean, contentId: string, mode = '') {
    if (answered.current) return false;
    answered.current = true;
    setResult(correct);
    if (correct) setScore(value => value + 1);
    else if (round < total && total > 1) setRetries(values => retryQueue(values, position, total));
    trackAnalyticsEvent('exercise_completed', { contentId: gameEventId(game, scope, level, mode, contentId), correct });
    return true;
  }
  function next() {
    if (!answered.current) return;
    if (round + 1 >= total + retries.length) trackAnalyticsEvent('game_completed', { contentId: `${game}:${scope}` });
    if (result && (round + 1) % 2 === 0) setLevel(value => Math.min(3, value + 1));
    if (result === false) setLevel(value => Math.max(1, value - 1));
    setRound(value => value + 1); setResult(null); answered.current = false;
  }
  return { round, index, level, setLevel, result, check, next, score, finished, total: total + retries.length };
}
export function GameProgress({ level, onLevel, round, total }: { level: number; onLevel: (level: number) => void; round: number; total: number }) {
  return <div className="game-progress"><nav aria-label="Dificultad">{['Reconocer', 'Construir', 'Producir'].map((label, index) => <button key={label} aria-pressed={level === index + 1} onClick={() => onLevel(index + 1)}>{level === index + 1 ? '●' : '○'} {label}</button>)}</nav><small>{Math.min(round + 1, total)} / {total}</small><progress max={total || 1} value={round}/></div>;
}
export function GameResult({ score, total }: { score: number; total: number }) { return <div className="game-result"><h3>Sesión completada</h3><p>{score} aciertos en {total} intentos.</p><p>Los errores han vuelto al final para consolidar lo aprendido.</p></div>; }
