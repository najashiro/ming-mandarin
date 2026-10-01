'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { AdminVocabularyImageEntry, VocabularyImageReviewStatus } from '@/lib/server/vocabulary-images';
import { Hanzi } from '@/components/Hanzi';
import { PinyinText } from '@/components/PinyinText';
import { searchKey } from '@/lib/vocabulary';

const statusLabels: Record<VocabularyImageReviewStatus, string> = {
  pending_review: 'Pendiente',
  approved: 'Okay',
  no_image: 'No mostrar',
  needs_regeneration: 'Por regenerar',
};

type Action = 'approve' | 'save_correction' | 'no_image';

export function VocabularyImageReview({ initialEntries, storageReady }: { initialEntries: AdminVocabularyImageEntry[]; storageReady: boolean }) {
  const [entries, setEntries] = useState(initialEntries);
  const [query, setQuery] = useState('');
  const [lesson, setLesson] = useState('all');
  const [filter, setFilter] = useState<'all' | VocabularyImageReviewStatus>('all');
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [itemMessages, setItemMessages] = useState<Record<string, string>>({});
  const lessonEntries = useMemo(() => entries.filter(entry => lesson === 'all' || (entry.lessons ?? [entry.lesson]).includes(Number(lesson))), [entries, lesson]);
  const counts = useMemo(() => ({
    approved: lessonEntries.filter(entry => entry.reviewStatus === 'approved').length,
    pending_review: lessonEntries.filter(entry => entry.reviewStatus === 'pending_review').length,
    no_image: lessonEntries.filter(entry => entry.reviewStatus === 'no_image').length,
    needs_regeneration: lessonEntries.filter(entry => entry.reviewStatus === 'needs_regeneration').length,
  }), [lessonEntries]);
  const normalized = searchKey(query);
  const visible = lessonEntries.filter(entry => (filter === 'all' || entry.reviewStatus === filter) && (!normalized || [entry.hanzi, entry.pinyin, entry.spanish, entry.wordId].some(value => searchKey(value).includes(normalized))));

  async function review(entry: AdminVocabularyImageEntry, action: Action) {
    if (busy || !storageReady) return;
    setBusy(entry.wordId); setMessage('');
    setItemMessages(current => ({ ...current, [entry.wordId]: 'Guardando…' }));
    try {
      const correction = drafts[entry.wordId] ?? entry.correction;
      const response = await fetch('/api/admin/vocabulary-images', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wordId: entry.wordId, action, correction, assetSha256: entry.sha256, revision: entry.revision }) });
      const body = await response.json() as { error?: string; reviewStatus?: VocabularyImageReviewStatus; prompt?: string; correction?: string; reviewedAt?: string | null; revision?: number };
      if (!response.ok || !body.reviewStatus) throw new Error(body.error ?? 'No se pudo guardar la revisión.');
      setEntries(current => current.map(item => item.wordId === entry.wordId ? { ...item, reviewStatus: body.reviewStatus!, prompt: body.prompt ?? item.prompt, correction: body.correction ?? item.correction, reviewedAt: body.reviewedAt ?? null, revision: body.revision ?? item.revision } : item));
      setDrafts(current => { const next = { ...current }; delete next[entry.wordId]; return next; });
      setEditing(current => ({ ...current, [entry.wordId]: false }));
      const result = action === 'approve' ? `${entry.hanzi}: Okay. Visible en Vocabulario.` : action === 'no_image' ? `${entry.hanzi}: No mostrar. Imagen oculta.` : `Prompt de ${entry.hanzi} actualizado. La imagen queda oculta hasta regenerarla y aprobarla.`;
      setMessage(result);
      setItemMessages(current => ({ ...current, [entry.wordId]: result }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo guardar la revisión.';
      setMessage(errorMessage);
      setItemMessages(current => ({ ...current, [entry.wordId]: errorMessage }));
    } finally {
      setBusy('');
    }
  }

  return <div className="admin-image-review shell">
    {!storageReady && <p className="admin-image-warning" role="alert">No hay conexión con el guardado de revisiones. Las acciones están desactivadas hasta restablecerla. <button type="button" onClick={() => window.location.reload()}>Reintentar</button></p>}
    <p>Aprobar u ocultar se refleja al abrir Vocabulario y en un máximo de 30 segundos en una pestaña abierta. Actualizar el prompt deja la foto oculta y pendiente de regeneración.</p>
    <section className="admin-image-summary" aria-label="Resumen de revisión">
      <button type="button" className={filter === 'pending_review' ? 'selected' : ''} onClick={() => setFilter('pending_review')}><b>{counts.pending_review}</b><span>Pendientes</span></button>
      <button type="button" className={filter === 'approved' ? 'selected' : ''} onClick={() => setFilter('approved')}><b>{counts.approved}</b><span>Publicadas</span></button>
      <button type="button" className={filter === 'no_image' ? 'selected' : ''} onClick={() => setFilter('no_image')}><b>{counts.no_image}</b><span>Sin imagen</span></button>
      <button type="button" className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}><b>{lessonEntries.length}</b><span>Todas</span></button>
      <button type="button" className={filter === 'needs_regeneration' ? 'selected' : ''} onClick={() => setFilter('needs_regeneration')}><b>{counts.needs_regeneration}</b><span>Por regenerar</span></button>
    </section>
    <div className="admin-image-search"><label htmlFor="admin-image-lesson">Filtrar por lección</label><select id="admin-image-lesson" value={lesson} onChange={event => setLesson(event.target.value)}><option value="all">Todas las lecciones</option><option value="1">Lección 1</option><option value="2">Lección 2</option><option value="3">Lección 3</option><option value="4">Lección 4</option></select></div>
    {storageReady && counts.needs_regeneration > 0 && <a href="/api/admin/vocabulary-images?export=regeneration" download>Descargar pendientes de regeneración</a>}
    <div className="admin-image-search"><label htmlFor="admin-image-search">Buscar palabra</label><input id="admin-image-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Hanzi, pinyin, español o ID"/></div>
    {message && <p className="admin-image-message" role="status"><Hanzi>{message}</Hanzi></p>}
    <p className="admin-image-results" aria-live="polite">{visible.length} {visible.length === 1 ? 'imagen' : 'imágenes'} en esta vista</p>
    <section className="admin-image-list" aria-busy={Boolean(busy)}>{visible.map(entry => {
      const isEditing = Boolean(editing[entry.wordId]);
      const correction = drafts[entry.wordId] ?? entry.correction;
      const promptChanged = correction.trim() !== entry.correction.trim();
      return <article aria-label={`Revisión de ${entry.hanzi}`} className={`admin-image-card status-${entry.reviewStatus}`} key={entry.wordId}>
        <div className="admin-image-preview"><Image unoptimized src={entry.src} alt={entry.alt} width={1618} height={1000}/></div>
        <div className="admin-image-content">
          <header><div><h2><Hanzi>{entry.hanzi}</Hanzi></h2><p><PinyinText>{entry.pinyin}</PinyinText> · {entry.spanish}</p></div><span>{statusLabels[entry.reviewStatus]}</span></header>
          <div className="admin-image-metadata"><span>{entry.visualMode}</span><span>Riesgo: {entry.ambiguityRisk}</span><span>{entry.imageQuizEligible ? 'Quiz posible' : 'Solo apoyo'}</span></div>
          {entry.reviewStatus === 'needs_regeneration' && <p>Esta es la foto anterior. Hay un prompt actualizado pendiente de generar.</p>}
          <label className="admin-image-edit-toggle"><input type="checkbox" checked={isEditing} disabled={!storageReady || Boolean(busy)} onChange={event => setEditing(current => ({ ...current, [entry.wordId]: event.target.checked }))}/> Modificar prompt</label>
          {isEditing && <div><label htmlFor={`correction-${entry.wordId}`}>¿Qué quieres cambiar en la imagen?</label><p>Describe solo el cambio. Conservaremos el prompt base, la transparencia y la ausencia de texto. Guardar no genera ni cobra una imagen.</p><textarea id={`correction-${entry.wordId}`} maxLength={2000} value={correction} disabled={Boolean(busy)} placeholder="Por ejemplo: mostrar a la persona entrando, con un pie dentro de la puerta." onChange={event => setDrafts(current => ({ ...current, [entry.wordId]: event.target.value }))}/></div>}
          {!isEditing && entry.correction && <p>Cambio solicitado: {entry.correction}</p>}
          <details><summary>Ver prompt completo</summary><textarea aria-label={`Prompt de ${entry.hanzi}`} value={entry.prompt} readOnly/></details>
          <div className="admin-image-actions">
            <button type="button" className="approve" aria-pressed={entry.reviewStatus === 'approved'} disabled={!storageReady || Boolean(busy) || promptChanged || entry.reviewStatus === 'needs_regeneration'} onClick={() => void review(entry, 'approve')}>✓ Okay</button>
            {isEditing && promptChanged && <button type="button" disabled={!storageReady || Boolean(busy) || !correction.trim()} onClick={() => void review(entry, 'save_correction')}>Actualizar prompt</button>}
            <button type="button" className="hide" aria-pressed={entry.reviewStatus === 'no_image'} disabled={!storageReady || Boolean(busy)} onClick={() => void review(entry, 'no_image')}>{entry.reviewStatus === 'no_image' ? 'No mostrar' : 'No mostrar imagen'}</button>
          </div>
          {itemMessages[entry.wordId] && <p role="status">{itemMessages[entry.wordId]}</p>}
        </div>
      </article>;
    })}</section>
  </div>;
}
