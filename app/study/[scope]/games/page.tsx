import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { Arcade } from '@/components/Arcade';
import { ARCADE_GAME_COUNT } from '@/data/arcade-games';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getHanziProgressMap } from '@/lib/server/persistence';
import { recommendHanziCharacters } from '@/lib/hanzi/progress';
import { getListeningEntriesForScope } from '@/lib/lesson-content';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export default async function ScopeGamesPage({params}:{params:Promise<{scope:string}>}){const {scope:rawScope}=await params;if(!isCurriculumScope(rawScope))notFound();const data=getCurriculum(rawScope);const user=await getCurrentUser();const progress=user?await getHanziProgressMap(user):{};const characters=recommendHanziCharacters(data.characters,progress,data.characters.length);return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 游戏`} title={`${ARCADE_GAME_COUNT} formas de practicar`} description="Los juegos respetan el alcance seleccionado e incluyen Dictado Hanzi."/><CurriculumNav scope={rawScope} section="games"/><Arcade exercises={data.exercises} hanziCharacters={characters} listeningEntries={getListeningEntriesForScope(rawScope)}/></main></SiteShell>;}
