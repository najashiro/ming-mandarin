'use client';
import { useState } from 'react';
import type { ListeningEntry } from '@/data/types';
import { Hanzi } from '@/components/Hanzi';
import { SpeakButton } from '@/components/SpeakButton';
export function StudyTools({ entries }: { entries: ListeningEntry[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [rate, setRate] = useState(0.85);
  const item = entries[index];
  if (!item) return null;
  return <details className="study-tools shell"><summary>Herramientas de repaso · Flashcards y Shadowing</summary><p>Escucha, repite en voz alta y recupera el significado.</p><button className="study-flashcard" onClick={() => setRevealed(value => !value)} aria-label="Voltear flashcard"><Hanzi>{item.hanzi}</Hanzi>{revealed && <span>{item.pinyin}<br/>{item.translation}</span>}</button><label>Velocidad <select value={rate} onChange={event => setRate(Number(event.target.value))}><option value="0.7">0.7×</option><option value="0.85">0.85×</option><option value="1">1×</option></select></label><SpeakButton key={`${index}-${rate}`} text={item.hanzi} audioSrc={item.audioSrc} rate={rate}/><button onClick={() => { setIndex(value => (value + 1) % entries.length); setRevealed(false); }}>Siguiente ficha</button></details>;
}
