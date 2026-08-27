import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PracticeEngine } from '@/components/PracticeEngine';
import { requireUser } from '@/app/auth';
import { getDailyExercises } from '@/lib/server/persistence';
import Link from 'next/link';
export default async function DailyPage(){const user=await requireUser('/lesson/1/daily');const set=await getDailyExercises(user);return <SiteShell><main><LessonHeader eyebrow="复习 · SRS ADAPTATIVO" title="Sesión de hoy" description="Prioriza errores abiertos, repasos vencidos y conceptos nuevos; intercala dimensiones para evitar memorización mecánica."/><div className="shell narrow"><PracticeEngine exercises={set} title="Repaso intercalado"/><aside className="panel daily-hanzi-card"><div><p className="eyebrow">5 MINUTOS · HANZI</p><h2>Orden y escritura</h2><p>El laboratorio registra esta dimensión por separado y programa el próximo repaso según tus resultados.</p></div><Link className="button button-primary" href="/lesson/1/hanzi?mode=practice">Practicar Hanzi</Link></aside></div></main></SiteShell>}
