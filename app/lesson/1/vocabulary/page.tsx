import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { VocabularyExplorer } from '@/components/VocabularyExplorer';
import { vocabulary } from '@/seed/vocabulary';

export default function VocabularyPage(){return <SiteShell><main><LessonHeader eyebrow="LECCIÓN 1 · 词汇" title="Vocabulario auditable" description="Corpus del libro, material suplementario, notas de clase y nombres propios, siempre etiquetados por procedencia."/><VocabularyExplorer vocabulary={vocabulary}/></main></SiteShell>}
