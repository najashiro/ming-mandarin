import type { NextRequest } from 'next/server';
import { updateAuthSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateAuthSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg|og.png|offline.html|sw.js|manifest.webmanifest).*)'],
};
