import { Hanzi } from '@/components/Hanzi';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PracticeEngine } from '@/components/PracticeEngine';
import { grammarPoints } from '@/seed/grammar';
import { exercises } from '@/seed/exercises';
import { CommunityButton, CommunityContextProvider } from '@/components/community/CommunityProvider';
const concepts: Record<string,string>={ma:'吗',hen:'很',bu:'不','bu-tai':'不太',ye:'也',ne:'呢',order:'orden-básico'};
export default function GrammarPage(){const set=exercises.filter(item=>item.dimension==='grammar');return <SiteShell><CommunityContextProvider context={{lessonId:1,section:'grammar',skill:'grammar',route:'/lesson/1/grammar'}}><main><LessonHeader eyebrow="语法 · GRAMÁTICA" title="Estructuras de la Lección 1" description="Explicaciones breves, orden visible y práctica con retroalimentación por regla."/><section className="grammar-grid shell">{grammarPoints.map(point=><article className="panel" key={point.id}><h2><Hanzi>{point.title}</Hanzi></h2><div className="pattern"><Hanzi>{point.pattern}</Hanzi></div><p><Hanzi>{point.explanation}</Hanzi></p><ul>{point.examples.map(example=><li key={example}><Hanzi>{example}</Hanzi></li>)}</ul><CommunityButton label="Preguntar sobre esta regla" context={{concept:concepts[point.slug],route:`/lesson/1/grammar?concept=${encodeURIComponent(concepts[point.slug])}`}}/></article>)}</section><div className="shell narrow"><PracticeEngine exercises={set} title="Constructor gramatical"/></div></main></CommunityContextProvider></SiteShell>}
