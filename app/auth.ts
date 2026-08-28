import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ACCESS_COOKIE, authRequest, type SupabaseAuthUser } from '@/lib/supabase/auth';

export type AppUser = {
  userId: string;
  displayName: string;
  email: string | null;
  fullName: string | null;
  isAnonymous: boolean;
  role: string | null;
};

export async function getCurrentUser(): Promise<AppUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  try {
    const user = await authRequest<SupabaseAuthUser>('/user', {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken}` },
    });
    const email = user.email ?? null;
    const isAnonymous = user.is_anonymous === true;
    if (!email && !isAnonymous) return null;
    const fullName = typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null;
    return {
      userId: user.id,
      email,
      fullName,
      isAnonymous,
      role: typeof user.app_metadata?.role === 'string' ? user.app_metadata.role : null,
      displayName: fullName ?? (email ? email.split('@')[0] : 'Estudiante'),
    };
  } catch {
    return null;
  }
}

export function isAdminUser(user: AppUser | null) {
  if (!user || user.isAnonymous) return false;
  if (user.role === 'admin' || user.role === 'moderator') return true;
  const allowed = (process.env.ADMIN_EMAILS ?? '').split(',').map((value) => value.trim().toLowerCase()).filter(Boolean);
  return Boolean(user.email && allowed.includes(user.email.toLowerCase()));
}

export async function requireAdmin(returnTo: string): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/admin/login?returnTo=${encodeURIComponent(safeReturnPath(returnTo))}`);
  if (!isAdminUser(user)) redirect('/');
  return user;
}

export async function requireUser(returnTo: string): Promise<AppUser> {
  const user = await getCurrentUser();
  if (user) return user;
  redirect(signInPath(returnTo));
}

export function signInPath(returnTo = '/') {
  return `/login?returnTo=${encodeURIComponent(safeReturnPath(returnTo))}`;
}

export function signOutPath(returnTo = '/') {
  return `/api/auth/signout?returnTo=${encodeURIComponent(safeReturnPath(returnTo))}`;
}

export function safeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  try {
    const url = new URL(value, 'https://ming.local');
    if (url.origin !== 'https://ming.local' || url.pathname.startsWith('/api/auth')) return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}
