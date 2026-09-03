import { apiUser, jsonError } from '@/lib/server/api';
import { getProgress } from '@/lib/server/persistence';
import { isCurriculumScope } from '@/seed/curriculum';

export async function GET(request: Request) {
  try { const value=new URL(request.url).searchParams.get('scope')??'l1'; return Response.json(await getProgress(await apiUser(),isCurriculumScope(value)?value:'l1')); }
  catch (error) { return jsonError(error); }
}
