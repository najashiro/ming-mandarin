'use client';

import { useMemo, useState } from 'react';
import type { VocabularyEntry } from '@/data/types';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { SpeakButton } from './SpeakButton';
import { CommunityButton } from './community/CommunityProvider';

type Props = {
  vocabulary: VocabularyEntry[];
  route?: string;
  showSearch?: boolean;
};

export function VocabularyExplorer({ vocabulary, route = '/lesson/1/vocabulary', showSearch = vocabulary.length > 9 }: Props) {
  const [query, setQuery] = useState('');
  const [hidden, setHidden] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const visible = useMemo(() => vocabulary.filter((item) => [item.hanzi,item.pinyin,item.translation].join(' ').toLowerCase().includes(query.toLowerCase())), [vocabulary, query]);
  return <>
    {showSearch && <section className="toolbar shell"><label>Buscar <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Hanzi, pinyin o español" /></label></section>}
    <section className="vocab-grid shell">{visible.map((item)=><article className="vocab-card" key={item.id}><div className="vocab-actions"><button aria-label="Favorito" type="button" onClick={()=>setFavorites((values)=>values.includes(item.id)?values.filter(id=>id!==item.id):[...values,item.id])}>{favorites.includes(item.id)?'★':'☆'}</button></div><button type="button" className="hanzi-button" onClick={()=>setHidden(values=>values.includes(item.id)?values.filter(id=>id!==item.id):[...values,item.id])}>{item.hanzi}</button><p className="word-pinyin">{item.pinyin}</p>{hidden.includes(item.id)?<p className="hidden-meaning">Significado oculto · toca el hanzi</p>:<p>{item.translation}</p>}<dl><div><dt>Clase</dt><dd>{item.grammaticalType}</dd></div>{item.example&&<div><dt>Ejemplo</dt><dd>{item.example}</dd></div>}</dl><div className="vocab-community-row"><SpeakButton text={item.hanzi} audioSrc={audioForMandarinText(item.hanzi)}/><CommunityButton compact label={`Preguntas sobre ${item.hanzi}`} context={{concept:item.hanzi,route:`${route}?concept=${encodeURIComponent(item.hanzi)}`}}/></div></article>)}</section>
  </>;
}
