'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { emptyVocabularyState, parseVocabularyState, vocabularyStorageKey, type VocabularyState } from '@/lib/vocabulary-storage';

type Snapshot = { data: VocabularyState; ready: boolean; saved: boolean };
const serverSnapshot: Snapshot = { data: emptyVocabularyState(), ready: false, saved: true };
const cache = new Map<string, Snapshot>();
const listeners = new Set<() => void>();
function read(key: string): Snapshot {
  if (!cache.has(key)) {
    try { cache.set(key, { data: parseVocabularyState(localStorage.getItem(key)), ready: true, saved: true }); }
    catch { cache.set(key, { data: emptyVocabularyState(), ready: true, saved: false }); }
  }
  return cache.get(key)!;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const changed = (event: StorageEvent) => { if (event.key?.startsWith('ming-vocabulary-v1:')) { cache.delete(event.key); listeners.forEach(fn => fn()); } };
  window.addEventListener('storage', changed);
  return () => { listeners.delete(listener); window.removeEventListener('storage', changed); };
}
export function useVocabularyState(userId: string) {
  const key = vocabularyStorageKey(userId);
  const snapshot = useSyncExternalStore(subscribe, useCallback(() => read(key), [key]), () => serverSnapshot);
  const update = useCallback((change: (previous: VocabularyState) => VocabularyState) => {
    const data = change(read(key).data);
    let saved = true;
    try { localStorage.setItem(key, JSON.stringify(data)); } catch { saved = false; }
    cache.set(key, { data, saved, ready: true });
    listeners.forEach(fn => fn());
  }, [key]);
  return { ...snapshot, update };
}
