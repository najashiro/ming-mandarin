import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PracticeEngine } from '@/components/PracticeEngine';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export default async function ScopeGrammarPage({ params }: { params: Promise<{ scope: string }> }) { const {scope:rawScope}=await params;if(!isCurriculumScope(rawScope))notFound();const data=getCurriculum(rawScope);return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 语法`} title="Gramática del alcance" description="Patrones auditados, ejemplos y recuperación activa."/><CurriculumNav scope={rawScope} section="grammar"/><section className="grammar-grid shell">{data.grammar.map((point)=><article className="panel" key={point.id}><h2>{point.title}</h2><div className="pattern">{point.pattern}</div><p>{point.explanation}</p><ul>{point.examples.map((example)=><li key={example}>{example}</li>)}</ul></article>)}</section><div className="shell narrow"><PracticeEngine exercises={data.exercises.filter((item)=>item.dimension==='grammar')} title="Práctica gramatical"/></div></main></SiteShell>;}
