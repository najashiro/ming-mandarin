import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { CurriculumNav } from '@/components/CurriculumNav';
import { HanziLab } from '@/components/hanzi/HanziLab';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getHanziProgressMap } from '@/lib/server/persistence';
import type { HanziManifestEntry } from '@/lib/hanzi/types';
import manifest from '@/public/hanzi-data/manifest.json';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export const dynamic='force-dynamic';
const tabs=['Aprender','Componentes','Trazos','Practicar'] as const;
export default async function ScopeHanziPage({params,searchParams}:{params:Promise<{scope:string}>;searchParams:Promise<{character?:string;tab?:string;mode?:string}>}){const [{scope:rawScope},query,user]=await Promise.all([params,searchParams,getCurrentUser()]);if(!isCurriculumScope(rawScope))notFound();const data=getCurriculum(rawScope);const progress=user?await getHanziProgressMap(user):{};const requested=query.mode==='practice'?'Practicar':query.tab;const tab=tabs.includes(requested as typeof tabs[number])?requested as typeof tabs[number]:'Aprender';const initial=data.characters.some((item)=>item.hanzi===query.character)?query.character:data.characters[0]?.hanzi;return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 汉字`} title="Hanzi: forma, sonido y trazos" description="Reconocimiento, pronunciación estática, orden de trazos y escritura táctil."/><CurriculumNav scope={rawScope} section="hanzi"/><HanziLab characters={data.characters} stages={data.stages} manifest={manifest as Record<string,HanziManifestEntry>} initialProgress={progress} initialCharacter={initial} initialTab={tab} scopeLabel={data.definition.label} route={`/study/${rawScope}/hanzi`}/></main></SiteShell>;}
