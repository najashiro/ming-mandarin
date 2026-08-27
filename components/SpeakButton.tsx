'use client';

import { useEffect, useRef, useState } from 'react';

let activeAudio: HTMLAudioElement | null = null;

async function findChineseVoice() {
  if (!('speechSynthesis' in window)) return null;
  let voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
      const finish = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', finish);
        resolve(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
      window.setTimeout(finish, 1000);
    });
  }
  return voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'))
    ?? null;
}

export async function speakChinese(text: string, rate = 0.85, onFinish?: () => void) {
  if (!('speechSynthesis' in window)) return false;
  const voice = await findChineseVoice();
  if (!voice) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = rate;
  utterance.voice = voice;
  utterance.onend = () => onFinish?.();
  utterance.onerror = () => onFinish?.();
  window.speechSynthesis.speak(utterance);
  return true;
}

type SpeakButtonProps = {
  text: string;
  speechText?: string;
  audioSrc?: string | string[];
  rate?: number;
  label?: string;
};

export function SpeakButton({ text, speechText, audioSrc, rate = 0.85, label = 'Escuchar' }: SpeakButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playRunRef = useRef(0);
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'unavailable'>('idle');
  const recordedSources = Array.isArray(audioSrc) ? audioSrc : audioSrc ? [audioSrc] : [];

  useEffect(() => () => {
    playRunRef.current += 1;
    if (audioRef.current && activeAudio === audioRef.current) {
      audioRef.current.pause();
      activeAudio = null;
    }
  }, []);

  async function play() {
    const run = ++playRunRef.current;
    setState('loading');
    if (activeAudio) activeAudio.pause();
    window.speechSynthesis?.cancel();

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
      }
    }

    const spoken = await speakChinese(speechText ?? text, rate, () => {
      if (run === playRunRef.current) setState('idle');
    });
    setState(spoken ? 'playing' : 'unavailable');
  }

  const source = recordedSources.length > 1 ? 'serie IA grabada' : recordedSources.length === 1 ? 'voz IA grabada' : 'voz china local';
  const status = state === 'loading' ? 'cargando' : state === 'playing' ? 'reproduciendo' : state === 'unavailable' ? 'sin voz china' : source;
  const title = recordedSources.length ? 'Audio en mandarín; voz generada por IA' : 'Voz sintética china instalada en el dispositivo';

  return <button className={`audio-button ${state}`} type="button" onClick={play} title={title} aria-label={`${label}: ${text}`} aria-live="polite"><span aria-hidden="true">{state === 'playing' ? '■' : '▶'}</span> {label}<small>{status}</small></button>;
}
