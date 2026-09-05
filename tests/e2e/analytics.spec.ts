import { expect, test } from '@playwright/test';
import { ANALYTICS_IDLE_TIMEOUT_MS } from '../../lib/analytics/shared';

type CollectedEvent = { sessionId: string; visitorId: string; eventType: string; route: string; activeSeconds?: number };

test('el tracker conserva la sesión y cuenta solo tiempo visible con actividad reciente', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'La máquina de tiempo se valida una vez en Chromium.');
  const events: CollectedEvent[] = [];
  await page.route('**/api/analytics/collect', async (route) => {
    events.push(route.request().postDataJSON() as CollectedEvent);
    await route.fulfill({ status: 202, contentType: 'application/json', body: '{"recorded":true}' });
  });
  await page.clock.install({ time: new Date('2026-09-05T15:00:00-05:00') });
  await page.goto('/');
  await expect.poll(() => events.filter((event) => event.eventType === 'page_view').length).toBe(1);

  await page.clock.fastForward(30_000);
  await expect.poll(() => events.filter((event) => event.eventType === 'heartbeat').length).toBe(1);
  expect(events.find((event) => event.eventType === 'heartbeat')?.activeSeconds).toBe(30);

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hiddenCount = events.filter((event) => event.eventType === 'heartbeat').length;
  await page.clock.fastForward(90_000);
  expect(events.filter((event) => event.eventType === 'heartbeat')).toHaveLength(hiddenCount);

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(30_000);
  await expect.poll(() => events.filter((event) => event.eventType === 'heartbeat').length).toBe(hiddenCount + 1);

  await page.clock.fastForward(ANALYTICS_IDLE_TIMEOUT_MS + 60_000);
  const idleCount = events.filter((event) => event.eventType === 'heartbeat').length;
  await page.clock.fastForward(90_000);
  expect(events.filter((event) => event.eventType === 'heartbeat')).toHaveLength(idleCount);

  const firstPage = events.find((event) => event.eventType === 'page_view');
  await page.reload();
  await expect.poll(() => events.filter((event) => event.eventType === 'page_view').length).toBe(2);
  const secondPage = events.filter((event) => event.eventType === 'page_view')[1];
  expect(secondPage.sessionId).toBe(firstPage?.sessionId);
  expect(secondPage.visitorId).toBe(firstPage?.visitorId);
});
