import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_COOKIE, AUTH_COOKIE_MAX_AGE, authRequest, cookieOptions, REFRESH_COOKIE, type SupabaseTokenResponse } from './auth';

export async function updateAuthSession(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!accessToken || !refreshToken) return NextResponse.next({ request });

  try {
    await authRequest('/user', { method: 'GET', headers: { authorization: `Bearer ${accessToken}` } });
    return NextResponse.next({ request });
  } catch {
    try {
      const tokens = await authRequest<SupabaseTokenResponse>('/token?grant_type=refresh_token', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      request.cookies.set(ACCESS_COOKIE, tokens.access_token);
      request.cookies.set(REFRESH_COOKIE, tokens.refresh_token);
      const response = NextResponse.next({ request });
      response.cookies.set(ACCESS_COOKIE, tokens.access_token, cookieOptions(tokens.expires_in ?? 3600));
      response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, cookieOptions(AUTH_COOKIE_MAX_AGE));
      response.headers.set('cache-control', 'private, no-store');
      return response;
    } catch {
      const response = NextResponse.next({ request });
      response.cookies.set(ACCESS_COOKIE, '', cookieOptions(0));
      response.cookies.set(REFRESH_COOKIE, '', cookieOptions(0));
      return response;
    }
  }
}
