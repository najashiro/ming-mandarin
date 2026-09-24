'use client';

import { useEffect, useRef } from 'react';

export function HanziFocusScroller({ active, requestKey }: { active: boolean; requestKey: string | number }) {
  const lastRequest = useRef<string | number | null>(null);

  useEffect(() => {
    if (!active || lastRequest.current === requestKey) return;
    lastRequest.current = requestKey;
    let frame = 0;
    let settleFrame = 0;
    const viewport = window.visualViewport;
    function positionCard() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const target = document.getElementById('hanzi-detail-start');
        const header = document.querySelector<HTMLElement>('.topbar');
        if (!target || !header) return;
        const desiredTop = header.getBoundingClientRect().bottom + 6;
        const adjustment = target.getBoundingClientRect().top - desiredTop;
        if (Math.abs(adjustment) > 1) window.scrollBy({ top: adjustment, behavior: 'auto' });
      });
    }
    function afterViewportResize() { positionCard(); viewport?.removeEventListener('resize', afterViewportResize); }
    viewport?.addEventListener('resize', afterViewportResize);
    frame = window.requestAnimationFrame(() => {
      settleFrame = window.requestAnimationFrame(positionCard);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(settleFrame);
      viewport?.removeEventListener('resize', afterViewportResize);
    };
  }, [active, requestKey]);

  return null;
}
