import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { VocabularyExplorer } from '@/components/VocabularyExplorer';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export default async function ScopeVocabularyPage({ params }: { params: Promise<{ scope: string }> }) { const { scope: rawScope } = await params; if (!isCurriculumScope(rawScope)) notFound(); const data=getCurriculum(rawScope); return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 词汇`} title="Vocabulario del alcance" description="Entradas del corpus auditado, sin mezclar lecciones fuera del alcance elegido."/><CurriculumNav scope={rawScope} section="vocabulary"/><VocabularyExplorer vocabulary={data.vocabulary} route={`/study/${rawScope}/vocabulary`}/></main></SiteShell>; }
