import { apiUser, jsonError } from '@/lib/server/api';
import { getErrors } from '@/lib/server/persistence';
import { isCurriculumScope } from '@/seed/curriculum';

export async function GET(request: Request) {
  try { const value=new URL(request.url).searchParams.get('scope'); return Response.json(await getErrors(await apiUser(),value&&isCurriculumScope(value)?value:undefined)); }
  catch (error) { return jsonError(error); }
}
