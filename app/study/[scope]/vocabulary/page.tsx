import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { SiteShell } from '@/components/SiteShell';
import { ActiveVocabulary } from '@/components/vocabulary/ActiveVocabulary';
import { isCurriculumScope } from '@/seed/curriculum';
import { publishedVocabularyMedia } from '@/lib/server/vocabulary-images';
export default async function ScopeVocabularyPage({ params, searchParams }: { params: Promise<{ scope: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const query = await searchParams;
  if (query.mode === 'mix') {
    redirect(`/study/${scope}/games/vocabulary-mix`);
  }
  const [user, media] = await Promise.all([getCurrentUser(), publishedVocabularyMedia()]);
  return <SiteShell><main><Suspense fallback={<p className="shell">Cargando vocabulario…</p>}><ActiveVocabulary key={`${scope}:${user?.userId ?? 'guest'}`} scope={scope} userId={user?.userId ?? 'guest'} media={media}/></Suspense></main></SiteShell>;
}
