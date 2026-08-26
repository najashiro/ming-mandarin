'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterEntry } from '@/data/types';

export function HanziCanvas({ characters }: { characters: CharacterEntry[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [index, setIndex] = useState(0);
  const [ghost, setGhost] = useState(true);
  const [strokes, setStrokes] = useState(0);
  const character = characters[index];

  const clear = useCallback(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#fffdf7'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#d6cfc1'; ctx.lineWidth = 1; ctx.setLineDash([7,7]);
    for (const [x1,y1,x2,y2] of [[0,200,400,200],[200,0,200,400],[0,0,400,400],[400,0,0,400]]) { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
    ctx.setLineDash([]); if (ghost) { ctx.fillStyle = 'rgba(29,106,89,.12)'; ctx.font = '300px SimSun'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(character.hanzi, 200, 215); }
    setStrokes(0);
  }, [character.hanzi, ghost]);
  useEffect(() => { clear(); }, [clear]);
  function context() { return canvasRef.current?.getContext('2d') ?? null; }
  function point(event: React.PointerEvent<HTMLCanvasElement>) { const rect = event.currentTarget.getBoundingClientRect(); return { x: (event.clientX-rect.left)*400/rect.width, y: (event.clientY-rect.top)*400/rect.height }; }
  function start(event: React.PointerEvent<HTMLCanvasElement>) { drawing.current = true; event.currentTarget.setPointerCapture(event.pointerId); const p=point(event); const ctx=context(); if (!ctx) return; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.strokeStyle='#18332b'; ctx.lineWidth=17; ctx.lineCap='round'; ctx.lineJoin='round'; setStrokes((v)=>v+1); }
  function move(event: React.PointerEvent<HTMLCanvasElement>) { if(!drawing.current)return; const p=point(event); const ctx=context(); if(!ctx)return; ctx.lineTo(p.x,p.y); ctx.stroke(); }
  function end(){drawing.current=false;}
  return <div className="hanzi-lab"><section className="panel character-list"><p className="eyebrow">CARACTERES</p><div>{characters.map((item,i)=><button type="button" className={i===index?'selected':''} onClick={()=>setIndex(i)} key={item.id}>{item.hanzi}</button>)}</div></section><section className="panel canvas-panel"><div className="practice-top"><div><p className="eyebrow">米字格 · TRAZO LIBRE</p><h2>{character.hanzi} <small>{character.pinyin} · {character.meaning}</small></h2></div><span>{character.strokeCount} trazos</span></div><canvas ref={canvasRef} width="400" height="400" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} aria-label={`Área para escribir ${character.hanzi}`} /><div className="canvas-controls"><button type="button" onClick={()=>setGhost(v=>!v)}>{ghost?'Ocultar guía':'Modo fantasma'}</button><button type="button" onClick={clear}>Borrar</button><span>Trazos dibujados: <b>{strokes}</b> / {character.strokeCount}</span></div><p className={strokes===character.strokeCount?'canvas-ok':'source-note'}>{strokes===character.strokeCount?'★ Conteo correcto. Revisa visualmente orden y dirección.':'El conteo es comprobable; el orden se practica con la guía de la fuente. No se penalizan diferencias caligráficas pequeñas.'}</p></section></div>;
}
