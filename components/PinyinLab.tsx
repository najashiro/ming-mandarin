'use client';

import { useState } from 'react';
import pronunciation from '@/data/pronunciation.json';
import { numberedPinyinToMarked } from '@/lib/pinyin';
import { SpeakButton } from './SpeakButton';
import { CommunityButton } from './community/CommunityProvider';

const clipFiles = new Map(pronunciation.clips.map((clip) => [clip.id, `/audio/pinyin/${clip.file}`]));
const audioFor = (clipId: string) => clipFiles.get(clipId);
const audioSequence = (...clipIds: string[]) => clipIds.map(audioFor).filter((source): source is string => Boolean(source));
const normalizeNumbered = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

function ToneContour({ points, label, neutral = false }: { points: string; label: string; neutral?: boolean }) {
  return <svg className={`tone-contour${neutral ? ' neutral' : ''}`} viewBox="0 0 100 90" role="img" aria-label={label}>
    {[16, 31, 47, 63, 78].map((y) => <line key={y} x1="7" y1={y} x2="93" y2={y} />)}
    <polyline points={points} />
  </svg>;
}

export function PinyinLab() {
  const [numbered, setNumbered] = useState('ni3 hao3');
  const converted = numberedPinyinToMarked(numbered);
  const converterExample = pronunciation.converterExamples.find((example) => normalizeNumbered(example.numbered) === normalizeNumbered(numbered));

  return <div className="lab-grid">
    <section className="panel converter-panel wide"><p className="eyebrow">CONVERSOR</p><h2>Número → marca tonal</h2><label className="answer-input"><span>Pinyin numerado</span><input value={numbered} onChange={(e) => setNumbered(e.target.value)} /></label><div className="conversion">{converted}</div><div className="example-chips" aria-label="Ejemplos con audio">{pronunciation.converterExamples.slice(0, 6).map((example) => <button type="button" key={example.numbered} onClick={() => setNumbered(example.numbered)}>{example.numbered}</button>)}</div>{converterExample ? <SpeakButton text={`${converterExample.hanzi} · ${converted}`} speechText={converterExample.hanzi} audioSrc={audioFor(converterExample.clipId)} /> : <p className="audio-guidance">El conversor escribe cualquier pinyin. Para oírlo con precisión, elige un ejemplo vinculado a hanzi y audio.</p>}</section>
    <section className="panel wide"><div className="section-heading"><div><p className="eyebrow">MAPA DE TONOS</p><h2>Ve la altura, escucha el contraste</h2></div><div className="community-inline-actions"><SpeakButton text="妈、麻、马、骂、吗" speechText="妈，麻，马，骂，吗" audioSrc={audioSequence('tone-1-ma', 'tone-2-ma', 'tone-3-ma', 'tone-4-ma', 'tone-neutral-ma')} label="Escuchar serie" /><CommunityButton compact label="Preguntar sobre tonos" context={{concept:'tones',skill:'tones',route:'/lesson/1/pinyin?concept=tones'}}/></div></div><div className="tone-table">{pronunciation.tones.map((tone) => <article className="tone-card" key={tone.id}><header><b>{tone.label}</b><span>{tone.contour}</span></header><ToneContour points={tone.points} neutral={tone.id === '0'} label={`${tone.label}: ${tone.description}`} /><div className="tone-example"><strong>{tone.hanzi}</strong><div><em>{tone.pinyin}</em><small>{tone.meaning}</small></div></div><p>{tone.description}</p><SpeakButton text={`${tone.hanzi} · ${tone.pinyin}`} speechText={tone.hanzi} audioSrc={audioFor(tone.clipId)} label={tone.pinyin} /></article>)}</div><p className="map-note">Las líneas representan altura relativa, no volumen: 5 es alto y 1 es bajo.</p></section>
    <section className="panel wide sandhi-panel"><p className="eyebrow">CAMBIO TONAL EN 你好</p><h2>Se escribe de una forma y normalmente se oye de otra</h2><div className="sandhi-flow"><div><span>Forma léxica</span><strong>nǐ hǎo</strong><small>3.º + 3.º</small></div><b aria-hidden="true">→</b><div><span>Habla natural</span><strong>ní hǎo</strong><small>2.º + 3.º</small></div></div><p>Cuando dos terceros tonos se encuentran, el primero se pronuncia como segundo tono. La ortografía pinyin no cambia: seguimos escribiendo <b>nǐ hǎo</b>.</p><SpeakButton text="你好 · ní hǎo" speechText="你好" audioSrc={audioFor('ni-hao-natural')} label="Oír habla natural" /></section>
    <section className="panel wide"><div className="section-heading"><div><p className="eyebrow">z / c / s</p><h2>Posición compartida, aire diferente</h2></div><div className="community-inline-actions"><SpeakButton text="早、草、扫" speechText="早，草，扫" audioSrc={audioSequence('zao', 'cao', 'sao')} label="Comparar las tres" /><CommunityButton compact label="Preguntar sobre z c s" context={{section:'pronunciation',concept:'z-c-s',skill:'pronunciation',route:'/lesson/1/pinyin?concept=z-c-s'}}/></div></div><p className="articulation-lead">En las tres, la punta de la lengua trabaja muy cerca de la cara interna de los dientes inferiores. Pon una tira de papel frente a la boca para comprobar el aire.</p><div className="phonetic-cards">{pronunciation.initials.map((initial) => <article key={initial.letter}><header><b>{initial.letter}</b><div><strong>{initial.ipa}</strong><span>{initial.aspiration}</span></div></header><div className="airflow"><span>Aire</span><div aria-label={`Flujo de aire ${initial.airflow} de 3`}>{[1,2,3].map((level) => <i className={level <= initial.airflow ? 'active' : ''} key={level} />)}</div></div><p>{initial.articulation}</p><p className="paper-test">▱ {initial.test}</p><div className="initial-example"><strong>{initial.hanzi}</strong><span>{initial.pinyin}<small>{initial.meaning}</small></span></div><SpeakButton text={`${initial.hanzi} · ${initial.pinyin}`} speechText={initial.hanzi} audioSrc={audioFor(initial.clipId)} label={initial.pinyin} /></article>)}</div></section>
  </div>;
}
