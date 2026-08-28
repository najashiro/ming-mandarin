import { getCurrentUser } from '@/app/auth';
import { apiUser, jsonError } from '@/lib/server/api';
import { deleteCommunityThread, getCommunityThread, updateCommunityThread } from '@/lib/server/community';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return Response.json(await getCommunityThread((await params).id, await getCurrentUser()), { headers: { 'cache-control': 'no-store' } }); }
  catch (error) { return jsonError(error); }
}
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return Response.json(await updateCommunityThread(await apiUser(), (await params).id, await request.json())); }
  catch (error) { return jsonError(error); }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return Response.json(await deleteCommunityThread(await apiUser(), (await params).id)); }
  catch (error) { return jsonError(error); }
}
