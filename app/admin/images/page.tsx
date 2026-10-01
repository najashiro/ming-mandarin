import { requireAdmin } from '@/app/auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { VocabularyImageReview } from '@/components/admin/VocabularyImageReview';
import { LessonHeader, SiteShell } from '@/components/SiteShell';
import { listVocabularyImageReviews } from '@/lib/server/vocabulary-images';

export default async function AdminVocabularyImagesPage() {
  await requireAdmin('/admin/images');
  const { entries, planned, storageReady } = await listVocabularyImageReviews();
  return <SiteShell><main>
    <LessonHeader eyebrow="ADMIN · IMÁGENES" title="Revisión visual del vocabulario" description="Comprueba cada imagen y su prompt. Solo las aprobadas aparecen en las tarjetas; las pendientes y las marcadas como «No mostrar» permanecen ocultas."/>
    <AdminNav active="images"/>
    <VocabularyImageReview initialEntries={entries} storageReady={storageReady}/>
    <section className="shell"><h2>Lección 4 · Plan de imágenes</h2><p>Palabras sin recurso generado. Revisa su propuesta antes de generar; una propuesta no es una imagen aprobada.</p>
      {planned.map(entry => <details key={entry.wordId}><summary>{entry.hanzi} · {entry.spanish}</summary><p>{entry.reason}</p>{entry.prompt && <pre style={{ whiteSpace: 'pre-wrap' }}>{entry.prompt}</pre>}</details>)}
    </section>
  </main></SiteShell>;
}
