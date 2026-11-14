export const hanziTabs = ['Aprender', 'Palabras y frases', 'Trazos', 'Practicar'] as const;
export type HanziTab = typeof hanziTabs[number];

export function resolveHanziTab(tab?: string | null, mode?: string | null): HanziTab {
  if (mode === 'practice') return 'Practicar';
  if (tab === 'Componentes') return 'Palabras y frases';
  return hanziTabs.find(item => item === tab) ?? 'Aprender';
}
