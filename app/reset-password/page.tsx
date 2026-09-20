import { ResetPasswordForm } from '@/components/ResetPasswordForm';
import { LessonHeader, SiteShell } from '@/components/SiteShell';

export default function ResetPasswordPage() {
  return <SiteShell><main><LessonHeader eyebrow="ACCESO ADMINISTRATIVO" title="Crea una nueva contraseña" description="Elige una contraseña segura para volver a entrar a la administración de Míng."/><div className="shell narrow"><ResetPasswordForm/></div></main></SiteShell>;
}
