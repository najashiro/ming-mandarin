'use client';

import { useEffect, useRef, useState } from 'react';
import { audioForMandarinText } from '@/lib/mandarin-audio';

let activeAudio: HTMLAudioElement | null = null;

type SpeakButtonProps = {
  text: string;
  /** Conservado por compatibilidad; la reproducción curricular siempre usa audioSrc estático. */
  speechText?: string;
  audioSrc?: string | string[];
  rate?: number;
  label?: string;
  compact?: boolean;
  ariaLabel?: string;
  title?: string;
};

export function SpeakButton({ text, audioSrc, rate = 0.85, label = 'Escuchar', compact = false, ariaLabel, title }: SpeakButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playRunRef = useRef(0);
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'unavailable'>('idle');
  const resolvedAudio = audioSrc ?? audioForMandarinText(text);
  const recordedSources = Array.isArray(resolvedAudio) ? resolvedAudio : resolvedAudio ? [resolvedAudio] : [];

  useEffect(() => () => {
    playRunRef.current += 1;
    if (audioRef.current && activeAudio === audioRef.current) {
      audioRef.current.pause();
      activeAudio = null;
    }
  }, []);

  function stop() {
    playRunRef.current += 1;
    if (audioRef.current) audioRef.current.pause();
    if (activeAudio === audioRef.current) activeAudio = null;
    setState('idle');
  }

  async function play() {
    if (state === 'playing' || state === 'loading') {
      stop();
      return;
    }
    const run = ++playRunRef.current;
    setState('loading');
    if (activeAudio) activeAudio.pause();

    if (recordedSources.length) {
      try {
        for (let index = 0; index < recordedSources.length; index += 1) {
          if (run !== playRunRef.current) return;
          const audio = new Audio(recordedSources[index]);
          audioRef.current = audio;
          audio.playbackRate = rate;
          activeAudio = audio;
          setState('playing');
          await new Promise<void>((resolve, reject) => {
            audio.onended = () => resolve();
            audio.onerror = () => reject(new Error('No se pudo cargar el audio.'));
            audio.onpause = () => {
              if (!audio.ended) reject(new DOMException('Reproducción interrumpida.', 'AbortError'));
            };
            audio.play().catch(reject);
          });
          if (index < recordedSources.length - 1) {
            await new Promise((resolve) => window.setTimeout(resolve, 220));
          }
        }
        if (run === playRunRef.current) {
          activeAudio = null;
          setState('idle');
        }
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          setState('idle');
          return;
        }
        if (activeAudio === audioRef.current) activeAudio = null;
        if (run === playRunRef.current) setState('unavailable');
        return;
      }
    }

    setState('unavailable');
  }

  const isActive = state === 'loading' || state === 'playing';
  const visibleLabel = isActive ? 'Detener' : label;
  const accessibleLabel = isActive ? `Detener pronunciación de ${text}` : ariaLabel ?? `${visibleLabel}: ${text}`;
  return <button className={`audio-button ${state}${compact ? ' compact' : ''}`} type="button" onClick={play} aria-label={accessibleLabel} aria-live="polite" title={title}>
    <span aria-hidden="true">{isActive ? '■' : compact ? '🔊' : '▶'}</span>{!compact && <> {visibleLabel}</>}
  </button>;
}
