import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinText } from '@/components/PinyinText';
import { DialogueRoleplay } from '@/components/DialogueRoleplay';
import { sentences } from '@/seed/sentences';
import { SpeakButton } from '@/components/SpeakButton';
import { CommunityButton, CommunityContextProvider } from '@/components/community/CommunityProvider';
import { audioForMandarinText } from '@/lib/mandarin-audio';
export default function DialoguesPage(){return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'dialogues',concept:'dialogue-1',skill:'communication',route:'/lesson/1/dialogues'}}><main><LessonHeader eyebrow="课文 · DIÁLOGOS" title="Habla desde el primer día" description="Primero observa el texto; luego responde libremente con múltiples soluciones válidas."/><div className="community-page-action shell"><CommunityButton label="Preguntar sobre el diálogo"/></div><section className="dialogue-text shell">{sentences.slice(0,12).map(sentence=><article key={sentence.id}><div><h2>{sentence.hanzi}</h2><p><PinyinText>{sentence.pinyin}</PinyinText></p><span>{sentence.translation}</span></div><SpeakButton text={sentence.hanzi} audioSrc={audioForMandarinText(sentence.hanzi)}/></article>)}</section><section className="shell"><DialogueRoleplay/></section></main></CommunityContextProvider></SiteShell>}
