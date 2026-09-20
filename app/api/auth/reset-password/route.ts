import { NextResponse } from 'next/server';
import { authRequest } from '@/lib/supabase/auth';

function readText(value: unknown, maximum: number) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { accessToken?: unknown; password?: unknown };
    const accessToken = readText(body.accessToken, 4000);
    const password = String(body.password ?? '');
    if (!accessToken || password.length < 12) {
      return Response.json({ error: 'Usa una contraseña de al menos 12 caracteres.' }, { status: 400 });
    }

    await authRequest('/user', {
      method: 'PUT',
      headers: { authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ password }),
    });
    return NextResponse.json({ ok: true }, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return Response.json({ error: 'El enlace de recuperación ya no es válido. Solicita uno nuevo.' }, { status: 401 });
  }
}
