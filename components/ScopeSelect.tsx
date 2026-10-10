'use client';

import { useRouter } from 'next/navigation';
import type { CurriculumScope } from '@/data/types';
import { getStudyScopeLabel } from '@/lib/study-options';

export function ScopeSelect({ value, options, label = 'Estudiando', ariaLabel = 'Cambiar lección de estudio' }: { value: CurriculumScope; options: readonly { value: CurriculumScope; label: string; href: string }[]; label?: string; ariaLabel?: string }) {
  const router = useRouter();
  return <label className="scope-select">{label}<select aria-label={ariaLabel} value={value} onChange={event => {
    const option = options.find(item => item.value === event.target.value);
    if (option) router.push(option.href);
  }}>{!options.some(option => option.value === value) && <option value={value} disabled hidden>{getStudyScopeLabel(value)}</option>}{options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>;
}
