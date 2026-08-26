import 'server-only';

import type { AppUser } from '@/app/auth';
import type { Exercise } from '@/data/types';
import { scoreExamAnswers, type AnswerMap } from '@/lib/exam-score';
import { computeMasteryUpdate } from '@/lib/mastery';
import { comparePinyin, normalizeAnswer } from '@/lib/pinyin';
import { supabaseRest } from '@/lib/supabase/rest';
import { examBank } from '@/seed/exam';
import { exerciseById, exercises } from '@/seed/exercises';

type ProfileRow = {
  id: string;
  display_name: string;
  leaderboard_opt_in: boolean;
  timezone: string;
  xp: number;
  streak: number;
  last_study_date: string | null;
};

type MasteryRow = {
  user_id: string;
  item_type: string;
  item_id: string;
  skill_dimension: string;
  mastery: number;
  stability: number;
  difficulty: number;
  exposures: number;
  correct_count: number;
  incorrect_count: number;
  streak: number;
  last_seen_at: string | null;
  next_review_at: string | null;
};

export async function ensureProfile(user: AppUser) {
  const fallbackName = (user.fullName ?? (user.email ? user.email.split('@')[0] : user.displayName) ?? 'Estudiante').slice(0, 40);
  await supabaseRest('profiles?on_conflict=id', {
    method: 'POST',
    prefer: 'resolution=ignore-duplicates,return=minimal',
    body: {
      id: user.userId,
      display_name: fallbackName.length >= 2 ? fallbackName : 'Estudiante',
      leaderboard_opt_in: false,
      timezone: 'America/Lima',
      xp: 0,
      streak: 0,
    },
  });
}

export async function recordPracticeAttempt(user: AppUser, payload: { exerciseId: string; answer: string; responseMs?: number; hintsUsed?: number; selfRating?: 'know' | 'doubt' | 'unknown' }) {
  await ensureProfile(user);
  const exercise = exerciseById(payload.exerciseId);
  if (!exercise) throw new Error('Ejercicio desconocido.');
  const correct = checkExerciseAnswer(exercise, payload.answer);

  const [currentRows, profileRows] = await Promise.all([
    supabaseRest<MasteryRow[]>(`user_mastery?select=*&user_id=eq.${user.userId}&item_type=eq.${encodeURIComponent(exercise.type)}&item_id=eq.${encodeURIComponent(exercise.itemId)}&skill_dimension=eq.${encodeURIComponent(exercise.dimension)}&limit=1`),
    supabaseRest<ProfileRow[]>(`profiles?select=*&id=eq.${user.userId}&limit=1`),
  ]);
  const current = currentRows[0];
  const profile = profileRows[0];
  const timeZone = profile?.timezone || 'America/Lima';
  const today = formatStudyDate(new Date(), timeZone);
  const yesterday = formatStudyDate(new Date(Date.now() - 86_400_000), timeZone);
  const studyStreak = profile?.last_study_date === today ? profile.streak : profile?.last_study_date === yesterday ? profile.streak + 1 : 1;
  const { mastery, stability, nextReviewAt } = computeMasteryUpdate({
    previousMastery: current?.mastery ?? 0,
    previousStability: current?.stability ?? 0.4,
    difficulty: exercise.difficulty,
    correct,
    selfRating: payload.selfRating,
  });
  const now = new Date().toISOString();

  await supabaseRest('practice_attempts', {
    method: 'POST', prefer: 'return=minimal', body: {
      id: crypto.randomUUID(), user_id: user.userId, exercise_id: exercise.id, answer: payload.answer,
      correct, response_ms: payload.responseMs ?? 0, hints_used: payload.hintsUsed ?? 0, created_at: now,
    },
  });
  await supabaseRest('user_mastery?on_conflict=user_id,item_type,item_id,skill_dimension', {
    method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: {
      user_id: user.userId, item_type: exercise.type, item_id: exercise.itemId, skill_dimension: exercise.dimension,
      mastery, stability, difficulty: exercise.difficulty, exposures: (current?.exposures ?? 0) + 1,
      correct_count: (current?.correct_count ?? 0) + (correct ? 1 : 0),
      incorrect_count: (current?.incorrect_count ?? 0) + (correct ? 0 : 1),
      streak: correct ? (current?.streak ?? 0) + 1 : 0, last_seen_at: now, next_review_at: new Date(nextReviewAt).toISOString(),
    },
  });
  await supabaseRest(`profiles?id=eq.${user.userId}`, {
    method: 'PATCH', prefer: 'return=minimal', body: {
      xp: (profile?.xp ?? 0) + (correct ? 10 : 2), streak: studyStreak, last_study_date: today,
    },
  });

  if (correct) {
    await supabaseRest(`error_notebook?user_id=eq.${user.userId}&concept_id=eq.${encodeURIComponent(exercise.itemId)}&resolved_at=is.null`, {
      method: 'PATCH', prefer: 'return=minimal', body: { resolved_at: now },
    });
  } else {
    const existing = await supabaseRest<Array<{ id: string; occurrences: number }>>(`error_notebook?select=id,occurrences&user_id=eq.${user.userId}&concept_id=eq.${encodeURIComponent(exercise.itemId)}&error_type=eq.${encodeURIComponent(exercise.dimension)}&limit=1`);
    await supabaseRest('error_notebook?on_conflict=user_id,concept_id,error_type', {
      method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: {
        id: existing[0]?.id ?? crypto.randomUUID(), user_id: user.userId, concept_type: exercise.type,
        concept_id: exercise.itemId, error_type: exercise.dimension, given_answer: payload.answer,
        correct_answer: exercise.answer, rule: exercise.rule, occurrences: (existing[0]?.occurrences ?? 0) + 1,
        last_occurred_at: now, resolved_at: null,
      },
    });
  }

  return {
    correct,
    mastery: Math.round(mastery),
    xp: correct ? 10 : 2,
    feedback: {
      given: payload.answer,
      expected: exercise.answer,
      why: exercise.explanation,
      rule: exercise.rule,
      next: correct ? 'La próxima vez tendrás menos apoyo.' : 'Este concepto volverá pronto con una variante.',
    },
  };
}

export async function getProgress(user: AppUser) {
  await ensureProfile(user);
  const now = new Date().toISOString();
  const [profileRows, masteryRows, attempts, errors, dueRows, exams] = await Promise.all([
    supabaseRest<ProfileRow[]>(`profiles?select=*&id=eq.${user.userId}&limit=1`),
    supabaseRest<MasteryRow[]>(`user_mastery?select=*&user_id=eq.${user.userId}`),
    supabaseRest<Array<{ correct: boolean; exercise_id: string }>>(`practice_attempts?select=correct,exercise_id&user_id=eq.${user.userId}`),
    supabaseRest<Array<{ id: string }>>(`error_notebook?select=id&user_id=eq.${user.userId}&resolved_at=is.null`),
    supabaseRest<Array<{ item_id: string }>>(`user_mastery?select=item_id&user_id=eq.${user.userId}&next_review_at=lte.${encodeURIComponent(now)}`),
    supabaseRest<Array<{ score: number }>>(`exam_attempts?select=score&user_id=eq.${user.userId}`),
  ]);
  const dimensions = new Map<string, number[]>();
  for (const row of masteryRows) dimensions.set(row.skill_dimension, [...(dimensions.get(row.skill_dimension) ?? []), Number(row.mastery)]);
  const mastery = [...dimensions.entries()].map(([skill_dimension, values]) => ({
    skill_dimension,
    average: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10,
    concepts: values.length,
  }));
  const summary = {
    attempts: attempts.length,
    correct: attempts.filter((item) => item.correct).length,
    practiced: new Set(attempts.filter((item) => item.correct).map((item) => item.exercise_id)).size,
  };
  const bestScore = exams.length ? Math.max(...exams.map((item) => item.score)) : null;
  const general = mastery.length ? mastery.reduce((sum, row) => sum + row.average, 0) / mastery.length : 0;
  return { profile: profileRows[0], mastery, summary, unresolvedErrors: errors.length, due: dueRows.length, bestExam: { score: bestScore, attempts: exams.length }, general: Math.round(general) };
}

export async function getErrors(user: AppUser) {
  await ensureProfile(user);
  return supabaseRest<Array<Record<string, unknown>>>(`error_notebook?select=id,concept_type,concept_id,error_type,given_answer,correct_answer,rule,occurrences,last_occurred_at&user_id=eq.${user.userId}&resolved_at=is.null&order=last_occurred_at.desc`);
}

export async function getDailyExercises(user: AppUser) {
  await ensureProfile(user);
  const now = new Date().toISOString();
  const [errors, due, practiced] = await Promise.all([
    supabaseRest<Array<{ concept_id: string }>>(`error_notebook?select=concept_id&user_id=eq.${user.userId}&resolved_at=is.null&order=last_occurred_at.desc&limit=8`),
    supabaseRest<Array<{ item_id: string; skill_dimension: string }>>(`user_mastery?select=item_id,skill_dimension&user_id=eq.${user.userId}&next_review_at=lte.${encodeURIComponent(now)}&order=next_review_at.asc&limit=12`),
    supabaseRest<Array<{ exercise_id: string }>>(`practice_attempts?select=exercise_id&user_id=eq.${user.userId}`),
  ]);
  const seen = new Set<string>();
  const chosen: typeof exercises = [];
  const add = (item: (typeof exercises)[number] | undefined) => { if (item && !seen.has(item.id)) { seen.add(item.id); chosen.push(item); } };
  for (const row of errors) add(exercises.find((item) => item.itemId === row.concept_id));
  for (const row of due) add(exercises.find((item) => item.itemId === row.item_id && item.dimension === row.skill_dimension));
  const practicedIds = new Set(practiced.map((row) => row.exercise_id));
  for (const item of exercises) { if (chosen.length >= 7) break; if (!practicedIds.has(item.id) && !chosen.some((selected) => selected.dimension === item.dimension)) add(item); }
  for (const item of exercises) { if (chosen.length >= 7) break; add(item); }
  return chosen.slice(0, 7);
}

export async function updateProfile(user: AppUser, payload: { displayName: string; leaderboardOptIn: boolean; timezone: string }) {
  await ensureProfile(user);
  const name = payload.displayName.trim().slice(0, 40);
  if (name.length < 2) throw new Error('El nickname debe tener al menos 2 caracteres.');
  const timezone = payload.timezone || 'America/Lima';
  await supabaseRest(`profiles?id=eq.${user.userId}`, {
    method: 'PATCH', prefer: 'return=minimal', body: { display_name: name, leaderboard_opt_in: payload.leaderboardOptIn, timezone },
  });
  return { displayName: name, leaderboardOptIn: payload.leaderboardOptIn, timezone };
}

export async function startExam(user: AppUser) {
  await ensureProfile(user);
  const sessionId = crypto.randomUUID();
  const seed = crypto.randomUUID();
  await supabaseRest('exam_sessions', {
    method: 'POST', prefer: 'return=minimal', body: {
      id: sessionId, user_id: user.userId, lesson_id: 'lesson-1', seed, started_at: new Date().toISOString(), status: 'active',
    },
  });
  const questions = seededShuffle(examBank, seed).map((item) => {
    const { answer, ...question } = item;
    void answer;
    return { ...question, options: question.options ? seededShuffle(question.options, `${seed}-${question.id}`) : undefined };
  });
  return { sessionId, seed, questions };
}

export async function submitExam(user: AppUser, payload: { sessionId: string; answers: AnswerMap }) {
  await ensureProfile(user);
  const sessions = await supabaseRest<Array<{ id: string; started_at: string; status: string }>>(`exam_sessions?select=id,started_at,status&id=eq.${payload.sessionId}&user_id=eq.${user.userId}&limit=1`);
  const session = sessions[0];
  if (!session || session.status !== 'active') throw new Error('La sesión de examen no es válida o ya fue enviada.');

  const { sectionScores, review, score } = scoreExamAnswers(payload.answers);
  const now = new Date();
  const durationSeconds = Math.max(1, Math.round((now.getTime() - new Date(session.started_at).getTime()) / 1000));
  const profileRows = await supabaseRest<ProfileRow[]>(`profiles?select=xp&id=eq.${user.userId}&limit=1`);
  await supabaseRest('exam_attempts', {
    method: 'POST', prefer: 'return=minimal', body: {
      id: crypto.randomUUID(), exam_session_id: payload.sessionId, user_id: user.userId, score,
      section_scores: sectionScores, duration_seconds: durationSeconds, created_at: now.toISOString(),
    },
  });
  await Promise.all([
    supabaseRest(`exam_sessions?id=eq.${payload.sessionId}`, { method: 'PATCH', prefer: 'return=minimal', body: { completed_at: now.toISOString(), status: 'completed' } }),
    supabaseRest(`profiles?id=eq.${user.userId}`, { method: 'PATCH', prefer: 'return=minimal', body: { xp: (profileRows[0]?.xp ?? 0) + score } }),
  ]);
  return { score, sectionScores, review, durationSeconds };
}

export async function getExamHistory(user: AppUser) {
  await ensureProfile(user);
  return supabaseRest<Array<Record<string, unknown>>>(`exam_attempts?select=id,score,section_scores,duration_seconds,created_at&user_id=eq.${user.userId}&order=created_at.desc`);
}

export async function getLeaderboard() {
  return supabaseRest<Array<Record<string, unknown>>>('leaderboard_public?select=rank,display_name,avatar_url,best_score,perfect_exam_count,achieved_at&order=rank.asc,achieved_at.asc&limit=100');
}

function checkExerciseAnswer(exercise: Exercise, answer: string) {
  if (exercise.type === 'pinyin' && /[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(exercise.answer)) return comparePinyin(answer, exercise.answer, true);
  return normalizeAnswer(answer) === normalizeAnswer(exercise.answer);
}

function formatStudyDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  let value = [...seed].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const target = value % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}
