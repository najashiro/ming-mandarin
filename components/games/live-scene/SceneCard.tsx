'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { SceneKind } from '@/data/games-curriculum';

export function Person({ index = 0, doctor = false, busy = false }: { index?: number; doctor?: boolean; busy?: boolean }) {
  return <svg viewBox="0 0 110 160" aria-hidden="true"><ellipse cx="55" cy="150" rx="35" ry="6" fill="#c6bca8" opacity=".4"/><path d="M27 145v-37q0-28 28-28t28 28v37" fill={doctor ? '#fff' : ['#317c74','#d48253','#d5b667','#647b9c'][index % 4]} stroke="#25473e" strokeWidth="2"/><rect x="47" y="72" width="16" height="19" rx="7" fill="#dda77f"/><ellipse cx="55" cy="46" rx="27" ry="34" fill="#efbc92"/><path d="M28 45Q19 9 53 10Q91 8 83 49L74 30Q51 38 37 28Z" fill="#343b36"/><path d={busy ? 'M39 50h8m15 0h8M46 67h17' : 'M40 49h3m23 0h3M45 64q10 10 20 0'} stroke="#343b36" strokeWidth="3" fill="none" strokeLinecap="round"/>{doctor && <path d="M55 95v28m-14-14h28" stroke="#b34c43" strokeWidth="6"/>}</svg>;
}
export function SceneCard({ kind, count = 2, sentenceId = '', interactive = true }: { kind: SceneKind; count?: number; sentenceId?: string; interactive?: boolean }) {
  const [revealed, setRevealed] = useState(kind !== 'photo');
  const [selected, setSelected] = useState<number[]>([]);
  const food = sentenceId.includes('baozi') ? ['baozi', 'jiaozi'] : ['rice', 'noodles'];
  return <div className={`live-scene scene-${kind}`}>
    <div className="scene-window" aria-hidden="true"/>
    {kind === 'photo' && !revealed ? <button className="photo-cover" onClick={() => setRevealed(true)}>Revelar fotografía</button> : <>
      {kind === 'food' ? <div className="scene-table">{food.map((name, index) => <button disabled={!interactive} aria-label={`Observar plato ${index + 1}`} aria-pressed={selected.includes(index)} onClick={() => setSelected(values => values.includes(index) ? values.filter(id => id !== index) : [...values,index])} key={name}><Image unoptimized src={`/images/games/reto-mixto/${name}.webp`} alt={sentenceId.includes('baozi') ? (index ? 'Empanadillas hervidas, al fondo' : 'Bollos al vapor, cerca') : (index ? 'Fideos' : 'Arroz cocido')} width="180" height="180"/></button>)}</div> : kind === 'photo' ? <Image className="scene-photograph" unoptimized src="/images/games/reto-mixto/photo.webp" alt="Una fotografía de familia sostenida en las manos" width={640} height={640}/> : <div className="scene-people">{Array.from({length: kind === 'family' ? count : 1}, (_, index) => <button disabled={!interactive} key={index} aria-label={`Observar persona ${index + 1}`} aria-pressed={selected.includes(index)} onClick={() => setSelected(values => values.includes(index) ? values.filter(id => id !== index) : [...values,index])}><Person index={index} doctor={kind === 'doctor'} busy={kind === 'busy'}/></button>)}</div>}
      {kind === 'busy' && <div className="scene-work" aria-label="Mucho trabajo">▰ ▰ ▰ ▰ ▰</div>}
      {kind === 'country' && <div className="country-badge" aria-label="Estados Unidos">🇺🇸</div>}
      {kind === 'meeting' && <p className="scene-caption">Un encuentro en clase</p>}
      {interactive && kind === 'family' && <p className="scene-caption">Toca a cada persona para contar: {selected.length}</p>}
    </>}
  </div>;
}
