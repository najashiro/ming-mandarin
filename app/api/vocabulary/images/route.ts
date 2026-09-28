import { publishedVocabularyMedia } from '@/lib/server/vocabulary-images';
export const dynamic = 'force-dynamic';
export async function GET() {
  return Response.json(await publishedVocabularyMedia(), { headers: { 'cache-control': 'no-store' } });
}
