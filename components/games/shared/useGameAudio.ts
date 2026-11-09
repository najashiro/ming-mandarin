'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { claimMandarinAudio } from '@/components/SpeakButton';
import { audioForMandarinText } from '@/lib/mandarin-audio';

/** Start in the click/submit gesture so iPhone can play without an autoplay grant. */
export function useGameAudio() {
  const cleanup = useRef<(() => void) | null>(null);
  const last = useRef<{ text: string; reading?: string } | null>(null);
  const [error, setError] = useState(false);
  const stop = useCallback(() => { cleanup.current?.(); cleanup.current = null; }, []);
  useEffect(() => stop, [stop]);

  const play = useCallback((text: string, reading?: string) => {
    stop();
    last.current = { text, reading };
    setError(false);
    const src = audioForMandarinText(text, reading) ?? audioForMandarinText(text);
    if (!src) { setError(true); return; }
    const audio = new Audio(src);
    audio.playbackRate = 0.85;
    let cancelled = false;
    let release = () => {};
    const dispose = () => {
      cancelled = true;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      release();
    };
    release = claimMandarinAudio(dispose);
    cleanup.current = dispose;
    const failed = () => { if (!cancelled) { setError(true); dispose(); } };
    audio.onended = dispose;
    audio.onerror = failed;
    void audio.play().catch(failed);
  }, [stop]);
  const retry = () => { if (last.current) play(last.current.text, last.current.reading); };
  return { play, stop, error, retry };
}
