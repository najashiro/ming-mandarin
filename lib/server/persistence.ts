import 'server-only';

import type { ChatGPTUser } from '@/app/chatgpt-auth';
import { getBindings } from '@/db';
import type { Exercise } from '@/data/types';
import { examBank } from '@/seed/exam';
import { exerciseById } from '@/seed/exercises';
import { exercises } from '@/seed/exercises';
import { vocabulary } from '@/seed/vocabulary';
import { sentences } from '@/seed/sentences';
import { grammarPoints } from '@/seed/grammar';
import { characters } from '@/seed/characters';
import { comparePinyin, normalizeAnswer } from '@/lib/pinyin';
import { computeMasteryUpdate } from '@/lib/mastery';
import { isCertificateEligible, scoreExamAnswers, type AnswerMap } from '@/lib/exam-score';

const MASTER_ACHIEVEMENT_ID = 'ach-first-lesson-master';

export async function ensureProfile(user: ChatGPTUser) {
  const { DB } = getBindings();
  const fallbackName = user.fullName ?? user.email.split('@')[0] ?? 'Estudiante';
  await DB.batch([
    DB.prepare('INSERT OR IGNORE INTO profiles (id, display_name, leaderboard_opt_in, timezone, xp, streak, created_at) VALUES (?, ?, 0, ?, 0, 0, ?)')
      .bind(user.userId, fallbackName, 'America/Lima', Date.now()),
    DB.prepare('INSERT OR IGNORE INTO lessons (id, number, title_hanzi, title_pinyin, title_es) VALUES (?, 1, ?, ?, ?)')
      .bind('lesson-1', '你最近怎么样？', 'Nǐ zuìjìn zěnmeyàng?', '¿Cómo has estado?'),
    DB.prepare('INSERT OR IGNORE INTO achievements (id, code, title_es, title_zh) VALUES (?, ?, ?, ?)')
      .bind(MASTER_ACHIEVEMENT_ID, 'FIRST_LESSON_MASTER', 'Maestro de la Lección 1', '第一课大师'),
  ]);
  await seedLessonContent(DB);
}

async function seedLessonContent(DB: D1Database) {
  const ready = await DB.prepare('SELECT id FROM vocabulary LIMIT 1').first();
  if (ready) return;
  const statements: D1PreparedStatement[] = [];
  for (const item of vocabulary) statements.push(DB.prepare(`INSERT OR IGNORE INTO vocabulary
    (id, lesson_id, hanzi, pinyin, translation_es, grammatical_type, category, is_core, source_type, source_file, source_page)
    VALUES (?, 'lesson-1', ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(item.id, item.hanzi, item.pinyin, item.translation, item.grammaticalType, item.category, item.isCore ? 1 : 0, item.source.type, item.source.file, item.source.pdfPage));
  for (const item of sentences) statements.push(DB.prepare(`INSERT OR IGNORE INTO sentences
    (id, lesson_id, hanzi, pinyin, translation_es, grammar_tags, source_file, source_page) VALUES (?, 'lesson-1', ?, ?, ?, ?, ?, ?)`)
    .bind(item.id, item.hanzi, item.pinyin, item.translation, JSON.stringify(item.grammarTags), item.source.file, item.source.pdfPage));
  for (const item of grammarPoints) statements.push(DB.prepare(`INSERT OR IGNORE INTO grammar_points
    (id, lesson_id, slug, title, explanation, source_file, source_page) VALUES (?, 'lesson-1', ?, ?, ?, ?, ?)`)
    .bind(item.id, item.slug, item.title, `${item.pattern}\n${item.explanation}`, item.source.file, item.source.pdfPage));
  for (const item of characters) statements.push(DB.prepare(`INSERT OR IGNORE INTO characters
    (id, hanzi, pinyin, meaning, stroke_count, radical, components, recognition_required, writing_required, source_file, source_page)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(item.id, item.hanzi, item.pinyin, item.meaning, item.strokeCount, item.radical, JSON.stringify(item.components), item.recognitionRequired ? 1 : 0, item.writingRequired ? 1 : 0, item.source.file, item.source.pdfPage));
  for (const item of exercises) statements.push(DB.prepare(`INSERT OR IGNORE INTO exercises
    (id, lesson_id, type, difficulty, payload, solution_server, source_type, source_page) VALUES (?, 'lesson-1', ?, ?, ?, ?, ?, ?)`)
    .bind(item.id, item.type, item.difficulty, JSON.stringify({ prompt: item.prompt, options: item.options, explanation: item.explanation, rule: item.rule, itemId: item.itemId, dimension: item.dimension }), item.answer, item.source.type, item.source.pdfPage));
  statements.push(DB.prepare(`INSERT OR IGNORE INTO source_conflicts
    (id, item_type, item_id, canonical_value, class_note, status, created_at) VALUES (?, ?, ?, ?, ?, 'recorded', ?)`)
    .bind('source-note-hen', 'grammar', 'g-hen', 'Predicado adjetival: sujeto + 很 + adjetivo; 很 puede actuar como enlace estructural.', 'La presentación lo aproxima inicialmente a “muy”; la aplicación conserva la observación completa del libro.', Date.now()));
  for (let offset = 0; offset < statements.length; offset += 75) await DB.batch(statements.slice(offset, offset + 75));
}

export async function recordPracticeAttempt(user: ChatGPTUser, payload: { exerciseId: string; answer: string; responseMs?: number; hintsUsed?: number; selfRating?: 'know' | 'doubt' | 'unknown' }) {
  await ensureProfile(user);
  const exercise = exerciseById(payload.exerciseId);
  if (!exercise) throw new Error('Ejercicio desconocido.');

  const correct = checkExerciseAnswer(exercise, payload.answer);
  const { DB } = getBindings();
  const key = [user.userId, exercise.type, exercise.itemId, exercise.dimension];
  const current = await DB.prepare('SELECT mastery, stability, difficulty, exposures, correct_count, incorrect_count, streak FROM user_mastery WHERE user_id = ? AND item_type = ? AND item_id = ? AND skill_dimension = ?')
    .bind(...key).first<{ mastery: number; stability: number; difficulty: number; exposures: number; correct_count: number; incorrect_count: number; streak: number }>();
  const profile = await DB.prepare('SELECT timezone, streak, last_study_date FROM profiles WHERE id = ?').bind(user.userId).first<{ timezone: string; streak: number; last_study_date: string | null }>();
  const timeZone = profile?.timezone || 'America/Lima';
  const today = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const yesterday = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Date.now() - 86_400_000));
  const studyStreak = profile?.last_study_date === today ? profile.streak : profile?.last_study_date === yesterday ? profile.streak + 1 : 1;

  const { mastery, stability, nextReviewAt } = computeMasteryUpdate({ previousMastery: current?.mastery ?? 0, previousStability: current?.stability ?? 0.4, difficulty: exercise.difficulty, correct, selfRating: payload.selfRating });
  const attemptId = crypto.randomUUID();

  const statements = [
    DB.prepare('INSERT INTO practice_attempts (id, user_id, exercise_id, answer, correct, response_ms, hints_used, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(attemptId, user.userId, exercise.id, payload.answer, correct ? 1 : 0, payload.responseMs ?? 0, payload.hintsUsed ?? 0, Date.now()),
    DB.prepare(`INSERT INTO user_mastery (user_id, item_type, item_id, skill_dimension, mastery, stability, difficulty, exposures, correct_count, incorrect_count, streak, last_seen_at, next_review_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, item_type, item_id, skill_dimension) DO UPDATE SET
        mastery = excluded.mastery, stability = excluded.stability, difficulty = excluded.difficulty,
        exposures = user_mastery.exposures + 1, correct_count = user_mastery.correct_count + excluded.correct_count,
        incorrect_count = user_mastery.incorrect_count + excluded.incorrect_count, streak = excluded.streak,
        last_seen_at = excluded.last_seen_at, next_review_at = excluded.next_review_at`)
      .bind(...key, mastery, stability, exercise.difficulty, correct ? 1 : 0, correct ? 0 : 1, correct ? (current?.streak ?? 0) + 1 : 0, Date.now(), nextReviewAt),
    DB.prepare('UPDATE profiles SET xp = xp + ?, streak = ?, last_study_date = ? WHERE id = ?').bind(correct ? 10 : 2, studyStreak, today, user.userId),
  ];

  if (correct) {
    statements.push(DB.prepare('UPDATE error_notebook SET resolved_at = ? WHERE user_id = ? AND concept_id = ? AND resolved_at IS NULL').bind(Date.now(), user.userId, exercise.itemId));
  } else {
    statements.push(DB.prepare(`INSERT INTO error_notebook (id, user_id, concept_type, concept_id, error_type, given_answer, correct_answer, rule, occurrences, last_occurred_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      ON CONFLICT(user_id, concept_id, error_type) DO UPDATE SET given_answer = excluded.given_answer,
      correct_answer = excluded.correct_answer, rule = excluded.rule, occurrences = error_notebook.occurrences + 1,
      last_occurred_at = excluded.last_occurred_at, resolved_at = NULL`)
      .bind(crypto.randomUUID(), user.userId, exercise.type, exercise.itemId, exercise.dimension, payload.answer, exercise.answer, exercise.rule, Date.now()));
  }
  await DB.batch(statements);

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

export async function getProgress(user: ChatGPTUser) {
  await ensureProfile(user);
  const { DB } = getBindings();
  const profile = await DB.prepare('SELECT display_name, leaderboard_opt_in, xp, streak, last_study_date FROM profiles WHERE id = ?').bind(user.userId).first();
  const mastery = await DB.prepare('SELECT skill_dimension, ROUND(AVG(mastery), 1) AS average, COUNT(*) AS concepts FROM user_mastery WHERE user_id = ? GROUP BY skill_dimension').bind(user.userId).all();
  const summary = await DB.prepare(`SELECT COUNT(*) AS attempts, SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS correct,
    COUNT(DISTINCT CASE WHEN correct = 1 THEN exercise_id END) AS practiced FROM practice_attempts WHERE user_id = ?`).bind(user.userId).first();
  const errors = await DB.prepare('SELECT COUNT(*) AS count FROM error_notebook WHERE user_id = ? AND resolved_at IS NULL').bind(user.userId).first<{ count: number }>();
  const due = await DB.prepare('SELECT COUNT(*) AS count FROM user_mastery WHERE user_id = ? AND next_review_at <= ?').bind(user.userId, Date.now()).first<{ count: number }>();
  const bestExam = await DB.prepare('SELECT MAX(score) AS score, COUNT(*) AS attempts FROM exam_attempts WHERE user_id = ?').bind(user.userId).first();
  const general = mastery.results.length ? mastery.results.reduce((sum, row) => sum + Number(row.average ?? 0), 0) / mastery.results.length : 0;
  return { profile, mastery: mastery.results, summary, unresolvedErrors: errors?.count ?? 0, due: due?.count ?? 0, bestExam, general: Math.round(general) };
}

export async function getErrors(user: ChatGPTUser) {
  await ensureProfile(user);
  const { DB } = getBindings();
  const result = await DB.prepare('SELECT id, concept_type, concept_id, error_type, given_answer, correct_answer, rule, occurrences, last_occurred_at FROM error_notebook WHERE user_id = ? AND resolved_at IS NULL ORDER BY last_occurred_at DESC').bind(user.userId).all();
  return result.results;
}

export async function getDailyExercises(user: ChatGPTUser) {
  await ensureProfile(user);
  const { DB } = getBindings();
  const errors = await DB.prepare('SELECT concept_id FROM error_notebook WHERE user_id = ? AND resolved_at IS NULL ORDER BY last_occurred_at DESC LIMIT 8').bind(user.userId).all<{ concept_id: string }>();
  const due = await DB.prepare('SELECT item_id, skill_dimension FROM user_mastery WHERE user_id = ? AND next_review_at <= ? ORDER BY next_review_at LIMIT 12').bind(user.userId, Date.now()).all<{ item_id: string; skill_dimension: string }>();
  const seen = new Set<string>();
  const chosen: typeof exercises = [];
  const add = (item: (typeof exercises)[number] | undefined) => { if (item && !seen.has(item.id)) { seen.add(item.id); chosen.push(item); } };
  for (const row of errors.results) add(exercises.find((item) => item.itemId === row.concept_id));
  for (const row of due.results) add(exercises.find((item) => item.itemId === row.item_id && item.dimension === row.skill_dimension));
  const practiced = await DB.prepare('SELECT DISTINCT exercise_id FROM practice_attempts WHERE user_id = ?').bind(user.userId).all<{ exercise_id: string }>();
  const practicedIds = new Set(practiced.results.map((row) => row.exercise_id));
  for (const item of exercises) { if (chosen.length >= 7) break; if (!practicedIds.has(item.id) && !chosen.some((selected) => selected.dimension === item.dimension)) add(item); }
  for (const item of exercises) { if (chosen.length >= 7) break; add(item); }
  return chosen.slice(0, 7);
}

export async function updateProfile(user: ChatGPTUser, payload: { displayName: string; leaderboardOptIn: boolean; timezone: string }) {
  await ensureProfile(user);
  const name = payload.displayName.trim().slice(0, 40);
  if (name.length < 2) throw new Error('El nickname debe tener al menos 2 caracteres.');
  const { DB } = getBindings();
  await DB.prepare('UPDATE profiles SET display_name = ?, leaderboard_opt_in = ?, timezone = ? WHERE id = ?')
    .bind(name, payload.leaderboardOptIn ? 1 : 0, payload.timezone || 'America/Lima', user.userId).run();
  return { displayName: name, leaderboardOptIn: payload.leaderboardOptIn, timezone: payload.timezone };
}

export async function startExam(user: ChatGPTUser) {
  await ensureProfile(user);
  const { DB } = getBindings();
  const sessionId = crypto.randomUUID();
  const seed = crypto.randomUUID();
  await DB.prepare('INSERT INTO exam_sessions (id, user_id, lesson_id, seed, started_at, status) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(sessionId, user.userId, 'lesson-1', seed, Date.now(), 'active').run();
  const questions = seededShuffle(examBank, seed).map((item) => { const { answer, ...question } = item; void answer; return { ...question, options: question.options ? seededShuffle(question.options, `${seed}-${question.id}`) : undefined }; });
  return { sessionId, seed, questions };
}

export async function submitExam(user: ChatGPTUser, payload: { sessionId: string; answers: AnswerMap }) {
  await ensureProfile(user);
  const { DB } = getBindings();
  const session = await DB.prepare('SELECT id, started_at, status FROM exam_sessions WHERE id = ? AND user_id = ?').bind(payload.sessionId, user.userId).first<{ id: string; started_at: number; status: string }>();
  if (!session || session.status !== 'active') throw new Error('La sesión de examen no es válida o ya fue enviada.');

  const { sectionScores, review, score } = scoreExamAnswers(payload.answers);
  const attemptId = crypto.randomUUID();
  const durationSeconds = Math.max(1, Math.round((Date.now() - Number(session.started_at)) / 1000));
  await DB.batch([
    DB.prepare(`INSERT INTO exam_attempts (id, exam_session_id, user_id, score, listening_score, pinyin_score, vocabulary_score, grammar_score, dialogue_score, reading_score, hanzi_score, communication_score, duration_seconds, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
      attemptId, payload.sessionId, user.userId, score, sectionScores.listening, sectionScores.pinyin, sectionScores.vocabulary,
      sectionScores.grammar, sectionScores.dialogue, sectionScores.reading, sectionScores.hanzi, sectionScores.communication, durationSeconds, Date.now(),
    ),
    DB.prepare('UPDATE exam_sessions SET completed_at = ?, status = ? WHERE id = ?').bind(Date.now(), 'completed', payload.sessionId),
    DB.prepare('UPDATE profiles SET xp = xp + ? WHERE id = ?').bind(score, user.userId),
  ]);

  let certificateCode: string | null = null;
  if (isCertificateEligible(score)) {
    certificateCode = `L1-${crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()}`;
    await DB.batch([
      DB.prepare('INSERT OR IGNORE INTO user_achievements (user_id, achievement_id, exam_attempt_id, earned_at) VALUES (?, ?, ?, ?)')
        .bind(user.userId, MASTER_ACHIEVEMENT_ID, attemptId, Date.now()),
      DB.prepare('INSERT OR IGNORE INTO certificates (id, user_id, exam_attempt_id, certificate_code, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), user.userId, attemptId, certificateCode, Date.now()),
    ]);
    const certificate = await DB.prepare('SELECT certificate_code FROM certificates WHERE exam_attempt_id = ?').bind(attemptId).first<{ certificate_code: string }>();
    certificateCode = certificate?.certificate_code ?? certificateCode;
  }
  return { score, sectionScores, review, certificateCode, durationSeconds };
}

export async function getExamHistory(user: ChatGPTUser) {
  await ensureProfile(user);
  const { DB } = getBindings();
  return (await DB.prepare('SELECT id, score, listening_score, pinyin_score, vocabulary_score, grammar_score, dialogue_score, reading_score, hanzi_score, communication_score, duration_seconds, created_at FROM exam_attempts WHERE user_id = ? ORDER BY created_at DESC').bind(user.userId).all()).results;
}

export async function getUserAchievements(user: ChatGPTUser) {
  await ensureProfile(user);
  const { DB } = getBindings();
  return (await DB.prepare(`SELECT a.code, a.title_es, a.title_zh, ua.earned_at, e.score
    FROM user_achievements ua JOIN achievements a ON a.id = ua.achievement_id
    LEFT JOIN exam_attempts e ON e.id = ua.exam_attempt_id WHERE ua.user_id = ? ORDER BY ua.earned_at DESC`)
    .bind(user.userId).all()).results;
}

export async function getUserCertificates(user: ChatGPTUser) {
  await ensureProfile(user);
  const { DB } = getBindings();
  return (await DB.prepare(`SELECT c.certificate_code, c.storage_path, c.file_hash, c.created_at, e.score
    FROM certificates c JOIN exam_attempts e ON e.id = c.exam_attempt_id WHERE c.user_id = ? ORDER BY c.created_at DESC`)
    .bind(user.userId).all()).results;
}

export async function getLeaderboard() {
  const { DB } = getBindings();
  const result = await DB.prepare(`WITH best AS (
      SELECT p.id, p.display_name, p.avatar_url, MAX(e.score) AS best_score,
        SUM(CASE WHEN e.score = 100 THEN 1 ELSE 0 END) AS perfect_exam_count,
        MIN(CASE WHEN e.score = (SELECT MAX(e2.score) FROM exam_attempts e2 WHERE e2.user_id = p.id) THEN e.created_at END) AS achieved_at
      FROM profiles p JOIN exam_attempts e ON e.user_id = p.id
      WHERE p.leaderboard_opt_in = 1 GROUP BY p.id, p.display_name, p.avatar_url
    )
    SELECT DENSE_RANK() OVER (ORDER BY best_score DESC) AS rank, display_name, avatar_url, best_score,
      perfect_exam_count, achieved_at FROM best ORDER BY rank, achieved_at LIMIT 100`).all();
  return result.results;
}

export async function getCertificate(code: string) {
  const { DB } = getBindings();
  return DB.prepare(`SELECT c.certificate_code, c.storage_path, c.file_hash, c.created_at, p.display_name, e.score
    FROM certificates c JOIN profiles p ON p.id = c.user_id JOIN exam_attempts e ON e.id = c.exam_attempt_id
    WHERE c.certificate_code = ?`).bind(code).first();
}

export async function storeCertificatePng(user: ChatGPTUser, code: string, bytes: ArrayBuffer) {
  const { DB, FILES } = getBindings();
  const certificate = await DB.prepare(`SELECT c.id, c.user_id, e.score FROM certificates c JOIN exam_attempts e ON e.id = c.exam_attempt_id
    WHERE c.certificate_code = ? AND c.user_id = ?`).bind(code, user.userId).first<{ id: string; user_id: string; score: number }>();
  if (!certificate || certificate.score !== 100) throw new Error('Certificado no autorizado.');
  if (bytes.byteLength < 10_000 || bytes.byteLength > 8_000_000) throw new Error('Archivo PNG fuera del tamaño permitido.');
  const signature = new Uint8Array(bytes.slice(0, 8));
  if ([...signature].join(',') !== '137,80,78,71,13,10,26,10') throw new Error('El archivo debe ser PNG.');
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const storagePath = `certificates/${code}.png`;
  await FILES.put(storagePath, bytes, { httpMetadata: { contentType: 'image/png', contentDisposition: `attachment; filename="${code}.png"` } });
  await DB.prepare('UPDATE certificates SET storage_path = ?, file_hash = ? WHERE id = ?').bind(storagePath, hash, certificate.id).run();
  return { storagePath, hash };
}

export async function certificateFile(code: string) {
  const { DB, FILES } = getBindings();
  const row = await DB.prepare('SELECT storage_path FROM certificates WHERE certificate_code = ?').bind(code).first<{ storage_path: string | null }>();
  return row?.storage_path ? FILES.get(row.storage_path) : null;
}

function checkExerciseAnswer(exercise: Exercise, answer: string) {
  if (exercise.type === 'pinyin' && /[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(exercise.answer)) return comparePinyin(answer, exercise.answer, true);
  return normalizeAnswer(answer) === normalizeAnswer(exercise.answer);
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
