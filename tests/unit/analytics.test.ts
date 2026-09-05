import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ANALYTICS_IDLE_TIMEOUT_MS, deriveAnalyticsContext, effectiveElapsedSeconds, formatStudyTime } from '@/lib/analytics/shared';

describe('analítica privada', () => {
  it('deriva lección y módulo únicamente desde rutas conocidas', () => {
    expect(deriveAnalyticsContext('/study/l1-l2-l3/hanzi?character=好')).toEqual({ route: '/study/l1-l2-l3/hanzi', lessonId: 'l1-l2-l3', module: 'hanzi' });
    expect(deriveAnalyticsContext('/lesson/1/games')).toEqual({ route: '/lesson/1/games', lessonId: '1', module: 'games' });
    expect(deriveAnalyticsContext('/progress')).toEqual({ route: '/progress', lessonId: '', module: 'progress' });
  });

  it('suma solo tiempo visible, reciente y acotado al heartbeat', () => {
    expect(effectiveElapsedSeconds({ from: 0, to: 30_000, lastInteractionAt: 0, visible: true })).toBe(30);
    expect(effectiveElapsedSeconds({ from: 0, to: 30_000, lastInteractionAt: 0, visible: false })).toBe(0);
    expect(effectiveElapsedSeconds({ from: 0, to: ANALYTICS_IDLE_TIMEOUT_MS + 1, lastInteractionAt: 0, visible: true })).toBe(0);
    expect(effectiveElapsedSeconds({ from: 0, to: 90_000, lastInteractionAt: 89_000, visible: true })).toBe(60);
  });

  it('formatea duraciones sin exponer precisión innecesaria', () => {
    expect(formatStudyTime(0)).toBe('0 s');
    expect(formatStudyTime(125)).toBe('2 min');
    expect(formatStudyTime(3_661)).toBe('1 h 1 min');
  });

  it('mantiene tablas y RPC globales fuera de anon y authenticated', () => {
    const migration = readFileSync(join(process.cwd(), 'supabase/migrations/0005_private_analytics.sql'), 'utf8');
    for (const table of ['analytics_sessions', 'analytics_daily', 'analytics_daily_content', 'analytics_events']) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
    expect(migration).toContain('revoke all on public.analytics_sessions');
    expect(migration).toContain('from public, anon, authenticated');
    expect(migration).toContain('to service_role');
    expect(migration).not.toMatch(/ip_address|user_agent|email|answer_text/i);
  });
});
