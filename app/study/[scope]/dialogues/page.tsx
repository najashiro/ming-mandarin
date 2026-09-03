import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { SpeakButton } from '@/components/SpeakButton';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';

export default async function ScopeDialoguesPage({ params }: { params: Promise<{ scope: string }> }) { const { scope: rawScope }=await params; if(!isCurriculumScope(rawScope))notFound(); const data=getCurriculum(rawScope); return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 课文`} title="Diálogos y frases" description="Escucha, relaciona el pinyin con el significado y recupera cada estructura."/><CurriculumNav scope={rawScope} section="dialogues"/><section className="dialogue-text shell">{data.sentences.map((item)=><article key={item.id}><div><h2>{item.hanzi}</h2><p>{item.pinyin}</p><span>{item.translation}</span></div><SpeakButton text={item.hanzi}/></article>)}</section></main></SiteShell>; }
