import Link from 'next/link';
import { requireAdmin } from '@/app/auth';
import { AdminCommunity } from '@/components/community/AdminCommunity';
import { LessonHeader, SiteShell } from '@/components/SiteShell';

export default async function AdminCommunityPage() {
  await requireAdmin('/admin/community');
  return <SiteShell><main><LessonHeader eyebrow="COMUNIDAD · MODERACIÓN" title="Preguntas, respuestas y reportes" description="Modera sin borrar el historial: oculta, restaura, elimina lógicamente o bloquea únicamente la publicación comunitaria."/><nav className="admin-nav shell" aria-label="Administración"><Link href="/admin/content">Fuentes</Link><Link className="selected" href="/admin/community">Comunidad</Link></nav><AdminCommunity/></main></SiteShell>;
}
