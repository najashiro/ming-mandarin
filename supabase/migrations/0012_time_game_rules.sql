-- Preserve legacy seven-minute scores while creating isolated 4-minute rule boards.
alter table public.time_game_sessions add column if not exists rules_mode text not null default 'legacy' check (rules_mode in ('legacy','normal','hard'));
alter table public.time_game_sessions add column if not exists duration_seconds integer not null default 420 check (duration_seconds > 0);
alter table public.time_game_sessions add column if not exists rules_version integer not null default 1 check (rules_version > 0);
alter table public.time_game_scores add column if not exists rules_mode text not null default 'legacy' check (rules_mode in ('legacy','normal','hard'));
alter table public.time_game_scores add column if not exists duration_seconds integer not null default 420 check (duration_seconds > 0);
alter table public.time_game_scores add column if not exists rules_version integer not null default 1 check (rules_version > 0);
create index if not exists time_game_scores_board_idx on public.time_game_scores(rules_mode,duration_seconds,rules_version,score desc,played_at asc);
create or replace view public.time_game_leaderboard as
with best as (
 select distinct on (s.user_id,s.rules_mode,s.duration_seconds,s.rules_version) s.user_id,p.display_name player_name,s.score,s.played_at,s.rules_mode,s.duration_seconds,s.rules_version
 from public.time_game_scores s join public.profiles p on p.id=s.user_id where p.leaderboard_opt_in=true
 order by s.user_id,s.rules_mode,s.duration_seconds,s.rules_version,s.score desc,s.played_at asc
)
select dense_rank() over(partition by rules_mode,duration_seconds,rules_version order by score desc) rank,user_id,player_name,score,played_at,rules_mode,duration_seconds,rules_version from best;
revoke all on public.time_game_leaderboard from anon,authenticated;
grant select on public.time_game_leaderboard to service_role;
