import Link from 'next/link';
import type { CurriculumScope } from '@/data/types';
import { MingIcon } from '@/components/MingIcon';
import { Hanzi } from '@/components/Hanzi';
import './workbook-links.css';

const activities = [
  { mode: 'order', title: 'Constructor de frases', glyph: '句', description: 'Dale sentido a las palabras, bloque a bloque.' },
  { mode: 'complete', title: 'El carácter que falta', glyph: '字', description: 'Elige el carácter que encaja en el contexto.' },
  { mode: 'dialogue', title: 'Conecta la conversación', glyph: '话', description: 'Encuentra la respuesta para cada pregunta.' },
] as const;

export function WorkbookGameLinks({ scope }: { scope: CurriculumScope }) {
  return <section className="workbook-links shell" aria-labelledby="workbook-links-title">
    <div className="workbook-links-intro"><div><p className="eyebrow">DE TUS LIBROS DE EJERCICIOS</p><h2 id="workbook-links-title">Del cuaderno al juego</h2><p>Retos cortos, pistas y una segunda oportunidad para tus errores.</p></div><span className="workbook-links-note"><MingIcon name="book" width="18" height="18"/>A tu ritmo</span></div>
    <div className="workbook-links-grid">{activities.map(item => <Link prefetch={false} href={`/study/${scope}/games/workbook?mode=${item.mode}`} key={item.mode} className={`workbook-link workbook-link-${item.mode}`}>
      <span className="workbook-link-glyph" aria-hidden="true"><Hanzi>{item.glyph}</Hanzi></span>
      <span className="workbook-link-copy"><strong>{item.title}</strong><span>{item.description}</span><span className="workbook-link-action">Jugar <MingIcon name="arrow" width="17" height="17"/></span></span>
    </Link>)}</div>
  </section>;
}
