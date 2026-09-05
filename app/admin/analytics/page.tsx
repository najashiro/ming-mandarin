import { requireAdmin } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { AdminNav } from '@/components/admin/AdminNav';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { getAnalyticsDashboard } from '@/lib/server/analytics';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const [, query] = await Promise.all([requireAdmin('/admin/analytics'), searchParams]);
  const days = query.range === '1' || query.range === '30' ? Number(query.range) as 1 | 30 : 7;
  const data = await getAnalyticsDashboard(days);
  return <SiteShell><main>
    <LessonHeader eyebrow="ADMIN · ANALÍTICA" title="Uso y aprendizaje" description="Métricas privadas de actividad efectiva, práctica y avance. Ningún dato de este panel aparece en las pantallas del estudiante."/>
    <AdminNav active="analytics"/>
    <AnalyticsDashboard data={data} days={days}/>
  </main></SiteShell>;
}
