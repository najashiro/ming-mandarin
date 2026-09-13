'use client';

import { useEffect } from 'react';

type Props = {
  enabled: boolean;
};

const TARGET_SELECTOR = '.hanzi-learn-visual';
const TOP_OFFSET_PX = 88;
const MAX_WAIT_MS = 5000;

export function HanziFocusScroller({ enabled }: Props) {
  useEffect(() => {
    if (!enabled) return;

    let handled = false;
    let timeoutId: number | undefined;

    function scrollToGlyph() {
      if (handled) return true;
      const target = document.querySelector<HTMLElement>(TARGET_SELECTOR);
      if (!target) return false;

      handled = true;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - TOP_OFFSET_PX);
          window.scrollTo({ top, behavior: 'auto' });
        });
      });
      return true;
    }

    if (scrollToGlyph()) return;

    const observer = new MutationObserver(() => {
      if (scrollToGlyph()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    timeoutId = window.setTimeout(() => observer.disconnect(), MAX_WAIT_MS);
    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [enabled]);

  return null;
}
