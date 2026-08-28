import { getCurrentUser } from '@/app/auth';
import { apiUser, jsonError } from '@/lib/server/api';
import { createCommunityReply, listCommunityReplies } from '@/lib/server/community';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return Response.json(await listCommunityReplies((await params).id, await getCurrentUser()), { headers: { 'cache-control': 'no-store' } }); }
  catch (error) { return jsonError(error); }
}
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const body = await request.json() as { body?: unknown }; return Response.json(await createCommunityReply(await apiUser(), (await params).id, body.body), { status: 201 }); }
  catch (error) { return jsonError(error); }
}
