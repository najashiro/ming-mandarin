import 'server-only';

import { supabasePublishableKey, supabaseUrl } from './config';

export const ACCESS_COOKIE = 'ming_access_token';
export const REFRESH_COOKIE = 'ming_refresh_token';
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  is_anonymous?: boolean;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

export type SupabaseTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user: SupabaseAuthUser;
};

export async function authRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${supabaseUrl()}/auth/v1${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: supabasePublishableKey(),
      'content-type': 'application/json',
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => ({})) as T & { message?: string; msg?: string; error_description?: string };
  if (!response.ok) throw new Error(body.message ?? body.msg ?? body.error_description ?? 'No se pudo completar la autenticación.');
  return body;
}

export function cookieOptions(maxAge = AUTH_COOKIE_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
