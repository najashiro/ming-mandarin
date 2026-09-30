import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { CurriculumNav } from '@/components/CurriculumNav';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton } from '@/components/SpeakButton';
import { isCurriculumScope, scopeDefinitions } from '@/seed/curriculum';
import lesson4 from '@/data/lesson4-public.json';

export default async function ReadingsPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isCurriculumScope(scope)) notFound();
  const readings = scopeDefinitions[scope].lessonIds.includes(4) ? lesson4.readings : [];
  return <SiteShell><main><LessonHeader eyebrow={`${scopeDefinitions[scope].shortLabel} · 阅读`} title="Lecturas" description="Lee a tu ritmo y escucha el texto completo."/><CurriculumNav scope={scope} section="readings"/>
    <section className="corpus-dialogues shell">{readings.map(reading => <article className="corpus-dialogue" key={reading.id} id={reading.id}>
      <h2>{reading.title}</h2><p style={{ whiteSpace: 'pre-line', lineHeight: 2, fontSize: '1.25rem' }}><LinkedChineseText text={reading.hanzi} returnTo={`/study/${scope}/readings#${reading.id}`}/></p>
      {reading.pinyin && <p><PinyinText>{reading.pinyin}</PinyinText></p>}{reading.spanish && <p>{reading.spanish}</p>}
      <SpeakButton text={reading.hanzi}/>
    </article>)}{!readings.length && <p>Continúa con los <Link href={`/study/${scope}/dialogues`}>diálogos de esta lección</Link>.</p>}</section>
    <p className="ai-audio-note shell">Audio de estudio generado con IA.</p>
  </main></SiteShell>;
}
