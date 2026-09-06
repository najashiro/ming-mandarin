import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { ExamClient } from '@/components/ExamClient';
import { getCurrentUser } from '@/app/auth';
import { getExamHistory } from '@/lib/server/persistence';
import { CommunityButton, CommunityContextProvider } from '@/components/community/CommunityProvider';
import { HanziUnitNav } from '@/components/hanzi/HanziUnitNav';
import { hanziUnits, isHanziUnitId } from '@/seed/characters';

export default async function ExamPage({searchParams}:{searchParams:Promise<{unit?:string}>}) {
  const query = await searchParams;
  const units = hanziUnits.filter((unit) => unit.lesson === 1);
  const activeUnit = query.unit && isHanziUnitId(query.unit) && units.some((unit) => unit.id === query.unit) ? query.unit : undefined;
  const user = await getCurrentUser();
  const history = user ? await getExamHistory(user) : [];
  return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'exam',route:'/lesson/1/exam'}}><main>
    <LessonHeader eyebrow="测验 · EXAMEN" title="Examen final · 100 puntos" description={activeUnit?`Evaluación Hanzi de ${activeUnit} · Texto ${activeUnit.endsWith('.1')?'1':'2'}.`:'Intentos ilimitados, historial real y mejor puntuación disponible para el ranking voluntario.'}/>
    <div className="community-page-action shell"><CommunityButton label="Preguntar sobre el examen"/></div>
    <HanziUnitNav basePath="/lesson/1/exam" units={units} active={activeUnit}/>
    <section className="shell narrow"><ExamClient scope={activeUnit??'l1'}/></section>
    {user&&<section className="exam-history shell"><p className="eyebrow">HISTORIAL REAL</p><h2>Intentos anteriores</h2>{history.length?<div>{history.map(row=><article key={String(row.id)}><strong>{String(row.score)}/100</strong><span>{String(row.duration_seconds)} s</span><time>{new Date(String(row.created_at)).toLocaleDateString('es-PE')}</time></article>)}</div>:<p className="empty-state">Tu primer resultado aparecerá aquí.</p>}</section>}
  </main></CommunityContextProvider></SiteShell>;
}
