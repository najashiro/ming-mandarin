import Link from 'next/link';
import { requireAdmin } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { AdminNav } from '@/components/admin/AdminNav';
import { hanziSourceGroups } from '@/seed/characters';
import { getCurriculum } from '@/seed/curriculum';
import manifest from '@/public/hanzi-data/manifest.json';
import type { HanziSourceCode } from '@/data/types';
import { PinyinText } from '@/components/PinyinText';

const filters: Array<['all' | HanziSourceCode, string]> = [
  ['all','Todos'],['1.1','1.1 · Texto 1'],['1.2','1.2 · Texto 2'],['2.1','2.1 · Texto 1'],['2.2','2.2 · Texto 2'],['3.1','3.1 · Texto 1'],['3.2','3.2 · Texto 2'],
];

export default async function AdminContent({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  const [, query] = await Promise.all([requireAdmin('/admin/content'), searchParams]);
  const active = filters.some(([code]) => code === query.source) ? query.source as 'all' | HanziSourceCode : 'all';
  const curriculum=getCurriculum('l1-l2-l3');
  const generalSources = [...curriculum.vocabulary, ...curriculum.sentences, ...curriculum.grammar];
  const filteredCharacters = active === 'all' ? curriculum.characters : curriculum.characters.filter((item) => item.appearsIn.includes(active));
  return <SiteShell><main>
    <LessonHeader eyebrow="ADMIN · AUDITORÍA" title="Trazabilidad del contenido" description="Vista protegida para revisar qué fuente y página respaldan cada elemento." />
    <AdminNav active="content"/>
    <section className="audit-summary shell"><article><b>{curriculum.vocabulary.length}</b> palabras</article><article><b>{curriculum.sentences.length}</b> frases</article><article><b>{curriculum.grammar.length}</b> reglas</article><article><b>{curriculum.characters.length}</b> Hanzi curriculares</article></section>
    <div className="audit-table shell"><div className="audit-head"><span>Elemento</span><span>Tipo</span><span>Archivo</span><span>Página</span></div>{generalSources.map((item, index) => <div key={`${item.id}-${index}`}><b>{'hanzi' in item ? String(item.hanzi) : 'title' in item ? String(item.title) : ''}</b><span>{item.source.type}</span><span>{item.source.file}</span><span>PDF {item.source.pdfPage}{item.source.printedPage ? ` / imp. ${item.source.printedPage}` : ''}</span></div>)}</div>

    <section className="shell admin-hanzi-section"><h2>Currículo Hanzi · Lecciones 1–3</h2><p className="source-note">Fuente canónica única organizada por Lección + Texto. Un Hanzi reutilizado conserva el mismo ID y puede aparecer en varias unidades.</p>
      <nav className="admin-source-filters" aria-label="Filtrar por hoja Hanzi">{filters.map(([code, label]) => <Link className={active === code ? 'selected' : ''} href={code === 'all' ? '/admin/content' : `/admin/content?source=${code}`} key={code}>{label}<small>{code === 'all' ? curriculum.characters.length : hanziSourceGroups[code].length}</small></Link>)}</nav>
    </section>
    <div className="audit-table hanzi-audit-table shell"><div className="audit-head"><span>汉字</span><span>Pinyin</span><span>Significado</span><span>Introducido</span><span>Trazos</span><span>Aparece en</span><span>Rol / fuente</span><span>Escritura</span><span>Radical</span><span>Componentes</span><span>Datos</span></div>{filteredCharacters.map((item) => {
      const technical = manifest[item.hanzi as keyof typeof manifest];
      return <div key={`hanzi-${item.id}`}><b>{item.hanzi}</b><span><PinyinText>{item.pinyin}</PinyinText></span><span>{item.meaning}</span><span>{item.introducedIn}</span><span>{technical?.strokeCount ?? '—'}</span><span>{item.appearsIn.join(' · ')}</span><span>{item.sourceRole}<small>{item.source.file} · PDF {item.source.pdfPage}</small></span><strong>{item.writingRequired ? 'Sí' : 'No'}</strong><span>{item.radicalAudited ? item.radical : 'No auditado'}</span><span>{item.componentsAudited ? item.components.join(' + ') : 'No auditados'}</span><strong className={technical?.available ? 'available' : 'unavailable'}>{technical?.available ? 'Sí' : 'No'}</strong></div>;
    })}</div>
  </main></SiteShell>;
}
