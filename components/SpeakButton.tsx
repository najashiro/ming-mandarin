'use client';
import { Hanzi } from '@/components/Hanzi';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { audioForMandarinText } from '@/lib/mandarin-audio';
let stopActive: (() => void) | null = null;
export function stopMandarinAudio() { stopActive?.(); }
type SpeakButtonProps = { text: string; reading?: string; speechText?: string; audioSrc?: string | string[]; rate?: number; label?: string; compact?: boolean; ariaLabel?: string; title?: string; autoPlayKey?: string; onAutoPlayBlocked?: () => void };
export function SpeakButton({ text, reading, audioSrc, rate = 0.85, label = 'Escuchar', compact = false, ariaLabel, title, autoPlayKey, onAutoPlayBlocked }: SpeakButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const runRef = useRef(0);
  const stopRef = useRef<(() => void) | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const resolved = audioSrc ?? audioForMandarinText(text, reading);
  const sources = useMemo(() => Array.isArray(resolved) ? resolved : resolved ? [resolved] : [], [resolved]);
  useEffect(() => () => {
    runRef.current++;
    const audio = audioRef.current;
    if (audio) { audio.onended = null; audio.onerror = null; audio.onpause = null; audio.onplaying = null; audio.pause(); audio.removeAttribute('src'); audio.load(); }
    if (stopActive === stopRef.current) stopActive = null;
  }, [text, reading, audioSrc]);
  const stop = useCallback(() => {
    runRef.current++;
    audioRef.current?.pause();
    if (stopActive === stopRef.current) stopActive = null;
    setState('idle');
  }, []);
  const play = useCallback(async (automatic = false) => {
    if (state === 'loading' || state === 'playing') { stop(); return; }
    if (!sources.length) return;
    stopActive?.();
    const run = ++runRef.current;
    stopRef.current = stop;
    stopActive = stop;
    setState('loading');
    try {
      for (const src of sources) {
        if (run !== runRef.current) return;
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.playbackRate = rate;
        await new Promise<void>((resolve, reject) => {
          audio.onplaying = () => { if (run === runRef.current) setState('playing'); };
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error('load'));
          audio.onpause = () => { if (!audio.ended) reject(new DOMException('Stopped', 'AbortError')); };
          audio.play().catch(reject);
        });
      }
      if (run === runRef.current) { setState('idle'); if (stopActive === stopRef.current) stopActive = null; }
    } catch (error) {
      if (run !== runRef.current) return;
      const aborted = error instanceof DOMException && error.name === 'AbortError';
      const blocked = error instanceof DOMException && error.name === 'NotAllowedError';
      setState(aborted || (automatic && blocked) ? 'idle' : 'error');
      if (automatic && blocked) onAutoPlayBlocked?.();
      if (stopActive === stopRef.current) stopActive = null;
    }
  }, [onAutoPlayBlocked, rate, sources, state, stop]);
  const autoStarted = useRef('');
  useEffect(() => {
    if (!autoPlayKey || autoStarted.current === autoPlayKey || !sources.length) return;
    const timer = window.setTimeout(() => {
      autoStarted.current = autoPlayKey;
      void play(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [autoPlayKey, play, sources.length]);
  if (!sources.length) return null;
  const active = state === 'loading' || state === 'playing';
  const status = state === 'error' ? 'No se pudo reproducir. Reintentar' : state === 'loading' ? 'Cargando. Detener' : active ? 'Detener' : label;
  return <span className="audio-control"><button className={`audio-button ${state}${compact ? ' compact' : ''}`} type="button" disabled={!sources.length} onClick={() => void play()} aria-label={active || !sources.length || state === 'error' ? `${status}: ${text}` : ariaLabel ?? `${label}: ${text}`} aria-busy={state === 'loading'} title={title ?? `${status}: ${text}`}><span aria-hidden="true">{active ? '■' : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4 6 8H3v8h3l5 4V4Z M15 8a6 6 0 0 1 0 8 M18 5a10 10 0 0 1 0 14"/></svg>}</span>{!compact && <> <Hanzi>{status}</Hanzi></>}</button>{(!sources.length || state === 'error') && <small role="status">{status}</small>}</span>;
}
