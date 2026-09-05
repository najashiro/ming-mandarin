export const analyticsEventTypes = [
  'page_view',
  'heartbeat',
  'exercise_completed',
  'hanzi_practiced',
  'game_started',
  'game_completed',
  'exam_started',
  'exam_completed',
] as const;

export type AnalyticsEventType = typeof analyticsEventTypes[number];

export type AnalyticsContext = {
  route: string;
  lessonId: string;
  module: string;
};

export const ANALYTICS_HEARTBEAT_MS = 30_000;
export const ANALYTICS_IDLE_TIMEOUT_MS = 5 * 60_000;
export const ANALYTICS_SESSION_TIMEOUT_MS = 30 * 60_000;

export function deriveAnalyticsContext(pathname: string): AnalyticsContext {
  const route = pathname.startsWith('/') ? pathname.split('?')[0].slice(0, 300) : '/';
  const study = /^\/study\/([^/]+)(?:\/([^/]+))?/.exec(route);
  if (study) return { route, lessonId: study[1], module: study[2] ?? 'course' };
  const lesson = /^\/lesson\/([^/]+)(?:\/([^/]+))?/.exec(route);
  if (lesson) return { route, lessonId: lesson[1], module: lesson[2] ?? 'course' };
  const section = /^\/([^/]+)/.exec(route)?.[1] ?? 'home';
  return { route, lessonId: '', module: section === 'admin' ? 'admin' : section };
}

export function effectiveElapsedSeconds(input: {
  from: number;
  to: number;
  lastInteractionAt: number;
  visible: boolean;
}) {
  if (!input.visible || input.to <= input.from || input.to - input.lastInteractionAt > ANALYTICS_IDLE_TIMEOUT_MS) return 0;
  return Math.min(60, Math.floor((input.to - input.from) / 1000));
}

export function formatStudyTime(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  if (hours) return `${hours} h ${minutes} min`;
  if (minutes) return `${minutes} min`;
  return `${safe} s`;
}
