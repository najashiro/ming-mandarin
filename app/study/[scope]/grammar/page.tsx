import { GrammarCards } from '@/components/GrammarCards';
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
  const grammar = data.grammar.map(point => hasLesson4
    ? studyReference.grammar.find(reviewed => reviewed.id === point.id) as GrammarPoint | undefined ?? point
    : point);
  return <SiteShell><main>
    <LessonHeader eyebrow={`${data.definition.shortLabel} · 语法`} title="Gramática del alcance" description="Patrones, tablas y ejemplos para comprender y practicar."/>
    <CurriculumNav scope={scope} section="grammar"/>
    <GrammarCards points={grammar}/>
    {hasLesson4 && <div className="shell"><BookReference reference={studyReference.bookReference}/></div>}
    <div className="shell narrow"><PracticeEngine exercises={data.exercises.filter(item => item.dimension === 'grammar')} title="Práctica gramatical"/></div>
  </main></SiteShell>;
}
