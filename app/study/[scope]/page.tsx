import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Hanzi } from '@/components/Hanzi';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell } from '@/components/SiteShell';
import { MingIcon, type MingIconName } from '@/components/MingIcon';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { getVocabularySet } from '@/lib/vocabulary';

export default async function ScopePage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const data = getCurriculum(scope);
  const hasL4 = data.definition.lessonIds.includes(4);
  const modules: { href: string; icon: MingIconName; title: string; description: string; detail: string }[] = [
    { href: 'vocabulary', icon: 'book', title: 'Conoce las palabras', description: 'Escucha y descubre las palabras que vas a usar.', detail: getVocabularySet(scope).length + ' palabras' },
    { href: 'dialogues', icon: 'chat', title: 'Escucha los diálogos', description: 'Encuentra las palabras en una conversación.', detail: 'Conversaciones del libro' },
    { href: 'grammar', icon: 'practice', title: 'Entiende cómo funciona', description: 'Conecta las ideas con ejemplos y estructuras.', detail: data.grammar.length + ' puntos de gramática' },
    { href: 'hanzi', icon: 'write', title: 'Escribe los caracteres', description: 'Sigue los trazos y después inténtalo sin ayuda.', detail: data.characters.length + ' hanzi' },
    { href: 'radicals', icon: 'sun', title: 'Descubre los radicales', description: 'Reconoce las piezas que forman los caracteres.', detail: 'Explorar y practicar' },
    ...(hasL4 ? [
      { href: 'readings', icon: 'book' as const, title: 'Lee y comprende', description: 'Lleva lo aprendido a textos más largos.', detail: '6 lecturas · Lección 4' },
      { href: 'exercises', icon: 'check' as const, title: 'Explora los ejercicios', description: 'Practica con las actividades de la lección.', detail: 'Lección 4' },
    ] : []),
  ];
  return <SiteShell><main id="main-content" className="study-overview">
    <header className="study-heading shell"><Link prefetch={false} href="/course" className="back-link">← Todas las lecciones</Link><p className="eyebrow">{data.definition.label.toLocaleUpperCase('es')}</p><h1><Hanzi>{data.definition.title}</Hanzi></h1><p>{scope.includes('-') ? 'Vuelve a las palabras, los diálogos y los caracteres de estas lecciones.' : data.definition.description}</p><Link prefetch={false} className="button button-primary" href={'/study/' + scope + '/vocabulary'}>Empezar con el vocabulario <MingIcon name="arrow"/></Link></header>
    <CurriculumNav scope={scope}/>
    <div className="study-body shell"><section aria-labelledby="study-steps-title"><div className="home-section-heading"><div><p className="eyebrow">APRENDE A TU RITMO</p><h2 id="study-steps-title">Tu camino en esta lección</h2></div></div><div className="study-steps">{modules.map((module, index) => <Link prefetch={false} className="study-step" href={'/study/' + scope + '/' + module.href} key={module.href}><span className="study-step-number">0{index + 1}</span><span className="skill-icon sage"><MingIcon name={module.icon}/></span><div><h3>{module.title}</h3><p>{module.description}</p><small>{module.detail}</small></div><MingIcon name="arrow"/></Link>)}</div></section>
      <aside className="study-sidebar"><p className="eyebrow">HAZLO TUYO</p><h2>De aprender<br/>a recordar.</h2><p>Después de explorar, pon a prueba lo aprendido.</p><Link prefetch={false} className="study-extra" href={'/study/' + scope + '/games'}><MingIcon name="games"/><span><b>Juega y practica</b><small>Aprende con cada intento</small></span><MingIcon name="arrow" width="17" height="17"/></Link><Link prefetch={false} className="study-extra" href={'/study/' + scope + '/daily'}><MingIcon name="progress"/><span><b>Repaso personal</b><small>Guarda tu progreso con un nombre</small></span><MingIcon name="arrow" width="17" height="17"/></Link><Link prefetch={false} className="study-extra" href={'/study/' + scope + '/exam'}><MingIcon name="check"/><span><b>Comprueba lo aprendido</b><small>Examen · 20 preguntas</small></span><MingIcon name="arrow" width="17" height="17"/></Link></aside>
    </div>
  </main></SiteShell>;
}
