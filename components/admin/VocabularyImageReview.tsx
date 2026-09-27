'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { AdminVocabularyImageEntry, VocabularyImageReviewStatus } from '@/lib/server/vocabulary-images';
import { Hanzi } from '@/components/Hanzi';
import { PinyinText } from '@/components/PinyinText';

const statusLabels: Record<VocabularyImageReviewStatus, string> = {
  pending_review: 'Pendiente',
  approved: 'Publicada',
  no_image: 'Sin imagen',
};

type Action = 'approve' | 'save_prompt' | 'no_image';

export function VocabularyImageReview({ initialEntries, storageReady }: { initialEntries: AdminVocabularyImageEntry[]; storageReady: boolean }) {
  const [entries, setEntries] = useState(initialEntries);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | VocabularyImageReviewStatus>('pending_review');
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const counts = useMemo(() => ({
    approved: entries.filter(entry => entry.reviewStatus === 'approved').length,
    pending_review: entries.filter(entry => entry.reviewStatus === 'pending_review').length,
    no_image: entries.filter(entry => entry.reviewStatus === 'no_image').length,
  }), [entries]);
  const normalized = query.trim().toLocaleLowerCase('es');
  const visible = entries.filter(entry => (filter === 'all' || entry.reviewStatus === filter) && (!normalized || [entry.hanzi, entry.pinyin, entry.spanish, entry.wordId].some(value => value.toLocaleLowerCase('es').includes(normalized))));

  async function review(entry: AdminVocabularyImageEntry, action: Action) {
    setBusy(entry.wordId); setMessage('');
    try {
      const prompt = drafts[entry.wordId] ?? entry.prompt;
      const response = await fetch('/api/admin/vocabulary-images', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wordId: entry.wordId, action, prompt }) });
      const body = await response.json() as { error?: string; reviewStatus?: VocabularyImageReviewStatus; prompt?: string; reviewedAt?: string | null };
      if (!response.ok || !body.reviewStatus) throw new Error(body.error ?? 'No se pudo guardar la revisión.');
      setEntries(current => current.map(item => item.wordId === entry.wordId ? { ...item, reviewStatus: body.reviewStatus!, prompt: body.prompt ?? prompt, reviewedAt: body.reviewedAt ?? null } : item));
      setEditing(current => ({ ...current, [entry.wordId]: false }));
      setMessage(action === 'approve' ? `${entry.hanzi} quedó publicada.` : action === 'no_image' ? `${entry.hanzi} quedó sin imagen.` : `Prompt de ${entry.hanzi} guardado; la imagen permanece pendiente.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la revisión.');
    } finally {
      setBusy('');
    }
  }

  return <div className="admin-image-review shell">
    {!storageReady && <p className="admin-image-warning" role="alert">La cola se muestra con los estados iniciales del repositorio. Para guardar decisiones, aplica la migración privada <code>0013_vocabulary_image_reviews.sql</code> en Supabase.</p>}
    <section className="admin-image-summary" aria-label="Resumen de revisión">
      <button type="button" className={filter === 'pending_review' ? 'selected' : ''} onClick={() => setFilter('pending_review')}><b>{counts.pending_review}</b><span>Pendientes</span></button>
      <button type="button" className={filter === 'approved' ? 'selected' : ''} onClick={() => setFilter('approved')}><b>{counts.approved}</b><span>Publicadas</span></button>
      <button type="button" className={filter === 'no_image' ? 'selected' : ''} onClick={() => setFilter('no_image')}><b>{counts.no_image}</b><span>Sin imagen</span></button>
      <button type="button" className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}><b>{entries.length}</b><span>Todas</span></button>
    </section>
    <div className="admin-image-search"><label htmlFor="admin-image-search">Buscar palabra</label><input id="admin-image-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Hanzi, pinyin, español o ID"/></div>
    {message && <p className="admin-image-message" role="status"><Hanzi>{message}</Hanzi></p>}
    <p className="admin-image-results" aria-live="polite">{visible.length} {visible.length === 1 ? 'imagen' : 'imágenes'} en esta vista</p>
    <section className="admin-image-list" aria-busy={Boolean(busy)}>{visible.map(entry => {
      const isEditing = Boolean(editing[entry.wordId]);
      const prompt = drafts[entry.wordId] ?? entry.prompt;
      return <article className={`admin-image-card status-${entry.reviewStatus}`} key={entry.wordId}>
        <div className="admin-image-preview"><Image unoptimized src={entry.src} alt={entry.alt} width={1618} height={1000}/></div>
        <div className="admin-image-content">
          <header><div><h2><Hanzi>{entry.hanzi}</Hanzi></h2><p><PinyinText>{entry.pinyin}</PinyinText> · {entry.spanish}</p></div><span>{statusLabels[entry.reviewStatus]}</span></header>
          <div className="admin-image-metadata"><span>{entry.visualMode}</span><span>Riesgo: {entry.ambiguityRisk}</span><span>{entry.imageQuizEligible ? 'Quiz posible' : 'Solo apoyo'}</span></div>
          <label className="admin-image-edit-toggle"><input type="checkbox" checked={isEditing} onChange={event => setEditing(current => ({ ...current, [entry.wordId]: event.target.checked }))}/> Modificar prompt</label>
          <textarea aria-label={`Prompt de ${entry.hanzi}`} value={prompt} disabled={!isEditing} onChange={event => setDrafts(current => ({ ...current, [entry.wordId]: event.target.value }))}/>
          <div className="admin-image-actions">
            <button type="button" className="approve" disabled={busy === entry.wordId} onClick={() => void review(entry, 'approve')}>✓ Okay</button>
            {isEditing && <button type="button" disabled={busy === entry.wordId || prompt.trim() === entry.prompt.trim()} onClick={() => void review(entry, 'save_prompt')}>Guardar prompt</button>}
            <button type="button" className="hide" disabled={busy === entry.wordId} onClick={() => void review(entry, 'no_image')}>No mostrar imagen</button>
          </div>
        </div>
      </article>;
    })}</section>
  </div>;
}
