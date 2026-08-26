import 'server-only';

import { supabaseSecretKey, supabaseUrl } from './config';

type RestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  prefer?: string;
  headers?: Record<string, string>;
};

export async function supabaseRest<T>(path: string, options: RestOptions = {}): Promise<T> {
  const secret = supabaseSecretKey();
  const response = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
    method: options.method ?? 'GET',
    cache: 'no-store',
    headers: {
      apikey: secret,
      authorization: `Bearer ${secret}`,
      'content-type': 'application/json',
      ...(options.prefer ? { prefer: options.prefer } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as { message?: string; details?: string };
    throw new Error(error.message ?? error.details ?? `Supabase respondió ${response.status}.`);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function eq(value: string | number | boolean) {
  return `eq.${encodeURIComponent(String(value))}`;
}

export function lte(value: string | number) {
  return `lte.${encodeURIComponent(String(value))}`;
}
