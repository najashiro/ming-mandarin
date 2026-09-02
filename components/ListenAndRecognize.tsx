'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ListeningEntry } from '@/data/types';
import { hanziOptions, shuffleWithoutImmediateRepeat } from '@/lib/listen-recognize';

type Props = {
  entries: ListeningEntry[];
  initialDeck: ListeningEntry[];
  initialAudio: HTMLAudioElement | null;
  onClose: () => void;
};

export function ListenAndRecognize({ entries, initialDeck, initialAudio, onClose }: Props) {
  const [deck, setDeck] = useState(() => initialDeck.length ? initialDeck : shuffleWithoutImmediateRepeat(entries));
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [correct, setCorrect] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(initialAudio);
  const current = deck[index];
  const options = useMemo(() => current ? hanziOptions(current, entries) : [], [current, entries]);

  useEffect(() => () => audioRef.current?.pause(), []);

  if (!current) return <div className="listen-recognize"><h3>Escucha y reconoce</h3><p>No hay entradas con audio disponibles para esta lección.</p><button type="button" onClick={onClose}>Cerrar</button></div>;

  function replay() {
    audioRef.current?.pause();
    const audio = new Audio(current.audioSrc);
    audioRef.current = audio;
    void audio.play().catch(() => undefined);
  }

  function choose(hanzi: string) {
    if (correct) return;
    if (hanzi === current.hanzi) {
      setCorrect(true);
      setWrong(false);
    } else {
      setWrong(true);
    }
  }

  function next() {
    setCorrect(false);
    setWrong(false);
    if (index + 1 < deck.length) {
      playNext(deck[index + 1]);
      setIndex(index + 1);
      return;
    }
    const nextDeck = shuffleWithoutImmediateRepeat(entries, current.id);
    playNext(nextDeck[0]);
    setDeck(nextDeck);
    setIndex(0);
  }

  function playNext(entry: ListeningEntry | undefined) {
    if (!entry) return;
    audioRef.current?.pause();
    const audio = new Audio(entry.audioSrc);
    audioRef.current = audio;
    void audio.play().catch(() => undefined);
  }

  return <div className="listen-recognize">
    <p className="eyebrow">听一听 · ESCUCHA Y RECONOCE</p>
    <button className="audio-button" type="button" onClick={replay}><span aria-hidden="true">▶</span> Escuchar de nuevo</button>
    <h3>¿Qué has escuchado?</h3>
    <div className="listen-options" aria-label="Opciones de hanzi">{options.map((hanzi) => <button type="button" disabled={correct} onClick={() => choose(hanzi)} key={hanzi}>{hanzi}</button>)}</div>
    <div className="listen-feedback" aria-live="polite">
      {wrong && !correct && <p>Todavía no. Inténtalo de nuevo.</p>}
      {correct && <div className="listen-answer"><b>✓ Correcto</b><strong>{current.hanzi}</strong><span>{current.pinyin}</span><p>{current.translation}</p></div>}
    </div>
    <div className="arena-actions">{correct && <button className="button button-primary" type="button" onClick={next}>Siguiente</button>}<button type="button" onClick={onClose}>Cerrar</button></div>
  </div>;
}
