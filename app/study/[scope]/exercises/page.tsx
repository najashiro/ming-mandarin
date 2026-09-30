import { notFound } from 'next/navigation';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { CurriculumNav } from '@/components/CurriculumNav';
import { Hanzi } from '@/components/Hanzi';
import { PracticeEngine } from '@/components/PracticeEngine';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import lesson4 from '@/data/lesson4-public.json';

export default async function ExercisesPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const data = getCurriculum(scope);
  return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 练习`} title="Ejercicios" description="Practica vocabulario y trabaja las actividades de lectura y producción."/><CurriculumNav scope={scope} section="exercises"/>
    <section className="shell"><h2>Práctica de vocabulario</h2><PracticeEngine exercises={data.exercises}/></section>
    {data.definition.lessonIds.includes(4) && <section className="shell"><h2>Actividades de la lección 4</h2><p>Actividades abiertas para estudiar. No se califican automáticamente.</p>{lesson4.documentaryExercises.map(exercise => <details className="panel" key={exercise.id}>
      <summary><Hanzi>{exercise.title}</Hanzi></summary>{exercise.requiresOriginalAudio && <p role="status">Pendiente: esta actividad necesita la grabación original del libro, aún no disponible.</p>}
      {exercise.texts.map((text, index) => <p style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} key={index}><Hanzi>{text}</Hanzi></p>)}
    </details>)}</section>}
  </main></SiteShell>;
}
