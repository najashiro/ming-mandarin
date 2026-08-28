import { getCurrentUser, isAuthorizedAdmin } from '@/app/auth';

export async function apiUser() {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, 'Elige un nombre para guardar tu progreso.');
  return user;
}

export async function apiAdmin() {
  const user = await apiUser();
  if (!(await isAuthorizedAdmin(user))) throw new ApiError(403, 'No tienes permiso para moderar la comunidad.');
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
