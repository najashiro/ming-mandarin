import type { MixSession, ReviewMap } from './vocabulary-review';
export type VocabularyState = { version: 2; favorites: string[]; hideTranslation: boolean; faces: Record<string, boolean>; progress: ReviewMap; sessions: Record<string, MixSession>; lastSequences: Record<string, string[]>; legacyMixNotice: boolean };
export const emptyVocabularyState = (): VocabularyState => ({ version: 2, favorites: [], hideTranslation: false, faces: {}, progress: {}, sessions: {}, lastSequences: {}, legacyMixNotice: false });
export const vocabularyStorageKey = (userId: string) => `ming-vocabulary-v1:${userId}`;

function isSession(value: unknown, scope: string): value is MixSession {
  const s = value as MixSession;
  const validAnswers = (answers: unknown) => Array.isArray(answers) && answers.every(answer => answer && typeof answer.id === 'string' && typeof answer.wordId === 'string' && typeof answer.known === 'boolean' && Number.isFinite(answer.answeredAt));
  const origin = s?.originResult;
  const validOrigin = !origin || Boolean(typeof origin.sessionId === 'string' && typeof origin.scope === 'string' && Number.isInteger(origin.requestedSize) && Number.isInteger(origin.actualSize) && Array.isArray(origin.deck) && origin.deck.length === origin.actualSize && origin.deck.every(id => typeof id === 'string') && validAnswers(origin.answers));
  return Boolean(s && s.formatVersion === 2 && typeof s.id === 'string' && typeof s.userId === 'string' && s.scope === scope && Number.isInteger(s.requestedSize) && s.requestedSize > 0 && Number.isInteger(s.actualSize) && s.actualSize >= 0 && Array.isArray(s.deck) && s.deck.length === s.actualSize && s.deck.length <= 50 && new Set(s.deck).size === s.deck.length && s.deck.every(id => typeof id === 'string') && Number.isInteger(s.index) && s.index >= 0 && s.index <= s.deck.length && typeof s.revealed === 'boolean' && typeof s.paused === 'boolean' && ['normal', 'review'].includes(s.kind) && Number.isFinite(s.startedAt) && validAnswers(s.answers) && s.answers.length === s.index && validOrigin);
}

export function parseVocabularyState(raw: string | null): VocabularyState {
  const fallback = emptyVocabularyState();
  if (!raw) return fallback;
  try {
    const value = JSON.parse(raw);
    if (!value || ![1, 2].includes(value.version)) return fallback;
    if (Array.isArray(value.favorites)) fallback.favorites = value.favorites.filter((id: unknown) => typeof id === 'string');
    fallback.hideTranslation = value.hideTranslation === true;
    if (value.faces && typeof value.faces === 'object') for (const [id, face] of Object.entries(value.faces)) if (typeof face === 'boolean') fallback.faces[id] = face;
    if (value.progress && typeof value.progress === 'object') for (const [id, entry] of Object.entries(value.progress)) {
      const r = entry as ReviewMap[string];
      if (r && Number.isFinite(r.due) && Number.isInteger(r.streak) && r.streak >= 0 && Number.isInteger(r.attempts) && typeof r.lastEvent === 'string') fallback.progress[id] = r;
    }
    if (value.version === 1) {
      fallback.legacyMixNotice = Boolean(value.sessions && typeof value.sessions === 'object' && Object.keys(value.sessions).length);
      return fallback;
    }
    if (value.sessions && typeof value.sessions === 'object') for (const [scope, entry] of Object.entries(value.sessions)) if (isSession(entry, scope)) fallback.sessions[scope] = entry;
    if (value.lastSequences && typeof value.lastSequences === 'object') for (const [scope, ids] of Object.entries(value.lastSequences)) if (Array.isArray(ids) && ids.length <= 50 && ids.every(id => typeof id === 'string')) fallback.lastSequences[scope] = ids;
    fallback.legacyMixNotice = value.legacyMixNotice === true;
    return fallback;
  } catch { return fallback; }
}
