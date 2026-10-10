import Link from 'next/link';
import type { CurriculumScope } from '@/data/types';
import { curriculumScopes, scopeDefinitions } from '@/seed/curriculum';
import { ScopeSelect } from './ScopeSelect';

export function CurriculumNav({ scope, section }: { scope: CurriculumScope; section?: string }) {
  const suffix = section ? `/${section}` : '';
  const availableScopes = section === 'readings' ? curriculumScopes.filter(item => scopeDefinitions[item].lessonIds.includes(4)) : curriculumScopes;
  const options = [...availableScopes].sort((a,b) => a.length - b.length || a.localeCompare(b)).map(item => ({ value: item, href: `/study/${item}${suffix}`, label: item.includes('-') ? `Repaso ${scopeDefinitions[item].shortLabel.replaceAll('L', '')}` : scopeDefinitions[item].label }));
  return <nav className="curriculum-nav shell" aria-label="Alcance de estudio">
    {section && <Link prefetch={false} href={`/study/${scope}`} aria-label="Volver a la ruta de esta lección">← Ruta</Link>}
    <div className="curriculum-links">{options.map(item => <Link prefetch={false} className={item.value === scope ? 'selected' : ''} aria-current={item.value === scope ? 'page' : undefined} href={item.href} key={item.value}>{item.label}</Link>)}</div>
    <ScopeSelect value={scope} options={options}/>
  </nav>;
}
