import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, cookieOptions, REFRESH_COOKIE } from '@/lib/supabase/auth';
import { safeReturnPath } from '@/app/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL(safeReturnPath(url.searchParams.get('returnTo')), url.origin));
  response.cookies.set(ACCESS_COOKIE, '', cookieOptions(0));
  response.cookies.set(REFRESH_COOKIE, '', cookieOptions(0));
  return response;
}
