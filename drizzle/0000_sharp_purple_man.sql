CREATE TABLE `achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`title_es` text NOT NULL,
	`title_zh` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `achievements_code_unique` ON `achievements` (`code`);--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`exam_attempt_id` text NOT NULL,
	`certificate_code` text NOT NULL,
	`storage_path` text,
	`file_hash` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_exam_attempt_id_unique` ON `certificates` (`exam_attempt_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_certificate_code_unique` ON `certificates` (`certificate_code`);--> statement-breakpoint
CREATE TABLE `characters` (
	`id` text PRIMARY KEY NOT NULL,
	`hanzi` text NOT NULL,
	`pinyin` text NOT NULL,
	`meaning` text NOT NULL,
	`stroke_count` integer NOT NULL,
	`radical` text NOT NULL,
	`components` text NOT NULL,
	`recognition_required` integer NOT NULL,
	`writing_required` integer NOT NULL,
	`source_file` text NOT NULL,
	`source_page` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `error_notebook` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`concept_type` text NOT NULL,
	`concept_id` text NOT NULL,
	`error_type` text NOT NULL,
	`given_answer` text NOT NULL,
	`correct_answer` text NOT NULL,
	`rule` text NOT NULL,
	`occurrences` integer DEFAULT 1 NOT NULL,
	`last_occurred_at` integer NOT NULL,
	`resolved_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `errors_concept_idx` ON `error_notebook` (`user_id`,`concept_id`,`error_type`);--> statement-breakpoint
CREATE TABLE `exam_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`exam_session_id` text NOT NULL,
	`user_id` text NOT NULL,
	`score` integer NOT NULL,
	`listening_score` integer NOT NULL,
	`pinyin_score` integer NOT NULL,
	`vocabulary_score` integer NOT NULL,
	`grammar_score` integer NOT NULL,
	`dialogue_score` integer NOT NULL,
	`reading_score` integer NOT NULL,
	`hanzi_score` integer NOT NULL,
	`communication_score` integer NOT NULL,
	`duration_seconds` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `exam_user_score_idx` ON `exam_attempts` (`user_id`,`score`);--> statement-breakpoint
CREATE TABLE `exam_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`seed` text NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`status` text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`type` text NOT NULL,
	`difficulty` integer NOT NULL,
	`payload` text NOT NULL,
	`solution_server` text NOT NULL,
	`source_type` text NOT NULL,
	`source_page` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `grammar_points` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`explanation` text NOT NULL,
	`source_file` text NOT NULL,
	`source_page` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `grammar_slug_idx` ON `grammar_points` (`lesson_id`,`slug`);--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`title_hanzi` text NOT NULL,
	`title_pinyin` text NOT NULL,
	`title_es` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lessons_number_idx` ON `lessons` (`number`);--> statement-breakpoint
CREATE TABLE `practice_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`answer` text NOT NULL,
	`correct` integer NOT NULL,
	`response_ms` integer DEFAULT 0 NOT NULL,
	`hints_used` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attempts_user_idx` ON `practice_attempts` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`avatar_url` text,
	`leaderboard_opt_in` integer DEFAULT false NOT NULL,
	`timezone` text DEFAULT 'America/Lima' NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`streak` integer DEFAULT 0 NOT NULL,
	`last_study_date` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sentences` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`hanzi` text NOT NULL,
	`pinyin` text NOT NULL,
	`translation_es` text NOT NULL,
	`grammar_tags` text NOT NULL,
	`source_file` text NOT NULL,
	`source_page` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `source_conflicts` (
	`id` text PRIMARY KEY NOT NULL,
	`item_type` text NOT NULL,
	`item_id` text NOT NULL,
	`canonical_value` text NOT NULL,
	`class_note` text NOT NULL,
	`status` text DEFAULT 'recorded' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	`xp` integer DEFAULT 0 NOT NULL,
	`accuracy` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`user_id` text NOT NULL,
	`achievement_id` text NOT NULL,
	`exam_attempt_id` text NOT NULL,
	`earned_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `achievement_id`)
);
--> statement-breakpoint
CREATE TABLE `user_mastery` (
	`user_id` text NOT NULL,
	`item_type` text NOT NULL,
	`item_id` text NOT NULL,
	`skill_dimension` text NOT NULL,
	`mastery` real DEFAULT 0 NOT NULL,
	`stability` real DEFAULT 0 NOT NULL,
	`difficulty` real DEFAULT 5 NOT NULL,
	`exposures` integer DEFAULT 0 NOT NULL,
	`correct_count` integer DEFAULT 0 NOT NULL,
	`incorrect_count` integer DEFAULT 0 NOT NULL,
	`streak` integer DEFAULT 0 NOT NULL,
	`last_seen_at` integer,
	`next_review_at` integer,
	PRIMARY KEY(`user_id`, `item_type`, `item_id`, `skill_dimension`)
);
--> statement-breakpoint
CREATE INDEX `mastery_due_idx` ON `user_mastery` (`user_id`,`next_review_at`);--> statement-breakpoint
CREATE TABLE `vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`hanzi` text NOT NULL,
	`pinyin` text NOT NULL,
	`translation_es` text NOT NULL,
	`grammatical_type` text NOT NULL,
	`category` text NOT NULL,
	`is_core` integer NOT NULL,
	`source_type` text NOT NULL,
	`source_file` text NOT NULL,
	`source_page` integer NOT NULL
);
