import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { DialogueRoleplay } from '@/components/DialogueRoleplay';
import { sentences } from '@/seed/sentences';
import { SpeakButton } from '@/components/SpeakButton';
export default function DialoguesPage(){return <SiteShell><main><LessonHeader eyebrow="课文 · DIÁLOGOS" title="Habla desde el primer día" description="Primero observa el texto; luego responde libremente con múltiples soluciones válidas."/><section className="dialogue-text shell">{sentences.slice(0,12).map(sentence=><article key={sentence.id}><div><h2>{sentence.hanzi}</h2><p>{sentence.pinyin}</p><span>{sentence.translation}</span></div><SpeakButton text={sentence.hanzi}/></article>)}</section><section className="shell"><DialogueRoleplay/></section></main></SiteShell>}
