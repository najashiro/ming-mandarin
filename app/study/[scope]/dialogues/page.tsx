import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton } from '@/components/SpeakButton';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { audioForMandarinText } from '@/lib/mandarin-audio';

export default async function ScopeDialoguesPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope: rawScope }=await params; if(!isCurriculumScope(rawScope))notFound();
  const data=getCurriculum(rawScope); const corpus=publicCorpusForScope(rawScope);
  return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 课文`} title="Diálogos completos" description="Conversaciones organizadas por lección y texto. Abre cualquier carácter disponible en su ficha Hanzi."/><CurriculumNav scope={rawScope} section="dialogues"/>
    <section className="corpus-dialogues shell">{corpus.dialogues.map((dialogue)=><article className="panel corpus-dialogue" key={`${dialogue.lesson}-${dialogue.text}`}><p className="eyebrow">LECCIÓN {dialogue.lesson} · {dialogue.text.toUpperCase()}</p><h2>{dialogue.text}</h2>{dialogue.versions.map((version)=><section key={version.id}><h3>{version.label}</h3><ol>{version.turns.map((turn)=><li id={`turn-${version.id}-${turn.turn}`} key={turn.turn}><b>{turn.speaker}</b><div><strong><LinkedChineseText text={turn.hanzi} returnTo={`/study/${rawScope}/dialogues#turn-${version.id}-${turn.turn}`}/></strong>{turn.pinyin&&<p><PinyinText>{turn.pinyin}</PinyinText></p>}{turn.spanish&&<span>{turn.spanish}</span>}</div><SpeakButton text={turn.hanzi} audioSrc={audioForMandarinText(turn.hanzi)}/></li>)}</ol></section>)}</article>)}</section>
    <section className="shell"><h2>Frases para practicar</h2><div className="dialogue-text">{data.sentences.map((item)=><article id={item.id} key={item.id}><div><h3><LinkedChineseText text={item.hanzi} returnTo={`/study/${rawScope}/dialogues#${item.id}`}/></h3><p><PinyinText>{item.pinyin}</PinyinText></p><span>{item.translation}</span></div><SpeakButton text={item.hanzi} audioSrc={audioForMandarinText(item.hanzi)}/></article>)}</div></section>
  </main></SiteShell>;
}
