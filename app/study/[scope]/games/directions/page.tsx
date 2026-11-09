import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DirectionsGame } from '@/components/games/directions/DirectionsGame';
import { isCurriculumScope, getCurriculum } from '@/seed/curriculum';

export const metadata: Metadata = { title: 'Una llamada, mil vueltas', description: 'Guía a tus amigos por seis laberintos usando las direcciones en chino de la lección 06.' };
export default async function DirectionsPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope) || !getCurriculum(scope).definition.lessonIds.includes(6)) notFound();
  return <main className="directions-page"><DirectionsGame scope={scope}/></main>;
}
