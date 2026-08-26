import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, AUTH_COOKIE_MAX_AGE, authRequest, cookieOptions, REFRESH_COOKIE, type SupabaseTokenResponse } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  try {
    const { displayName } = await request.json() as { displayName?: string };
    const name = String(displayName ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
    if (name.length < 2) return Response.json({ error: 'Escribe un nombre de al menos 2 caracteres.' }, { status: 400 });

    const tokens = await authRequest<SupabaseTokenResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify({ data: { full_name: name } }),
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, cookieOptions(tokens.expires_in ?? 3600));
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, cookieOptions(AUTH_COOKIE_MAX_AGE));
    response.headers.set('cache-control', 'private, no-store');
    return response;
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'No se pudo preparar tu perfil.' }, { status: 400 });
  }
}
