import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/auth';
import { supabaseSecretKey } from '@/lib/supabase/config';
import { supabaseRest } from '@/lib/supabase/rest';
import { issueTimeChallengeToken, verifyTimeChallengeToken } from '@/lib/time-challenge-token';
import { TIME_CHALLENGE_SECONDS, TIME_RULES_VERSION, type TimeRuleMode } from '@/data/time-game';

type ScoreInput = { token?: string; name?: string; score?: number; maxDifficulty?: number; correctAnswers?: number; maxStreak?: number; masteryBonusTotal?: number };
type RankRow = { rank: number; user_id: string; player_name: string; score: number };

async function leaderboard(userId: string, rules:TimeRuleMode) {
  const filter=`rules_mode=eq.${rules}&duration_seconds=eq.${TIME_CHALLENGE_SECONDS}&rules_version=eq.${TIME_RULES_VERSION}`;
  const [rows, own] = await Promise.all([
    supabaseRest<RankRow[]>(`time_game_leaderboard?select=rank,user_id,player_name,score&${filter}&order=rank.asc&limit=100`),
    supabaseRest<RankRow[]>(`time_game_leaderboard?select=rank,user_id,player_name,score&${filter}&user_id=eq.${userId}&limit=1`),
  ]);
  return { rank: own[0]?.rank ?? null, ranking: rows.map(({ rank, player_name, score }) => ({ rank, player_name, score })) };
}

export async function PUT(request:Request) {
  try {
    const body=await request.json().catch(()=>({})) as {rules?:string};
    const rules:TimeRuleMode=body.rules==='hard'?'hard':'normal';
    return NextResponse.json({ token: issueTimeChallengeToken(supabaseSecretKey(),rules) });
  } catch {
    return NextResponse.json({ error: 'No se pudo preparar el ranking.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Completa tu nombre para guardar el ranking.' }, { status: 401 });
  let body: ScoreInput;
  try { body = await request.json() as ScoreInput; } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }); }
  const valid = (value: unknown, max: number) => typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= max;
  const name = String(body.name ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
  if (name.length < 2 || !valid(body.score, 100000) || !valid(body.maxDifficulty, 100) || !valid(body.correctAnswers, 1000) || !valid(body.maxStreak, 1000) || !valid(body.masteryBonusTotal, 2000)) {
    return NextResponse.json({ error: 'Nombre o resultado inválido.' }, { status: 400 });
  }
  const session = verifyTimeChallengeToken(String(body.token ?? ''), supabaseSecretKey());
  if (!session || body.correctAnswers! > 240 || body.maxStreak! > body.correctAnswers! || body.masteryBonusTotal! > body.correctAnswers! * 2 || body.score! > body.correctAnswers! * 17 || body.maxDifficulty! > Math.min(100, body.correctAnswers! * 6)) {
    return NextResponse.json({ error: 'El reto aún no ha terminado o el resultado no es válido.' }, { status: 400 });
  }
  try {
    await supabaseRest('time_game_sessions?on_conflict=id', { method: 'POST', prefer: 'resolution=ignore-duplicates,return=minimal', body: { id: session.id, user_id: user.userId, started_at: new Date(session.startedAt).toISOString(),rules_mode:session.rules,duration_seconds:session.durationSeconds,rules_version:session.rulesVersion } });
    const existing = await supabaseRest<Array<{ user_id: string }>>(`time_game_sessions?select=user_id&id=eq.${session.id}&limit=1`);
    if (existing[0]?.user_id !== user.userId) return NextResponse.json({ error: 'Sesión inválida.' }, { status: 403 });
    await supabaseRest(`profiles?id=eq.${user.userId}`, { method: 'PATCH', prefer: 'return=minimal', body: { display_name: name, leaderboard_opt_in: true } });
    await supabaseRest('time_game_scores?on_conflict=session_id', { method: 'POST', prefer: 'resolution=ignore-duplicates,return=minimal', body: {
      session_id: session.id, user_id: user.userId, player_name: name, game_id: 'hora', score: body.score, max_difficulty: body.maxDifficulty,
      correct_answers: body.correctAnswers, max_streak: body.maxStreak, mastery_bonus_total: body.masteryBonusTotal,
      rules_mode:session.rules,duration_seconds:session.durationSeconds,rules_version:session.rulesVersion,
    } });
    return NextResponse.json(await leaderboard(user.userId,session.rules));
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar el ranking. Inténtalo de nuevo.' }, { status: 503 });
  }
}
