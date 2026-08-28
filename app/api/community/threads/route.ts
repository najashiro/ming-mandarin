import { getCurrentUser } from '@/app/auth';
import { apiUser, jsonError } from '@/lib/server/api';
import { createCommunityThread, listCommunityThreads } from '@/lib/server/community';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    return Response.json(await listCommunityThreads({ scope: url.searchParams.get('scope') as never, sort: url.searchParams.get('sort') as never, lessonId: Number(url.searchParams.get('lessonId') || 1), section: url.searchParams.get('section') ?? undefined, concept: url.searchParams.get('concept') ?? undefined, search: url.searchParams.get('search') ?? undefined }, await getCurrentUser()), { headers: { 'cache-control': 'no-store' } });
  } catch (error) { return jsonError(error); }
}

export async function POST(request: Request) {
  try { return Response.json(await createCommunityThread(await apiUser(), await request.json()), { status: 201 }); }
  catch (error) { return jsonError(error); }
}
