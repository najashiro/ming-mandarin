import 'server-only';

import type { AppUser } from '@/app/auth';
import { normalizeCommunityContext, normalizePlainText, titleSimilarity, validateReplyBody, validateThreadInput } from '@/lib/community/domain';
import { communitySections, reportReasons, type CommunityContext, type CommunityReply, type CommunityReportReason, type CommunityScope, type CommunitySort, type CommunityStatus, type CommunityTargetType, type CommunityThread } from '@/lib/community/types';
import { supabaseRest } from '@/lib/supabase/rest';
import { ApiError } from './api';

type ThreadRow = { id: string; user_id: string; author_display_name: string; lesson_id: number; section: CommunityContext['section']; concept: string | null; skill: CommunityContext['skill'] | null; route: string; title: string; body: string; status: CommunityStatus; created_at: string; updated_at: string; last_activity_at: string };
type ReplyRow = { id: string; thread_id: string; user_id: string; author_display_name: string; body: string; status: CommunityStatus; created_at: string; updated_at: string };
type ReportRow = { id: string; reporter_user_id: string; target_type: CommunityTargetType; target_id: string; reason: CommunityReportReason; details: string | null; status: string; created_at: string };

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const encode = (value: string | number) => encodeURIComponent(String(value));

export function communityEnabled() {
  return process.env.COMMUNITY_ENABLED !== 'false';
}

function assertEnabled() {
  if (!communityEnabled()) throw new ApiError(503, 'La comunidad está temporalmente desactivada.');
}

function validId(value: unknown) {
  const id = String(value ?? '');
  if (!uuidPattern.test(id)) throw new ApiError(400, 'Identificador de comunidad no válido.');
  return id;
}

async function profileFor(user: AppUser) {
  const rows = await supabaseRest<Array<{ id: string; display_name: string }>>(`profiles?select=id,display_name&id=eq.${encode(user.userId)}&limit=1`);
  if (!rows[0] || rows[0].display_name.trim().length < 2) throw new ApiError(409, 'Elige un nombre antes de participar en la comunidad.');
  return rows[0];
}

async function assertCanPost(user: AppUser, kind: 'thread' | 'reply') {
  await profileFor(user);
  const now = new Date();
  const bans = await supabaseRest<Array<{ id: string }>>(`community_bans?select=id&user_id=eq.${encode(user.userId)}&revoked_at=is.null&starts_at=lte.${encode(now.toISOString())}&or=(ends_at.is.null,ends_at.gt.${encode(now.toISOString())})&limit=1`);
  if (bans.length) throw new ApiError(403, 'Tu acceso para publicar en la comunidad está bloqueado. Puedes seguir estudiando y leyendo preguntas.');
  const settings = await supabaseRest<Array<{ key: string; value: number }>>('community_settings?select=key,value');
  const key = kind === 'thread' ? 'threads_per_10m' : 'replies_per_10m';
  const fallback = kind === 'thread' ? 3 : 12;
  const limit = Number(settings.find((row) => row.key === key)?.value ?? process.env[kind === 'thread' ? 'COMMUNITY_THREAD_LIMIT' : 'COMMUNITY_REPLY_LIMIT'] ?? fallback);
  const table = kind === 'thread' ? 'community_threads' : 'community_replies';
  const recent = await supabaseRest<Array<{ id: string }>>(`${table}?select=id&user_id=eq.${encode(user.userId)}&created_at=gte.${encode(new Date(now.getTime() - 10 * 60_000).toISOString())}`);
  if (recent.length >= limit) throw new ApiError(429, 'Has publicado varias veces en pocos minutos. Espera un momento antes de continuar.');
}

export async function getCommunityIdentity(user: AppUser | null) {
  if (!user) return { authenticated: false, displayName: null, canPost: false, blockedUntil: null };
  const profile = await profileFor(user);
  const now = new Date().toISOString();
  const bans = await supabaseRest<Array<{ ends_at: string | null }>>(`community_bans?select=ends_at&user_id=eq.${encode(user.userId)}&revoked_at=is.null&starts_at=lte.${encode(now)}&or=(ends_at.is.null,ends_at.gt.${encode(now)})&order=created_at.desc&limit=1`);
  return { authenticated: true, displayName: profile.display_name, canPost: !bans[0], blockedUntil: bans[0]?.ends_at ?? null };
}

function mapThread(row: ThreadRow, counts: Map<string, { replies: number; helpful: number }>, viewerId?: string): CommunityThread {
  const count = counts.get(row.id) ?? { replies: 0, helpful: 0 };
  return {
    id: row.id, lessonId: row.lesson_id, section: row.section, ...(row.concept ? { concept: row.concept } : {}), ...(row.skill ? { skill: row.skill } : {}), route: row.route,
    title: row.title, body: row.body, authorDisplayName: row.author_display_name, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at,
    lastActivityAt: row.last_activity_at, replyCount: count.replies, helpfulCount: count.helpful, canEdit: row.user_id === viewerId && row.status === 'active',
  };
}

async function threadCounts(rows: ThreadRow[]) {
  const result = new Map<string, { replies: number; helpful: number }>();
  if (!rows.length) return result;
  const ids = rows.map((row) => row.id);
  const replies = await supabaseRest<Array<{ id: string; thread_id: string }>>(`community_replies?select=id,thread_id&status=eq.active&thread_id=in.(${ids.join(',')})`);
  const replyIds = replies.map((reply) => reply.id);
  const reactions = replyIds.length ? await supabaseRest<Array<{ reply_id: string }>>(`community_reactions?select=reply_id&reaction_type=eq.helpful&reply_id=in.(${replyIds.join(',')})`) : [];
  const replyThreads = new Map(replies.map((reply) => [reply.id, reply.thread_id]));
  for (const row of rows) result.set(row.id, { replies: 0, helpful: 0 });
  for (const reply of replies) result.get(reply.thread_id)!.replies += 1;
  for (const reaction of reactions) {
    const threadId = replyThreads.get(reaction.reply_id);
    if (threadId) result.get(threadId)!.helpful += 1;
  }
  return result;
}

export async function listCommunityThreads(input: { scope?: CommunityScope; sort?: CommunitySort; lessonId?: number; section?: string; concept?: string; search?: string }, viewer?: AppUser | null) {
  assertEnabled();
  const scope: CommunityScope = ['context', 'lesson', 'general'].includes(String(input.scope)) ? input.scope as CommunityScope : 'context';
  const sort: CommunitySort = ['recent', 'unanswered', 'helpful'].includes(String(input.sort)) ? input.sort as CommunitySort : 'recent';
  const lessonId = Number(input.lessonId || 1);
  const section = communitySections.includes(input.section as CommunityContext['section']) ? input.section : undefined;
  const concept = normalizePlainText(input.concept, 80);
  const clauses = ['status=eq.active'];
  if (scope !== 'general') clauses.push(`lesson_id=eq.${encode(lessonId)}`);
  if (scope === 'context' && section) clauses.push(`section=eq.${encode(section)}`);
  if (scope === 'context' && concept) clauses.push(`concept=eq.${encode(concept)}`);
  const rows = await supabaseRest<ThreadRow[]>(`community_threads?select=id,user_id,author_display_name,lesson_id,section,concept,skill,route,title,body,status,created_at,updated_at,last_activity_at&${clauses.join('&')}&order=last_activity_at.desc&limit=80`);
  const counts = await threadCounts(rows);
  const search = normalizePlainText(input.search, 160);
  let mapped = rows.map((row) => mapThread(row, counts, viewer?.userId));
  if (search) mapped = mapped.filter((thread) => titleSimilarity(search, thread.title) >= 0.3 || thread.title.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
  if (sort === 'unanswered') mapped = mapped.filter((thread) => thread.replyCount === 0);
  if (sort === 'helpful') mapped.sort((a, b) => b.helpfulCount - a.helpfulCount || Date.parse(b.lastActivityAt) - Date.parse(a.lastActivityAt));
  return mapped.slice(0, 30);
}

export async function getCommunityThread(threadId: unknown, viewer?: AppUser | null) {
  assertEnabled();
  const id = validId(threadId);
  const rows = await supabaseRest<ThreadRow[]>(`community_threads?select=id,user_id,author_display_name,lesson_id,section,concept,skill,route,title,body,status,created_at,updated_at,last_activity_at&id=eq.${id}&limit=1`);
  const row = rows[0];
  if (!row || (row.status !== 'active' && row.user_id !== viewer?.userId)) throw new ApiError(404, 'La pregunta ya no está disponible.');
  return mapThread(row, await threadCounts([row]), viewer?.userId);
}

export async function createCommunityThread(user: AppUser, input: Partial<CommunityContext> & { title?: unknown; body?: unknown }) {
  assertEnabled();
  await assertCanPost(user, 'thread');
  const context = normalizeCommunityContext(input);
  const content = validateThreadInput(input);
  const duplicateRows = await supabaseRest<Array<{ title: string; body: string }>>(`community_threads?select=title,body&user_id=eq.${encode(user.userId)}&created_at=gte.${encode(new Date(Date.now() - 60 * 60_000).toISOString())}`);
  if (duplicateRows.some((row) => row.title.toLocaleLowerCase('es') === content.title.toLocaleLowerCase('es') && row.body.toLocaleLowerCase('es') === content.body.toLocaleLowerCase('es'))) throw new ApiError(409, 'Esta pregunta ya fue publicada recientemente.');
  const rows = await supabaseRest<ThreadRow[]>('community_threads', { method: 'POST', prefer: 'return=representation', body: { user_id: user.userId, author_display_name: user.displayName, lesson_id: context.lessonId, section: context.section, concept: context.concept ?? null, skill: context.skill ?? null, route: context.route, ...content } });
  return mapThread(rows[0], new Map(), user.userId);
}

export async function updateCommunityThread(user: AppUser, threadId: unknown, input: { title?: unknown; body?: unknown }) {
  const id = validId(threadId); const thread = await getCommunityThread(id, user);
  if (!thread.canEdit) throw new ApiError(403, 'Solo puedes editar tu propia pregunta activa.');
  const content = validateThreadInput(input);
  const rows = await supabaseRest<ThreadRow[]>(`community_threads?id=eq.${id}&user_id=eq.${encode(user.userId)}`, { method: 'PATCH', prefer: 'return=representation', body: content });
  return mapThread(rows[0], await threadCounts(rows), user.userId);
}

export async function deleteCommunityThread(user: AppUser, threadId: unknown) {
  const id = validId(threadId); const thread = await getCommunityThread(id, user);
  if (!thread.canEdit) throw new ApiError(403, 'Solo puedes eliminar tu propia pregunta activa.');
  await supabaseRest(`community_threads?id=eq.${id}&user_id=eq.${encode(user.userId)}`, { method: 'PATCH', prefer: 'return=minimal', body: { status: 'deleted_by_author' } });
  return { ok: true };
}

export async function listCommunityReplies(threadId: unknown, viewer?: AppUser | null) {
  const thread = await getCommunityThread(threadId, viewer);
  const rows = await supabaseRest<ReplyRow[]>(`community_replies?select=id,thread_id,user_id,author_display_name,body,status,created_at,updated_at&thread_id=eq.${thread.id}&status=eq.active&order=created_at.asc`);
  const ids = rows.map((row) => row.id);
  const reactions = ids.length ? await supabaseRest<Array<{ reply_id: string; user_id: string }>>(`community_reactions?select=reply_id,user_id&reaction_type=eq.helpful&reply_id=in.(${ids.join(',')})`) : [];
  return rows.map((row): CommunityReply => ({ id: row.id, threadId: row.thread_id, body: row.body, authorDisplayName: row.author_display_name, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, helpfulCount: reactions.filter((reaction) => reaction.reply_id === row.id).length, userHelpful: reactions.some((reaction) => reaction.reply_id === row.id && reaction.user_id === viewer?.userId), canEdit: row.user_id === viewer?.userId && row.status === 'active' }));
}

export async function createCommunityReply(user: AppUser, threadId: unknown, value: unknown) {
  assertEnabled(); await assertCanPost(user, 'reply');
  const thread = await getCommunityThread(threadId, user); const body = validateReplyBody(value);
  const recent = await supabaseRest<Array<{ body: string }>>(`community_replies?select=body&user_id=eq.${encode(user.userId)}&created_at=gte.${encode(new Date(Date.now() - 60 * 60_000).toISOString())}`);
  if (recent.some((row) => row.body.toLocaleLowerCase('es') === body.toLocaleLowerCase('es'))) throw new ApiError(409, 'Esta respuesta ya fue publicada recientemente.');
  const rows = await supabaseRest<ReplyRow[]>('community_replies', { method: 'POST', prefer: 'return=representation', body: { thread_id: thread.id, user_id: user.userId, author_display_name: user.displayName, body } });
  return { id: rows[0].id };
}

async function ownReply(user: AppUser, replyId: unknown) {
  const id = validId(replyId);
  const rows = await supabaseRest<ReplyRow[]>(`community_replies?select=id,thread_id,user_id,author_display_name,body,status,created_at,updated_at&id=eq.${id}&limit=1`);
  if (!rows[0] || rows[0].user_id !== user.userId || rows[0].status !== 'active') throw new ApiError(403, 'Solo puedes modificar tu propia respuesta activa.');
  return rows[0];
}

export async function updateCommunityReply(user: AppUser, replyId: unknown, value: unknown) {
  const row = await ownReply(user, replyId); const body = validateReplyBody(value);
  await supabaseRest(`community_replies?id=eq.${row.id}&user_id=eq.${encode(user.userId)}`, { method: 'PATCH', prefer: 'return=minimal', body: { body } });
  return { ok: true };
}

export async function deleteCommunityReply(user: AppUser, replyId: unknown) {
  const row = await ownReply(user, replyId);
  await supabaseRest(`community_replies?id=eq.${row.id}&user_id=eq.${encode(user.userId)}`, { method: 'PATCH', prefer: 'return=minimal', body: { status: 'deleted_by_author' } });
  return { ok: true };
}

export async function toggleHelpful(user: AppUser, replyId: unknown) {
  assertEnabled(); await profileFor(user); const id = validId(replyId);
  const reply = await supabaseRest<ReplyRow[]>(`community_replies?select=id,thread_id,user_id,author_display_name,body,status,created_at,updated_at&id=eq.${id}&status=eq.active&limit=1`);
  if (!reply[0]) throw new ApiError(404, 'La respuesta no está disponible.');
  await getCommunityThread(reply[0].thread_id, user);
  const existing = await supabaseRest<Array<{ id: string }>>(`community_reactions?select=id&reply_id=eq.${id}&user_id=eq.${encode(user.userId)}&reaction_type=eq.helpful&limit=1`);
  if (existing[0]) await supabaseRest(`community_reactions?id=eq.${existing[0].id}&user_id=eq.${encode(user.userId)}`, { method: 'DELETE', prefer: 'return=minimal' });
  else await supabaseRest('community_reactions', { method: 'POST', prefer: 'return=minimal', body: { reply_id: id, user_id: user.userId, reaction_type: 'helpful' } });
  return { helpful: !existing[0] };
}

export async function reportCommunityContent(user: AppUser, input: { targetType?: unknown; targetId?: unknown; reason?: unknown; details?: unknown }) {
  assertEnabled(); await profileFor(user);
  const targetType = String(input.targetType) as CommunityTargetType; const targetId = validId(input.targetId);
  if (!['thread', 'reply'].includes(targetType)) throw new ApiError(400, 'El tipo de reporte no es válido.');
  const reason = String(input.reason) as CommunityReportReason;
  if (!reportReasons.includes(reason)) throw new ApiError(400, 'Selecciona un motivo de reporte.');
  const details = normalizePlainText(input.details, 1000) || null;
  const table = targetType === 'thread' ? 'community_threads' : 'community_replies';
  const target = await supabaseRest<Array<{ id: string; status: string }>>(`${table}?select=id,status&id=eq.${targetId}&status=eq.active&limit=1`);
  if (!target[0]) throw new ApiError(404, 'El contenido ya no está disponible.');
  const since = encode(new Date(Date.now() - 60 * 60_000).toISOString());
  const recent = await supabaseRest<Array<{ id: string }>>(`community_reports?select=id&reporter_user_id=eq.${encode(user.userId)}&created_at=gte.${since}`);
  const settings = await supabaseRest<Array<{ value: number }>>('community_settings?select=value&key=eq.reports_per_hour&limit=1');
  if (recent.length >= Number(settings[0]?.value ?? 10)) throw new ApiError(429, 'Has enviado varios reportes. Espera antes de enviar otro.');
  const prior = await supabaseRest<Array<{ id: string }>>(`community_reports?select=id&reporter_user_id=eq.${encode(user.userId)}&target_type=eq.${targetType}&target_id=eq.${targetId}&limit=1`);
  if (prior.length) throw new ApiError(409, 'Ya reportaste este contenido.');
  await supabaseRest('community_reports', { method: 'POST', prefer: 'return=minimal', body: { reporter_user_id: user.userId, target_type: targetType, target_id: targetId, reason, details } });
  return { ok: true };
}

export type AdminCommunityItem = { targetType: CommunityTargetType; id: string; authorUserId: string; authorDisplayName: string; content: string; title?: string; status: CommunityStatus; lessonId: number; section: string; concept?: string; createdAt: string; reportCount: number; reports: Array<{ id: string; reason: string; details: string | null; createdAt: string }>; actionCount: number };

export async function listCommunityModeration(input: { status?: string; section?: string; lessonId?: number; reported?: boolean; after?: string }) {
  const status = ['active', 'hidden', 'deleted', 'deleted_by_author'].includes(String(input.status)) ? String(input.status) : undefined;
  const section = communitySections.includes(input.section as CommunityContext['section']) ? input.section : undefined;
  const lessonId = Number(input.lessonId || 0);
  const after = input.after && !Number.isNaN(Date.parse(input.after)) ? new Date(input.after).toISOString() : undefined;
  const allThreads = await supabaseRest<ThreadRow[]>('community_threads?select=id,user_id,author_display_name,lesson_id,section,concept,skill,route,title,body,status,created_at,updated_at,last_activity_at&order=created_at.desc&limit=200');
  const threads = allThreads.filter((row) => (!status || row.status === status) && (!section || row.section === section) && (!lessonId || row.lesson_id === lessonId) && (!after || row.created_at >= after));
  const threadById = new Map(allThreads.map((row) => [row.id, row]));
  const replies = (await supabaseRest<ReplyRow[]>('community_replies?select=id,thread_id,user_id,author_display_name,body,status,created_at,updated_at&order=created_at.desc&limit=200')).filter((row) => (!status || row.status === status) && (!after || row.created_at >= after));
  const reports = await supabaseRest<ReportRow[]>('community_reports?select=id,reporter_user_id,target_type,target_id,reason,details,status,created_at&status=eq.open&order=created_at.desc');
  const actions = await supabaseRest<Array<{ target_type: CommunityTargetType; target_id: string }>>('community_moderation_actions?select=target_type,target_id');
  const decorate = (targetType: CommunityTargetType, id: string) => ({
    reports: reports.filter((report) => report.target_type === targetType && report.target_id === id).map((report) => ({ id: report.id, reason: report.reason, details: report.details, createdAt: report.created_at })),
    actionCount: actions.filter((action) => action.target_type === targetType && action.target_id === id).length,
  });
  let items: AdminCommunityItem[] = threads.map((row) => ({ targetType: 'thread', id: row.id, authorUserId: row.user_id, authorDisplayName: row.author_display_name, content: row.body, title: row.title, status: row.status, lessonId: row.lesson_id, section: row.section, ...(row.concept ? { concept: row.concept } : {}), createdAt: row.created_at, reportCount: decorate('thread', row.id).reports.length, ...decorate('thread', row.id) }));
  items.push(...replies.flatMap((row): AdminCommunityItem[] => { const thread = threadById.get(row.thread_id); if (!thread || (section && thread.section !== section) || (lessonId && thread.lesson_id !== lessonId)) return []; const extra = decorate('reply', row.id); return [{ targetType: 'reply', id: row.id, authorUserId: row.user_id, authorDisplayName: row.author_display_name, content: row.body, status: row.status, lessonId: thread.lesson_id, section: thread.section, ...(thread.concept ? { concept: thread.concept } : {}), createdAt: row.created_at, reportCount: extra.reports.length, ...extra }]; }));
  if (input.reported) items = items.filter((item) => item.reportCount > 0);
  return items.sort((a, b) => b.reportCount - a.reportCount || Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function moderateCommunityContent(moderator: AppUser, input: { targetType?: unknown; targetId?: unknown; action?: unknown; reason?: unknown; authorUserId?: unknown; endsAt?: unknown }) {
  const targetType = String(input.targetType) as 'thread' | 'reply' | 'user'; const action = String(input.action) as 'hide' | 'restore' | 'delete' | 'ban' | 'unban';
  if (!['thread', 'reply', 'user'].includes(targetType) || !['hide', 'restore', 'delete', 'ban', 'unban'].includes(action)) throw new ApiError(400, 'Acción de moderación no válida.');
  const targetId = validId(input.targetId); const reason = normalizePlainText(input.reason, 1000) || null;
  if (['hide', 'restore', 'delete'].includes(action)) {
    if (targetType === 'user') throw new ApiError(400, 'Selecciona una publicación.');
    const table = targetType === 'thread' ? 'community_threads' : 'community_replies';
    const status = action === 'hide' ? 'hidden' : action === 'restore' ? 'active' : 'deleted';
    const rows = await supabaseRest<Array<{ id: string }>>(`${table}?select=id&id=eq.${targetId}&limit=1`);
    if (!rows[0]) throw new ApiError(404, 'La publicación no existe.');
    await supabaseRest(`${table}?id=eq.${targetId}`, { method: 'PATCH', prefer: 'return=minimal', body: { status } });
    await supabaseRest(`community_reports?target_type=eq.${targetType}&target_id=eq.${targetId}&status=eq.open`, { method: 'PATCH', prefer: 'return=minimal', body: { status: 'actioned', reviewed_at: new Date().toISOString(), reviewed_by: moderator.userId } });
  } else if (action === 'ban') {
    const userId = validId(input.authorUserId ?? targetId); const endsAt = input.endsAt ? new Date(String(input.endsAt)) : null;
    if (userId === moderator.userId) throw new ApiError(400, 'No puedes bloquear tu propia cuenta administrativa.');
    if (!reason) throw new ApiError(400, 'Indica el motivo del bloqueo.');
    if (endsAt && Number.isNaN(endsAt.getTime())) throw new ApiError(400, 'La fecha de finalización no es válida.');
    await supabaseRest('community_bans', { method: 'POST', prefer: 'return=minimal', body: { user_id: userId, reason, ends_at: endsAt?.toISOString() ?? null, created_by: moderator.userId } });
  } else {
    const userId = validId(input.authorUserId ?? targetId);
    await supabaseRest(`community_bans?user_id=eq.${userId}&revoked_at=is.null`, { method: 'PATCH', prefer: 'return=minimal', body: { revoked_at: new Date().toISOString(), revoked_by: moderator.userId } });
  }
  await supabaseRest('community_moderation_actions', { method: 'POST', prefer: 'return=minimal', body: { moderator_user_id: moderator.userId, target_type: targetType, target_id: targetId, action, reason } });
  return { ok: true };
}
