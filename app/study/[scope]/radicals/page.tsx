import { notFound } from 'next/navigation';
import { CurriculumNav } from '@/components/CurriculumNav';
import { LinkedChineseText } from '@/components/LinkedChineseText';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { PinyinText } from '@/components/PinyinText';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { isCurriculumScope, scopeDefinitions } from '@/seed/curriculum';

export default async function RadicalsPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params; if (!isCurriculumScope(scope)) notFound();
  const radicals = publicCorpusForScope(scope).radicals;
  const lessons = scopeDefinitions[scope].lessonIds;
  return <SiteShell><main><LessonHeader eyebrow={`${scopeDefinitions[scope].shortLabel} · 部首`} title="Radicales" description="Explora formas, lecturas y relaciones documentadas de manera independiente."/><CurriculumNav scope={scope} section="radicals"/>
    <div className="radical-lessons shell">{lessons.map((lesson)=>{const rows=radicals.map((radical)=>({...radical,examples:radical.examples.filter((example)=>example.lessons.includes(lesson))})).filter((radical)=>radical.examples.length);return rows.length?<section key={lesson}><h2>Lección {lesson}</h2><div className="radical-grid">{rows.map((item)=><article className="panel" key={`${lesson}-${item.id}`}><strong className="radical-glyph"><LinkedChineseText text={item.radical} disabled/></strong>{item.name&&<p className="radical-name"><PinyinText>{item.name}</PinyinText></p>}{item.meaning&&<p className="radical-meaning">{item.meaning}</p>}<div className="radical-examples" aria-label={`Ejemplos de ${item.radical}`}>{item.examples.map((example)=><div className="radical-example" key={example.hanzi}><LinkedChineseText text={example.hanzi}/><PinyinText>{example.pinyin!}</PinyinText></div>)}</div></article>)}</div></section>:null})}</div>
  </main></SiteShell>;
}
