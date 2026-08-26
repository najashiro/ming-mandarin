import Link from 'next/link';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getUserAchievements } from '@/lib/server/persistence';
export default async function AchievementsPage(){const user=await requireChatGPTUser('/achievements');const rows=await getUserAchievements(user);return <SiteShell><main><LessonHeader eyebrow="成就 · LOGROS" title="Reconocimientos" description="Los logros se emiten a partir de eventos verificados en el servidor."/><section className="achievement-grid shell"><article className={rows.length?'achievement earned':'achievement'}><span>明</span><h2>第一课大师</h2><p>Obtén 100/100 en el examen final de la Lección 1.</p><b>{rows.length?'Obtenido':'Pendiente'}</b></article></section><div className="shell"><Link href="/lesson/1/exam">Ir al examen →</Link></div></main></SiteShell>}
