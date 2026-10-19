'use client';

import { useEffect, useRef, useState } from 'react';
import { stopMandarinAudio } from '@/components/SpeakButton';

/** Listening questions never expose their answer through a tooltip or live label. */
export function HiddenAudioButton({ src, label = 'Escuchar audio', disabled = false }: { src: string; label?: string; disabled?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  useEffect(() => {
    const audio = audioRef.current;
    return () => { audio?.pause(); };
  }, [src]);
  useEffect(() => { if (disabled) audioRef.current?.pause(); }, [disabled]);

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    stopMandarinAudio();
    setStatus('loading');
    audio.playbackRate = 0.85;
    audio.currentTime = 0;
    try { await audio.play(); } catch { setStatus('error'); }
  }

  const text = status === 'loading' ? 'Cargando audio. Detener' : status === 'playing' ? 'Detener audio' : status === 'error' ? 'Reintentar audio' : label;
  return <span className="audio-control">
    <audio ref={audioRef} src={src} preload="none" hidden onPlaying={() => setStatus('playing')} onPause={() => setStatus('idle')} onEnded={() => setStatus('idle')} onError={() => setStatus('error')}/>
    <button className={`audio-button ${status}`} type="button" disabled={disabled} aria-label={text} title={text} aria-busy={status === 'loading'} onClick={() => void play()}>{text}</button>
    {status === 'error' && <small role="status">No se pudo reproducir el audio. Vuelve a intentarlo.</small>}
  </span>;
}
