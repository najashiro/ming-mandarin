import type { HanziAttemptPayload } from '@/lib/hanzi/types';
import { updateLocalHanziProgress } from '@/lib/hanzi/mastery';
import { trackAnalyticsEvent } from '@/lib/analytics/client';

export async function saveGameHanziAttempt(payload: HanziAttemptPayload) {
  trackAnalyticsEvent('hanzi_practiced', { contentId: payload.characterId, correct: payload.mistakes === 0 });
  try {
    const response = await fetch('/api/hanzi/practice', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    if (response.ok) return;
  } catch { /* Keep the same local fallback as the study laboratory. */ }
  try {
    const key = 'ming-hanzi-progress-v1';
    const previous = JSON.parse(localStorage.getItem(key) || '{}');
    const progressKey = `${payload.characterId}:${payload.skillDimension}`;
    localStorage.setItem(key, JSON.stringify({ ...previous, [progressKey]: updateLocalHanziProgress(previous[progressKey], payload) }));
  } catch { /* Private browsing must not interrupt practice. */ }
}
