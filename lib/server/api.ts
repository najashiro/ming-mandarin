import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function apiUser() {
  const user = await getChatGPTUser();
  if (!user) throw new ApiError(401, 'Inicia sesión para guardar tu progreso.');
  return user;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function jsonError(error: unknown) {
  const status = error instanceof ApiError ? error.status : 400;
  const message = error instanceof Error ? error.message : 'No se pudo completar la operación.';
  return Response.json({ error: message }, { status });
}
