import { redirect } from 'next/navigation';
import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { vocabulary } from '@/seed/vocabulary';
import { sentences } from '@/seed/sentences';
import { grammarPoints } from '@/seed/grammar';
import { characters } from '@/seed/characters';

export default async function AdminContent(){
  const user=await requireChatGPTUser('/admin/content');
  const allow=(process.env.ADMIN_EMAILS??'').split(',').map(value=>value.trim()).filter(Boolean);
  if(allow.length&&!allow.includes(user.email))redirect('/');
  const sources=[...vocabulary,...sentences,...grammarPoints,...characters];
  return <SiteShell><main><LessonHeader eyebrow="ADMIN · AUDITORÍA" title="Trazabilidad del contenido" description="Vista protegida para revisar qué fuente y página respaldan cada elemento."/><section className="audit-summary shell"><article><b>{vocabulary.length}</b> palabras</article><article><b>{sentences.length}</b> frases</article><article><b>{grammarPoints.length}</b> reglas</article><article><b>{characters.length}</b> caracteres</article></section><div className="audit-table shell"><div className="audit-head"><span>Elemento</span><span>Tipo</span><span>Archivo</span><span>Página</span></div>{sources.map((item,index)=><div key={`${item.id}-${index}`}><b>{'hanzi' in item?String(item.hanzi):'title' in item?String(item.title):''}</b><span>{item.source.type}</span><span>{item.source.file}</span><span>PDF {item.source.pdfPage}{item.source.printedPage?` / imp. ${item.source.printedPage}`:''}</span></div>)}</div></main></SiteShell>;
}
