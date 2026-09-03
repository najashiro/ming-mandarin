import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { ExamClient } from '@/components/ExamClient';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export default async function ScopeExamPage({params}:{params:Promise<{scope:string}>}){const {scope:rawScope}=await params;if(!isCurriculumScope(rawScope))notFound();const data=getCurriculum(rawScope);return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 测验`} title="Examen · 100 puntos" description="20 preguntas, ocho competencias y corrección en el servidor."/><CurriculumNav scope={rawScope} section="exam"/><section className="shell narrow"><ExamClient scope={rawScope}/></section></main></SiteShell>;}
