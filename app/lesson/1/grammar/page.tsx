import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { GrammarStudy } from '@/components/GrammarStudy';
import { grammarPoints } from '@/seed/grammar';
import { exercises } from '@/seed/exercises';
import { sentences } from '@/seed/sentences';
import { CommunityButton, CommunityContextProvider } from '@/components/community/CommunityProvider';
export default function GrammarPage() {
  const set = exercises.filter(item => item.dimension === 'grammar');
  return <SiteShell><CommunityContextProvider context={{ lessonId: 1, section: 'grammar', skill: 'grammar', route: '/lesson/1/grammar' }}>
    <main><LessonHeader eyebrow="LECCIÓN 1 · GRAMÁTICA" title="Comprende, escucha y construye" description="Paso a paso, con pinyin, español y práctica con audio."/>
      <GrammarStudy points={grammarPoints} exercises={set} sentences={sentences} returnTo="/lesson/1/grammar"/>
      <div className="shell"><CommunityButton label="Preguntar sobre gramática"/></div>
    </main>
  </CommunityContextProvider></SiteShell>;
}
