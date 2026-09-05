'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { setCurrentAnalyticsRoute, touchAnalyticsSession, trackAnalyticsEvent, trackAnalyticsHeartbeat } from '@/lib/analytics/client';
import { ANALYTICS_HEARTBEAT_MS, ANALYTICS_IDLE_TIMEOUT_MS, effectiveElapsedSeconds } from '@/lib/analytics/shared';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    setCurrentAnalyticsRoute(pathname);
    trackAnalyticsEvent('page_view');
  }, [pathname]);

  useEffect(() => {
    let lastInteractionAt = Date.now();
    let lastTickAt = lastInteractionAt;
    let lastSessionTouchAt = lastInteractionAt;
    let visible = document.visibilityState === 'visible';

    function flush(beacon = false) {
      const now = Date.now();
      const seconds = effectiveElapsedSeconds({ from: lastTickAt, to: now, lastInteractionAt, visible });
      lastTickAt = now;
      if (seconds) trackAnalyticsHeartbeat(seconds, beacon);
    }

    function interact() {
      const now = Date.now();
      if (now - lastInteractionAt > ANALYTICS_IDLE_TIMEOUT_MS) lastTickAt = now;
      lastInteractionAt = now;
      if (now - lastSessionTouchAt >= 15_000) {
        lastSessionTouchAt = now;
        touchAnalyticsSession();
      }
    }

    function visibilityChanged() {
      if (document.visibilityState === 'hidden') {
        flush(true);
        visible = false;
      } else {
        visible = true;
        lastInteractionAt = Date.now();
        lastTickAt = lastInteractionAt;
        lastSessionTouchAt = lastInteractionAt;
        touchAnalyticsSession();
      }
    }

    function pageHidden() {
      flush(true);
    }

    const interactionEvents: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    interactionEvents.forEach((name) => window.addEventListener(name, interact, { passive: true }));
    document.addEventListener('visibilitychange', visibilityChanged);
    window.addEventListener('pagehide', pageHidden);
    const timer = window.setInterval(() => flush(), ANALYTICS_HEARTBEAT_MS);

    return () => {
      flush(true);
      window.clearInterval(timer);
      interactionEvents.forEach((name) => window.removeEventListener(name, interact));
      document.removeEventListener('visibilitychange', visibilityChanged);
      window.removeEventListener('pagehide', pageHidden);
    };
  }, []);

  return null;
}
