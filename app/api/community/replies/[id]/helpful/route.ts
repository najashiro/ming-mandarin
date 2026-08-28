import { apiUser, jsonError } from '@/lib/server/api';
import { toggleHelpful } from '@/lib/server/community';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return Response.json(await toggleHelpful(await apiUser(), (await params).id)); }
  catch (error) { return jsonError(error); }
}
