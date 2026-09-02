'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type HanziWriter from 'hanzi-writer';
import { hanziWriterDataLoader } from '@/lib/hanzi/loader';
import type { HanziPracticeMode } from '@/lib/hanzi/types';

export type QuizSummary = {
  correctStrokes: number;
  mistakes: number;
  durationMs: number;
};

export type HanziWriterStageHandle = {
  animate(onComplete?: () => void): void;
  pause(): void;
  resume(): void;
  show(): void;
  hide(): void;
  showOutline(): void;
  hideOutline(): void;
  animateStroke(index: number): void;
  startQuiz(mode: HanziPracticeMode): void;
  cancelQuiz(): void;
};

type Props = {
  character: string;
  showCharacter?: boolean;
  showOutline?: boolean;
  speed?: number;
  interactive?: boolean;
  onReady?: () => void;
  onError?: (message: string) => void;
  onMistake?: (total: number, mistakesOnStroke: number) => void;
  onCorrectStroke?: (count: number) => void;
  onQuizComplete?: (summary: QuizSummary) => void;
};

export const HanziWriterStage = forwardRef<HanziWriterStageHandle, Props>(function HanziWriterStage({
  character,
  showCharacter = true,
  showOutline = true,
  speed = 1,
  interactive = false,
  onReady,
  onError,
  onMistake,
  onCorrectStroke,
  onQuizComplete,
}, ref) {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const quizStartedAt = useRef(0);
  const correctStrokes = useRef(0);
  const callbacks = useRef({ onReady, onError, onMistake, onCorrectStroke, onQuizComplete });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    callbacks.current = { onReady, onError, onMistake, onCorrectStroke, onQuizComplete };
  }, [onCorrectStroke, onError, onMistake, onQuizComplete, onReady]);

  useEffect(() => {
    let active = true;
    let observer: ResizeObserver | null = null;
    const target = targetRef.current;
    if (!target) return;
    target.replaceChildren();
    setStatus('loading');

    void import('hanzi-writer').then(({ default: Writer }) => {
      if (!active || !targetRef.current) return;
      const size = Math.max(260, Math.min(420, targetRef.current.clientWidth || 360));
      const writer = Writer.create(targetRef.current, character, {
        width: size,
        height: size,
        padding: 24,
        renderer: 'svg',
        showCharacter,
        showOutline,
        charDataLoader: hanziWriterDataLoader,
        strokeColor: '#18332b',
        radicalColor: '#a23a2c',
        outlineColor: '#c9c3b6',
        highlightColor: '#d48d35',
        drawingColor: '#1d6a59',
        drawingWidth: 8,
        strokeAnimationSpeed: speed,
        strokeHighlightSpeed: speed,
        delayBetweenStrokes: 280,
        onLoadCharDataSuccess: () => {
          if (!active) return;
          setStatus('ready');
          callbacks.current.onReady?.();
        },
        onLoadCharDataError: () => {
          if (!active) return;
          setStatus('error');
          callbacks.current.onError?.(`No se pudieron cargar los trazos de ${character}.`);
        },
      });
      writerRef.current = writer;
      observer = new ResizeObserver(([entry]) => {
        const next = Math.max(260, Math.min(420, Math.floor(entry.contentRect.width)));
        writer.updateDimensions({ width: next, height: next, padding: 24 });
      });
      observer.observe(targetRef.current);
    }).catch(() => {
      if (!active) return;
      setStatus('error');
      callbacks.current.onError?.('El motor de escritura no está disponible.');
    });

    return () => {
      active = false;
      observer?.disconnect();
      writerRef.current?.cancelQuiz();
      writerRef.current = null;
      target.replaceChildren();
    };
  }, [character, showCharacter, showOutline, speed]);

  useImperativeHandle(ref, () => ({
    animate: (onComplete) => { void writerRef.current?.animateCharacter({ onComplete }); },
    pause: () => { void writerRef.current?.pauseAnimation(); },
    resume: () => { void writerRef.current?.resumeAnimation(); },
    show: () => { void writerRef.current?.showCharacter({ duration: 120 }); },
    hide: () => { void writerRef.current?.hideCharacter({ duration: 120 }); },
    showOutline: () => { void writerRef.current?.showOutline({ duration: 120 }); },
    hideOutline: () => { void writerRef.current?.hideOutline({ duration: 120 }); },
    animateStroke: (index) => { void writerRef.current?.animateStroke(index); },
    cancelQuiz: () => writerRef.current?.cancelQuiz(),
    startQuiz: (mode) => {
      const writer = writerRef.current;
      if (!writer) return;
      writer.cancelQuiz();
      quizStartedAt.current = performance.now();
      correctStrokes.current = 0;
      void writer.quiz({
        leniency: mode === 'guided' ? 1.35 : mode === 'independent' ? 1 : 0.8,
        showHintAfterMisses: mode === 'guided' ? 2 : mode === 'independent' ? 4 : false,
        acceptBackwardsStrokes: false,
        highlightOnComplete: true,
        onMistake: (stroke) => callbacks.current.onMistake?.(stroke.totalMistakes, stroke.mistakesOnStroke),
        onCorrectStroke: () => {
          correctStrokes.current += 1;
          callbacks.current.onCorrectStroke?.(correctStrokes.current);
        },
        onComplete: (summary) => callbacks.current.onQuizComplete?.({
          correctStrokes: correctStrokes.current,
          mistakes: summary.totalMistakes,
          durationMs: Math.max(1, Math.round(performance.now() - quizStartedAt.current)),
        }),
      });
    },
  }), []);

  return <div className={`hanzi-writer-frame ${interactive ? 'is-interactive' : ''}`}>
    <div className="mizi-grid" aria-hidden="true"><i /><i /><i /><i /></div>
    <div ref={targetRef} className="hanzi-writer-target" data-testid="hanzi-writer" aria-label={`Área de escritura para ${character}`} />
    {status === 'loading' && <p className="hanzi-stage-status">Cargando trazos…</p>}
    {status === 'error' && <p className="hanzi-stage-status error">Datos no disponibles.</p>}
  </div>;
});
