import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { SiteShell } from '@/components/SiteShell';
import { ActiveVocabulary } from '@/components/vocabulary/ActiveVocabulary';
import { isCurriculumScope } from '@/seed/curriculum';
import { publishedVocabularyMedia } from '@/lib/server/vocabulary-images';

export default async function VocabularyMixGamePage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const lesson = scope === 'l1-l2' ? 'l1-l2-l3' : scope;
  const [user, media] = await Promise.all([getCurrentUser(), publishedVocabularyMedia()]);
  return <SiteShell><main><Suspense fallback={<p className="shell">Cargando Vocabulario Mix…</p>}>
    <ActiveVocabulary key={`${scope}:${user?.userId ?? 'guest'}`} scope={lesson} userId={user?.userId ?? 'guest'} mode="mix" media={media}/>
  </Suspense></main></SiteShell>;
}
