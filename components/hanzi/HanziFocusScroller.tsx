'use client';

import { useEffect, useRef } from 'react';

type Props = { active: boolean; requestKey: string | number; expectedCharacter: string };

export function HanziFocusScroller({ active, requestKey, expectedCharacter }: Props) {
  const completedRequest = useRef<string | number | null>(null);

  useEffect(() => {
    if (!active || completedRequest.current === requestKey) return;
    let cancelled = false;
    let frame = 0;
    let stableFrames = 0;
    let lastGap = Number.NaN;
    let selfScrolling = false;
    let observer: ResizeObserver | null = null;
    const startedAt = performance.now();
    const root = document.documentElement;
    const workspace = document.querySelector('.hanzi-workspace');

    const cancelForUser = () => { if (!selfScrolling) cancelled = true; };
    const options: AddEventListenerOptions = { passive: true, capture: true };
    for (const event of ['wheel', 'touchstart', 'pointerdown'] as const) window.addEventListener(event, cancelForUser, options);

    const position = () => {
      if (cancelled || completedRequest.current === requestKey) return;
      const target = document.getElementById('hanzi-detail-start');
      const header = document.querySelector('.topbar');
      if (!target || !header || target.dataset.character !== expectedCharacter) {
        if (performance.now() - startedAt < 1800) frame = requestAnimationFrame(position);
        return;
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const targetTop = target.getBoundingClientRect().top;
      const gap = targetTop - headerBottom;
      if (Math.abs(gap - 6) > 1) {
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        selfScrolling = true;
        window.scrollTo(0, Math.max(0, window.scrollY + gap - 6));
        selfScrolling = false;
        root.style.scrollBehavior = previousBehavior;
        stableFrames = 0;
      } else if (Math.abs(gap - lastGap) <= 1) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }
      lastGap = gap;

      if (stableFrames >= 3) {
        completedRequest.current = requestKey;
        observer?.disconnect();
        window.visualViewport?.removeEventListener('resize', position);
        for (const event of ['wheel', 'touchstart', 'pointerdown'] as const) window.removeEventListener(event, cancelForUser, true);
        return;
      }
      if (performance.now() - startedAt < 1800) frame = requestAnimationFrame(position);
    };

    observer = workspace ? new ResizeObserver(() => {
      stableFrames = 0;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(position);
    }) : null;
    if (workspace) observer?.observe(workspace);
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', position);
    void document.fonts?.ready.then(() => { if (!cancelled) { stableFrames = 0; position(); } });
    frame = requestAnimationFrame(position);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      viewport?.removeEventListener('resize', position);
      for (const event of ['wheel', 'touchstart', 'pointerdown'] as const) window.removeEventListener(event, cancelForUser, true);
    };
  }, [active, expectedCharacter, requestKey]);

  return null;
}
