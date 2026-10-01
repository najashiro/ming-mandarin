import { DialogueReadingAids } from '@/components/DialogueReadingAids';
import '@/app/dialogue-speakers.css';
import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinText } from '@/components/PinyinText';
import { SpeakButton } from '@/components/SpeakButton';
import { getCurriculum, isCurriculumScope } from '@/seed/curriculum';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { dialogueSpeakerFor } from '@/data/dialogue-speakers';
import type { CSSProperties } from 'react';

export default async function ScopeDialoguesPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope: rawScope }=await params; if(!isCurriculumScope(rawScope))notFound();
  const data=getCurriculum(rawScope); const corpus=publicCorpusForScope(rawScope);
  return <SiteShell><main><LessonHeader eyebrow={`${data.definition.shortLabel} · 课文`} title="Diálogos completos" description="Conversaciones organizadas por lección y texto. Abre cualquier carácter disponible en su ficha Hanzi."/><CurriculumNav scope={rawScope} section="dialogues"/>
    <DialogueReadingAids key={rawScope}><section className="corpus-dialogues shell">{corpus.dialogues.map((dialogue)=><article className="corpus-dialogue" key={dialogue.id}><header><p className="eyebrow">LECCIÓN {dialogue.lesson}</p><h2>{dialogue.text}</h2></header><ol>{dialogue.turns.map((turn)=>{const audio=audioForMandarinText(turn.hanzi, turn.pinyin || undefined);const speaker=dialogueSpeakerFor(turn.speaker);if(!speaker)throw new Error(`Interlocutor publicado sin presentación: ${turn.speaker}`);const style={'--speaker-bg':speaker.background,'--speaker-accent':speaker.accent} as CSSProperties;return <li className="dialogue-turn" data-speaker={speaker.id} data-speaker-token={speaker.token} style={style} id={`turn-${dialogue.id}-${turn.turn}`} key={turn.turn}><div className="dialogue-turn-heading"><b><span className="dialogue-speaker-hanzi"><LinkedChineseText text={turn.speaker} disabled/></span>{turn.speakerPinyin&&<span className="dialogue-pinyin"> · <PinyinText>{turn.speakerPinyin}</PinyinText></span>}:</b>{audio?<SpeakButton text={turn.hanzi} audioSrc={audio} compact label="Audio"/>:<span className="dialogue-audio-pending">Audio pendiente</span>}</div><strong className="dialogue-turn-text"><LinkedChineseText text={turn.hanzi} returnTo={`/study/${rawScope}/dialogues#turn-${dialogue.id}-${turn.turn}`}/></strong>{turn.pinyin&&<p className="dialogue-pinyin"><PinyinText>{turn.pinyin}</PinyinText></p>}{turn.spanish&&<span className="dialogue-spanish">{turn.spanish}</span>}</li>})}</ol></article>)}</section>
    <p className="ai-audio-note shell">Audio generado con IA cuando se indica como disponible.</p>
    <section className="shell"><h2>Frases para practicar</h2><div className="dialogue-text">{data.sentences.map((item)=><article id={item.id} key={item.id}><div><h3><LinkedChineseText text={item.hanzi} returnTo={`/study/${rawScope}/dialogues#${item.id}`}/></h3><p className="dialogue-pinyin"><PinyinText>{item.pinyin}</PinyinText></p><span className="dialogue-spanish">{item.translation}</span></div><SpeakButton text={item.hanzi} audioSrc={audioForMandarinText(item.hanzi)}/></article>)}</div></section>
  </DialogueReadingAids></main></SiteShell>;
}
