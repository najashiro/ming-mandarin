'use client';

import { useRouter } from 'next/navigation';

export function ScopeSelect({ value, options }: { value: string; options: { value: string; label: string; href: string }[] }) {
  const router = useRouter();
  return <label className="scope-select">Estudiando<select aria-label="Cambiar lección de estudio" value={value} onChange={event => {
    const option = options.find(item => item.value === event.target.value);
    if (option) router.push(option.href);
  }}>{options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>;
}
