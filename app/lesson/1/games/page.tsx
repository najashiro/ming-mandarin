import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { Arcade } from '@/components/Arcade';
import { exercises } from '@/seed/exercises';
export default function GamesPage(){return <SiteShell><main><LessonHeader eyebrow="游戏中心 · ARCADE" title="28 formas de practicar" description="Cada tarjeta abre un juego real usando el corpus auditado; no hay contenido de la Lección 2."/><Arcade exercises={exercises}/></main></SiteShell>}
