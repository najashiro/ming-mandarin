import Link from 'next/link';
import type { HanziUnitDefinition, HanziUnitId } from '@/data/types';

export function HanziUnitNav({basePath,units,active,label='Alcance Hanzi'}:{basePath:string;units:HanziUnitDefinition[];active?:HanziUnitId;label?:string}) {
  return <nav className="hanzi-unit-nav shell" aria-label={label}>
    <Link className={!active?'selected':''} href={basePath}>Acumulado</Link>
    {units.map((unit) => <Link className={active===unit.id?'selected':''} href={`${basePath}?unit=${unit.id}`} key={unit.id}>{unit.id}<small>Texto {unit.text}</small></Link>)}
  </nav>;
}
