import Link from 'next/link';
import type { CurriculumScope } from '@/data/types';
import { curriculumScopes, scopeDefinitions } from '@/seed/curriculum';

export function CurriculumNav({ scope, section }: { scope: CurriculumScope; section?: string }) {
  const suffix = section ? `/${section}` : '';
  return <nav className="curriculum-nav shell" aria-label="Alcance de estudio">
    {curriculumScopes.map((item) => <Link className={item === scope ? 'selected' : ''} href={`/study/${item}${suffix}`} key={item}>{scopeDefinitions[item].shortLabel}</Link>)}
  </nav>;
}
