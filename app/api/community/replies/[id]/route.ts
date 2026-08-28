import { apiUser, jsonError } from '@/lib/server/api';
import { deleteCommunityReply, updateCommunityReply } from '@/lib/server/community';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const body = await request.json() as { body?: unknown }; return Response.json(await updateCommunityReply(await apiUser(), (await params).id, body.body)); }
  catch (error) { return jsonError(error); }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return Response.json(await deleteCommunityReply(await apiUser(), (await params).id)); }
  catch (error) { return jsonError(error); }
}
