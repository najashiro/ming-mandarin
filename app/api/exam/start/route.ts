import { apiUser, jsonError } from '@/lib/server/api';
import { startExam } from '@/lib/server/persistence';
import { isCurriculumScope } from '@/seed/curriculum';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as { scope?: string };
    const scope = body.scope && isCurriculumScope(body.scope) ? body.scope : 'l1';
    return Response.json(await startExam(await apiUser(), scope));
  }
  catch (error) { return jsonError(error); }
}
