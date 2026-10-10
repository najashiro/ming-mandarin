import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { LessonCards } from '@/components/LessonCards';
import { MingIcon } from '@/components/MingIcon';

export default function CoursePage() {
  return <SiteShell><main id="main-content" className="course-page shell">
    <header className="editorial-heading"><p className="eyebrow">TU RUTA DE APRENDIZAJE · LECCIONES 1–4</p><h1>Una conversación<br/>empieza con <em>un paso.</em></h1><p>Empieza por la primera lección o vuelve a la que quieras afianzar. En cada una encontrarás palabras, diálogos, gramática y escritura.</p></header>
    <div className="foundation-banner"><span className="skill-icon sage"><MingIcon name="sound"/></span><div><h2>¿Es tu primera vez con el mandarín?</h2><p>Conoce el pinyin y escucha los cuatro tonos antes de empezar.</p></div><Link prefetch={false} href="/lesson/1/pinyin" className="text-link">Explorar los sonidos <MingIcon name="arrow"/></Link></div>
    <LessonCards/>
    <section className="review-section"><div><p className="eyebrow">CONECTA LO APRENDIDO</p><h2>Volver también es avanzar.</h2><p>Mezcla las lecciones que ya estudiaste y descubre cuánto recuerdas.</p></div><div className="review-links"><Link prefetch={false} href="/study/l1-l2">Repasar lecciones 1 + 2 <MingIcon name="arrow"/></Link><Link prefetch={false} href="/study/l1-l2-l3">Repasar lecciones 1 + 2 + 3 <MingIcon name="arrow"/></Link><Link prefetch={false} href="/study/l1-l2-l3-l4">Repasar el curso completo <MingIcon name="arrow"/></Link></div></section>
    <Link prefetch={false} className="text-link legacy-route-link" href="/lesson/1">Ver ruta completa de la lección 1 <MingIcon name="arrow" width="18" height="18"/></Link>
  </main></SiteShell>;
}
