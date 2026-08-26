import { apiUser, jsonError } from '@/lib/server/api';
import { recordPracticeAttempt } from '@/lib/server/persistence';

export async function POST(request: Request) {
  try {
    const user = await apiUser();
    const body = await request.json() as { exerciseId?: string; answer?: string; responseMs?: number; hintsUsed?: number; selfRating?: 'know' | 'doubt' | 'unknown' };
    if (typeof body.exerciseId !== 'string' || typeof body.answer !== 'string') throw new Error('Respuesta incompleta.');
    return Response.json(await recordPracticeAttempt(user, body as { exerciseId: string; answer: string; responseMs?: number; hintsUsed?: number; selfRating?: 'know' | 'doubt' | 'unknown' }));
  } catch (error) { return jsonError(error); }
}
