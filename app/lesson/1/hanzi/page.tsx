import { getCurrentUser } from '@/app/auth';
import { HanziLab } from '@/components/hanzi/HanziLab';
import { LessonHeader, SiteShell } from '@/components/SiteShell';
import manifest from '@/public/hanzi-data/manifest.json';
import { getHanziProgressMap } from '@/lib/server/persistence';
import type { HanziManifestEntry } from '@/lib/hanzi/types';
import { canonicalCharacters, hanziUnits } from '@/seed/characters';
import { allCurriculumCharacters } from '@/seed/curriculum';
import { CommunityContextProvider } from '@/components/community/CommunityProvider';

export const dynamic = 'force-dynamic';

const validTabs = ['Aprender', 'Palabras y frases', 'Trazos', 'Practicar'] as const;
type HanziTab = typeof validTabs[number];

export default async function HanziPage({ searchParams }: { searchParams: Promise<{ character?: string; tab?: string; mode?: string }> }) {
  const [user, query] = await Promise.all([getCurrentUser(), searchParams]);
  const initialProgress = user ? await getHanziProgressMap(user) : {};
  const requestedTab = query.mode === 'practice' ? 'Practicar' : query.tab === 'Componentes' ? 'Palabras y frases' : query.tab;
  const initialTab: HanziTab = validTabs.includes(requestedTab as HanziTab) ? requestedTab as HanziTab : 'Aprender';
  const initialCharacter = query.character && canonicalCharacters.some((item) => item.hanzi === query.character) ? query.character : '好';

  return <SiteShell><CommunityContextProvider context={{ lessonId: 1, section: 'hanzi', concept: initialCharacter, skill: initialTab === 'Trazos' ? 'stroke-order' : initialTab === 'Practicar' ? 'hanzi-writing' : 'hanzi-recognition', route: `/lesson/1/hanzi?character=${encodeURIComponent(initialCharacter)}` }}><main>
    <LessonHeader
      eyebrow="汉字 · LABORATORIO REUTILIZABLE"
      title="Hanzi: forma, trazos y práctica"
      description="Aprende con datos técnicos locales, observa el orden real y practica con mouse, touch o stylus. El sistema mide reconocimiento, orden y escritura por separado."
    />
    <HanziLab
      characters={allCurriculumCharacters.map(({id,hanzi,pinyin,meaning,strokeCount,writingRequired,words,introducedIn,appearsIn})=>({id,hanzi,pinyin,meaning,strokeCount,radical:'',components:[],componentsAudited:false,writingRequired,words,introducedIn,appearsIn}))}
      canonicalHanzi={canonicalCharacters.map((character) => character.hanzi)}
      stages={hanziUnits}
      manifest={manifest as Record<string, HanziManifestEntry>}
      initialProgress={initialProgress}
      initialCharacter={initialCharacter}
      initialTab={initialTab}
      scopeLabel="Lecciones 1–3"
    />
  </main></CommunityContextProvider></SiteShell>;
}
