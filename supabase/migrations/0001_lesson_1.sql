create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  avatar_url text,
  leaderboard_opt_in boolean not null default false,
  timezone text not null default 'America/Lima',
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_study_date date,
  created_at timestamptz not null default now()
);
create table public.lessons (id text primary key, number integer unique not null, title_hanzi text not null, title_pinyin text not null, title_es text not null);
create table public.vocabulary (id text primary key, lesson_id text not null references public.lessons(id), hanzi text not null, pinyin text not null, translation_es text not null, grammatical_type text not null, category text not null, is_core boolean not null, source_type text not null, source_file text not null, source_page integer not null);
create table public.sentences (id text primary key, lesson_id text not null references public.lessons(id), hanzi text not null, pinyin text not null, translation_es text not null, grammar_tags jsonb not null, source_file text not null, source_page integer not null);
create table public.grammar_points (id text primary key, lesson_id text not null references public.lessons(id), slug text not null, title text not null, explanation text not null, source_file text not null, source_page integer not null, unique(lesson_id,slug));
create table public.characters (id text primary key, hanzi text not null, pinyin text not null, meaning text not null, stroke_count integer not null, radical text not null, components jsonb not null, recognition_required boolean not null, writing_required boolean not null, source_file text not null, source_page integer not null);
create table public.exercises (id text primary key, lesson_id text not null references public.lessons(id), type text not null, difficulty integer not null check(difficulty between 1 and 5), payload jsonb not null, solution_server text not null, source_type text not null, source_page integer not null);
create table public.user_mastery (user_id uuid not null references public.profiles(id) on delete cascade, item_type text not null, item_id text not null, skill_dimension text not null, mastery numeric not null default 0 check(mastery between 0 and 100), stability numeric not null default 0, difficulty numeric not null default 5, exposures integer not null default 0, correct_count integer not null default 0, incorrect_count integer not null default 0, streak integer not null default 0, last_seen_at timestamptz, next_review_at timestamptz, primary key(user_id,item_type,item_id,skill_dimension));
create index mastery_due_idx on public.user_mastery(user_id,next_review_at);
create table public.practice_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, exercise_id text not null, answer text not null, correct boolean not null, response_ms integer not null default 0, hints_used integer not null default 0, created_at timestamptz not null default now());
create table public.error_notebook (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, concept_type text not null, concept_id text not null, error_type text not null, given_answer text not null, correct_answer text not null, rule text not null, occurrences integer not null default 1, last_occurred_at timestamptz not null default now(), resolved_at timestamptz, unique(user_id,concept_id,error_type));
create table public.exam_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, lesson_id text not null references public.lessons(id), seed text not null, started_at timestamptz not null default now(), completed_at timestamptz, status text not null default 'active');
create table public.exam_attempts (id uuid primary key default gen_random_uuid(), exam_session_id uuid not null unique references public.exam_sessions(id), user_id uuid not null references public.profiles(id) on delete cascade, score integer not null check(score between 0 and 100), section_scores jsonb not null, duration_seconds integer not null default 0, created_at timestamptz not null default now());
create index exam_user_score_idx on public.exam_attempts(user_id,score desc);
create table public.achievements (id text primary key, code text unique not null, title_es text not null, title_zh text not null);
create table public.user_achievements (user_id uuid not null references public.profiles(id) on delete cascade, achievement_id text not null references public.achievements(id), exam_attempt_id uuid not null references public.exam_attempts(id), earned_at timestamptz not null default now(), primary key(user_id,achievement_id));
create table public.certificates (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, exam_attempt_id uuid not null unique references public.exam_attempts(id), certificate_code text not null unique check(certificate_code ~ '^L1-[A-F0-9]{8}$'), storage_path text, file_hash text check(file_hash is null or char_length(file_hash)=64), created_at timestamptz not null default now());

alter table public.profiles enable row level security;
alter table public.user_mastery enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.error_notebook enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.user_achievements enable row level security;
alter table public.certificates enable row level security;
create policy profiles_self on public.profiles for all using(auth.uid()=id) with check(auth.uid()=id);
create policy mastery_self on public.user_mastery for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy attempts_self on public.practice_attempts for select using(auth.uid()=user_id);
create policy errors_self on public.error_notebook for select using(auth.uid()=user_id);
create policy exam_sessions_self on public.exam_sessions for select using(auth.uid()=user_id);
create policy exam_attempts_self on public.exam_attempts for select using(auth.uid()=user_id);
create policy achievements_self on public.user_achievements for select using(auth.uid()=user_id);
create policy certificates_owner_read on public.certificates for select using(auth.uid()=user_id);
create policy certificates_public_verify on public.certificates for select using(storage_path is not null);

insert into public.lessons values ('lesson-1',1,'你最近怎么样？','Nǐ zuìjìn zěnmeyàng?','¿Cómo has estado?') on conflict do nothing;
insert into public.achievements values ('ach-first-lesson-master','FIRST_LESSON_MASTER','Maestro de la Lección 1','第一课大师') on conflict do nothing;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('certificates','certificates',false,8000000,array['image/png']) on conflict(id) do update set file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy certificate_storage_owner_read on storage.objects for select to authenticated using(bucket_id='certificates' and (storage.foldername(name))[1]=auth.uid()::text);
create policy certificate_storage_owner_insert on storage.objects for insert to authenticated with check(bucket_id='certificates' and (storage.foldername(name))[1]=auth.uid()::text);
