import { NextResponse } from 'next/server';
import { isAuthorizedAdmin, type AppUser } from '@/app/auth';
import { ACCESS_COOKIE, AUTH_COOKIE_MAX_AGE, authRequest, cookieOptions, REFRESH_COOKIE, type SupabaseTokenResponse } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: unknown; password?: unknown };
    const email = String(body.email ?? '').trim().toLowerCase(); const password = String(body.password ?? '');
    if (!email || password.length < 8) return Response.json({ error: 'Ingresa el correo y la contraseña administrativa.' }, { status: 400 });
    const tokens = await authRequest<SupabaseTokenResponse>('/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
    const authUser: AppUser = { userId: tokens.user.id, email: tokens.user.email ?? null, fullName: typeof tokens.user.user_metadata?.full_name === 'string' ? tokens.user.user_metadata.full_name : null, displayName: typeof tokens.user.user_metadata?.full_name === 'string' ? tokens.user.user_metadata.full_name : email.split('@')[0], isAnonymous: false, role: typeof tokens.user.app_metadata?.role === 'string' ? tokens.user.app_metadata.role : null };
    if (!(await isAuthorizedAdmin(authUser))) return Response.json({ error: 'La cuenta no tiene permisos administrativos.' }, { status: 403 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, cookieOptions(tokens.expires_in ?? 3600));
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, cookieOptions(AUTH_COOKIE_MAX_AGE));
    response.headers.set('cache-control', 'private, no-store');
    return response;
  } catch {
    return Response.json({ error: 'No se pudo iniciar la sesión administrativa.' }, { status: 401 });
  }
}
