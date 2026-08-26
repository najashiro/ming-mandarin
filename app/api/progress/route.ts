import { apiUser, jsonError } from '@/lib/server/api';
import { getProgress } from '@/lib/server/persistence';

export async function GET() {
  try { return Response.json(await getProgress(await apiUser())); }
  catch (error) { return jsonError(error); }
}
