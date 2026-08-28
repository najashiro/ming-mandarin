import { apiUser, jsonError } from '@/lib/server/api';
import { reportCommunityContent } from '@/lib/server/community';

export async function POST(request: Request) {
  try { return Response.json(await reportCommunityContent(await apiUser(), await request.json()), { status: 201 }); }
  catch (error) { return jsonError(error); }
}
