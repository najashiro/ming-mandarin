import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { SiteShell } from '@/components/SiteShell';
import { ActiveVocabulary } from '@/components/vocabulary/ActiveVocabulary';
import { isCurriculumScope } from '@/seed/curriculum';
export default async function ScopeVocabularyPage({ params, searchParams }: { params: Promise<{ scope: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const lesson = scope === 'l1-l2' ? 'l1-l2-l3' : scope;
  const query = await searchParams;
  if (query.mode === 'mix') {
    const next = new URLSearchParams();
    for (const key of ['q', 'favorites']) if (typeof query[key] === 'string') next.set(key, query[key]);
    redirect(`/study/${lesson}/games/vocabulary-mix${next.size ? `?${next}` : ''}`);
  }
  const user = await getCurrentUser();
  return <SiteShell><main><Suspense fallback={<p className="shell">Cargando vocabulario…</p>}><ActiveVocabulary key={`${scope}:${user?.userId ?? 'guest'}`} scope={lesson} userId={user?.userId ?? 'guest'}/></Suspense></main></SiteShell>;
}
