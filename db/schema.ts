import { index, integer, primaryKey, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

const timestamps = { createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()) };

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(), displayName: text('display_name').notNull(), avatarUrl: text('avatar_url'),
  leaderboardOptIn: integer('leaderboard_opt_in', { mode: 'boolean' }).notNull().default(false),
  timezone: text('timezone').notNull().default('America/Lima'), xp: integer('xp').notNull().default(0),
  streak: integer('streak').notNull().default(0), lastStudyDate: text('last_study_date'), ...timestamps,
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(), number: integer('number').notNull(), titleHanzi: text('title_hanzi').notNull(),
  titlePinyin: text('title_pinyin').notNull(), titleEs: text('title_es').notNull(),
}, (table) => [uniqueIndex('lessons_number_idx').on(table.number)]);

export const vocabularyTable = sqliteTable('vocabulary', {
  id: text('id').primaryKey(), lessonId: text('lesson_id').notNull(), hanzi: text('hanzi').notNull(), pinyin: text('pinyin').notNull(),
  translationEs: text('translation_es').notNull(), grammaticalType: text('grammatical_type').notNull(), category: text('category').notNull(),
  isCore: integer('is_core', { mode: 'boolean' }).notNull(), sourceType: text('source_type').notNull(), sourceFile: text('source_file').notNull(),
  sourcePage: integer('source_page').notNull(),
});

export const sentencesTable = sqliteTable('sentences', {
  id: text('id').primaryKey(), lessonId: text('lesson_id').notNull(), hanzi: text('hanzi').notNull(), pinyin: text('pinyin').notNull(),
  translationEs: text('translation_es').notNull(), grammarTags: text('grammar_tags', { mode: 'json' }).$type<string[]>().notNull(),
  sourceFile: text('source_file').notNull(), sourcePage: integer('source_page').notNull(),
});

export const grammarPointsTable = sqliteTable('grammar_points', {
  id: text('id').primaryKey(), lessonId: text('lesson_id').notNull(), slug: text('slug').notNull(), title: text('title').notNull(),
  explanation: text('explanation').notNull(), sourceFile: text('source_file').notNull(), sourcePage: integer('source_page').notNull(),
}, (table) => [uniqueIndex('grammar_slug_idx').on(table.lessonId, table.slug)]);

export const charactersTable = sqliteTable('characters', {
  id: text('id').primaryKey(), hanzi: text('hanzi').notNull(), pinyin: text('pinyin').notNull(), meaning: text('meaning').notNull(),
  strokeCount: integer('stroke_count').notNull(), radical: text('radical').notNull(), components: text('components', { mode: 'json' }).$type<string[]>().notNull(),
  recognitionRequired: integer('recognition_required', { mode: 'boolean' }).notNull(), writingRequired: integer('writing_required', { mode: 'boolean' }).notNull(),
  sourceFile: text('source_file').notNull(), sourcePage: integer('source_page').notNull(),
});

export const exercisesTable = sqliteTable('exercises', {
  id: text('id').primaryKey(), lessonId: text('lesson_id').notNull(), type: text('type').notNull(), difficulty: integer('difficulty').notNull(),
  payload: text('payload', { mode: 'json' }).$type<Record<string, unknown>>().notNull(), solutionServer: text('solution_server').notNull(),
  sourceType: text('source_type').notNull(), sourcePage: integer('source_page').notNull(),
});

export const userMastery = sqliteTable('user_mastery', {
  userId: text('user_id').notNull(), itemType: text('item_type').notNull(), itemId: text('item_id').notNull(), skillDimension: text('skill_dimension').notNull(),
  mastery: real('mastery').notNull().default(0), stability: real('stability').notNull().default(0), difficulty: real('difficulty').notNull().default(5),
  exposures: integer('exposures').notNull().default(0), correctCount: integer('correct_count').notNull().default(0),
  incorrectCount: integer('incorrect_count').notNull().default(0), streak: integer('streak').notNull().default(0),
  lastSeenAt: integer('last_seen_at', { mode: 'timestamp_ms' }), nextReviewAt: integer('next_review_at', { mode: 'timestamp_ms' }),
}, (table) => [primaryKey({ columns: [table.userId, table.itemType, table.itemId, table.skillDimension] }), index('mastery_due_idx').on(table.userId, table.nextReviewAt)]);

export const practiceAttempts = sqliteTable('practice_attempts', {
  id: text('id').primaryKey(), userId: text('user_id').notNull(), exerciseId: text('exercise_id').notNull(), answer: text('answer').notNull(),
  correct: integer('correct', { mode: 'boolean' }).notNull(), responseMs: integer('response_ms').notNull().default(0), hintsUsed: integer('hints_used').notNull().default(0), ...timestamps,
}, (table) => [index('attempts_user_idx').on(table.userId, table.createdAt)]);

export const studySessions = sqliteTable('study_sessions', {
  id: text('id').primaryKey(), userId: text('user_id').notNull(), startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
  endedAt: integer('ended_at', { mode: 'timestamp_ms' }), xp: integer('xp').notNull().default(0), accuracy: real('accuracy').notNull().default(0),
});

export const examSessions = sqliteTable('exam_sessions', {
  id: text('id').primaryKey(), userId: text('user_id').notNull(), lessonId: text('lesson_id').notNull(), seed: text('seed').notNull(),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(), completedAt: integer('completed_at', { mode: 'timestamp_ms' }), status: text('status').notNull().default('active'),
});

export const examAttempts = sqliteTable('exam_attempts', {
  id: text('id').primaryKey(), examSessionId: text('exam_session_id').notNull(), userId: text('user_id').notNull(), score: integer('score').notNull(),
  listeningScore: integer('listening_score').notNull(), pinyinScore: integer('pinyin_score').notNull(), vocabularyScore: integer('vocabulary_score').notNull(),
  grammarScore: integer('grammar_score').notNull(), dialogueScore: integer('dialogue_score').notNull(), readingScore: integer('reading_score').notNull(),
  hanziScore: integer('hanzi_score').notNull(), communicationScore: integer('communication_score').notNull(), durationSeconds: integer('duration_seconds').notNull().default(0), ...timestamps,
}, (table) => [index('exam_user_score_idx').on(table.userId, table.score)]);

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(), code: text('code').notNull().unique(), titleEs: text('title_es').notNull(), titleZh: text('title_zh').notNull(),
});

export const userAchievements = sqliteTable('user_achievements', {
  userId: text('user_id').notNull(), achievementId: text('achievement_id').notNull(), examAttemptId: text('exam_attempt_id').notNull(),
  earnedAt: integer('earned_at', { mode: 'timestamp_ms' }).notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.achievementId] })]);

export const certificates = sqliteTable('certificates', {
  id: text('id').primaryKey(), userId: text('user_id').notNull(), examAttemptId: text('exam_attempt_id').notNull().unique(),
  certificateCode: text('certificate_code').notNull().unique(), storagePath: text('storage_path'), fileHash: text('file_hash'), ...timestamps,
});

export const errorNotebook = sqliteTable('error_notebook', {
  id: text('id').primaryKey(), userId: text('user_id').notNull(), conceptType: text('concept_type').notNull(), conceptId: text('concept_id').notNull(),
  errorType: text('error_type').notNull(), givenAnswer: text('given_answer').notNull(), correctAnswer: text('correct_answer').notNull(), rule: text('rule').notNull(),
  occurrences: integer('occurrences').notNull().default(1), lastOccurredAt: integer('last_occurred_at', { mode: 'timestamp_ms' }).notNull(),
  resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
}, (table) => [uniqueIndex('errors_concept_idx').on(table.userId, table.conceptId, table.errorType)]);

export const sourceConflicts = sqliteTable('source_conflicts', {
  id: text('id').primaryKey(), itemType: text('item_type').notNull(), itemId: text('item_id').notNull(), canonicalValue: text('canonical_value').notNull(),
  classNote: text('class_note').notNull(), status: text('status').notNull().default('recorded'), ...timestamps,
});
