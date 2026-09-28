import { apiAdmin, jsonError } from '@/lib/server/api';
import { listVocabularyImageReviews, updateVocabularyImageReview, regenerationQueue } from '@/lib/server/vocabulary-images';

export async function GET(request: Request) {
  try {
    await apiAdmin();
    if (new URL(request.url).searchParams.get('export') === 'regeneration') {
      return Response.json(await regenerationQueue(), { headers: { 'cache-control': 'private, no-store',
        'content-disposition': 'attachment; filename="ming-image-regeneration.json"' } });
    }
    return Response.json(await listVocabularyImageReviews(), { headers: { 'cache-control': 'private, no-store' } });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await apiAdmin();
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Origen no permitido.' }, { status: 403 });
    const input = await request.json() as Parameters<typeof updateVocabularyImageReview>[1];
    return Response.json(await updateVocabularyImageReview(admin.userId, input), { headers: { 'cache-control': 'private, no-store' } });
  } catch (error) {
    return jsonError(error);
  }
}
