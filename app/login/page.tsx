import { redirect } from 'next/navigation';
import { getCurrentUser, safeReturnPath } from '@/app/auth';
import { LoginForm } from '@/components/LoginForm';
import { LessonHeader, SiteShell } from '@/components/SiteShell';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const params = await searchParams;
  const returnTo = safeReturnPath(params.returnTo);
  if (await getCurrentUser()) redirect(returnTo);
  return <SiteShell><main><LessonHeader eyebrow="名字 · TU PERFIL" title="¿Cómo quieres que te llamemos?" description="Elige un nombre una sola vez. Míng conservará tu progreso en este navegador sin pedir correo ni contraseña."/><div className="shell narrow"><LoginForm returnTo={returnTo}/></div></main></SiteShell>;
}
