import Link from 'next/link';
import { requireUser } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getProgress } from '@/lib/server/persistence';
import { curriculumScopes, isCurriculumScope, scopeDefinitions } from '@/seed/curriculum';

const dimensionLabels: Record<string, string> = { recognition: 'Reconocimiento', stroke_order: 'Orden de trazos', writing: 'Escritura' };

export default async function ProgressPage({searchParams}:{searchParams:Promise<{scope?:string}>}) {
  const query=await searchParams;
  const scope=query.scope&&isCurriculumScope(query.scope)?query.scope:'l1';
  const user=await requireUser(`/progress?scope=${scope}`);
  const data=await getProgress(user,scope);
  const profile=data.profile as Record<string,unknown>;
  const summary=data.summary as Record<string,unknown>;
  const best=data.bestExam as Record<string,unknown>;
  const practiceHref=scope==='l1'?'/lesson/1/daily':`/study/${scope}/daily`;
  const examHref=scope==='l1'?'/lesson/1/exam':`/study/${scope}/exam`;
  const hanziHref=scope==='l1'?'/lesson/1/hanzi?mode=practice':`/study/${scope}/hanzi?mode=practice`;
  return <SiteShell><main>
    <LessonHeader eyebrow={`学习进度 · ${scopeDefinitions[scope].shortLabel}`} title={`Hola, ${String(profile?.display_name??user.displayName)}`} description="Indicadores persistidos dentro del alcance seleccionado; no hay cifras simuladas."/>
    <nav className="curriculum-nav shell" aria-label="Alcance del progreso">{curriculumScopes.map((item)=><Link className={item===scope?'selected':''} href={`/progress?scope=${item}`} key={item}>{scopeDefinitions[item].shortLabel}</Link>)}</nav>
    <section className="metric-grid shell"><article><strong>{data.general}%</strong><span>Dominio del alcance</span></article><article><strong>{String(profile?.xp??0)}</strong><span>XP total</span></article><article><strong>{String(summary?.attempts??0)}</strong><span>Intentos</span></article><article><strong>{String(best?.score??'—')}</strong><span>Mejor examen global</span></article></section>
    <section className="progress-layout shell"><div className="panel"><h2>Dominio por dimensión</h2>{data.mastery.length?data.mastery.map((item)=><div className="mastery-row" key={String(item.skill_dimension)}><span>{String(item.skill_dimension)}</span><div><i style={{width:`${Number(item.average)}%`}}/></div><b>{String(item.average)}%</b></div>):<p className="empty-state">Aún no hay dimensiones medidas en este alcance.</p>}<Link className="button button-primary" href={practiceHref}>Practicar ahora</Link></div><aside className="panel"><h2>Próxima acción</h2><p><b>{data.due}</b> conceptos vencidos</p><p><b>{data.unresolvedErrors}</b> errores abiertos</p><Link href={`/errors?scope=${scope}`}>Abrir cuaderno de errores →</Link><Link href={examHref}>Ver examen →</Link></aside></section>
    <section className="shell hanzi-progress-section"><div className="section-heading"><div><p className="eyebrow">汉字 · RUTA DE SEIS ETAPAS</p><h2>{data.hanziSummary.studied} / {data.hanziSummary.total} Hanzi estudiados</h2></div><Link href={hanziHref}>Abrir laboratorio →</Link></div><p className="source-note">“Estudiado” exige una práctica registrada; abrir una ficha no aumenta el contador.</p><div className="hanzi-dimension-summary">{data.hanziSummary.dimensions.map((item)=><article key={item.dimension}><span>{dimensionLabels[item.dimension]}</span><strong>{item.average}%</strong></article>)}</div><div className="hanzi-stage-summary">{data.hanziSummary.stages.map((stage)=><article key={stage.id}><span>{stage.id}</span><div><b>{stage.title}</b><small>{stage.studied} / {stage.total}</small><i><em style={{width:`${stage.total?stage.studied/stage.total*100:0}%`}}/></i></div></article>)}</div>{data.hanzi.length?<div className="hanzi-progress-grid">{data.hanzi.map((item)=><article key={`${item.characterId}-${item.skillDimension}`}><strong>{item.character}</strong><span>{dimensionLabels[item.skillDimension]??item.skillDimension}</span><b>{item.mastery}%</b></article>)}</div>:<div className="panel empty-state">Aún no hay intentos Hanzi sincronizados.</div>}</section>
  </main></SiteShell>;
}
