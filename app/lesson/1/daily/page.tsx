import Link from 'next/link';
import { requireUser } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PracticeEngine } from '@/components/PracticeEngine';
import { getDailyExercises, getDailyHanziPlan } from '@/lib/server/persistence';
import { CommunityButton, CommunityContextProvider } from '@/components/community/CommunityProvider';

export default async function DailyPage() {
  const user = await requireUser('/lesson/1/daily');
  const [set, hanziPlan] = await Promise.all([getDailyExercises(user), getDailyHanziPlan(user)]);
  return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'practice',route:'/lesson/1/daily'}}><main>
    <LessonHeader eyebrow="复习 · SRS ADAPTATIVO" title="Sesión de hoy" description="Prioriza errores abiertos, repasos vencidos y conceptos nuevos; intercala dimensiones para evitar memorización mecánica." />
    <div className="community-page-action shell"><CommunityButton label="Preguntar sobre la práctica"/></div>
    <div className="shell narrow">
      <PracticeEngine exercises={set} title="Repaso intercalado" />
      <aside className="panel daily-hanzi-card">
        <div><p className="eyebrow">SESIÓN BREVE · HANZI</p><h2>Repaso acumulativo</h2><p>Errores, repasos vencidos, escritura débil y el siguiente carácter nuevo, en ese orden.</p>
          <div className="daily-hanzi-list">{hanziPlan.map((item) => <Link href={`/lesson/1/hanzi?character=${encodeURIComponent(item.hanzi)}&mode=practice`} key={item.id}><strong>{item.hanzi}</strong><span>{item.pinyin}</span></Link>)}</div>
        </div>
        <Link className="button button-primary" href="/lesson/1/hanzi?mode=practice">Practicar Hanzi</Link>
      </aside>
    </div>
  </main></CommunityContextProvider></SiteShell>;
}
