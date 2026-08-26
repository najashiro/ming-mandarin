import { redirect } from 'next/navigation';
import { getCurrentUser, safeReturnPath } from '@/app/auth';
import { LoginForm } from '@/components/LoginForm';
import { LessonHeader, SiteShell } from '@/components/SiteShell';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const params = await searchParams;
  const returnTo = safeReturnPath(params.returnTo);
  if (await getCurrentUser()) redirect(returnTo);
  return <SiteShell><main><LessonHeader eyebrow="账号 · CUENTA" title="Guarda tu aprendizaje" description="Crea una cuenta con correo o inicia sesión para sincronizar progreso, errores, examen y ranking."/><div className="shell narrow"><LoginForm returnTo={returnTo}/></div></main></SiteShell>;
}
