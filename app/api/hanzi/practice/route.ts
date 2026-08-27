import { apiUser, jsonError } from '@/lib/server/api';
import { recordHanziAttempt } from '@/lib/server/persistence';
import type { HanziAttemptPayload } from '@/lib/hanzi/types';

export async function POST(request: Request) {
  try {
    const user = await apiUser();
    const body = await request.json() as Partial<HanziAttemptPayload>;
    if (typeof body.characterId !== 'string'
      || !['guided', 'independent', 'exam'].includes(String(body.mode))
      || !['recognition', 'stroke_order', 'writing'].includes(String(body.skillDimension))
      || typeof body.completed !== 'boolean') throw new Error('Intento Hanzi incompleto.');
    return Response.json(await recordHanziAttempt(user, body as HanziAttemptPayload));
  } catch (error) {
    return jsonError(error);
  }
}
