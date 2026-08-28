import { apiAdmin, jsonError } from '@/lib/server/api';
import { listCommunityModeration } from '@/lib/server/community';

export async function GET(request: Request) {
  try {
    await apiAdmin(); const url = new URL(request.url);
    return Response.json(await listCommunityModeration({ status: url.searchParams.get('status') ?? undefined, section: url.searchParams.get('section') ?? undefined, lessonId: Number(url.searchParams.get('lessonId') || 0), reported: url.searchParams.get('reported') === 'true', after: url.searchParams.get('after') ?? undefined }), { headers: { 'cache-control': 'private, no-store' } });
  } catch (error) { return jsonError(error); }
}
