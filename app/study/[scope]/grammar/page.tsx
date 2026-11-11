import { GrammarStudy } from '@/components/GrammarStudy';
import studyReference from '@/data/lesson4-study-reference.json';
import type { GrammarPoint } from '@/data/types';
import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export default async function ScopeGrammarPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const data = getCurriculum(scope);
  const hasLesson4 = data.definition.lessonIds.includes(4);
  const grammar = data.grammar.map(point => hasLesson4
    ? studyReference.grammar.find(reviewed => reviewed.id === point.id) as GrammarPoint | undefined ?? point
    : point);
  return <SiteShell><main>
    <LessonHeader eyebrow={`${data.definition.shortLabel} · GRAMÁTICA`} title="Comprende, escucha y construye" description="Paso a paso, con pinyin y español debajo de los caracteres. Aprende las reglas y practica las frases con audio."/>
    <CurriculumNav scope={scope} section="grammar"/>
    <GrammarStudy key={scope} points={grammar} exercises={data.exercises.filter(item => item.dimension === 'grammar')} sentences={data.sentences}
      returnTo={`/study/${scope}/grammar`} bookReference={hasLesson4 ? studyReference.bookReference : undefined}/>
  </main></SiteShell>;
}
