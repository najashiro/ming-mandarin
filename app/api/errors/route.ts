import { apiUser, jsonError } from '@/lib/server/api';
import { getErrors } from '@/lib/server/persistence';

export async function GET() {
  try { return Response.json(await getErrors(await apiUser())); }
  catch (error) { return jsonError(error); }
}
