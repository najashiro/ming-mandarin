import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { SiteShell } from '@/components/SiteShell';
import { ActiveVocabulary } from '@/components/vocabulary/ActiveVocabulary';
import { isCurriculumScope } from '@/seed/curriculum';
export default async function ScopeVocabularyPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const lesson = scope === 'l1-l2-l3' ? 'l3' : scope === 'l1-l2' ? 'l2' : scope;
  const user = await getCurrentUser();
  return <SiteShell><main><Suspense fallback={<p className="shell">Cargando vocabulario…</p>}><ActiveVocabulary key={`${scope}:${user?.userId ?? 'guest'}`} scope={lesson} userId={user?.userId ?? 'guest'}/></Suspense></main></SiteShell>;
}
