import Link from 'next/link';
import type { CurriculumScope } from '@/data/types';
import { studyScopeOptions } from '@/lib/study-options';
import { ScopeSelect } from './ScopeSelect';

export function CurriculumNav({ scope, section }: { scope: CurriculumScope; section?: string }) {
  const suffix = section ? `/${section}` : '';
  const availableScopes = section === 'readings' ? studyScopeOptions.filter(item => item.value === 'l4' || item.value === 'l1-l2-l3-l4') : studyScopeOptions;
  const options = availableScopes.map(item => ({ ...item, href: `/study/${item.value}${suffix}` }));
  return <nav className="curriculum-nav shell" aria-label="Alcance de estudio">
    {section && <Link prefetch={false} href={`/study/${scope}`} aria-label="Volver a la ruta de esta lección">← Ruta</Link>}
    <div className="curriculum-links">{options.map(item => <Link prefetch={false} className={item.value === scope ? 'selected' : ''} aria-current={item.value === scope ? 'page' : undefined} href={item.href} key={item.value}>{item.label}</Link>)}</div>
    <ScopeSelect value={scope} options={options}/>
  </nav>;
}
