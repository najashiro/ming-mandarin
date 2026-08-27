import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinLab } from '@/components/PinyinLab';
export default function PinyinPage(){return <SiteShell><main><LessonHeader eyebrow="REPASO FONÉTICO" title="Pinyin y tonos" description="Relaciona cada marca con su altura, escucha mandarín real y comprueba la aspiración con una prueba física."/><section className="shell"><PinyinLab/></section></main></SiteShell>}
