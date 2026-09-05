import { recordAnalyticsActivity } from '@/lib/server/analytics';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await recordAnalyticsActivity(body);
    return Response.json({ recorded: true }, { status: 202 });
  } catch {
    // La analítica nunca debe bloquear el estudio si Supabase no está disponible.
    return Response.json({ recorded: false }, { status: 202 });
  }
}
