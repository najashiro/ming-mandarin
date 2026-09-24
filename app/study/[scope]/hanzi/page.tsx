import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { CurriculumNav } from '@/components/CurriculumNav';
import { HanziLab } from '@/components/hanzi/HanziLab';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getHanziProgressMap } from '@/lib/server/persistence';
import type { HanziManifestEntry } from '@/lib/hanzi/types';
import manifest from '@/public/hanzi-data/manifest.json';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { canonicalCharacters } from '@/seed/characters';
import { supplementalHanziByGlyph } from '@/data/supplemental-hanzi';
import { resolveHanziGlyph } from '@/lib/hanzi/navigation';

export const dynamic = 'force-dynamic';

const tabs = ['Aprender', 'Palabras y frases', 'Trazos', 'Practicar'] as const;

export default async function ScopeHanziPage({
  params,
  searchParams,
}: {
  params: Promise<{ scope: string }>;
  searchParams: Promise<{ character?: string; tab?: string; mode?: string; focus?: string;content?:string }>;
}) {
  const [{ scope: rawScope }, query, user] = await Promise.all([params, searchParams, getCurrentUser()]);
  if (!isCurriculumScope(rawScope)) notFound();

  const data = getCurriculum(rawScope);
  const requestedResolution=query.character?resolveHanziGlyph(query.character):null;
  const supplemental=query.content==='supplementary'&&requestedResolution?.kind==='supplementary'?supplementalHanziByGlyph.get(query.character!):undefined;
  const explicitlyUnavailable=Boolean(query.character&&!supplemental&&!data.characters.some(item=>item.hanzi===query.character));
  const progress = user&&!supplemental ? await getHanziProgressMap(user) : {};
  const requested = query.mode === 'practice' ? 'Practicar' : query.tab === 'Componentes' ? 'Palabras y frases' : query.tab;
  const tab = tabs.includes(requested as (typeof tabs)[number])
    ? (requested as (typeof tabs)[number])
    : 'Aprender';
  const initial = supplemental?.hanzi??(data.characters.some((item) => item.hanzi === query.character)
    ? query.character
    : data.characters[0]?.hanzi);
  const characters=supplemental?[{...supplemental,radical:'',components:[],writingRequired:false,componentsAudited:false,words:[],introducedIn:null,appearsIn:[]}]:data.characters.map(({id,hanzi,pinyin,meaning,strokeCount,writingRequired,words,introducedIn,appearsIn})=>({id,hanzi,pinyin,meaning,strokeCount,radical:'',components:[],componentsAudited:false,writingRequired,words,introducedIn,appearsIn}));

  // Preserve direct character links while allowing explicit tabs to control the view.
  const focusGlyph = query.focus === 'glyph'
    || Boolean(query.character && !query.tab && !query.mode);

  return (
    <SiteShell>
      <main>
        <LessonHeader
          eyebrow={supplemental?'Consulta directa · 汉字':`${data.definition.shortLabel} · 汉字`}
          title="Hanzi: forma, sonido y trazos"
          description="Reconocimiento, pronunciación estática, orden de trazos y escritura táctil."
        />
        {!supplemental&&<CurriculumNav scope={rawScope} section="hanzi" />}
        {explicitlyUnavailable?<section className="panel hanzi-unavailable" role="status"><h2>Carácter aún no disponible</h2><p>El carácter solicitado es <strong className="font-hanzi">{query.character}</strong>.</p><p>No se seleccionó otro carácter como sustitución.</p></section>:<HanziLab
          characters={characters}
          canonicalHanzi={canonicalCharacters.map((character) => character.hanzi)}
          stages={data.stages}
          manifest={manifest as Record<string, HanziManifestEntry>}
          initialProgress={progress}
          initialCharacter={initial}
          initialTab={tab}
          focusGlyph={focusGlyph}
          scopeLabel={data.definition.label}
          route={`/study/${rawScope}/hanzi`}
          tracking={supplemental?'supplementary':'course'}
        />}
      </main>
    </SiteShell>
  );
}
