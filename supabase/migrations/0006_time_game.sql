create table public.time_game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now()
);
create table public.time_game_scores (
  session_id uuid primary key references public.time_game_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  player_name text not null,
  game_id text not null default 'hora' check (game_id='hora'),
  score integer not null check (score>=0),
  max_difficulty integer not null check (max_difficulty between 0 and 100),
  correct_answers integer not null check (correct_answers>=0),
  max_streak integer not null default 0,
  mastery_bonus_total integer not null default 0,
  played_at timestamptz not null default now()
);
create index time_game_scores_rank_idx on public.time_game_scores(score desc,played_at asc);
alter table public.time_game_sessions enable row level security;
alter table public.time_game_scores enable row level security;
create policy time_game_sessions_self_select on public.time_game_sessions for select to authenticated using (auth.uid()=user_id);
create policy time_game_scores_self_select on public.time_game_scores for select to authenticated using (auth.uid()=user_id);
create or replace view public.time_game_leaderboard as
with best as (
  select distinct on (s.user_id) s.user_id,p.display_name as player_name,s.score,s.played_at
  from public.time_game_scores s join public.profiles p on p.id=s.user_id
  where p.leaderboard_opt_in=true
  order by s.user_id,s.score desc,s.played_at asc
)
select dense_rank() over(order by score desc) as rank,user_id,player_name,score,played_at from best;
revoke all on public.time_game_leaderboard from anon,authenticated;
grant select on public.time_game_leaderboard to service_role;
