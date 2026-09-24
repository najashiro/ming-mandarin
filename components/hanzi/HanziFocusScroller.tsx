'use client';

import { useEffect, useRef } from 'react';

export function HanziFocusScroller({ active, requestKey }: { active: boolean; requestKey: string | number }) {
  const lastRequest = useRef<string | number | null>(null);

  useEffect(() => {
    if (!active || lastRequest.current === requestKey) return;
    lastRequest.current = requestKey;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('hanzi-detail-start')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start',
      });
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [active, requestKey]);

  return null;
}
