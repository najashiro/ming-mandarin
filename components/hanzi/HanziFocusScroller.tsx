'use client';

import { useEffect, useRef } from 'react';

export function HanziFocusScroller({ active }: { active: boolean }) {
  const focused = useRef(false);

  useEffect(() => {
    if (!active || focused.current) return;

    let frame = 0;
    let nextFrame = 0;
    let queued = false;
    const observer = new MutationObserver(() => checkReady());
    const timeout = window.setTimeout(() => observer.disconnect(), 12_000);

    function checkReady() {
      if (queued || focused.current) return;
      const target = document.getElementById('hanzi-glyph-focus');
      if (!target?.querySelector('.hanzi-writer-target svg') || target.querySelector('.hanzi-stage-status')) return;

      queued = true;
      observer.disconnect();
      window.clearTimeout(timeout);
      frame = window.requestAnimationFrame(() => {
        nextFrame = window.requestAnimationFrame(() => {
          const headerHeight = document.querySelector('.topbar')?.getBoundingClientRect().height ?? 76;
          const top = window.scrollY + target.getBoundingClientRect().top - headerHeight - 12;
          window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
          focused.current = true;
        });
      });
    }

    observer.observe(document.body, { childList: true, subtree: true });
    checkReady();
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(nextFrame);
    };
  }, [active]);

  return null;
}
