import { CommunityContextProvider } from '@/components/community/CommunityProvider';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { VocabularyExplorer } from '@/components/VocabularyExplorer';
import { getVocabularyForModule } from '@/lib/lesson-content';

export default function NamePage() {
  return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'vocabulary',concept:'name',skill:'vocabulary',route:'/lesson/1/name'}}><main>
    <LessonHeader eyebrow="02 · 姓名" title="Nombre y apellido" description="Aprende a preguntar y decir el nombre y el apellido, y a presentarte con cortesía." />
    <VocabularyExplorer vocabulary={getVocabularyForModule('name')} route="/lesson/1/name" showSearch={false} />
  </main></CommunityContextProvider></SiteShell>;
}
