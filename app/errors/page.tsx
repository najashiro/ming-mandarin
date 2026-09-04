import Link from 'next/link';
import { requireUser } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getErrors } from '@/lib/server/persistence';
import { curriculumScopes, isCurriculumScope, scopeDefinitions } from '@/seed/curriculum';
import { PinyinText } from '@/components/PinyinText';

export default async function ErrorsPage({searchParams}:{searchParams:Promise<{scope?:string}>}) {
  const query=await searchParams;
  const scope=query.scope&&isCurriculumScope(query.scope)?query.scope:'l1';
  const user=await requireUser(`/errors?scope=${scope}`);
  const errors=await getErrors(user,scope);
  const practiceHref=scope==='l1'?'/lesson/1/daily':`/study/${scope}/daily`;
  return <SiteShell><main><LessonHeader eyebrow={`错题本 · ${scopeDefinitions[scope].shortLabel}`} title="Errores que enseñan" description="Cada fallo vuelve a la práctica dentro del alcance seleccionado."/><nav className="curriculum-nav shell" aria-label="Alcance de errores">{curriculumScopes.map((item)=><Link className={item===scope?'selected':''} href={`/errors?scope=${item}`} key={item}>{scopeDefinitions[item].shortLabel}</Link>)}</nav><section className="error-list shell">{errors.length?errors.map((item)=>{const isPinyin=String(item.error_type)==='pinyin';const given=String(item.given_answer);const correct=String(item.correct_answer);return <article className="panel" key={String(item.id)}><div><span>{String(item.error_type)}</span><b>{String(item.occurrences)}×</b></div><h2>{String(item.concept_id)}</h2><p><del>{isPinyin?<PinyinText>{given}</PinyinText>:given}</del> → <strong>{isPinyin?<PinyinText>{correct}</PinyinText>:correct}</strong></p><p className="rule-note">{String(item.rule)}</p></article>}):<div className="empty-state panel"><h2>Cuaderno vacío</h2><p>Todavía no hay errores abiertos en este alcance.</p><Link className="button button-primary" href={practiceHref}>Empezar práctica</Link></div>}</section></main></SiteShell>;
}
