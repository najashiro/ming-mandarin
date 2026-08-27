import { getCurrentUser } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { Arcade } from '@/components/Arcade';
import { recommendHanziCharacters } from '@/lib/hanzi/progress';
import { getHanziProgressMap } from '@/lib/server/persistence';
import { exercises } from '@/seed/exercises';
import { lesson1Characters } from '@/seed/characters';

export default async function GamesPage() {
  const user = await getCurrentUser();
  const progress = user ? await getHanziProgressMap(user) : {};
  const hanziCharacters = recommendHanziCharacters(lesson1Characters, progress, lesson1Characters.length);
  return <SiteShell><main><LessonHeader eyebrow="游戏中心 · ARCADE" title="28 formas de practicar" description="Cada tarjeta abre un juego real usando el corpus auditado; no hay contenido de otras lecciones." /><Arcade exercises={exercises} hanziCharacters={hanziCharacters} /></main></SiteShell>;
}
