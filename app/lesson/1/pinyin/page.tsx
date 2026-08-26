import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinLab } from '@/components/PinyinLab';
export default function PinyinPage(){return <SiteShell><main><LessonHeader eyebrow="REPASO FONÉTICO" title="Pinyin y tonos" description="Convierte, escucha y escribe. Las marcas tonales se evalúan de forma estricta."/><section className="shell"><PinyinLab/></section></main></SiteShell>}
