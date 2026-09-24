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
  return <SiteShell><main><LessonHeader eyebrow={`${scopeDefinitions[scope].shortLabel} · 部首`} title="Radicales" description="Explora formas, lecturas y relaciones documentadas de manera independiente."/><CurriculumNav scope={scope} section="radicals"/>
    <nav className="radical-views shell" aria-label="Vistas de Radicales"><a href="#explorar">Explorar</a><a href="#aprender">Aprender</a><a href="#practicar">Practicar</a></nav>
    <section id="explorar" className="radical-grid shell">{radicals.map((item)=><article className="panel" key={item.id}><strong className="radical-glyph">{item.radical}</strong><h2>{item.name&&<PinyinText>{item.name}</PinyinText>}</h2>{item.meaning&&<p>{item.meaning}</p>}<div className="radical-examples" aria-label="Caracteres relacionados">{item.hanzi.map((hanzi)=><LinkedChineseText text={hanzi} key={hanzi}/>)}</div></article>)}</section>
    <section id="aprender" className="panel shell radical-study"><h2>Aprender</h2><p>Compara cada forma con los caracteres vinculados. Las formas parecidas se mantienen separadas.</p></section>
    <section id="practicar" className="panel shell radical-study"><h2>Practicar</h2><p>Elige una tarjeta, di su lectura y comprueba sus ejemplos. Esta práctica no publica ni reutiliza preguntas de evaluaciones.</p></section>
  </main></SiteShell>;
}
