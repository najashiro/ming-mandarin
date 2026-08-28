import { expect, test, type Page } from '@playwright/test';
import type { CommunityReply, CommunityThread } from '../../lib/community/types';

function communityFixture(page: Page) {
  const state: { threads: CommunityThread[]; replies: CommunityReply[]; reported: boolean } = { threads: [], replies: [], reported: false };
  void page.route('**/api/community/**', async (route) => {
    const request = route.request(); const url = new URL(request.url()); const path = url.pathname; const method = request.method();
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (path.endsWith('/config')) return json({ enabled: true, realtimeUrl: 'https://example.supabase.co', publishableKey: 'public-test-key' });
    if (path.endsWith('/me')) return json({ authenticated: true, displayName: 'Ana', canPost: true, blockedUntil: null });
    if (path.endsWith('/reports') && method === 'POST') { state.reported = true; return json({ ok: true }, 201); }
    if (/\/replies\/[^/]+\/helpful$/.test(path) && method === 'POST') { const reply = state.replies.find((item) => path.includes(item.id)); if (reply) { reply.userHelpful = !reply.userHelpful; reply.helpfulCount += reply.userHelpful ? 1 : -1; } return json({ helpful: reply?.userHelpful }); }
    if (/\/replies\/[^/]+$/.test(path) && method === 'PATCH') { const reply = state.replies.find((item) => path.endsWith(item.id)); if (reply) { reply.body = String((request.postDataJSON() as { body: string }).body); reply.updatedAt = new Date().toISOString(); } return json({ ok: true }); }
    const repliesMatch = path.match(/\/threads\/([^/]+)\/replies$/);
    if (repliesMatch) {
      if (method === 'GET') return json(state.replies.filter((item) => item.threadId === repliesMatch[1]));
      const body = request.postDataJSON() as { body: string }; state.replies.push({ id: '40000000-0000-4000-8000-000000000001', threadId: repliesMatch[1], body: body.body, authorDisplayName: 'Ana', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), helpfulCount: 0, userHelpful: false, canEdit: true }); return json({ id: state.replies.at(-1)!.id }, 201);
    }
    const threadMatch = path.match(/\/threads\/([^/]+)$/);
    if (threadMatch) return json(state.threads.find((item) => item.id === threadMatch[1]) ?? { error: 'No encontrada' }, state.threads.some((item) => item.id === threadMatch[1]) ? 200 : 404);
    if (path.endsWith('/threads') && method === 'POST') {
      const body = request.postDataJSON() as Partial<CommunityThread>;
      const thread: CommunityThread = { id: '20000000-0000-4000-8000-000000000001', lessonId: body.lessonId ?? 1, section: body.section ?? 'grammar', concept: body.concept, skill: body.skill, route: body.route ?? '/lesson/1/grammar', title: body.title ?? '', body: body.body ?? '', authorDisplayName: 'Ana', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date().toISOString(), replyCount: 0, helpfulCount: 0, canEdit: true };
      state.threads = [thread]; return json(thread, 201);
    }
    if (path.endsWith('/threads') && method === 'GET') return json(state.threads);
    return json({ error: 'Ruta mock no prevista' }, 404);
  });
  return state;
}

test('pregunta contextual de Gramática persiste al cerrar y reabrir', async ({ page }) => {
  const fixture = communityFixture(page);
  await page.goto('/lesson/1/grammar');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const card = page.locator('article').filter({ hasText: '很 · Predicado adjetival' });
  await card.getByRole('button', { name: 'Preguntar sobre esta regla' }).click();
  await expect(page.getByRole('dialog')).toContainText('Lección 1 · Gramática · 很');
  await page.getByRole('button', { name: 'Haz una pregunta' }).click();
  await page.getByLabel('Título').fill('¿Por qué usamos 很 con 好?');
  await page.getByLabel('Pregunta').fill('Quiero entender qué función cumple 很 en 我很好.');
  await page.getByRole('button', { name: 'Publicar pregunta' }).click();
  await expect(page.getByRole('dialog')).toContainText('¿Por qué usamos 很 con 好?');
  await page.getByRole('button', { name: 'Cerrar Comunidad' }).click();
  await card.getByRole('button', { name: 'Preguntar sobre esta regla' }).click();
  await page.getByRole('button', { name: /¿Por qué usamos 很 con 好?/ }).click();
  fixture.replies.push({ id: '40000000-0000-4000-8000-000000000002', threadId: fixture.threads[0].id, body: 'En una oración adjetival, 很 conecta el sujeto y el adjetivo sin significar siempre “muy”.', authorDisplayName: 'Carlos', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), helpfulCount: 0, userHelpful: false, canEdit: false });
  await page.getByRole('button', { name: 'Actualizar' }).click();
  await expect(page.getByRole('dialog')).toContainText('Carlos');
  await page.getByRole('button', { name: '👍 Me ayudó · 0' }).click();
  await expect(page.getByRole('button', { name: '👍 Me ayudó · 1' })).toBeVisible();
  await page.getByRole('button', { name: '⋯ Reportar' }).first().click();
  await page.getByRole('button', { name: 'Enviar' }).click();
  expect(fixture.reported).toBe(true);
});

test('Hanzi abre la Comunidad con carácter y skill actuales sin salir de la página', async ({ page }, testInfo) => {
  communityFixture(page);
  await page.goto('/lesson/1/hanzi?character=好&tab=Trazos');
  await page.getByRole('button', { name: 'Preguntar sobre 好' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Lección 1 · Hanzi · 好 · Orden de trazos');
  await expect(page).toHaveURL(/\/lesson\/1\/hanzi/);
  if (testInfo.project.name === 'mobile') {
    const box = await dialog.boundingBox();
    expect(box?.width).toBeGreaterThan(350);
    expect(box?.y).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Hanzi: forma, trazos y práctica' })).toBeVisible();
});
