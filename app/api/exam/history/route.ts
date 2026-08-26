import { apiUser, jsonError } from '@/lib/server/api';
import { getExamHistory } from '@/lib/server/persistence';

export async function GET() {
  try { return Response.json(await getExamHistory(await apiUser())); }
  catch (error) { return jsonError(error); }
}
