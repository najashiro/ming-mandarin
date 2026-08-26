import { SiteShell, LessonHeader, SourceBadge } from '@/components/SiteShell';
import { PracticeEngine } from '@/components/PracticeEngine';
import { grammarPoints } from '@/seed/grammar';
import { exercises } from '@/seed/exercises';
export default function GrammarPage(){const set=exercises.filter(item=>item.dimension==='grammar');return <SiteShell><main><LessonHeader eyebrow="语法 · GRAMÁTICA" title="Estructuras de la Lección 1" description="Explicaciones breves, orden visible y práctica con retroalimentación por regla."/><section className="grammar-grid shell">{grammarPoints.map(point=><article className="panel" key={point.id}><SourceBadge page={point.source.pdfPage}/><h2>{point.title}</h2><div className="pattern">{point.pattern}</div><p>{point.explanation}</p><ul>{point.examples.map(example=><li key={example}>{example}</li>)}</ul></article>)}</section><div className="shell narrow"><PracticeEngine exercises={set} title="Constructor gramatical"/></div></main></SiteShell>}
