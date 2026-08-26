import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PracticeEngine } from '@/components/PracticeEngine';
import { requireUser } from '@/app/auth';
import { getDailyExercises } from '@/lib/server/persistence';
export default async function DailyPage(){const user=await requireUser('/lesson/1/daily');const set=await getDailyExercises(user);return <SiteShell><main><LessonHeader eyebrow="复习 · SRS ADAPTATIVO" title="Sesión de hoy" description="Prioriza errores abiertos, repasos vencidos y conceptos nuevos; intercala dimensiones para evitar memorización mecánica."/><div className="shell narrow"><PracticeEngine exercises={set} title="Repaso intercalado"/></div></main></SiteShell>}
