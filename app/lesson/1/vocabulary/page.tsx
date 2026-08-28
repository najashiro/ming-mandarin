import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { VocabularyExplorer } from '@/components/VocabularyExplorer';
import { vocabulary } from '@/seed/vocabulary';
import { CommunityContextProvider } from '@/components/community/CommunityProvider';

export default function VocabularyPage(){return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'vocabulary',skill:'vocabulary',route:'/lesson/1/vocabulary'}}><main><LessonHeader eyebrow="LECCIÓN 1 · 词汇" title="Vocabulario auditable" description="Corpus del libro, material suplementario, notas de clase y nombres propios, siempre etiquetados por procedencia."/><VocabularyExplorer vocabulary={vocabulary}/></main></CommunityContextProvider></SiteShell>}
