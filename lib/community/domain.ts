import { communitySections, communitySkills, sectionLabels, skillLabels, type CommunityContext, type CommunitySection, type CommunitySkill, type CommunityStatus } from './types';

export const COMMUNITY_LIMITS = { titleMin: 8, titleMax: 160, threadBodyMin: 12, bodyMax: 5000, replyBodyMin: 2, reportDetailsMax: 1000 } as const;
const weakTitles = new Set(['ayuda', 'pregunta', 'no entiendo', 'duda', 'help']);

export function normalizePlainText(value: unknown, max: number) {
  return String(value ?? '').normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/\r\n?/g, '\n').trim().slice(0, max);
}

export function validateThreadInput(input: { title?: unknown; body?: unknown }) {
  const title = normalizePlainText(input.title, COMMUNITY_LIMITS.titleMax);
  const body = normalizePlainText(input.body, COMMUNITY_LIMITS.bodyMax);
  if (title.length < COMMUNITY_LIMITS.titleMin) throw new Error('Escribe un título claro de al menos 8 caracteres.');
  if (weakTitles.has(title.toLocaleLowerCase('es'))) throw new Error('Resume tu duda en una frase más descriptiva.');
  if (body.length < COMMUNITY_LIMITS.threadBodyMin) throw new Error('Explica tu duda con al menos 12 caracteres.');
  return { title, body };
}

export function validateReplyBody(value: unknown) {
  const body = normalizePlainText(value, COMMUNITY_LIMITS.bodyMax);
  if (body.length < COMMUNITY_LIMITS.replyBodyMin) throw new Error('Escribe una respuesta antes de publicarla.');
  return body;
}

export function normalizeCommunityContext(value: Partial<CommunityContext>): CommunityContext {
  const lessonId = Number(value.lessonId);
  if (!Number.isInteger(lessonId) || lessonId < 1) throw new Error('El contexto necesita una lección válida.');
  if (!communitySections.includes(value.section as CommunitySection)) throw new Error('La sección de comunidad no es válida.');
  const skill = value.skill && communitySkills.includes(value.skill as CommunitySkill) ? value.skill as CommunitySkill : undefined;
  const concept = normalizePlainText(value.concept, 80) || undefined;
  const route = safeCommunityRoute(value.route);
  return { lessonId, section: value.section as CommunitySection, ...(concept ? { concept } : {}), ...(skill ? { skill } : {}), route };
}

export function safeCommunityRoute(value: unknown) {
  const route = String(value ?? '');
  if (!route.startsWith('/') || route.startsWith('//') || route.length > 300) throw new Error('La ruta de contexto no es válida.');
  const url = new URL(route, 'https://ming.local');
  if (url.origin !== 'https://ming.local' || !url.pathname.startsWith('/lesson/')) throw new Error('La ruta debe pertenecer a una lección de Míng.');
  return `${url.pathname}${url.search}${url.hash}`;
}

export function communityTags(context: CommunityContext) {
  return [`lesson:${context.lessonId}`, `section:${context.section}`, ...(context.concept ? [`concept:${context.concept}`] : []), ...(context.skill ? [`skill:${context.skill}`] : [])];
}

export function communityContextLabel(context: CommunityContext) {
  return [`Lección ${context.lessonId}`, sectionLabels[context.section], context.concept, context.skill ? skillLabels[context.skill] : undefined].filter(Boolean).join(' · ');
}

export function isCommunityVisibleStatus(status: CommunityStatus, isOwner = false, isAdmin = false) {
  return status === 'active' || isAdmin || (isOwner && status === 'deleted_by_author');
}

export function titleSimilarity(left: string, right: string) {
  const stopwords = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'por', 'que', 'con', 'se', 'en']);
  const tokens = (value: string) => new Set(value.toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\p{L}\p{N}\p{Script=Han}]+/gu, ' ').split(/\s+/).filter((token) => (token.length > 1 || /\p{Script=Han}/u.test(token)) && !stopwords.has(token)));
  const a = tokens(left); const b = tokens(right);
  if (!a.size || !b.size) return 0;
  const overlap = [...a].filter((token) => b.has(token)).length;
  return overlap / Math.min(a.size, b.size);
}

export function isActiveCommunityBan(ban: { startsAt: string; endsAt?: string | null; revokedAt?: string | null }, now = new Date()) {
  if (ban.revokedAt) return false;
  const starts = Date.parse(ban.startsAt); const ends = ban.endsAt ? Date.parse(ban.endsAt) : Number.POSITIVE_INFINITY;
  return Number.isFinite(starts) && starts <= now.getTime() && ends > now.getTime();
}

export function isCommunityRateLimited(timestamps: string[], limit: number, windowMs: number, now = new Date()) {
  const threshold = now.getTime() - windowMs;
  return timestamps.filter((value) => { const parsed = Date.parse(value); return Number.isFinite(parsed) && parsed >= threshold && parsed <= now.getTime(); }).length >= limit;
}
