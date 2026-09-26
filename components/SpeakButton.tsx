'use client';
import { Hanzi } from '@/components/Hanzi';
import { useEffect, useRef, useState } from 'react';
import { audioForMandarinText } from '@/lib/mandarin-audio';
let stopActive: (() => void) | null = null;
type SpeakButtonProps = { text: string; reading?: string; speechText?: string; audioSrc?: string | string[]; rate?: number; label?: string; compact?: boolean; ariaLabel?: string; title?: string };
export function SpeakButton({ text, reading, audioSrc, rate = 0.85, label = 'Escuchar', compact = false, ariaLabel, title }: SpeakButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const runRef = useRef(0);
  const stopRef = useRef<(() => void) | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const resolved = audioSrc ?? audioForMandarinText(text, reading);
  const sources = Array.isArray(resolved) ? resolved : resolved ? [resolved] : [];
  useEffect(() => () => {
    runRef.current++;
    const audio = audioRef.current;
    if (audio) { audio.onended = null; audio.onerror = null; audio.onpause = null; audio.onplaying = null; audio.pause(); audio.removeAttribute('src'); audio.load(); }
    if (stopActive === stopRef.current) stopActive = null;
  }, [text, reading, audioSrc]);
  function stop() {
    runRef.current++;
    audioRef.current?.pause();
    if (stopActive === stopRef.current) stopActive = null;
    setState('idle');
  }
  async function play() {
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
      setState(error instanceof DOMException && error.name === 'AbortError' ? 'idle' : 'error');
      if (stopActive === stopRef.current) stopActive = null;
    }
  }
  if (!sources.length) return null;
  const active = state === 'loading' || state === 'playing';
  const status = state === 'error' ? 'No se pudo reproducir. Reintentar' : state === 'loading' ? 'Cargando. Detener' : active ? 'Detener' : label;
  return <span className="audio-control"><button className={`audio-button ${state}${compact ? ' compact' : ''}`} type="button" disabled={!sources.length} onClick={() => void play()} aria-label={active || !sources.length || state === 'error' ? `${status}: ${text}` : ariaLabel ?? `${label}: ${text}`} aria-busy={state === 'loading'} title={title ?? `${status}: ${text}`}><span aria-hidden="true">{active ? '■' : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4 6 8H3v8h3l5 4V4Z M15 8a6 6 0 0 1 0 8 M18 5a10 10 0 0 1 0 14"/></svg>}</span>{!compact && <> <Hanzi>{status}</Hanzi></>}</button>{(!sources.length || state === 'error') && <small role="status">{status}</small>}</span>;
}
