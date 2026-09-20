import { NextRequest } from 'next/server';
import { supabasePublishableKey, supabaseUrl } from '@/lib/supabase/config';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { email?: unknown };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Escribe un correo válido.' }, { status: 400 });
  }

  try {
    const redirectTo = `${request.nextUrl.origin}/reset-password`;
    const response = await fetch(`${supabaseUrl()}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: 'POST',
      headers: { apikey: supabasePublishableKey(), 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });
    if (response.status === 429) {
      return Response.json({ error: 'Se alcanzó el límite temporal de correos. Espera un poco antes de volver a solicitarlo.' }, { status: 429 });
    }
    if (!response.ok) {
      return Response.json({ error: 'No se pudo solicitar el enlace. Inténtalo más tarde.' }, { status: 502 });
    }
    return Response.json({ ok: true }, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return Response.json({ error: 'No se pudo conectar con el servicio de recuperación.' }, { status: 502 });
  }
}
