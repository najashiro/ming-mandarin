import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { WorkbookGames } from '@/components/games/workbook/WorkbookGames';
import { getWorkbookQuestions, type WorkbookMode } from '@/lib/workbook-games';
import { getStudyScopeLabel } from '@/lib/study-options';
import { isCurriculumScope } from '@/seed/curriculum';

export const metadata: Metadata = {
  title: 'Juegos del cuaderno · Míng',
  description: 'Ordena frases, completa ideas y une conversaciones. Juegos de mandarín basados en los libros de ejercicios, con pistas y repaso de errores.',
};

export default async function WorkbookGamesPage({ params, searchParams }: {
  params: Promise<{ scope: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const [{ scope }, query] = await Promise.all([params, searchParams]);
  if (!isCurriculumScope(scope)) notFound();
  const mode: WorkbookMode | undefined = query.mode === 'order' || query.mode === 'complete' || query.mode === 'dialogue' ? query.mode : undefined;
  return <SiteShell><main>
    <LessonHeader eyebrow={`${getStudyScopeLabel(scope)} · PRACTICA JUGANDO`} title="Del cuaderno al juego" description="Tres formas de practicar lo que aprendes en tus libros. Piensa, prueba y aprende de cada respuesta."/>
    <CurriculumNav scope={scope} section="games/workbook"/>
    <WorkbookGames key={`${scope}:${mode ?? 'all'}`} scope={scope} questions={getWorkbookQuestions(scope)} initialMode={mode}/>
  </main></SiteShell>;
}
