'use client';
import { useEffect, useState } from 'react';
import type { VocabularyMediaEntry } from '@/lib/vocabulary-media';

export function usePublishedImages(initial: readonly VocabularyMediaEntry[]) {
  const [loaded, setLoaded] = useState<{ source: typeof initial; entries: VocabularyMediaEntry[] } | null>(null);
  useEffect(() => {
    let active = true;
    let inFlight = false;
    const controller = new AbortController();
    async function refresh() {
      if (document.hidden || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch('/api/vocabulary/images', { cache: 'no-store', signal: controller.signal });
        const entries = response.ok ? await response.json() : [];
        if (active) setLoaded({ source: initial, entries: Array.isArray(entries) ? entries : [] });
      } catch {
        if (active) setLoaded({ source: initial, entries: [] });
      } finally { inFlight = false; }
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { active = false; controller.abort(); window.clearInterval(timer);
      window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [initial]);
  return loaded?.source === initial ? loaded.entries : initial;
}
