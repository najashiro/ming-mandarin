import { CommunityContextProvider } from '@/components/community/CommunityProvider';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { VocabularyExplorer } from '@/components/VocabularyExplorer';
import { getVocabularyForModule } from '@/lib/lesson-content';

export default function StatesPage() {
  return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'vocabulary',concept:'states',skill:'vocabulary',route:'/lesson/1/states'}}><main>
    <LessonHeader eyebrow="04 · 状态" title="Estados" description="Aprende a reconocer y expresar estados personales de la lección." />
    <VocabularyExplorer vocabulary={getVocabularyForModule('states')} route="/lesson/1/states" showSearch={false} />
  </main></CommunityContextProvider></SiteShell>;
}
