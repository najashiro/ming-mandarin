import 'server-only';

import { getCurrentUser } from '@/app/auth';
import { analyticsEventTypes, deriveAnalyticsContext, type AnalyticsEventType } from '@/lib/analytics/shared';
import { supabaseRest } from '@/lib/supabase/rest';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type AnalyticsDashboardData = {
  kpis: {
    visitors: number;
    activeUsers: number;
    sessions: number;
    activeSeconds: number;
    avgSessionSeconds: number;
    exercises: number;
    correctAnswers: number;
    incorrectAnswers: number;
  };
  lessons: Array<{ id: string; activeSeconds: number; pageViews: number; exercises: number; correctAnswers: number; incorrectAnswers: number; hanzi: number }>;
  modules: Array<{ id: string; activeSeconds: number; pageViews: number; exercises: number }>;
  content: Array<{ module: string; route: string; activeSeconds: number; pageViews: number; events: number }>;
  games: Array<{ id: string; started: number; completed: number }>;
  hanzi: Array<{ id: string; practiced: number }>;
  exams: Array<{ id: string; started: number; completed: number }>;
  trend: Array<{ day: string; visitors: number; sessions: number; activeSeconds: number; exercises: number }>;
};

type CollectInput = {
  sessionId?: unknown;
  visitorId?: unknown;
  eventType?: unknown;
  route?: unknown;
  contentId?: unknown;
  activeSeconds?: unknown;
  correct?: unknown;
};

function cleanText(value: unknown, maximum: number) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

export async function recordAnalyticsActivity(input: CollectInput) {
  const sessionId = cleanText(input.sessionId, 36);
  const anonymousId = cleanText(input.visitorId, 36);
  const eventType = cleanText(input.eventType, 40) as AnalyticsEventType;
  const route = cleanText(input.route, 300);
  if (!uuidPattern.test(sessionId) || !uuidPattern.test(anonymousId)) throw new Error('Identificador analítico inválido.');
  if (!analyticsEventTypes.includes(eventType)) throw new Error('Evento analítico inválido.');
  if (!route.startsWith('/')) throw new Error('Ruta analítica inválida.');

  const context = deriveAnalyticsContext(route);
  if (context.module === 'admin') return;
  const currentUser = await getCurrentUser();
  const userId = currentUser && !currentUser.isAnonymous ? currentUser.userId : null;
  const visitorKey = userId ? `user:${userId}` : `anon:${anonymousId}`;
  const activeSeconds = eventType === 'heartbeat' && typeof input.activeSeconds === 'number'
    ? Math.max(1, Math.min(60, Math.round(input.activeSeconds)))
    : 0;

  await supabaseRest('rpc/record_analytics_activity', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      p_session_id: sessionId,
      p_visitor_key: visitorKey,
      p_user_id: userId,
      p_anonymous_id: userId ? null : anonymousId,
      p_event_type: eventType,
      p_route: context.route,
      p_lesson_id: context.lessonId,
      p_module: context.module,
      p_content_id: cleanText(input.contentId, 120),
      p_active_seconds: activeSeconds,
      p_correct: typeof input.correct === 'boolean' ? input.correct : null,
    },
  });
}

export async function getAnalyticsDashboard(days: 1 | 7 | 30) {
  return supabaseRest<AnalyticsDashboardData>('rpc/admin_analytics_dashboard', {
    method: 'POST',
    body: { p_days: days },
  });
}
