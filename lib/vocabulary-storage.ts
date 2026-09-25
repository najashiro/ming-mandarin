import type { MixSession, ReviewMap } from './vocabulary-review';
export type VocabularyState = { version: 1; favorites: string[]; hideTranslation: boolean; faces: Record<string, boolean>; progress: ReviewMap; sessions: Record<string, MixSession> };
export const emptyVocabularyState = (): VocabularyState => ({ version: 1, favorites: [], hideTranslation: false, faces: {}, progress: {}, sessions: {} });
export const vocabularyStorageKey = (userId: string) => `ming-vocabulary-v1:${userId}`;

export function parseVocabularyState(raw: string | null): VocabularyState {
  const fallback = emptyVocabularyState();
  if (!raw) return fallback;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1) return fallback;
    if (Array.isArray(value.favorites)) fallback.favorites = value.favorites.filter((id: unknown) => typeof id === 'string');
    fallback.hideTranslation = value.hideTranslation === true;
    if (value.faces && typeof value.faces === 'object') for (const [id, face] of Object.entries(value.faces)) if (typeof face === 'boolean') fallback.faces[id] = face;
    if (value.progress && typeof value.progress === 'object') for (const [id, entry] of Object.entries(value.progress)) {
      const r = entry as ReviewMap[string];
      if (r && Number.isFinite(r.due) && Number.isInteger(r.streak) && r.streak >= 0 && Number.isInteger(r.attempts) && typeof r.lastEvent === 'string') fallback.progress[id] = r;
    }
    if (value.sessions && typeof value.sessions === 'object') for (const [scope, entry] of Object.entries(value.sessions)) {
      const s = entry as MixSession;
      if (s && typeof s.id === 'string' && s.scope === scope && ['basic', 'hard'].includes(s.level) && Array.isArray(s.queue) && s.queue.length <= 100 && s.queue.every(c => c && typeof c.wordId === 'string' && ['hanzi', 'image', 'context'].includes(c.type)) && Number.isInteger(s.index) && s.index >= 0 && s.index <= s.queue.length && Array.isArray(s.events) && s.events.every(e => e && typeof e.id === 'string' && typeof e.wordId === 'string' && typeof e.known === 'boolean' && ['hanzi', 'image', 'context'].includes(e.type)) && typeof s.paused === 'boolean' && typeof s.revealed === 'boolean') fallback.sessions[scope] = s;
    }
    return fallback;
  } catch { return fallback; }
}
