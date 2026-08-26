import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, AUTH_COOKIE_MAX_AGE, authRequest, cookieOptions, REFRESH_COOKIE, type SupabaseTokenResponse } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as { email?: string; password?: string };
    if (!email || !password) return Response.json({ error: 'Completa correo y contraseña.' }, { status: 400 });
    const tokens = await authRequest<SupabaseTokenResponse>('/token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, cookieOptions(tokens.expires_in ?? 3600));
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, cookieOptions(AUTH_COOKIE_MAX_AGE));
    response.headers.set('cache-control', 'private, no-store');
    return response;
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'No se pudo iniciar sesión.' }, { status: 401 });
  }
}
