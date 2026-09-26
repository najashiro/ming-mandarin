'use client';
import { useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { CurriculumScope } from '@/data/types';
const lessonScopes = ['l1', 'l2', 'l3', 'l1-l2-l3'] as const;
import { getVocabularySet, getVocabularyLesson, searchGlobalVocabulary, searchVocabulary } from '@/lib/vocabulary';
import { vocabularyStyle, vocabularyStyleId } from '@/lib/vocabulary-style';
import { hanziInputClass } from '../Hanzi';
import { PinyinText } from '../PinyinText';
import { useVocabularyState } from './useVocabularyState';
import { VocabularyCard } from './VocabularyCard';
import { VocabularyMix } from './VocabularyMix';
import './vocabulary.css';

export function ActiveVocabulary({ scope, userId = 'guest', mode = 'catalog' }: { scope: CurriculumScope; userId?: string; mode?: 'catalog' | 'mix' }) {
  const params = useSearchParams();
  const router = useRouter();
  const { data, ready, saved, update } = useVocabularyState(userId);
  const selectedId = mode === 'catalog' ? params.get('card') : null;
  const selectedWord = selectedId ? getVocabularySet(scope).find(word => word.id === selectedId) : undefined;
  const query = params.get('q') ?? selectedWord?.hanzi ?? '';
  const favoritesOnly = params.get('favorites') === '1';
  const mix = mode === 'mix';
  const section = mix ? 'games/vocabulary-mix' : 'vocabulary';
  const [faces, setFaces] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const composing = useRef(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionTouch = useRef<{ id: string; x: number; y: number } | null>(null);
  const candidates = useMemo(() => getVocabularySet(scope).filter(w => !favoritesOnly || data.favorites.includes(w.id)), [scope, favoritesOnly, data.favorites]);
  const results = useMemo(() => selectedId ? candidates.filter(word => word.id === selectedId) : searchVocabulary(candidates, query), [candidates, query, selectedId]);
  const suggestions = searchGlobalVocabulary(query).slice(0, 6);
  const pages = Math.max(1, Math.ceil(results.length / 24));
  const rawPage = Number(params.get('page') ?? 1);
  const page = Number.isInteger(rawPage) ? Math.max(1, Math.min(pages, rawPage)) : 1;
  const route = `/study/${scope}/${section}?${params.toString()}`;
  function resetCardFaces() {
    setFaces({});
  }
  function change(values: Record<string, string>) {
    resetCardFaces();
    const next = new URLSearchParams(params.toString());
    for (const key of ['selection', 'level', 'source', 'mode']) next.delete(key);
    for (const [key, value] of Object.entries(values)) { if (value) next.set(key, value); else next.delete(key); }
    if (!('page' in values)) next.delete('page');
    window.history.replaceState(null, '', `?${next.toString()}`);
  }
  function navigateToVocabularyWord(id: string) {
    const word = searchGlobalVocabulary(query).find(word => word.id === id);
    if (!word) return;
    const lesson = getVocabularyLesson(word);
    if (!lesson) return;
    const destination = `l${lesson}` as CurriculumScope;
    const next = new URLSearchParams({ q: word.hanzi, card: id });
    resetCardFaces();
    suggestionTouch.current = null;
    setOpen(false); setActive(-1);
    router.push(mix ? `/study/${destination}/games/vocabulary-mix?q=${encodeURIComponent(word.hanzi)}` : `/study/${destination}/vocabulary?${next}`, { scroll: false });
  }
  return <div className="active-vocabulary shell" data-ready={ready} data-visual-style={vocabularyStyleId} style={vocabularyStyle}>
    {mix && <Link className="vocabulary-games-back" href={`/study/${scope}/games`}>← Volver a Juegos</Link>}
    <header className="vocabulary-heading"><div><p className="eyebrow">{mix ? '游戏' : '词汇'} · MÍNG</p><h1>{mix ? 'Vocabulario Mix' : 'Vocabulario'}</h1></div><small role="status">{saved ? 'Guardado en este dispositivo' : 'Almacenamiento no disponible; cambios solo en esta visita'}</small></header>
    <div className="vocabulary-toolbar">
      <div className="vocabulary-lesson-controls"><select aria-label="Lección" value={scope} onChange={e => { resetCardFaces(); const next = new URLSearchParams(params.toString()); for (const key of ['page', 'card', 'q', 'source', 'selection', 'level', 'mode']) next.delete(key); router.push(`/study/${e.target.value}/${section}?${next}`); }}>{lessonScopes.map((s, i) => <option key={s} value={s}>{s === 'l1-l2-l3' ? 'Acumulado' : `Lección ${i + 1}`}</option>)}</select><button type="button" aria-label="Solo favoritos" title="Solo favoritos de esta lección" aria-pressed={favoritesOnly} onClick={() => change({ favorites: favoritesOnly ? '' : '1', card: '' })}>{favoritesOnly ? '★' : '☆'}</button></div>
      <div className="vocabulary-search"><label htmlFor="vocabulary-search">Buscar</label><div className="vocabulary-search-line"><input id="vocabulary-search" ref={searchRef} className={hanziInputClass(query)} value={query} role="combobox" aria-autocomplete="list" aria-controls="vocabulary-suggestions" aria-expanded={open} aria-activedescendant={open && active >= 0 && suggestions[active] ? `suggestion-${active}` : undefined} autoComplete="off" placeholder="Hanzi, pinyin o español" onFocus={() => { resetCardFaces(); setOpen(Boolean(query)); }} onBlur={() => { if (!suggestionTouch.current) setOpen(false); }} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }} onChange={e => { change({ q: e.target.value, card: '' }); setOpen(Boolean(e.target.value)); setActive(-1); }} onKeyDown={e => {
        if (e.nativeEvent.isComposing || composing.current || e.keyCode === 229) return;
        if (e.key === 'Escape') { setOpen(false); setActive(-1); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); setActive(i => suggestions.length ? (i + (e.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length : -1); }
        if (e.key === 'Enter' && open && suggestions.length) { e.preventDefault(); navigateToVocabularyWord(suggestions[Math.max(0, active)].id); }
      }}/>{query && <button type="button" aria-label="Limpiar búsqueda" onClick={() => { change({ q: '', card: '' }); searchRef.current?.focus(); setOpen(false); setActive(-1); }}>×</button>}</div>
        {open && <ul id="vocabulary-suggestions" role="listbox" aria-label="Sugerencias">{suggestions.length ? suggestions.map((w, i) => <li key={w.id} id={`suggestion-${i}`} role="option" aria-selected={i === active}
          onPointerDown={e => {
            if (e.pointerType === 'mouse') e.preventDefault();
            else suggestionTouch.current = { id: w.id, x: e.clientX, y: e.clientY };
          }}
          onPointerUp={e => {
            const touch = suggestionTouch.current;
            suggestionTouch.current = null;
            if (touch?.id === w.id && Math.hypot(e.clientX - touch.x, e.clientY - touch.y) < 12) {
              e.preventDefault();
              searchRef.current?.blur();
              navigateToVocabularyWord(w.id);
            } else if (document.activeElement !== searchRef.current) setOpen(false);
          }}
          onPointerCancel={() => { suggestionTouch.current = null; if (document.activeElement !== searchRef.current) setOpen(false); }}
          onClick={() => navigateToVocabularyWord(w.id)}><strong>{w.hanzi}</strong> <PinyinText>{w.pinyin}</PinyinText><span>{w.spanish} <small className="vocabulary-lesson-badge">L{getVocabularyLesson(w)}</small></span></li>) : <li role="presentation">Sin resultados en el vocabulario.</li>}</ul>}
      </div>
    </div>
    <p className="vocabulary-count" aria-live="polite">{results.length} {results.length === 1 ? 'palabra' : 'palabras'}</p>
    {mix ? <VocabularyMix words={results} scope={scope} userId={userId} route={route}/> : <>
      {!results.length && <p role="status">Sin resultados. Ajusta los filtros o limpia la búsqueda.</p>}
      <section className="vocabulary-grid" aria-label="Catálogo">{results.slice((page - 1) * 24, page * 24).map(word => <VocabularyCard key={word.id} word={word} scope={scope} route={`${route}#word-${encodeURIComponent(word.id)}`} back={Boolean(faces[word.id])} favorite={data.favorites.includes(word.id)} hideTranslation={false} onFlip={() => setFaces(previous => ({ ...previous, [word.id]: !previous[word.id] }))} onFavorite={() => update(previous => ({ ...previous, favorites: previous.favorites.includes(word.id) ? previous.favorites.filter(id => id !== word.id) : [...previous.favorites, word.id] }))}/>)}</section>
      {pages > 1 && <nav className="vocabulary-pagination" aria-label="Páginas del catálogo"><button type="button" disabled={page === 1} onClick={() => change({ page: String(page - 1) })}>Anterior</button><span>{page} / {pages}</span><button type="button" disabled={page === pages} onClick={() => change({ page: String(page + 1) })}>Siguiente</button></nav>}
    </>}
    <p className="vocabulary-count">Voz generada por IA.</p>
  </div>;
}

