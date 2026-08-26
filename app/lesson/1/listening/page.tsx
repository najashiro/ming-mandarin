import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { SpeakButton } from '@/components/SpeakButton';
import { PracticeEngine } from '@/components/PracticeEngine';
import { exercises } from '@/seed/exercises';
const clips=[['你最近怎么样？','Nǐ zuìjìn zěnmeyàng?'],['我很好。你呢？','Wǒ hěn hǎo. Nǐ ne?'],['我不太忙。','Wǒ bú tài máng.'],['请进，请坐。','Qǐng jìn, qǐng zuò.']];
export default function ListeningPage(){const set=exercises.filter(item=>['tone','dialogue','reading'].includes(item.type)).slice(0,12);return <SiteShell><main><LessonHeader eyebrow="语音 · ESCUCHA" title="Laboratorio auditivo" description="Voz sintética zh-CN identificada como tal; velocidad ajustable en shadowing."/><section className="clip-grid shell">{clips.map(([hanzi,pinyin])=><article className="panel" key={hanzi}><h2>{hanzi}</h2><p className="word-pinyin">{pinyin}</p><div className="speed-row"><SpeakButton text={hanzi} rate={.7} label="0.7×"/><SpeakButton text={hanzi} rate={.85} label="0.85×"/><SpeakButton text={hanzi} rate={1} label="1×"/></div></article>)}</section><div className="shell narrow"><PracticeEngine exercises={set} title="Escucha, tonos y comprensión"/></div></main></SiteShell>}
