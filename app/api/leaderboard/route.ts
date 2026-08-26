import { jsonError } from '@/lib/server/api';
import { getLeaderboard } from '@/lib/server/persistence';

export async function GET() {
  try { return Response.json(await getLeaderboard()); }
  catch (error) { return jsonError(error); }
}
