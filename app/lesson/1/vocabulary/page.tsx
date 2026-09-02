import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { VocabularyExplorer } from '@/components/VocabularyExplorer';
import { vocabulary } from '@/seed/vocabulary';
import { CommunityContextProvider } from '@/components/community/CommunityProvider';

export default function VocabularyPage(){return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'vocabulary',skill:'vocabulary',route:'/lesson/1/vocabulary'}}><main><LessonHeader eyebrow="LECCIÓN 1 · 词汇" title="Vocabulario de la lección" description="Explora las palabras y expresiones estudiadas en esta lección."/><VocabularyExplorer vocabulary={vocabulary}/></main></CommunityContextProvider></SiteShell>}
