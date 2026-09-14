'use client';

import { useEffect, useRef, useState } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { PinyinText } from '@/components/PinyinText';
import { recognizeHanzi, type WritingStroke } from '@/lib/hanzi/recognition';
import { HanziWritingCanvas } from './HanziWritingCanvas';
import { hanziGlyphHref } from '@/lib/hanzi/navigation';

export type WritingSummary = { expected: string; completedCharacters: number; attempts: number; failedCharacters: string[] };
type Props = { expected: string; pinyin: string; meaning: string; onComplete: (correct: boolean, summary: WritingSummary) => void; showExpectedLength?: boolean };

export function HanziWritingSequence({ expected, pinyin, meaning, onComplete, showExpectedLength = true }: Props) {
  const characters = [...expected];
  const [index, setIndex] = useState(0);
  const [strokes, setStrokes] = useState<WritingStroke[]>([]);
  const [status, setStatus] = useState<'drawing' | 'checking' | 'correct' | 'incorrect'>('drawing');
  const [message, setMessage] = useState('');
  const attempts = useRef(0);
  const failures = useRef<string[]>([]);
  const finished = useRef(false);
  const nextTimer = useRef<number | null>(null);
  const mounted = useRef(true);
  const checking = useRef(false);
  const completed = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (nextTimer.current !== null) window.clearTimeout(nextTimer.current);
    };
  }, []);

  function advance() {
    if (index + 1 === characters.length) {
      if (finished.current) return;
      finished.current = true;
      onComplete(completed.current === characters.length, { expected, completedCharacters: completed.current, attempts: attempts.current, failedCharacters: failures.current });
      return;
    }
    setIndex(index + 1);
    setStrokes([]);
    setStatus('drawing');
    setMessage('');
  }

  async function check() {
    if (checking.current || status !== 'drawing' || !strokes.length) return;
    checking.current = true;
    setStatus('checking');
    attempts.current += 1;
    const result = await recognizeHanzi(strokes, characters[index], 'EXAM_MODE');
    if (!mounted.current) return;
    checking.current = false;
    if (result.unavailable) {
      setStatus('drawing');
      setMessage(result.message);
      return;
    }
    if (result.accepted) {
      completed.current += 1;
      setStatus('correct');
      setMessage('✅ OK');
      nextTimer.current = window.setTimeout(advance, 650);
    } else {
      failures.current = [...new Set([...failures.current, characters[index]])];
      setStatus('incorrect');
      setMessage(result.message);
    }
  }

  return <div className="hanzi-writing-sequence">
    <p className="hanzi-writing-count">{showExpectedLength ? `Carácter ${index + 1} de ${characters.length}` : 'Escribe el carácter actual'}</p>
    {showExpectedLength && <div className="hanzi-writing-slots" aria-label="Progreso de escritura">{characters.map((character, position) => <span className={position < index ? 'completed' : position === index ? 'active' : ''} key={position}>{position < index ? <Hanzi>{character}</Hanzi> : '□'}</span>)}</div>}
    <HanziWritingCanvas strokes={strokes} onChange={setStrokes} disabled={status !== 'drawing'} label={showExpectedLength ? `Escribe el carácter ${index + 1} de ${characters.length}` : 'Escribe el carácter actual'} />
    <div className="hanzi-writing-controls">
      <button type="button" disabled={status !== 'drawing' || !strokes.length} onClick={() => setStrokes((current) => current.slice(0, -1))}>↶ Deshacer</button>
      <button type="button" disabled={status !== 'drawing' || !strokes.length} onClick={() => setStrokes([])}>🗑 Limpiar</button>
      <button type="button" disabled={status !== 'drawing' || !strokes.length} onClick={() => void check()}>{status === 'checking' ? 'Comprobando…' : '✓ Comprobar'}</button>
    </div>
    <p className={`hanzi-writing-status ${status}`} role="status" aria-live="polite">{message}</p>
    {status === 'incorrect' && <div className="hanzi-writing-correction">
      <b>❌ Revisa este carácter</b>
      <p>Respuesta correcta: <strong><Hanzi>{characters[index]}</Hanzi></strong></p>
      <p>Palabra o frase: <PinyinText>{pinyin}</PinyinText> · <Hanzi>{meaning}</Hanzi></p>
      <div>
        <button type="button" onClick={() => { setStrokes([]); setStatus('drawing'); setMessage(''); }}>↻ Intentar nuevamente</button>
        <a href={hanziGlyphHref(characters[index])} target="_blank" rel="noopener noreferrer">Ver Hanzi →</a>
        <button type="button" onClick={advance}>Continuar con el siguiente →</button>
      </div>
    </div>}
  </div>;
}
