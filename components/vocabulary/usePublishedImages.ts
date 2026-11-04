'use client';
import { useEffect, useState } from 'react';
import type { VocabularyMediaEntry } from '@/lib/vocabulary-media';

export function usePublishedImages(initial: readonly VocabularyMediaEntry[]) {
  const [loaded, setLoaded] = useState<{ source: typeof initial; entries: VocabularyMediaEntry[] } | null>(null);
  useEffect(() => {
    let active = true;
    let inFlight = false;
    let controller: AbortController | null = null;
    async function refresh() {
      if (document.hidden || inFlight) return;
      inFlight = true;
      controller = new AbortController();
      const requestController = controller;
      const timeout = window.setTimeout(() => requestController.abort(), 7000);
      try {
        const response = await fetch('/api/vocabulary/images', { cache: 'no-store', signal: requestController.signal });
        const entries = response.ok ? await response.json() : [];
        if (active) setLoaded({ source: initial, entries: Array.isArray(entries) ? entries : [] });
      } catch {
        if (active) setLoaded({ source: initial, entries: [] });
      } finally { window.clearTimeout(timeout); inFlight = false; }
    }
    // A server-rendered publication list was just checked against review storage.
    // Avoid repeating that request while the first images are downloading.
    if (!initial.length) void refresh();
    const timer = window.setInterval(() => void refresh(), 30000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { active = false; controller?.abort(); window.clearInterval(timer);
      window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [initial]);
  return loaded?.source === initial ? loaded.entries : initial;
}
