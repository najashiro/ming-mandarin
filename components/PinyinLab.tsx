'use client';

import { useState } from 'react';
import { numberedPinyinToMarked } from '@/lib/pinyin';
import { SpeakButton } from './SpeakButton';

const toneKeys = ['ā','á','ǎ','à','ē','é','ě','è','ī','í','ǐ','ì','ō','ó','ǒ','ò','ū','ú','ǔ','ù','ǖ','ǘ','ǚ','ǜ','ü'];
const toneRows = [
  ['1', '˥', 'alto y sostenido', 'mā'], ['2', '˧˥', 'ascendente', 'má'], ['3', '˨˩˦', 'baja y sube', 'mǎ'], ['4', '˥˩', 'descendente', 'mà'], ['0', '·', 'neutro y ligero', 'ma'],
];

export function PinyinLab() {
  const [numbered, setNumbered] = useState('ni3 hao3');
  const [writing, setWriting] = useState('');
  return <div className="lab-grid">
    <section className="panel"><p className="eyebrow">CONVERSOR</p><h2>Número → marca tonal</h2><label className="answer-input"><span>Pinyin numerado</span><input value={numbered} onChange={(e) => setNumbered(e.target.value)} /></label><div className="conversion">{numberedPinyinToMarked(numbered)}</div><SpeakButton text={numberedPinyinToMarked(numbered)} /></section>
    <section className="panel"><p className="eyebrow">TECLADO TONAL</p><h2>Escribe con precisión</h2><label className="answer-input"><span>Texto</span><input value={writing} onChange={(e) => setWriting(e.target.value)} /></label><div className="tone-keyboard">{toneKeys.map((key) => <button type="button" key={key} onClick={() => setWriting((value) => value + key)}>{key}</button>)}</div></section>
    <section className="panel wide"><p className="eyebrow">MAPA DE TONOS</p><h2>Escucha y compara</h2><div className="tone-table">{toneRows.map(([tone,curve,meaning,example]) => <article key={tone}><b>{tone === '0' ? 'Neutro' : `Tono ${tone}`}</b><strong>{curve}</strong><span>{meaning}</span><SpeakButton text={example} label={example} /></article>)}</div></section>
    <section className="panel wide"><p className="eyebrow">z / c / s</p><h2>Aspiración y posición</h2><div className="phonetic-cards"><article><b>z</b><p>No aspirada. Punta de la lengua detrás de los dientes.</p><SpeakButton text="zǎo" label="zǎo" /></article><article><b>c</b><p>Aspirada. La misma zona, con expulsión clara de aire.</p><SpeakButton text="cǎo" label="cǎo" /></article><article><b>s</b><p>Fricativa continua; deja pasar el aire por un canal estrecho.</p><SpeakButton text="sǎo" label="sǎo" /></article></div><p className="source-note">Refuerzo fonético de las presentaciones de clase; la voz está marcada como sintética.</p></section>
  </div>;
}
