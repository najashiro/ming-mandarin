import { GrammarCards } from '@/components/GrammarCards';
import { GrammarStudy } from '@/components/GrammarStudy';
import { BookReference } from '@/components/BookReference';
import studyReference from '@/data/lesson4-study-reference.json';
import type { GrammarPoint } from '@/data/types';
import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PracticeEngine } from '@/components/PracticeEngine';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export default async function ScopeGrammarPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const data = getCurriculum(scope);
  const hasLesson4 = data.definition.lessonIds.includes(4);
  const isLesson5 = scope === 'l5';
  const grammar = data.grammar.map(point => hasLesson4
    ? studyReference.grammar.find(reviewed => reviewed.id === point.id) as GrammarPoint | undefined ?? point
    : point);
  return <SiteShell><main>
    <LessonHeader eyebrow={`${data.definition.shortLabel} · GRAMÁTICA`} title={isLesson5 ? 'Comprende, escucha y construye' : 'Gramática del alcance'} description={isLesson5 ? 'Paso a paso, con pinyin y español debajo de los caracteres. Aprende las reglas y practica las frases con audio.' : 'Patrones, tablas y ejemplos para comprender y practicar.'}/>
    <CurriculumNav scope={scope} section="grammar"/>
    {isLesson5 ? <GrammarStudy points={grammar} exercises={data.exercises.filter(item => item.dimension === 'grammar')}/> : <GrammarCards points={grammar}/>}
    {hasLesson4 && <div className="shell"><BookReference reference={studyReference.bookReference}/></div>}
    {!isLesson5 && <div className="shell narrow"><PracticeEngine exercises={data.exercises.filter(item => item.dimension === 'grammar')} title="Práctica gramatical"/></div>}
  </main></SiteShell>;
}
