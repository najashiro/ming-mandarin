import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/app/auth';
import { CurriculumNav } from '@/components/CurriculumNav';
import { PracticeEngine } from '@/components/PracticeEngine';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinText } from '@/components/PinyinText';
import { getDailyExercises, getDailyHanziPlan } from '@/lib/server/persistence';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export default async function ScopeDailyPage({params}:{params:Promise<{scope:string}>}){const {scope:rawScope}=await params;if(!isCurriculumScope(rawScope))notFound();const data=getCurriculum(rawScope);const route=`/study/${rawScope}/daily`;const user=await requireUser(route);const [set,hanzi]=await Promise.all([getDailyExercises(user,rawScope),getDailyHanziPlan(user,5,rawScope)]);return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 复习`} title="Sesión adaptativa" description="Prioriza errores, repasos vencidos y conceptos nuevos dentro del alcance."/><CurriculumNav scope={rawScope} section="daily"/><div className="shell narrow"><PracticeEngine exercises={set} title="Repaso intercalado"/><aside className="panel daily-hanzi-card"><div><p className="eyebrow">HANZI DEL DÍA</p><h2>Repaso acumulativo</h2><div className="daily-hanzi-list">{hanzi.map((item)=><Link href={`/study/${rawScope}/hanzi?character=${encodeURIComponent(item.hanzi)}&mode=practice`} key={item.id}><strong>{item.hanzi}</strong><span><PinyinText>{item.pinyin}</PinyinText></span></Link>)}</div></div><Link className="button button-primary" href={`/study/${rawScope}/hanzi?mode=practice`}>Practicar Hanzi</Link></aside></div></main></SiteShell>;}
