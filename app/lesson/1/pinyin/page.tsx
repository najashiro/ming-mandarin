import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinLab } from '@/components/PinyinLab';
import { CommunityButton, CommunityContextProvider } from '@/components/community/CommunityProvider';
export default function PinyinPage(){return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'pinyin',skill:'pinyin',route:'/lesson/1/pinyin'}}><main><LessonHeader eyebrow="REPASO FONÉTICO" title="Pinyin y tonos" description="Relaciona cada marca con su altura, escucha mandarín real y comprueba la aspiración con una prueba física."/><div className="community-page-action shell"><CommunityButton label="Preguntar sobre pinyin"/></div><section className="shell"><PinyinLab/></section></main></CommunityContextProvider></SiteShell>}
