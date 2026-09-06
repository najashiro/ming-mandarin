import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { ExamClient } from '@/components/ExamClient';
import { HanziUnitNav } from '@/components/hanzi/HanziUnitNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { isHanziUnitId } from '@/seed/characters';

export default async function ScopeExamPage({params,searchParams}:{params:Promise<{scope:string}>;searchParams:Promise<{unit?:string}>}) {
  const [{scope:rawScope},query] = await Promise.all([params,searchParams]);
  if (!isCurriculumScope(rawScope)) notFound();
  const data = getCurriculum(rawScope);
  const activeUnit = query.unit && isHanziUnitId(query.unit) && data.stages.some((unit) => unit.id === query.unit) ? query.unit : undefined;
  return <SiteShell><main>
    <LessonHeader eyebrow={`${data.definition.shortLabel} · 测验`} title="Examen · 100 puntos" description={activeUnit?`20 preguntas del corpus Hanzi de ${activeUnit} · Texto ${activeUnit.endsWith('.1')?'1':'2'}.`:'20 preguntas, ocho competencias y corrección en el servidor.'}/>
    <CurriculumNav scope={rawScope} section="exam"/>
    <HanziUnitNav basePath={`/study/${rawScope}/exam`} units={data.stages} active={activeUnit}/>
    <section className="shell narrow"><ExamClient scope={activeUnit??rawScope}/></section>
  </main></SiteShell>;
}
