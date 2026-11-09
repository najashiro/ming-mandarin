'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Hanzi } from '@/components/Hanzi';
import { PinyinText } from '@/components/PinyinText';
import { stopMandarinAudio } from '@/components/SpeakButton';
import language from '@/data/directions-language.json';

type Reading = { hanzi: string; pinyin: string; spanish: string; audioSrc: string };
const readings: Record<string, Reading> = language.entries;
export function directionReading(text: string): Reading {
  const entry = readings[text];
  if (!entry) throw new Error(`Texto del juego sin lectura ni audio: ${text}`);
  return entry;
}
export const readingPreferenceKey = 'ming-directions-reading-v1';
type LearningState = {
  showReading: boolean; toggleReading: () => void;
  play: (text: string) => void; stop: () => void; activeText: string | null;
};
const LearningContext = createContext<LearningState | null>(null);
export function useDirectionLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('DirectionLearningProvider is required');
  return context;
}

export function DirectionLearningProvider({ children }: { children: ReactNode }) {
  const [showReading, setShowReading] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generation = useRef(0);
  const release = useCallback(() => {
    generation.current++;
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null; audio.onerror = null; audio.onplaying = null;
      audio.pause(); audio.removeAttribute('src'); audio.load();
      audioRef.current = null;
    }
  }, []);
  const stop = useCallback(() => { release(); setActiveText(null); }, [release]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setShowReading(localStorage.getItem(readingPreferenceKey) === 'true'); }
      catch { /* Reading aids still work when persistence is unavailable. */ }
    });
    return () => { cancelAnimationFrame(frame); release(); };
  }, [release]);
  const play = useCallback((text: string) => {
    release(); stopMandarinAudio(); setError(null);
    const current = generation.current;
    const audio = new Audio(directionReading(text).audioSrc);
    audioRef.current = audio;
    audio.playbackRate = 0.9;
    setActiveText(text);
    const failed = () => {
      if (generation.current !== current) return;
      setActiveText(null); setError(text);
    };
    audio.onended = () => { if (generation.current === current) setActiveText(null); };
    audio.onerror = failed;
    // Start within the original tap, including on iOS. Never synthesize browser voices.
    void audio.play().catch(failed);
  }, [release]);
  function toggleReading() {
    const next = !showReading; setShowReading(next);
    try { localStorage.setItem(readingPreferenceKey, String(next)); } catch { /* Optional persistence. */ }
  }
  return <LearningContext.Provider value={{ showReading, toggleReading, play, stop, activeText }}>
    {children}
    {error && <div className="directions-audio-error" role="status"><span>No se pudo reproducir el audio.</span><button type="button" onClick={() => play(error)}>Reintentar <Hanzi>{error}</Hanzi></button><button type="button" aria-label="Cerrar aviso de audio" onClick={() => setError(null)}>×</button></div>}
  </LearningContext.Provider>;
}

export function AudioGlyph({ active = false }: { active?: boolean }) {
  return <svg className={`directions-audio-glyph${active ? ' active' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m11 4-5 4H3v8h3l5 4Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>;
}

/** Text-only content for action buttons: no nested interactive elements. */
export function DirectionText({ text, forceReading = false, icon = false }: { text: string; forceReading?: boolean; icon?: boolean }) {
  const { showReading, activeText } = useDirectionLearning();
  const entry = directionReading(text);
  return <span className="direction-text" data-reading={showReading || forceReading}>
    <span className="direction-text-hanzi"><Hanzi>{entry.hanzi}</Hanzi>{icon && <AudioGlyph active={activeText === text}/>}</span>
    {(showReading || forceReading) && <><span className="direction-text-pinyin"><PinyinText>{entry.pinyin}</PinyinText></span><span className="direction-text-spanish" lang="es">{entry.spanish}</span></>}
  </span>;
}

/** Both the hanzi and the adjacent speaker replay the complete word or sentence. */
export function DirectionReadout({ text, className = '', forceReading = false }: { text: string; className?: string; forceReading?: boolean }) {
  const { play, activeText } = useDirectionLearning();
  return <button type="button" className={`direction-readout ${className}`} onClick={() => play(text)} aria-label={`Escuchar: ${text}`} aria-pressed={activeText === text} title="Escuchar en mandarín">
    <DirectionText text={text} forceReading={forceReading} icon/>
  </button>;
}
