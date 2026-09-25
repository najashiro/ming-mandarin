'use client';
import { useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CurriculumScope } from '@/data/types';
const lessonScopes = ['l1', 'l2', 'l3'] as const;
import { selectVocabulary, searchVocabulary } from '@/lib/vocabulary';
import { hanziInputClass } from '../Hanzi';
import { PinyinText } from '../PinyinText';
import { useVocabularyState } from './useVocabularyState';
import { VocabularyCard } from './VocabularyCard';
import { VocabularyMix } from './VocabularyMix';
import './vocabulary.css';

export function ActiveVocabulary({ scope, userId = 'guest' }: { scope: CurriculumScope; userId?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const { data, ready, saved, update } = useVocabularyState(userId);
  const query = params.get('q') ?? '';
  const favoritesOnly = params.get('favorites') === '1';
  const mix = params.get('mode') === 'mix';
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const composing = useRef(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const candidates = useMemo(() => selectVocabulary(scope).filter(w => !favoritesOnly || data.favorites.includes(w.id)), [scope, favoritesOnly, data.favorites]);
  const results = useMemo(() => searchVocabulary(candidates, query), [candidates, query]);
  const suggestions = results.slice(0, 6);
  const pages = Math.max(1, Math.ceil(results.length / 24));
  const rawPage = Number(params.get('page') ?? 1);
  const page = Number.isInteger(rawPage) ? Math.max(1, Math.min(pages, rawPage)) : 1;
  const route = `/study/${scope}/vocabulary?${params.toString()}`;
  function change(values: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const key of ['selection', 'level', 'source']) next.delete(key);
    for (const [key, value] of Object.entries(values)) { if (value) next.set(key, value); else next.delete(key); }
    if (!('page' in values)) next.delete('page');
    window.history.replaceState(null, '', `?${next.toString()}`);
  }
  function choose(id: string) {
    const index = results.findIndex(w => w.id === id);
    change({ page: String(Math.floor(index / 24) + 1), card: id });
    setOpen(false); setActive(-1);
    requestAnimationFrame(() => requestAnimationFrame(() => { const card = document.getElementById(`word-${id}`); card?.scrollIntoView({ block: 'center', behavior: 'instant' }); card?.focus({ preventScroll: true }); }));
  }
  return <div className="active-vocabulary shell" data-ready={ready}>
    <header className="vocabulary-heading"><div><p className="eyebrow">词汇 · MÍNG</p><h1>Vocabulario</h1></div><small role="status">{saved ? 'Guardado en este dispositivo' : 'Almacenamiento no disponible; cambios solo en esta visita'}</small></header>
    <div className="vocabulary-toolbar">
      <div className="vocabulary-lesson-controls"><select aria-label="Lección" value={scope} onChange={e => { const next = new URLSearchParams(params.toString()); for (const key of ['page', 'card', 'source', 'selection', 'level']) next.delete(key); router.push(`/study/${e.target.value}/vocabulary?${next}`); }}>{lessonScopes.map((s, i) => <option key={s} value={s}>Lección {i + 1}</option>)}</select><button type="button" aria-label="Solo favoritos" title="Solo favoritos de esta lección" aria-pressed={favoritesOnly} onClick={() => change({ favorites: favoritesOnly ? '' : '1', card: '' })}>{favoritesOnly ? '★' : '☆'}</button></div>
      <div className="vocabulary-search"><label htmlFor="vocabulary-search">Buscar</label><div className="vocabulary-search-line"><input id="vocabulary-search" ref={searchRef} className={hanziInputClass(query)} value={query} role="combobox" aria-autocomplete="list" aria-controls="vocabulary-suggestions" aria-expanded={open} aria-activedescendant={open && active >= 0 && suggestions[active] ? `suggestion-${active}` : undefined} autoComplete="off" placeholder="Hanzi, pinyin o español" onFocus={() => setOpen(Boolean(query))} onBlur={() => setOpen(false)} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }} onChange={e => { change({ q: e.target.value, card: '' }); setOpen(Boolean(e.target.value)); setActive(-1); }} onKeyDown={e => {
        if (e.nativeEvent.isComposing || composing.current || e.keyCode === 229) return;
        if (e.key === 'Escape') { setOpen(false); setActive(-1); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); setActive(i => suggestions.length ? (i + (e.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length : -1); }
        if (e.key === 'Enter' && open && suggestions.length) { e.preventDefault(); choose(suggestions[Math.max(0, active)].id); }
      }}/>{query && <button type="button" aria-label="Limpiar búsqueda" onClick={() => { change({ q: '', card: '' }); setOpen(false); searchRef.current?.focus(); }}>×</button>}</div>
        {open && <ul id="vocabulary-suggestions" role="listbox" aria-label="Sugerencias">{suggestions.length ? suggestions.map((w, i) => <li key={w.id} id={`suggestion-${i}`} role="option" aria-selected={i === active} onPointerDown={e => e.preventDefault()} onClick={() => choose(w.id)}><strong>{w.hanzi}</strong> <PinyinText>{w.pinyin}</PinyinText><span>{w.spanish}</span></li>) : <li role="presentation">Sin resultados en este alcance.</li>}</ul>}
      </div>
    </div>
    <nav className="vocabulary-tabs" aria-label="Modo de vocabulario"><button type="button" aria-pressed={!mix} onClick={() => change({ mode: '' })}>Explorar</button><button type="button" aria-pressed={mix} onClick={() => { setOpen(false); change({ mode: 'mix' }); }}>Vocabulario Mix</button><span aria-live="polite">{results.length} palabras</span></nav>
    {mix ? <VocabularyMix words={results} scope={scope} level="hard" userId={userId} route={route}/> : <>
      {!results.length && <p role="status">Sin resultados. Ajusta los filtros o limpia la búsqueda.</p>}
      <section className="vocabulary-grid" aria-label="Catálogo">{results.slice((page - 1) * 24, page * 24).map(word => <VocabularyCard key={word.id} word={word} scope={scope} route={`${route}#word-${encodeURIComponent(word.id)}`} back={Boolean(data.faces[word.id])} favorite={data.favorites.includes(word.id)} hideTranslation={false} onFlip={() => update(previous => ({ ...previous, faces: { ...previous.faces, [word.id]: !previous.faces[word.id] } }))} onFavorite={() => update(previous => ({ ...previous, favorites: previous.favorites.includes(word.id) ? previous.favorites.filter(id => id !== word.id) : [...previous.favorites, word.id] }))}/>)}</section>
      {pages > 1 && <nav className="vocabulary-pagination" aria-label="Páginas del catálogo"><button type="button" disabled={page === 1} onClick={() => change({ page: String(page - 1) })}>Anterior</button><span>{page} / {pages}</span><button type="button" disabled={page === pages} onClick={() => change({ page: String(page + 1) })}>Siguiente</button></nav>}
    </>}
  </div>;
}

