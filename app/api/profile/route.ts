import { apiUser, jsonError } from '@/lib/server/api';
import { getProgress, updateProfile } from '@/lib/server/persistence';

export async function GET() {
  try { return Response.json(await getProgress(await apiUser())); }
  catch (error) { return jsonError(error); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { displayName?: string; leaderboardOptIn?: boolean; timezone?: string };
    return Response.json(await updateProfile(await apiUser(), {
      displayName: String(body.displayName ?? ''),
      leaderboardOptIn: body.leaderboardOptIn === true,
      timezone: String(body.timezone ?? 'America/Lima'),
    }));
  } catch (error) { return jsonError(error); }
}
