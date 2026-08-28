import { getCurrentUser } from '@/app/auth';
import { jsonError } from '@/lib/server/api';
import { getCommunityIdentity } from '@/lib/server/community';

export async function GET() {
  try { return Response.json(await getCommunityIdentity(await getCurrentUser()), { headers: { 'cache-control': 'private, no-store' } }); }
  catch (error) { return jsonError(error); }
}
