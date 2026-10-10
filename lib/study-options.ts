import type { CurriculumScope } from '@/data/types';

// Navigation offers one lesson at a time or the complete review. Historical
// scopes remain valid so saved links and progress keep their original content.
export const studyScopeOptions: readonly { value: CurriculumScope; label: string }[] = [
  { value: 'l1', label: 'Lección 1' },
  { value: 'l2', label: 'Lección 2' },
  { value: 'l3', label: 'Lección 3' },
  { value: 'l4', label: 'Lección 4' },
  { value: 'l1-l2-l3-l4', label: 'Repaso general' },
];

export function getStudyScopeLabel(scope: CurriculumScope): string {
  if (scope === 'l1-l2') return 'Repaso hasta la lección 2';
  if (scope === 'l1-l2-l3') return 'Repaso hasta la lección 3';
  return studyScopeOptions.find(option => option.value === scope)!.label;
}
