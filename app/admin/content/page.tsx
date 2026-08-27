import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/app/auth';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { vocabulary } from '@/seed/vocabulary';
import { sentences } from '@/seed/sentences';
import { grammarPoints } from '@/seed/grammar';
import { hanziSourceGroups, legacyCharacters, lesson1Characters } from '@/seed/characters';
import manifest from '@/public/hanzi-data/manifest.json';
import type { HanziSourceCode } from '@/data/types';

const filters: Array<['all' | HanziSourceCode, string]> = [
  ['all', 'Todos'], ['hanzi-1.1', 'Hanzi 1.1'], ['hanzi-1.2', 'Hanzi 1.2'], ['hanzi-1.3', 'Hanzi 1.3'], ['hanzi-1.4', 'Hanzi 1.4'], ['hanzi-1.5', 'Hanzi 1.5 · Repaso'],
];

export default async function AdminContent({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  const [user, query] = await Promise.all([requireUser('/admin/content'), searchParams]);
  const allow = (process.env.ADMIN_EMAILS ?? 'najashiro@gmail.com').split(',').map((value) => value.trim().toLowerCase()).filter(Boolean);
  if (!user.email || !allow.includes(user.email.toLowerCase())) redirect('/');
  const active = filters.some(([code]) => code === query.source) ? query.source as 'all' | HanziSourceCode : 'all';
  const generalSources = [...vocabulary, ...sentences, ...grammarPoints];
  const filteredCharacters = active === 'all' ? lesson1Characters : lesson1Characters.filter((item) => item.sourceGroups?.includes(active));
  return <SiteShell><main>
    <LessonHeader eyebrow="ADMIN · AUDITORÍA" title="Trazabilidad del contenido" description="Vista protegida para revisar qué fuente y página respaldan cada elemento." />
    <section className="audit-summary shell"><article><b>{vocabulary.length}</b> palabras</article><article><b>{sentences.length}</b> frases</article><article><b>{grammarPoints.length}</b> reglas</article><article><b>{lesson1Characters.length}</b> Hanzi curriculares</article></section>
    <div className="audit-table shell"><div className="audit-head"><span>Elemento</span><span>Tipo</span><span>Archivo</span><span>Página</span></div>{generalSources.map((item, index) => <div key={`${item.id}-${index}`}><b>{'hanzi' in item ? String(item.hanzi) : 'title' in item ? String(item.title) : ''}</b><span>{item.source.type}</span><span>{item.source.file}</span><span>PDF {item.source.pdfPage}{item.source.printedPage ? ` / imp. ${item.source.printedPage}` : ''}</span></div>)}</div>

    <section className="shell admin-hanzi-section"><h2>Currículo Hanzi · Lección 1</h2><p className="source-note">Las hojas 1.1–1.5 son trazabilidad administrativa. La experiencia del alumno se organiza en seis etapas pedagógicas. Los {legacyCharacters.length} registros complementarios anteriores se conservan fuera del conteo curricular.</p>
      <nav className="admin-source-filters" aria-label="Filtrar por hoja Hanzi">{filters.map(([code, label]) => <Link className={active === code ? 'selected' : ''} href={code === 'all' ? '/admin/content' : `/admin/content?source=${code}`} key={code}>{label}<small>{code === 'all' ? lesson1Characters.length : hanziSourceGroups[code].length}</small></Link>)}</nav>
    </section>
    <div className="audit-table hanzi-audit-table shell"><div className="audit-head"><span>汉字</span><span>Pinyin</span><span>Significado</span><span>Etapa</span><span>Trazos</span><span>Grupos</span><span>Fuentes / páginas</span><span>Escritura</span><span>Radical</span><span>Componentes</span><span>Datos</span></div>{filteredCharacters.map((item) => {
      const technical = manifest[item.hanzi as keyof typeof manifest];
      const worksheets = item.sources?.filter((source) => source.type === 'hanzi_worksheet') ?? [];
      return <div key={`hanzi-${item.id}`}><b>{item.hanzi}</b><span>{item.pinyin}</span><span>{item.meaning}</span><span>{item.primaryStage}</span><span>{technical?.strokeCount ?? '—'}</span><span>{item.sourceGroups?.map((group) => group.replace('hanzi-', '')).join(' · ')}</span><span>{worksheets.map((source) => `${source.file.match(/1\.[1-5]/)?.[0] ?? source.file} p.${source.pdfPage}`).join(' · ')}</span><strong>{item.writingRequired ? 'Sí' : 'No'}</strong><span>{item.radicalAudited ? item.radical : 'No auditado'}</span><span>{item.componentsAudited ? item.components.join(' + ') : 'No auditados'}</span><strong className={technical?.available ? 'available' : 'unavailable'}>{technical?.available ? 'Sí' : 'No'}</strong></div>;
    })}</div>
  </main></SiteShell>;
}
