'use client';

import { ANALYTICS_SESSION_TIMEOUT_MS, deriveAnalyticsContext, type AnalyticsEventType } from './shared';

const VISITOR_KEY = 'ming-analytics-visitor-v1';
const SESSION_KEY = 'ming-analytics-session-v1';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let currentRoute = '/';

type StoredSession = { id: string; lastSeenAt: number };
type EventOptions = { contentId?: string; correct?: boolean; activeSeconds?: number; beacon?: boolean };

function freshId() {
  return crypto.randomUUID();
}

function visitorId() {
  const stored = localStorage.getItem(VISITOR_KEY);
  if (stored && uuidPattern.test(stored)) return stored;
  const id = freshId();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

function sessionState(now = Date.now()): StoredSession {
  try {
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null') as StoredSession | null;
    if (stored && uuidPattern.test(stored.id) && now - stored.lastSeenAt <= ANALYTICS_SESSION_TIMEOUT_MS) {
      const next = { ...stored, lastSeenAt: now };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return next;
    }
  } catch { /* Un estado inválido inicia una sesión limpia. */ }
  const next = { id: freshId(), lastSeenAt: now };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

function post(eventType: AnalyticsEventType, options: EventOptions = {}) {
  if (typeof window === 'undefined') return;
  const context = deriveAnalyticsContext(currentRoute || window.location.pathname);
  if (context.module === 'admin') return;
  const payload = JSON.stringify({
    sessionId: sessionState().id,
    visitorId: visitorId(),
    eventType,
    route: context.route,
    ...(options.contentId ? { contentId: options.contentId.slice(0, 120) } : {}),
    ...(typeof options.correct === 'boolean' ? { correct: options.correct } : {}),
    ...(options.activeSeconds ? { activeSeconds: options.activeSeconds } : {}),
  });
  if (options.beacon && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/collect', new Blob([payload], { type: 'application/json' }));
    return;
  }
  void fetch('/api/analytics/collect', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export function setCurrentAnalyticsRoute(pathname: string) {
  currentRoute = deriveAnalyticsContext(pathname).route;
}

export function trackAnalyticsEvent(eventType: Exclude<AnalyticsEventType, 'heartbeat'>, options: Omit<EventOptions, 'activeSeconds' | 'beacon'> = {}) {
  post(eventType, options);
}

export function trackAnalyticsHeartbeat(activeSeconds: number, beacon = false) {
  if (activeSeconds > 0) post('heartbeat', { activeSeconds: Math.min(60, activeSeconds), beacon });
}

export function touchAnalyticsSession() {
  if (typeof window !== 'undefined') sessionState();
}
