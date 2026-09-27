import { apiAdmin, jsonError } from '@/lib/server/api';
import { listVocabularyImageReviews, updateVocabularyImageReview } from '@/lib/server/vocabulary-images';

export async function GET() {
  try {
    await apiAdmin();
    return Response.json(await listVocabularyImageReviews(), { headers: { 'cache-control': 'private, no-store' } });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await apiAdmin();
    const input = await request.json() as { wordId?: unknown; action?: unknown; prompt?: unknown };
    return Response.json(await updateVocabularyImageReview(admin.userId, input), { headers: { 'cache-control': 'private, no-store' } });
  } catch (error) {
    return jsonError(error);
  }
}
