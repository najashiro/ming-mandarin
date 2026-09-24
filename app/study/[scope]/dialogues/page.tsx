import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton } from '@/components/SpeakButton';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { audioForMandarinText } from '@/lib/mandarin-audio';

function speakerTone(speaker: string) {
  return Array.from(speaker).reduce((total, character) => total + character.codePointAt(0)!, 0) % 6;
}

export default async function ScopeDialoguesPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope: rawScope }=await params; if(!isCurriculumScope(rawScope))notFound();
  const data=getCurriculum(rawScope); const corpus=publicCorpusForScope(rawScope);
  return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 课文`} title="Diálogos completos" description="Conversaciones organizadas por lección y texto. Abre cualquier carácter disponible en su ficha Hanzi."/><CurriculumNav scope={rawScope} section="dialogues"/>
    <section className="corpus-dialogues shell">{corpus.dialogues.map((dialogue)=><article className="corpus-dialogue" key={dialogue.id}><header><p className="eyebrow">LECCIÓN {dialogue.lesson}</p><h2>{dialogue.text}</h2></header><ol>{dialogue.turns.map((turn)=>{const audio=audioForMandarinText(turn.hanzi);return <li className={`dialogue-turn speaker-tone-${speakerTone(turn.speaker)}`} data-speaker={turn.speaker} id={`turn-${dialogue.id}-${turn.turn}`} key={turn.turn}><div className="dialogue-turn-heading"><b><span className="dialogue-speaker-hanzi"><LinkedChineseText text={turn.speaker} disabled/></span>{turn.speakerPinyin&&<> · <PinyinText>{turn.speakerPinyin}</PinyinText></>}:</b>{audio?<SpeakButton text={turn.hanzi} audioSrc={audio} compact label="Audio"/>:<span className="dialogue-audio-pending">Audio pendiente</span>}</div><strong className="dialogue-turn-text"><LinkedChineseText text={turn.hanzi} returnTo={`/study/${rawScope}/dialogues#turn-${dialogue.id}-${turn.turn}`}/></strong>{turn.pinyin&&<p><PinyinText>{turn.pinyin}</PinyinText></p>}{turn.spanish&&<span>{turn.spanish}</span>}</li>})}</ol></article>)}</section>
    <p className="ai-audio-note shell">Audio generado con IA cuando se indica como disponible.</p>
    <section className="shell"><h2>Frases para practicar</h2><div className="dialogue-text">{data.sentences.map((item)=><article id={item.id} key={item.id}><div><h3><LinkedChineseText text={item.hanzi} returnTo={`/study/${rawScope}/dialogues#${item.id}`}/></h3><p><PinyinText>{item.pinyin}</PinyinText></p><span>{item.translation}</span></div><SpeakButton text={item.hanzi} audioSrc={audioForMandarinText(item.hanzi)}/></article>)}</div></section>
  </main></SiteShell>;
}
