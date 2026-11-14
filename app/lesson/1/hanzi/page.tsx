import { getCurrentUser } from '@/app/auth';
import { HanziLab } from '@/components/hanzi/HanziLab';
import { LessonHeader, SiteShell } from '@/components/SiteShell';
import manifest from '@/public/hanzi-data/manifest.json';
import { getHanziProgressMap } from '@/lib/server/persistence';
import type { HanziManifestEntry } from '@/lib/hanzi/types';
import { resolveHanziTab } from '@/lib/hanzi/tabs';
import { hanziUnits } from '@/seed/characters';
import { hanziCatalog, hanziCatalogByGlyph } from '@/lib/hanzi/catalog';
import { CommunityContextProvider } from '@/components/community/CommunityProvider';

export const dynamic = 'force-dynamic';

export default async function HanziPage({ searchParams }: { searchParams: Promise<{ character?: string; tab?: string; mode?: string }> }) {
  const [user, query] = await Promise.all([getCurrentUser(), searchParams]);
  const initialProgress = user ? await getHanziProgressMap(user) : {};
  const initialTab = resolveHanziTab(query.tab, query.mode);
  const initialCharacter = query.character && hanziCatalogByGlyph.has(query.character) ? query.character : '好';

  return <SiteShell><CommunityContextProvider context={{ lessonId: 1, section: 'hanzi', concept: initialCharacter, skill: initialTab === 'Trazos' ? 'stroke-order' : initialTab === 'Practicar' ? 'hanzi-writing' : 'hanzi-recognition', route: `/lesson/1/hanzi?character=${encodeURIComponent(initialCharacter)}` }}><main>
    <LessonHeader
      eyebrow="汉字 · LABORATORIO REUTILIZABLE"
      title="Hanzi: forma, trazos y práctica"
      description="Aprende con datos técnicos locales, observa el orden real y practica con mouse, touch o stylus. El sistema mide reconocimiento, orden y escritura por separado."
    />
    <HanziLab
      key={`${initialCharacter}:${initialTab}`}
      characters={hanziCatalog}
      stages={hanziUnits}
      manifest={manifest as Record<string, HanziManifestEntry>}
      initialProgress={initialProgress}
      scope="l1"
    />
  </main></CommunityContextProvider></SiteShell>;
}
