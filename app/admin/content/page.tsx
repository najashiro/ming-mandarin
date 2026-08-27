import { redirect } from 'next/navigation';
import { requireUser } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { vocabulary } from '@/seed/vocabulary';
import { sentences } from '@/seed/sentences';
import { grammarPoints } from '@/seed/grammar';
import { characters } from '@/seed/characters';
import manifest from '@/public/hanzi-data/manifest.json';

export default async function AdminContent(){
  const user=await requireUser('/admin/content');
  const allow=(process.env.ADMIN_EMAILS??'najashiro@gmail.com').split(',').map(value=>value.trim().toLowerCase()).filter(Boolean);
  if(!user.email || !allow.includes(user.email.toLowerCase()))redirect('/');
  const sources=[...vocabulary,...sentences,...grammarPoints,...characters];
  return <SiteShell><main><LessonHeader eyebrow="ADMIN · AUDITORÍA" title="Trazabilidad del contenido" description="Vista protegida para revisar qué fuente y página respaldan cada elemento."/><section className="audit-summary shell"><article><b>{vocabulary.length}</b> palabras</article><article><b>{sentences.length}</b> frases</article><article><b>{grammarPoints.length}</b> reglas</article><article><b>{characters.length}</b> caracteres</article></section><div className="audit-table shell"><div className="audit-head"><span>Elemento</span><span>Tipo</span><span>Archivo</span><span>Página</span></div>{sources.map((item,index)=><div key={`${item.id}-${index}`}><b>{'hanzi' in item?String(item.hanzi):'title' in item?String(item.title):''}</b><span>{item.source.type}</span><span>{item.source.file}</span><span>PDF {item.source.pdfPage}{item.source.printedPage?` / imp. ${item.source.printedPage}`:''}</span></div>)}</div><section className="shell admin-hanzi-section"><h2>Disponibilidad técnica Hanzi</h2><p className="source-note">Audita por separado el contenido curricular y el archivo gráfico local. Un dato ausente desactiva la práctica, nunca crea trazos ficticios.</p></section><div className="audit-table hanzi-audit-table shell"><div className="audit-head"><span>Lección</span><span>汉字</span><span>Pinyin / significado</span><span>Radical / componentes</span><span>Trazos</span><span>Exigencia</span><span>Fuente</span><span>Nota pedagógica</span><span>hanzi_data_available</span></div>{characters.map((item)=>{const technical=manifest[item.hanzi as keyof typeof manifest];return <div key={`hanzi-${item.id}`}><span>{item.lessonId}</span><b>{item.hanzi}</b><span>{item.pinyin} · {item.meaning}</span><span>{item.radical} · {item.components.join(' + ')}</span><span>{technical?.strokeCount ?? '—'}</span><span>{item.recognitionRequired?'R':''}{item.writingRequired?' + W':''}</span><span>PDF {item.source.pdfPage}</span><span>{item.pedagogicalNote??'Sin nota añadida'}</span><strong className={technical?.available?'available':'unavailable'}>{technical?.available?'Sí':'No'}</strong></div>})}</div></main></SiteShell>;
}
