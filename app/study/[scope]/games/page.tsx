import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { Arcade } from '@/components/Arcade';
import { CurriculumNav } from '@/components/CurriculumNav';
import { HanziUnitNav } from '@/components/hanzi/HanziUnitNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getHanziProgressMap } from '@/lib/server/persistence';
import { recommendHanziCharacters } from '@/lib/hanzi/progress';
import { getListeningEntriesForScope } from '@/lib/lesson-content';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { isHanziUnitId } from '@/seed/characters';

export default async function ScopeGamesPage({params,searchParams}:{params:Promise<{scope:string}>;searchParams:Promise<{unit?:string;game?:string}>}) {
  const [{scope:rawScope},query] = await Promise.all([params,searchParams]);
  if (!isCurriculumScope(rawScope)) notFound();
  const data = getCurriculum(rawScope);
  const activeUnit = query.unit && isHanziUnitId(query.unit) && data.stages.some((unit) => unit.id === query.unit) ? query.unit : undefined;
  const unitCharacters = activeUnit ? data.characters.filter((item) => item.appearsIn.includes(activeUnit)) : data.characters;
  const user = await getCurrentUser();
  const progress = user ? await getHanziProgressMap(user) : {};
  const characters = recommendHanziCharacters(unitCharacters,progress,unitCharacters.length);
  return <SiteShell><main>
    <LessonHeader eyebrow={`${data.definition.shortLabel} · 游戏`} title="Juegos Míng" description="Convierte lo aprendido en mandarín activo."/>
    <CurriculumNav scope={rawScope} section="games"/>
    <HanziUnitNav basePath={`/study/${rawScope}/games`} units={data.stages} active={activeUnit}/>
    <Arcade scope={rawScope} playerName={user?.displayName??'Estudiante'} canCompete={Boolean(user)} initialGame={query.game==='reto-mixto'?'reto-mixto':undefined} exercises={data.exercises} hanziCharacters={characters} listeningEntries={getListeningEntriesForScope(rawScope)}/>
  </main></SiteShell>;
}
