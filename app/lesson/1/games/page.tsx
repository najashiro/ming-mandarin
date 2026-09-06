import { getCurrentUser } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { Arcade } from '@/components/Arcade';
import { ARCADE_GAME_COUNT } from '@/data/arcade-games';
import { recommendHanziCharacters } from '@/lib/hanzi/progress';
import { getHanziProgressMap } from '@/lib/server/persistence';
import { hanziUnits, isHanziUnitId, lesson1Characters } from '@/seed/characters';
import { CommunityButton, CommunityContextProvider } from '@/components/community/CommunityProvider';
import { HanziUnitNav } from '@/components/hanzi/HanziUnitNav';
import { getListeningEntriesForLessons } from '@/lib/lesson-content';
import { exercises } from '@/seed/exercises';

export default async function GamesPage({searchParams}:{searchParams:Promise<{unit?:string}>}) {
  const query = await searchParams;
  const units = hanziUnits.filter((unit) => unit.lesson === 1);
  const activeUnit = query.unit && isHanziUnitId(query.unit) && units.some((unit) => unit.id === query.unit) ? query.unit : undefined;
  const pool = activeUnit ? lesson1Characters.filter((item) => item.appearsIn.includes(activeUnit)) : lesson1Characters;
  const user = await getCurrentUser();
  const progress = user ? await getHanziProgressMap(user) : {};
  const hanziCharacters = recommendHanziCharacters(pool,progress,pool.length);
  return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'games',route:'/lesson/1/games'}}><main>
    <LessonHeader eyebrow="游戏中心 · ARCADE" title={`${ARCADE_GAME_COUNT} formas de practicar`} description="Cada juego Hanzi usa el Texto o acumulado seleccionado, sin duplicar caracteres reutilizados."/>
    <div className="community-page-action shell"><CommunityButton label="Preguntar sobre los juegos"/></div>
    <HanziUnitNav basePath="/lesson/1/games" units={units} active={activeUnit}/>
    <Arcade exercises={exercises} hanziCharacters={hanziCharacters} listeningEntries={getListeningEntriesForLessons([1])}/>
  </main></CommunityContextProvider></SiteShell>;
}
