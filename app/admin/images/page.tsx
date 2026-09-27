import { requireAdmin } from '@/app/auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { VocabularyImageReview } from '@/components/admin/VocabularyImageReview';
import { LessonHeader, SiteShell } from '@/components/SiteShell';
import { listVocabularyImageReviews } from '@/lib/server/vocabulary-images';

export default async function AdminVocabularyImagesPage() {
  await requireAdmin('/admin/images');
  const { entries, storageReady } = await listVocabularyImageReviews();
  return <SiteShell><main>
    <LessonHeader eyebrow="ADMIN · IMÁGENES" title="Revisión visual del vocabulario" description="Comprueba cada imagen y su prompt. Solo las aprobadas aparecen en las tarjetas; las pendientes y las marcadas como «No mostrar» permanecen ocultas."/>
    <AdminNav active="images"/>
    <VocabularyImageReview initialEntries={entries} storageReady={storageReady}/>
  </main></SiteShell>;
}
