'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { claimMandarinAudio } from '@/components/SpeakButton';

type VoiceState = { activeSource: string | null; blocked: boolean; failed: boolean };
const idle: VoiceState = { activeSource: null, blocked: false, failed: false };

// Keep the player separate from React so a render never starts or repeats audio.
export function createMandarinAudioPlayer({ onChange, createAudio = () => new Audio(), claimFocus = claimMandarinAudio }: {
  onChange: (state: VoiceState) => void;
  createAudio?: () => HTMLAudioElement;
  claimFocus?: (stop: () => void) => () => void;
}) {
  let audio: HTMLAudioElement | null = null;
  let releaseFocus: (() => void) | null = null;
  let run = 0;
  let clip = 0;
  let disposed = false;

  function clearPlayback() {
    run++;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.onpause = null;
      audio.pause();
    }
    releaseFocus?.();
    releaseFocus = null;
  }
  function update(state: VoiceState) { if (!disposed) onChange(state); }
  function stop() { clearPlayback(); update(idle); }

  function play(sources: readonly string[]) {
    if (disposed) return;
    stop();
    const queue = sources.filter(Boolean);
    if (!queue.length) return;
    try {
      // Safari grants playback to this element in the initiating click. Reuse it
      // for every subsequent clip, including clips in the next round.
      audio ??= createAudio();
      audio.preload = 'auto';
      audio.playbackRate = 1;
      releaseFocus = claimFocus(stop);
      const thisRun = ++run;
      let index = 0;

      function next() {
        if (!audio || disposed || thisRun !== run) return;
        const thisClip = ++clip;
        const current = () => !disposed && thisRun === run && thisClip === clip;
        const fail = (error: unknown) => {
          if (!current()) return;
          const name = error instanceof Error ? error.name : '';
          clearPlayback();
          update({ activeSource: null, blocked: name === 'NotAllowedError', failed: name !== 'NotAllowedError' && name !== 'AbortError' });
        };
        const src = queue[index];
        audio.onended = () => {
          if (!current()) return;
          if (++index < queue.length) next();
          else { clearPlayback(); update(idle); }
        };
        audio.onerror = () => fail(new Error('Audio unavailable'));
        audio.onpause = () => {
          // Ignore a queued pause from switching src if playback already resumed.
          if (current() && audio?.paused && !audio.ended) stop();
        };
        audio.src = src;
        update({ activeSource: src, blocked: false, failed: false });
        // Deliberately synchronous: do not move this into an effect or timer.
        try { void audio.play().catch(fail); } catch (error) { fail(error); }
      }
      next();
    } catch (error) {
      clearPlayback();
      update({ activeSource: null, blocked: error instanceof Error && error.name === 'NotAllowedError', failed: !(error instanceof Error && error.name === 'NotAllowedError') });
    }
  }

  function dispose() {
    disposed = true;
    clearPlayback();
    if (audio) { audio.removeAttribute('src'); audio.load(); audio = null; }
  }
  return { play, stop, dispose };
}

export function useMandarinAudioPlayer() {
  const [state, setState] = useState<VoiceState>(idle);
  const player = useRef<ReturnType<typeof createMandarinAudioPlayer> | null>(null);
  const play = useCallback((sources: readonly string[]) => {
    player.current ??= createMandarinAudioPlayer({ onChange: setState });
    player.current.play(sources);
  }, []);
  const stop = useCallback(() => player.current?.stop(), []);
  useEffect(() => () => { player.current?.dispose(); player.current = null; }, []);
  return { ...state, play, stop };
}
