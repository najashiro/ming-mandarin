'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { COMMUNITY_LIMITS, communityContextLabel } from '@/lib/community/domain';
import { reportReasonLabels, sectionLabels, skillLabels, type CommunityContext, type CommunityReply, type CommunityReportReason, type CommunityScope, type CommunitySort, type CommunityTargetType, type CommunityThread } from '@/lib/community/types';
import { subscribeToCommunityReplies } from '@/lib/community/realtime';

type Identity = { authenticated: boolean; displayName: string | null; canPost: boolean; blockedUntil: string | null };
type Config = { enabled: boolean; realtimeUrl: string; publishableKey: string };
type View = 'list' | 'new' | 'thread';

async function api<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, { ...init, headers: { ...(init?.body ? { 'content-type': 'application/json' } : {}), ...init?.headers }, cache: 'no-store' });
  const body = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) { const error = new Error(body.error ?? 'No se pudo completar la operación.') as Error & { status?: number }; error.status = response.status; throw error; }
  return body;
}

export function CommunityPanel({ context, onClose }: { context: CommunityContext; onClose: () => void }) {
  const dialog = useRef<HTMLElement>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [threads, setThreads] = useState<CommunityThread[]>([]);
  const [view, setView] = useState<View>('list');
  const [scope, setScope] = useState<CommunityScope>('context');
  const [sort, setSort] = useState<CommunitySort>('recent');
  const [selected, setSelected] = useState<CommunityThread | null>(null);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [needsName, setNeedsName] = useState(false);
  const [online, setOnline] = useState(true);
  const [realtime, setRealtime] = useState<'connecting' | 'live' | 'fallback'>('connecting');

  const loadIdentity = useCallback(async () => { try { const next = await api<Identity>('/api/community/me'); setIdentity(next); return next; } catch { return null; } }, []);
  const loadThreads = useCallback(async () => {
    setBusy(true); setMessage('');
    try {
      const query = new URLSearchParams({ scope, sort, lessonId: String(context.lessonId), section: context.section, ...(context.concept ? { concept: context.concept } : {}) });
      setThreads(await api<CommunityThread[]>(`/api/community/threads?${query}`));
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudieron cargar las preguntas.'); }
    finally { setBusy(false); }
  }, [context, scope, sort]);
  const loadReplies = useCallback(async () => { if (!selected) return; try { setReplies(await api<CommunityReply[]>(`/api/community/threads/${selected.id}/replies`)); } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudieron cargar las respuestas.'); } }, [selected]);

  useEffect(() => {
    const change = () => setOnline(navigator.onLine);
    window.addEventListener('online', change); window.addEventListener('offline', change);
    queueMicrotask(() => void Promise.all([api<Config>('/api/community/config').then(setConfig), loadIdentity()]));
    return () => { window.removeEventListener('online', change); window.removeEventListener('offline', change); };
  }, [loadIdentity]);
  useEffect(() => { queueMicrotask(() => void loadThreads()); }, [loadThreads]);
  useEffect(() => { if (view === 'thread') queueMicrotask(() => void loadReplies()); }, [loadReplies, view]);
  useEffect(() => {
    if (view !== 'thread' || !selected || !config?.enabled) return;
    const stop = subscribeToCommunityReplies({ realtimeUrl: config.realtimeUrl, publishableKey: config.publishableKey, threadId: selected.id, onChange: () => void loadReplies(), onStatus: setRealtime });
    const fallback = window.setInterval(() => void loadReplies(), 30_000);
    return () => { stop(); window.clearInterval(fallback); };
  }, [config, loadReplies, selected, view]);
  useEffect(() => {
    const root = dialog.current; if (!root) return;
    const priorOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const focusable = () => [...root.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled])')];
    focusable()[0]?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable(); if (!items.length) return;
      const first = items[0]; const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    root.addEventListener('keydown', keys);
    return () => { root.removeEventListener('keydown', keys); document.body.style.overflow = priorOverflow; };
  }, [onClose]);

  function requireIdentity() {
    if (!identity?.authenticated) { setNeedsName(true); setMessage('Elige un nombre para participar.'); return false; }
    if (!identity.canPost) { setMessage(`Puedes leer la comunidad, pero no publicar${identity.blockedUntil ? ` hasta ${new Date(identity.blockedUntil).toLocaleDateString('es-PE')}` : ''}.`); return false; }
    return true;
  }
  async function openThread(thread: CommunityThread) { setSelected(thread); setView('thread'); setMessage(''); }

  return <div className="community-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside className="community-sheet" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="community-title">
      <header className="community-header"><div><p>COMUNIDAD</p><h2 id="community-title">{communityContextLabel(context)}</h2></div><button type="button" className="community-close" onClick={onClose} aria-label="Cerrar Comunidad">×</button></header>
      {!online && <p className="community-offline" role="status">Necesitas conexión para usar la comunidad.</p>}
      {config && !config.enabled ? <div className="community-empty"><h3>Comunidad no disponible</h3><p>La función está temporalmente desactivada. El contenido académico sigue funcionando normalmente.</p></div> : <>
        {needsName && <NamePrompt onReady={async () => { setNeedsName(false); await loadIdentity(); setMessage('Ya puedes participar como estudiante.'); }} />}
        {message && <p className="community-message" role="status">{message}</p>}
        {view === 'list' && <>
          <div className="community-primary-action"><button className="button button-primary" type="button" disabled={!online} onClick={() => requireIdentity() && setView('new')}>Haz una pregunta</button></div>
          <nav className="community-scope" aria-label="Alcance de preguntas">{([['context', 'Esta sección'], ['lesson', `Lección ${context.lessonId}`], ['general', 'General']] as const).map(([value, label]) => <button type="button" className={scope === value ? 'selected' : ''} onClick={() => setScope(value)} key={value}>{label}</button>)}</nav>
          <nav className="community-sort" aria-label="Orden de preguntas">{([['recent', 'Recientes'], ['unanswered', 'Sin respuesta'], ['helpful', 'Más útiles']] as const).map(([value, label]) => <button type="button" className={sort === value ? 'selected' : ''} onClick={() => setSort(value)} key={value}>{label}</button>)}</nav>
          <section className="community-thread-list" aria-busy={busy}>{busy ? <p>Cargando preguntas…</p> : threads.length ? threads.map((thread) => <button type="button" onClick={() => void openThread(thread)} key={thread.id}><strong>{thread.title}</strong><span>{thread.authorDisplayName} · {relativeTime(thread.lastActivityAt)}</span><small>{thread.replyCount} {thread.replyCount === 1 ? 'respuesta' : 'respuestas'}{thread.helpfulCount ? ` · ${thread.helpfulCount} ayudaron` : ''}</small></button>) : <div className="community-empty"><h3>Todavía no hay preguntas sobre este tema.</h3><p>¿Quieres hacer la primera?</p><button className="button button-primary" type="button" onClick={() => requireIdentity() && setView('new')}>Hacer una pregunta</button></div>}</section>
        </>}
        {view === 'new' && <QuestionForm context={context} onCancel={() => setView('list')} onCreated={async (thread) => { await loadThreads(); await openThread(thread); }} />}
        {view === 'thread' && selected && <ThreadDetail thread={selected} replies={replies} realtime={realtime} online={online} requireIdentity={requireIdentity} onBack={() => { setView('list'); setSelected(null); setReplies([]); void loadThreads(); }} onRefresh={loadReplies} onChanged={async () => { const fresh = await api<CommunityThread>(`/api/community/threads/${selected.id}`); setSelected(fresh); await loadReplies(); }} onDeleted={() => { setView('list'); setSelected(null); void loadThreads(); }} onMessage={setMessage} />}
      </>}
    </aside>
  </div>;
}

function NamePrompt({ onReady }: { onReady: () => Promise<void> }) {
  const [name, setName] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  return <form className="community-name-prompt" onSubmit={async (event) => { event.preventDefault(); setBusy(true); setMessage(''); try { await api('/api/auth/guest', { method: 'POST', body: JSON.stringify({ displayName: name }) }); await onReady(); } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo guardar tu nombre.'); } finally { setBusy(false); } }}><h3>¿Cómo quieres aparecer en la comunidad?</h3><p>Usaremos el mismo perfil que guarda tu progreso.</p><label>Nombre visible<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={40} required autoComplete="nickname" /></label><button className="button button-primary" disabled={busy}>{busy ? 'Guardando…' : 'Continuar'}</button>{message && <small>{message}</small>}</form>;
}

function QuestionForm({ context, onCancel, onCreated }: { context: CommunityContext; onCancel: () => void; onCreated: (thread: CommunityThread) => Promise<void> }) {
  const [title, setTitle] = useState(''); const [body, setBody] = useState(''); const [suggestions, setSuggestions] = useState<CommunityThread[]>([]); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  useEffect(() => { if (title.trim().length < 8) return; const timer = window.setTimeout(() => { const query = new URLSearchParams({ scope: 'context', lessonId: String(context.lessonId), section: context.section, ...(context.concept ? { concept: context.concept } : {}), search: title }); void api<CommunityThread[]>(`/api/community/threads?${query}`).then(setSuggestions).catch(() => setSuggestions([])); }, 400); return () => window.clearTimeout(timer); }, [context, title]);
  return <form className="community-form" onSubmit={async (event) => { event.preventDefault(); setBusy(true); setMessage(''); try { await onCreated(await api<CommunityThread>('/api/community/threads', { method: 'POST', body: JSON.stringify({ ...context, title, body }) })); } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo publicar la pregunta.'); } finally { setBusy(false); } }}>
    <button type="button" className="community-back" onClick={onCancel}>← Volver</button><p className="community-culture"><b>En Míng aprendemos preguntando y ayudando a otros.</b><br/>Sé claro, amable y útil.</p><ContextChips context={context}/>
    <label>Título<input value={title} onChange={(event) => { setTitle(event.target.value); if (event.target.value.trim().length < 8) setSuggestions([]); }} minLength={COMMUNITY_LIMITS.titleMin} maxLength={COMMUNITY_LIMITS.titleMax} required placeholder="¿Por qué usamos 很 con 好?"/><small>Escribe tu duda en una frase clara.</small></label>
    {suggestions.length > 0 && <aside className="community-suggestions"><b>Quizá ya existe una respuesta</b>{suggestions.slice(0, 3).map((thread) => <span key={thread.id}>{thread.title} · {thread.replyCount} respuestas</span>)}</aside>}
    <label>Pregunta<textarea value={body} onChange={(event) => setBody(event.target.value)} minLength={COMMUNITY_LIMITS.threadBodyMin} maxLength={COMMUNITY_LIMITS.bodyMax} required rows={7}/><small>{body.length}/{COMMUNITY_LIMITS.bodyMax}</small></label>
    {message && <p className="community-message" role="alert">{message}</p>}<button className="button button-primary" disabled={busy}>{busy ? 'Publicando…' : 'Publicar pregunta'}</button>
  </form>;
}

function ThreadDetail({ thread, replies, realtime, online, requireIdentity, onBack, onRefresh, onChanged, onDeleted, onMessage }: { thread: CommunityThread; replies: CommunityReply[]; realtime: string; online: boolean; requireIdentity: () => boolean; onBack: () => void; onRefresh: () => Promise<void>; onChanged: () => Promise<void>; onDeleted: () => void; onMessage: (value: string) => void }) {
  const [reply, setReply] = useState(''); const [editingThread, setEditingThread] = useState(false); const [title, setTitle] = useState(thread.title); const [body, setBody] = useState(thread.body); const [editingReply, setEditingReply] = useState<string | null>(null); const [editReplyBody, setEditReplyBody] = useState(''); const [busy, setBusy] = useState(false);
  return <section className="community-thread-detail"><div className="community-thread-nav"><button type="button" className="community-back" onClick={onBack}>← Preguntas</button><button type="button" onClick={() => void onRefresh()}>Actualizar</button><small className={`realtime-${realtime}`}>{realtime === 'live' ? 'En vivo' : 'Actualización periódica'}</small></div>
    <article className="community-question"><ContextChips context={thread}/><p className="community-author">{thread.authorDisplayName} · {relativeTime(thread.createdAt)}{thread.updatedAt !== thread.createdAt ? ' · editado' : ''}</p>{editingThread ? <form onSubmit={async (event) => { event.preventDefault(); setBusy(true); try { await api(`/api/community/threads/${thread.id}`, { method: 'PATCH', body: JSON.stringify({ title, body }) }); setEditingThread(false); await onChanged(); } catch (error) { onMessage(error instanceof Error ? error.message : 'No se pudo editar.'); } finally { setBusy(false); } }}><label>Título<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160}/></label><label>Pregunta<textarea value={body} onChange={(event) => setBody(event.target.value)} rows={6} maxLength={5000}/></label><button disabled={busy}>Guardar</button><button type="button" onClick={() => setEditingThread(false)}>Cancelar</button></form> : <><h3>{thread.title}</h3><p className="community-body">{thread.body}</p></>}
      <div className="community-item-actions"><Link href={thread.route}>Volver al tema</Link><ReportButton targetType="thread" targetId={thread.id} requireIdentity={requireIdentity} onMessage={onMessage}/>{thread.canEdit && <><button type="button" onClick={() => setEditingThread(true)}>Editar</button><button type="button" onClick={async () => { if (!window.confirm('¿Eliminar tu pregunta? Se conservará únicamente para auditoría.')) return; await api(`/api/community/threads/${thread.id}`, { method: 'DELETE' }); onDeleted(); }}>Eliminar</button></>}</div></article>
    <div className="community-replies-heading"><h3>Respuestas · {replies.length}</h3></div>
    <div className="community-replies">{replies.length ? replies.map((item) => <article key={item.id}><p className="community-author">{item.authorDisplayName} · {relativeTime(item.createdAt)}{item.updatedAt !== item.createdAt ? ' · editado' : ''}</p>{editingReply === item.id ? <form onSubmit={async (event) => { event.preventDefault(); await api(`/api/community/replies/${item.id}`, { method: 'PATCH', body: JSON.stringify({ body: editReplyBody }) }); setEditingReply(null); await onRefresh(); }}><textarea value={editReplyBody} onChange={(event) => setEditReplyBody(event.target.value)} maxLength={5000}/><button>Guardar</button><button type="button" onClick={() => setEditingReply(null)}>Cancelar</button></form> : <p className="community-body">{item.body}</p>}<div className="community-item-actions"><button type="button" className={item.userHelpful ? 'selected' : ''} onClick={async () => { if (!requireIdentity()) return; try { await api(`/api/community/replies/${item.id}/helpful`, { method: 'POST' }); await onRefresh(); } catch (error) { onMessage(error instanceof Error ? error.message : 'No se pudo guardar la reacción.'); } }}>👍 Me ayudó · {item.helpfulCount}</button><ReportButton targetType="reply" targetId={item.id} requireIdentity={requireIdentity} onMessage={onMessage}/>{item.canEdit && <><button type="button" onClick={() => { setEditingReply(item.id); setEditReplyBody(item.body); }}>Editar</button><button type="button" onClick={async () => { if (!window.confirm('¿Eliminar tu respuesta?')) return; await api(`/api/community/replies/${item.id}`, { method: 'DELETE' }); await onRefresh(); }}>Eliminar</button></>}</div></article>) : <p className="community-empty-replies">Todavía no hay respuestas. Una explicación clara puede ayudar a más estudiantes.</p>}</div>
    <form className="community-reply-form" onSubmit={async (event) => { event.preventDefault(); if (!requireIdentity()) return; setBusy(true); try { await api(`/api/community/threads/${thread.id}/replies`, { method: 'POST', body: JSON.stringify({ body: reply }) }); setReply(''); await onRefresh(); } catch (error) { onMessage(error instanceof Error ? error.message : 'No se pudo publicar la respuesta.'); } finally { setBusy(false); } }}><label>Escribir respuesta<textarea value={reply} onChange={(event) => setReply(event.target.value)} maxLength={5000} rows={5} disabled={!online}/></label><button className="button button-primary" disabled={busy || !online}>{busy ? 'Publicando…' : 'Publicar respuesta'}</button></form>
  </section>;
}

function ReportButton({ targetType, targetId, requireIdentity, onMessage }: { targetType: CommunityTargetType; targetId: string; requireIdentity: () => boolean; onMessage: (value: string) => void }) {
  const [open, setOpen] = useState(false); const [reason, setReason] = useState<CommunityReportReason>('off_topic'); const [details, setDetails] = useState('');
  if (!open) return <button type="button" onClick={() => requireIdentity() && setOpen(true)}>⋯ Reportar</button>;
  return <form className="community-report" onSubmit={async (event) => { event.preventDefault(); try { await api('/api/community/reports', { method: 'POST', body: JSON.stringify({ targetType, targetId, reason, details }) }); onMessage('Reporte enviado de forma privada a moderación.'); setOpen(false); } catch (error) { onMessage(error instanceof Error ? error.message : 'No se pudo enviar el reporte.'); } }}><label>Motivo<select value={reason} onChange={(event) => setReason(event.target.value as CommunityReportReason)}>{Object.entries(reportReasonLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>{reason === 'other' && <label>Detalle<input value={details} onChange={(event) => setDetails(event.target.value)} maxLength={1000}/></label>}<button>Enviar</button><button type="button" onClick={() => setOpen(false)}>Cancelar</button></form>;
}

function ContextChips({ context }: { context: CommunityContext }) { return <div className="community-context-chips"><span>Lección {context.lessonId}</span><span>{sectionLabels[context.section]}</span>{context.concept && <span>{context.concept}</span>}{context.skill && <span>{skillLabels[context.skill]}</span>}</div>; }
function relativeTime(value: string) { const minutes = Math.max(0, Math.round((Date.now() - Date.parse(value)) / 60_000)); if (minutes < 1) return 'ahora'; if (minutes < 60) return `${minutes} min`; const hours = Math.round(minutes / 60); if (hours < 24) return `${hours} h`; return new Date(value).toLocaleDateString('es-PE'); }
