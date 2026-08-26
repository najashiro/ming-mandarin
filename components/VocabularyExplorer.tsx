'use client';

import { useMemo, useState } from 'react';
import type { VocabularyEntry } from '@/data/types';
import { SpeakButton } from './SpeakButton';

export function VocabularyExplorer({ vocabulary }: { vocabulary: VocabularyEntry[] }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [hidden, setHidden] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const visible = useMemo(() => vocabulary.filter((item) => (filter === 'all' || item.category === filter) && [item.hanzi,item.pinyin,item.translation].join(' ').toLowerCase().includes(query.toLowerCase())), [vocabulary, filter, query]);
  return <>
    <section className="toolbar shell"><label>Buscar <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Hanzi, pinyin o español" /></label><div role="group" aria-label="Filtrar vocabulario">{[['all','Todo'],['core','Libro'],['supplementary','Suplementario'],['teacher_supplement','Clase'],['name','Nombres']].map(([id,label])=><button type="button" className={filter===id?'selected':''} key={id} onClick={()=>setFilter(id)}>{label}</button>)}</div></section>
    <section className="vocab-grid shell">{visible.map((item)=><article className="vocab-card" key={item.id}><div className="vocab-actions"><span className={`category ${item.category}`}>{item.category.replace('_',' ')}</span><button aria-label="Favorito" type="button" onClick={()=>setFavorites((values)=>values.includes(item.id)?values.filter(id=>id!==item.id):[...values,item.id])}>{favorites.includes(item.id)?'★':'☆'}</button></div><button type="button" className="hanzi-button" onClick={()=>setHidden(values=>values.includes(item.id)?values.filter(id=>id!==item.id):[...values,item.id])}>{item.hanzi}</button><p className="word-pinyin">{item.pinyin}</p>{hidden.includes(item.id)?<p className="hidden-meaning">Significado oculto · toca el hanzi</p>:<p>{item.translation}</p>}<dl><div><dt>Clase</dt><dd>{item.grammaticalType}</dd></div>{item.example&&<div><dt>Ejemplo</dt><dd>{item.example}</dd></div>}<div><dt>Fuente</dt><dd>PDF p. {item.source.pdfPage}{item.source.printedPage?` · impresa ${item.source.printedPage}`:''}</dd></div></dl><SpeakButton text={item.hanzi}/></article>)}</section>
  </>;
}
