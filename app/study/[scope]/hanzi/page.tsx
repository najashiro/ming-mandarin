import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { HanziLab } from '@/components/hanzi/HanziLab';
import { BookCharacterDetails } from '@/components/BookReference';
import studyReference from '@/data/lesson4-study-reference.json';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getHanziProgressMap } from '@/lib/server/persistence';
import type { HanziManifestEntry } from '@/lib/hanzi/types';
import manifest from '@/public/hanzi-data/manifest.json';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { hanziUnits } from '@/seed/characters';
import { hanziCatalog, hanziCatalogByGlyph } from '@/lib/hanzi/catalog';

export const dynamic = 'force-dynamic';

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
  const selected = query.character ? hanziCatalogByGlyph.get(query.character) : undefined;
  const supplemental = selected && !selected.writingRequired;
  const explicitlyUnavailable = Boolean(query.character && !selected);
  const progress = user ? await getHanziProgressMap(user) : {};
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
        {explicitlyUnavailable?<section className="panel hanzi-unavailable" role="status"><h2>Carácter aún no disponible</h2><p>El carácter solicitado es <strong className="font-hanzi">{query.character}</strong>.</p><p>No se seleccionó otro carácter como sustitución.</p></section>:<HanziLab
          key={`${rawScope}:${query.character??''}:${query.focus??''}:${query.tab??''}:${query.mode??''}`}
          characters={hanziCatalog}
          stages={hanziUnits}
          manifest={manifest as Record<string, HanziManifestEntry>}
          initialProgress={progress}
          defaultCharacter={data.characters[0]?.hanzi}
          focusGlyph={focusGlyph}
          route={`/study/${rawScope}/hanzi`}
          scope={rawScope}
        />}
        {data.definition.lessonIds.includes(4) && <div className="shell"><BookCharacterDetails characters={studyReference.bookReference.characterDetails}/></div>}
      </main>
    </SiteShell>
  );
}
