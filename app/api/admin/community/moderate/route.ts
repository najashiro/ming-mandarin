import { apiAdmin, jsonError } from '@/lib/server/api';
import { moderateCommunityContent } from '@/lib/server/community';

export async function POST(request: Request) {
  try { return Response.json(await moderateCommunityContent(await apiAdmin(), await request.json())); }
  catch (error) { return jsonError(error); }
}
