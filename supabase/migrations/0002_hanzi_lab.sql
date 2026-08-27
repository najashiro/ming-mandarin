create table public.hanzi_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  character_id text not null,
  mode text not null check (mode in ('guided', 'independent', 'exam')),
  skill_dimension text not null check (skill_dimension in ('recognition', 'stroke_order', 'writing')),
  completed boolean not null default false,
  correct_strokes integer not null default 0 check (correct_strokes >= 0),
  mistakes integer not null default 0 check (mistakes >= 0),
  hints_used integer not null default 0 check (hints_used >= 0),
  duration_ms integer not null default 0 check (duration_ms >= 0),
  used_answer boolean not null default false,
  created_at timestamptz not null default now()
);

create index hanzi_attempts_user_idx on public.hanzi_attempts(user_id, created_at desc);
create index hanzi_attempts_character_idx on public.hanzi_attempts(user_id, character_id, skill_dimension, created_at desc);

alter table public.hanzi_attempts enable row level security;

create policy hanzi_attempts_self_select
  on public.hanzi_attempts for select to authenticated
  using (auth.uid() = user_id);

comment on table public.hanzi_attempts is
  'Resúmenes de práctica Hanzi. Por privacidad, no almacena coordenadas ni trayectorias de escritura.';
