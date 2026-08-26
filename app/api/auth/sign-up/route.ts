import { ACCESS_COOKIE, AUTH_COOKIE_MAX_AGE, authRequest, cookieOptions, REFRESH_COOKIE, type SupabaseTokenResponse } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as { email?: string; password?: string };
    if (!email || !password || password.length < 8) return Response.json({ error: 'Usa un correo válido y una contraseña de al menos 8 caracteres.' }, { status: 400 });
    const result = await authRequest<Partial<SupabaseTokenResponse> & { user?: { identities?: unknown[] } }>('/signup', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    if (!result.access_token || !result.refresh_token) {
      return Response.json({ ok: true, confirmationRequired: true });
    }
    const response = NextResponse.json({ ok: true, confirmationRequired: false });
    response.cookies.set(ACCESS_COOKIE, result.access_token, cookieOptions(result.expires_in ?? 3600));
    response.cookies.set(REFRESH_COOKIE, result.refresh_token, cookieOptions(AUTH_COOKIE_MAX_AGE));
    return response;
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'No se pudo crear la cuenta.' }, { status: 400 });
  }
}
