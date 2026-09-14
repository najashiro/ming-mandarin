'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { WritingPoint, WritingStroke } from '@/lib/hanzi/recognition';

export type HanziWritingCanvasHandle = { toDataURL: () => string; getStrokes: () => WritingStroke[] };
type Props = { strokes: WritingStroke[]; onChange: (strokes: WritingStroke[]) => void; disabled?: boolean; label?: string };

export const HanziWritingCanvas = forwardRef<HanziWritingCanvasHandle, Props>(function HanziWritingCanvas({ strokes, onChange, disabled = false, label = 'Escribe el carácter aquí' }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef(strokes);
  const pointerRef = useRef<number | null>(null);
  const sizeRef = useRef(150);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => { strokesRef.current = strokes; redrawRef.current(); }, [strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;
      const size = canvas.getBoundingClientRect().width;
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = size;
      const pixels = Math.round(size * dpr);
      if (canvas.width !== pixels) canvas.width = pixels;
      if (canvas.height !== pixels) canvas.height = pixels;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size, size);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = Math.max(4, size * 0.035);
      context.strokeStyle = '#18332b';
      for (const stroke of strokesRef.current) {
        if (!stroke.points.length) continue;
        context.beginPath();
        context.moveTo(stroke.points[0].x * size, stroke.points[0].y * size);
        for (const point of stroke.points.slice(1)) context.lineTo(point.x * size, point.y * size);
        if (stroke.points.length === 1) context.lineTo(stroke.points[0].x * size + 0.1, stroke.points[0].y * size + 0.1);
        context.stroke();
      }
    }
    redrawRef.current = draw;
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useImperativeHandle(ref, () => ({
    toDataURL: () => canvasRef.current?.toDataURL('image/png') ?? '',
    getStrokes: () => strokesRef.current,
  }), []);

  function point(event: React.PointerEvent<HTMLCanvasElement>): WritingPoint {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / sizeRef.current)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / sizeRef.current)), t: performance.now() };
  }

  function change(next: WritingStroke[]) {
    strokesRef.current = next;
    onChange(next);
  }

  return <canvas
    ref={canvasRef}
    className="hanzi-writing-canvas"
    role="img"
    aria-label={label}
    onPointerDown={(event) => {
      if (disabled || pointerRef.current !== null) return;
      event.preventDefault();
      pointerRef.current = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);
      change([...strokesRef.current, { points: [point(event)] }]);
    }}
    onPointerMove={(event) => {
      if (disabled || pointerRef.current !== event.pointerId) return;
      event.preventDefault();
      const next = [...strokesRef.current];
      const last = next.at(-1);
      if (!last) return;
      next[next.length - 1] = { points: [...last.points, point(event)] };
      change(next);
    }}
    onPointerUp={(event) => {
      if (pointerRef.current !== event.pointerId) return;
      event.preventDefault();
      pointerRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }}
    onPointerCancel={(event) => {
      if (pointerRef.current === event.pointerId) pointerRef.current = null;
    }}
  />;
});
