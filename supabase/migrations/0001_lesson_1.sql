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

create table public.user_mastery (
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null,
  item_id text not null,
  skill_dimension text not null,
  mastery numeric not null default 0 check (mastery between 0 and 100),
  stability numeric not null default 0,
  difficulty numeric not null default 5,
  exposures integer not null default 0,
  correct_count integer not null default 0,
  incorrect_count integer not null default 0,
  streak integer not null default 0,
  last_seen_at timestamptz,
  next_review_at timestamptz,
  primary key (user_id, item_type, item_id, skill_dimension)
);
create index mastery_due_idx on public.user_mastery(user_id, next_review_at);

create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id text not null,
  answer text not null,
  correct boolean not null,
  response_ms integer not null default 0,
  hints_used integer not null default 0,
  created_at timestamptz not null default now()
);
create index practice_attempts_user_idx on public.practice_attempts(user_id, created_at desc);

create table public.error_notebook (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  concept_type text not null,
  concept_id text not null,
  error_type text not null,
  given_answer text not null,
  correct_answer text not null,
  rule text not null,
  occurrences integer not null default 1,
  last_occurred_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique(user_id, concept_id, error_type)
);

create table public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null default 'lesson-1',
  seed text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'active' check (status in ('active', 'completed'))
);

create table public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  exam_session_id uuid not null unique references public.exam_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  section_scores jsonb not null,
  duration_seconds integer not null default 0,
  created_at timestamptz not null default now()
);
create index exam_user_score_idx on public.exam_attempts(user_id, score desc, created_at asc);

create or replace view public.leaderboard_public as
with best_score as (
  select user_id, max(score) as score
  from public.exam_attempts
  group by user_id
), ranked as (
  select
    p.id,
    p.display_name,
    p.avatar_url,
    b.score as best_score,
    count(*) filter (where e.score = 100)::integer as perfect_exam_count,
    min(e.created_at) filter (where e.score = b.score) as achieved_at
  from public.profiles p
  join best_score b on b.user_id = p.id
  join public.exam_attempts e on e.user_id = p.id
  where p.leaderboard_opt_in = true
  group by p.id, p.display_name, p.avatar_url, b.score
)
select
  dense_rank() over (order by best_score desc) as rank,
  display_name,
  avatar_url,
  best_score,
  perfect_exam_count,
  achieved_at
from ranked;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, case
    when char_length(left(coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1), 'Estudiante'), 40)) >= 2
      then left(coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1), 'Estudiante'), 40)
    else 'Estudiante'
  end)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_mastery enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.error_notebook enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.exam_attempts enable row level security;

create policy profiles_self_select on public.profiles for select to authenticated using (auth.uid() = id);
create policy profiles_self_update on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy mastery_self_select on public.user_mastery for select to authenticated using (auth.uid() = user_id);
create policy attempts_self_select on public.practice_attempts for select to authenticated using (auth.uid() = user_id);
create policy errors_self_select on public.error_notebook for select to authenticated using (auth.uid() = user_id);
create policy exam_sessions_self_select on public.exam_sessions for select to authenticated using (auth.uid() = user_id);
create policy exam_attempts_self_select on public.exam_attempts for select to authenticated using (auth.uid() = user_id);

revoke all on public.leaderboard_public from anon, authenticated;
grant select on public.leaderboard_public to service_role;
