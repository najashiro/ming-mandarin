import { apiUser, jsonError } from '@/lib/server/api';
import { submitExam } from '@/lib/server/persistence';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId?: string; answers?: Record<string,string> };
    if (typeof body.sessionId !== 'string' || typeof body.answers !== 'object') throw new Error('Examen incompleto.');
    return Response.json(await submitExam(await apiUser(), body as { sessionId: string; answers: Record<string,string> }));
  } catch (error) { return jsonError(error); }
}
