import { redirect } from 'next/navigation';
import { getCurrentUser, isAuthorizedAdmin, safeReturnPath } from '@/app/auth';
import { AdminLoginForm } from '@/components/AdminLoginForm';
import { LessonHeader, SiteShell } from '@/components/SiteShell';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const returnTo = safeReturnPath((await searchParams).returnTo || '/admin/community');
  if (await isAuthorizedAdmin(await getCurrentUser())) redirect(returnTo);
  return <SiteShell><main><LessonHeader eyebrow="ADMIN · ACCESO SEGURO" title="Administración de Míng" description="Inicia sesión con la cuenta de correo autorizada en Supabase Auth."/><div className="shell narrow"><AdminLoginForm returnTo={returnTo}/></div></main></SiteShell>;
}
