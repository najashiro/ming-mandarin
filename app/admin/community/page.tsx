import { requireAdmin } from '@/app/auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminCommunity } from '@/components/community/AdminCommunity';
import { LessonHeader, SiteShell } from '@/components/SiteShell';

export default async function AdminCommunityPage() {
  await requireAdmin('/admin/community');
  return <SiteShell><main><LessonHeader eyebrow="COMUNIDAD · MODERACIÓN" title="Preguntas, respuestas y reportes" description="Modera sin borrar el historial: oculta, restaura, elimina lógicamente o bloquea únicamente la publicación comunitaria."/><AdminNav active="community"/><AdminCommunity/></main></SiteShell>;
}
