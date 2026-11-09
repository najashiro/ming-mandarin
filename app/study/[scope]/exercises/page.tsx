import { notFound } from 'next/navigation';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { CurriculumNav } from '@/components/CurriculumNav';
import { DocumentaryActivities } from '@/components/DocumentaryActivities';
import { PracticeEngine } from '@/components/PracticeEngine';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { lesson5, lesson6 } from '@/lib/active-corpus';
import studyReference from '@/data/lesson4-study-reference.json';

export default async function ExercisesPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const data = getCurriculum(scope);
  const activities = [...(data.definition.lessonIds.includes(4) ? studyReference.activities : []), ...(data.definition.lessonIds.includes(5) ? lesson5.documentaryExercises : []), ...(data.definition.lessonIds.includes(6) ? lesson6.documentaryExercises : [])];
  return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 练习`} title="Ejercicios" description="Practica vocabulario y trabaja las actividades de lectura y producción."/><CurriculumNav scope={scope} section="exercises"/>
    <section className="shell"><h2>Práctica de vocabulario</h2>{data.definition.lessonIds.includes(6) && <p>Práctica editorial de Míng basada en el vocabulario y las frases estudiadas. No es una clave oficial del libro.</p>}<PracticeEngine exercises={data.exercises}/></section>
    {activities.length > 0 && <section className="shell"><h2>Actividades de la lección</h2><p>Actividades abiertas para estudiar. No se califican automáticamente.</p><DocumentaryActivities activities={activities}/></section>}
  </main></SiteShell>;
}
