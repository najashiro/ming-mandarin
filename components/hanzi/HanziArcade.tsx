'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { loadHanziData } from '@/lib/hanzi/loader';
import type { HanziCharacterData } from '@/lib/hanzi/types';
import { characters } from '@/seed/characters';
import { HanziStrokeSvg } from './HanziStrokeSvg';
import { HanziWriterStage, type HanziWriterStageHandle } from './HanziWriterStage';

export function HanziArcade({ gameIndex, round, onScore }: { gameIndex: number; round: number; onScore: () => void }) {
  const character = characters[(round + gameIndex) % characters.length];
  const [data, setData] = useState<HanziCharacterData | null>(null);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(1);
  const [message, setMessage] = useState('');
  const [quizActive, setQuizActive] = useState(false);
  const stage = useRef<HanziWriterStageHandle>(null);

  useEffect(() => {
    let active = true;
    void loadHanziData(character.hanzi).then((result) => { if (active) setData(result); });
    return () => { active = false; };
  }, [character.hanzi]);

  if (!data) return <p>Cargando reto Hanzi…</p>;

  if (gameIndex === 19) return <div className="arcade-hanzi-layout">
    <HanziWriterStage
      ref={stage}
      character={character.hanzi}
      showCharacter={false}
      interactive
      onQuizComplete={(summary) => {
        setQuizActive(false);
        if (summary.mistakes === 0) onScore();
        setMessage(summary.mistakes === 0 ? '无误 · Dojo perfecto.' : `Completado con ${summary.mistakes} ajustes.`);
      }}
    />
    <div><h3>Escribe {character.hanzi}</h3><p>{character.pinyin} · {character.meaning}</p><p>{message || 'El mismo motor del laboratorio comprueba orden, inicio y dirección.'}</p><div className="arena-actions"><button className="button button-primary" type="button" disabled={quizActive} onClick={() => { setQuizActive(true); setMessage(''); stage.current?.startQuiz('guided'); }}>Comenzar dojo</button><Link href={`/lesson/1/hanzi?character=${encodeURIComponent(character.hanzi)}&mode=practice`}>Practicar y guardar →</Link></div></div>
  </div>;

  if (gameIndex === 22) {
    function checkReveal() {
      if (answer.trim() === character.hanzi) {
        onScore();
        setRevealed(data!.strokes.length);
        setMessage('正确 · Lo reconociste.');
      } else {
        setRevealed((value) => Math.min(data!.strokes.length, value + 1));
        setMessage('Se revela un trazo más. Inténtalo de nuevo.');
      }
    }
    return <div className="arcade-hanzi-layout"><HanziStrokeSvg character={character.hanzi} data={data} visibleStrokes={revealed} showDirections={false} showNumbers={false} /><div><h3>¿Qué carácter aparece?</h3><p>Visible: {revealed} / {data.strokes.length} trazos.</p><input className="arcade-input" aria-label="Carácter revelado" value={answer} onChange={(event) => setAnswer(event.target.value)} maxLength={1} /><p>{message}</p><button className="button button-primary" type="button" onClick={checkReveal}>Comprobar</button></div></div>;
  }

  const isComponents = gameIndex === 20;
  return <div className="arcade-hanzi-layout compact-game"><div className="arcade-hanzi-glyph">{character.hanzi}</div><div><h3>{isComponents ? 'Constructor de caracteres' : 'Radical Lab'}</h3><p>{isComponents ? `Componentes registrados: ${character.components.join(' + ')}.` : `Radical registrado: ${character.radical}.`}</p><Link className="button button-primary" href={`/lesson/1/hanzi?character=${encodeURIComponent(character.hanzi)}&tab=Componentes`}>Explorar en el motor Hanzi</Link></div></div>;
}
