import { apiUser, jsonError } from '@/lib/server/api';
import { startExam } from '@/lib/server/persistence';

export async function POST() {
  try { return Response.json(await startExam(await apiUser())); }
  catch (error) { return jsonError(error); }
}
