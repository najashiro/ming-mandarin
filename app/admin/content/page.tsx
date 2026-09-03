import Link from 'next/link';
import { requireAdmin } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { hanziSourceGroups, legacyCharacters, lesson1Characters } from '@/seed/characters';
import { getCurriculum } from '@/seed/curriculum';
import manifest from '@/public/hanzi-data/manifest.json';
import type { HanziSourceCode } from '@/data/types';

const filters: Array<['all' | HanziSourceCode, string]> = [
  ['all', 'Todos'], ['hanzi-1.1', 'Hanzi 1.1'], ['hanzi-1.2', 'Hanzi 1.2'], ['hanzi-1.3', 'Hanzi 1.3'], ['hanzi-1.4', 'Hanzi 1.4'], ['hanzi-1.5', 'Hanzi 1.5 · Repaso'],
];

export default async function AdminContent({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  const [, query] = await Promise.all([requireAdmin('/admin/content'), searchParams]);
  const active = filters.some(([code]) => code === query.source) ? query.source as 'all' | HanziSourceCode : 'all';
  const curriculum=getCurriculum('l1-l2-l3');
  const generalSources = [...curriculum.vocabulary, ...curriculum.sentences, ...curriculum.grammar];
  const filteredCharacters = active === 'all' ? curriculum.characters : lesson1Characters.filter((item) => item.sourceGroups?.includes(active));
  return <SiteShell><main>
    <LessonHeader eyebrow="ADMIN · AUDITORÍA" title="Trazabilidad del contenido" description="Vista protegida para revisar qué fuente y página respaldan cada elemento." />
    <nav className="admin-nav shell" aria-label="Administración"><Link className="selected" href="/admin/content">Fuentes</Link><Link href="/admin/community">Comunidad</Link></nav>
    <section className="audit-summary shell"><article><b>{curriculum.vocabulary.length}</b> palabras</article><article><b>{curriculum.sentences.length}</b> frases</article><article><b>{curriculum.grammar.length}</b> reglas</article><article><b>{curriculum.characters.length}</b> Hanzi curriculares</article></section>
    <div className="audit-table shell"><div className="audit-head"><span>Elemento</span><span>Tipo</span><span>Archivo</span><span>Página</span></div>{generalSources.map((item, index) => <div key={`${item.id}-${index}`}><b>{'hanzi' in item ? String(item.hanzi) : 'title' in item ? String(item.title) : ''}</b><span>{item.source.type}</span><span>{item.source.file}</span><span>PDF {item.source.pdfPage}{item.source.printedPage ? ` / imp. ${item.source.printedPage}` : ''}</span></div>)}</div>

    <section className="shell admin-hanzi-section"><h2>Currículo Hanzi · Lecciones 1–3</h2><p className="source-note">Las hojas 1.1–1.5 conservan sus filtros históricos; L2/L3 se auditan en el inventario completo. Los {legacyCharacters.length} registros complementarios anteriores se conservan fuera del conteo curricular.</p>
      <nav className="admin-source-filters" aria-label="Filtrar por hoja Hanzi">{filters.map(([code, label]) => <Link className={active === code ? 'selected' : ''} href={code === 'all' ? '/admin/content' : `/admin/content?source=${code}`} key={code}>{label}<small>{code === 'all' ? curriculum.characters.length : hanziSourceGroups[code].length}</small></Link>)}</nav>
    </section>
    <div className="audit-table hanzi-audit-table shell"><div className="audit-head"><span>汉字</span><span>Pinyin</span><span>Significado</span><span>Etapa</span><span>Trazos</span><span>Grupos</span><span>Fuentes / páginas</span><span>Escritura</span><span>Radical</span><span>Componentes</span><span>Datos</span></div>{filteredCharacters.map((item) => {
      const technical = manifest[item.hanzi as keyof typeof manifest];
      const worksheets = item.sources?.filter((source) => source.type === 'hanzi_worksheet') ?? [];
      return <div key={`hanzi-${item.id}`}><b>{item.hanzi}</b><span>{item.pinyin}</span><span>{item.meaning}</span><span>{item.primaryStage}</span><span>{technical?.strokeCount ?? '—'}</span><span>{item.sourceGroups?.map((group) => group.replace('hanzi-', '')).join(' · ')}</span><span>{worksheets.map((source) => `${source.file.match(/1\.[1-5]/)?.[0] ?? source.file} p.${source.pdfPage}`).join(' · ')}</span><strong>{item.writingRequired ? 'Sí' : 'No'}</strong><span>{item.radicalAudited ? item.radical : 'No auditado'}</span><span>{item.componentsAudited ? item.components.join(' + ') : 'No auditados'}</span><strong className={technical?.available ? 'available' : 'unavailable'}>{technical?.available ? 'Sí' : 'No'}</strong></div>;
    })}</div>
  </main></SiteShell>;
}
