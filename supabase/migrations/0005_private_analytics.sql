-- Analítica privada y agregada. No almacena IP, user-agent, correo, respuestas
-- ni coordenadas de escritura. El navegador nunca consulta estas tablas.

create table public.analytics_sessions (
  id uuid primary key,
  visitor_key text not null check (char_length(visitor_key) between 10 and 80),
  user_id uuid,
  anonymous_id uuid,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  active_seconds integer not null default 0 check (active_seconds >= 0),
  page_views integer not null default 0 check (page_views >= 0),
  event_count integer not null default 0 check (event_count >= 0),
  check ((user_id is not null and anonymous_id is null) or (user_id is null and anonymous_id is not null))
);

create table public.analytics_daily (
  day date not null,
  visitor_key text not null,
  user_id uuid,
  anonymous_id uuid,
  sessions integer not null default 0,
  active_seconds integer not null default 0,
  page_views integer not null default 0,
  exercises integer not null default 0,
  correct_answers integer not null default 0,
  incorrect_answers integer not null default 0,
  hanzi_practiced integer not null default 0,
  games_started integer not null default 0,
  games_completed integer not null default 0,
  exams_started integer not null default 0,
  exams_completed integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (day, visitor_key)
);

create table public.analytics_daily_content (
  day date not null,
  lesson_id text not null default '',
  module text not null,
  route text not null,
  content_id text not null default '',
  active_seconds integer not null default 0,
  page_views integer not null default 0,
  events integer not null default 0,
  exercises integer not null default 0,
  correct_answers integer not null default 0,
  incorrect_answers integer not null default 0,
  hanzi_practiced integer not null default 0,
  games_started integer not null default 0,
  games_completed integer not null default 0,
  exams_started integer not null default 0,
  exams_completed integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (day, lesson_id, module, route, content_id)
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.analytics_sessions(id) on delete cascade,
  event_type text not null check (event_type in ('page_view', 'exercise_completed', 'hanzi_practiced', 'game_started', 'game_completed', 'exam_started', 'exam_completed')),
  occurred_at timestamptz not null default now(),
  route text not null,
  lesson_id text not null default '',
  module text not null,
  content_id text not null default '',
  correct boolean
);

create index analytics_sessions_identity_idx on public.analytics_sessions(visitor_key, started_at desc);
create index analytics_sessions_last_seen_idx on public.analytics_sessions(last_seen_at desc);
create index analytics_daily_day_idx on public.analytics_daily(day desc);
create index analytics_daily_user_idx on public.analytics_daily(user_id, day desc) where user_id is not null;
create index analytics_content_day_idx on public.analytics_daily_content(day desc, module, lesson_id);
create index analytics_events_period_idx on public.analytics_events(occurred_at desc, event_type);

alter table public.analytics_sessions enable row level security;
alter table public.analytics_daily enable row level security;
alter table public.analytics_daily_content enable row level security;
alter table public.analytics_events enable row level security;

-- Sin políticas: anon/authenticated no pueden leer ni escribir estadísticas.
revoke all on public.analytics_sessions, public.analytics_daily, public.analytics_daily_content, public.analytics_events from anon, authenticated;
revoke all on sequence public.analytics_events_id_seq from anon, authenticated;

create or replace function public.record_analytics_activity(
  p_session_id uuid,
  p_visitor_key text,
  p_user_id uuid,
  p_anonymous_id uuid,
  p_event_type text,
  p_route text,
  p_lesson_id text,
  p_module text,
  p_content_id text,
  p_active_seconds integer,
  p_correct boolean
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day date := (current_timestamp at time zone 'America/Lima')::date;
  v_previous_seen timestamptz;
  v_existing_key text;
  v_existing_user uuid;
  v_existing_anonymous uuid;
  v_new_session integer := 0;
  v_inserted integer := 0;
  v_meaningful integer := case when p_event_type <> 'heartbeat' then 1 else 0 end;
begin
  if p_event_type not in ('page_view', 'heartbeat', 'exercise_completed', 'hanzi_practiced', 'game_started', 'game_completed', 'exam_started', 'exam_completed') then
    raise exception 'analytics_event_invalid';
  end if;
  p_active_seconds := case when p_event_type = 'heartbeat' then greatest(0, least(coalesce(p_active_seconds, 0), 60)) else 0 end;
  p_route := left(coalesce(p_route, '/'), 300);
  p_lesson_id := left(coalesce(p_lesson_id, ''), 40);
  p_module := left(coalesce(p_module, 'other'), 60);
  p_content_id := left(coalesce(p_content_id, ''), 120);

  insert into public.analytics_sessions (id, visitor_key, user_id, anonymous_id)
    values (p_session_id, p_visitor_key, p_user_id, p_anonymous_id)
    on conflict (id) do nothing;
  get diagnostics v_inserted = row_count;

  select last_seen_at, visitor_key, user_id, anonymous_id
    into v_previous_seen, v_existing_key, v_existing_user, v_existing_anonymous
    from public.analytics_sessions where id = p_session_id for update;
  if v_inserted = 1 then
    v_new_session := 1;
  else
    p_visitor_key := v_existing_key;
    p_user_id := v_existing_user;
    p_anonymous_id := v_existing_anonymous;
    if (v_previous_seen at time zone 'America/Lima')::date < v_day then v_new_session := 1; end if;
  end if;
  update public.analytics_sessions set
    last_seen_at = now(),
    active_seconds = active_seconds + p_active_seconds,
    page_views = page_views + case when p_event_type = 'page_view' then 1 else 0 end,
    event_count = event_count + v_meaningful
  where id = p_session_id;

  insert into public.analytics_daily as d (
    day, visitor_key, user_id, anonymous_id, sessions, active_seconds, page_views, exercises,
    correct_answers, incorrect_answers, hanzi_practiced, games_started, games_completed, exams_started, exams_completed
  ) values (
    v_day, p_visitor_key, p_user_id, p_anonymous_id, v_new_session, p_active_seconds,
    case when p_event_type = 'page_view' then 1 else 0 end,
    case when p_event_type = 'exercise_completed' then 1 else 0 end,
    case when p_event_type = 'exercise_completed' and p_correct is true then 1 else 0 end,
    case when p_event_type = 'exercise_completed' and p_correct is false then 1 else 0 end,
    case when p_event_type = 'hanzi_practiced' then 1 else 0 end,
    case when p_event_type = 'game_started' then 1 else 0 end,
    case when p_event_type = 'game_completed' then 1 else 0 end,
    case when p_event_type = 'exam_started' then 1 else 0 end,
    case when p_event_type = 'exam_completed' then 1 else 0 end
  ) on conflict (day, visitor_key) do update set
    user_id = coalesce(excluded.user_id, d.user_id), anonymous_id = case when excluded.user_id is not null then null else d.anonymous_id end,
    sessions = d.sessions + excluded.sessions, active_seconds = d.active_seconds + excluded.active_seconds,
    page_views = d.page_views + excluded.page_views, exercises = d.exercises + excluded.exercises,
    correct_answers = d.correct_answers + excluded.correct_answers, incorrect_answers = d.incorrect_answers + excluded.incorrect_answers,
    hanzi_practiced = d.hanzi_practiced + excluded.hanzi_practiced, games_started = d.games_started + excluded.games_started,
    games_completed = d.games_completed + excluded.games_completed, exams_started = d.exams_started + excluded.exams_started,
    exams_completed = d.exams_completed + excluded.exams_completed, updated_at = now();

  insert into public.analytics_daily_content as c (
    day, lesson_id, module, route, content_id, active_seconds, page_views, events, exercises,
    correct_answers, incorrect_answers, hanzi_practiced, games_started, games_completed, exams_started, exams_completed
  ) values (
    v_day, p_lesson_id, p_module, p_route, p_content_id, p_active_seconds,
    case when p_event_type = 'page_view' then 1 else 0 end, v_meaningful,
    case when p_event_type = 'exercise_completed' then 1 else 0 end,
    case when p_event_type = 'exercise_completed' and p_correct is true then 1 else 0 end,
    case when p_event_type = 'exercise_completed' and p_correct is false then 1 else 0 end,
    case when p_event_type = 'hanzi_practiced' then 1 else 0 end,
    case when p_event_type = 'game_started' then 1 else 0 end,
    case when p_event_type = 'game_completed' then 1 else 0 end,
    case when p_event_type = 'exam_started' then 1 else 0 end,
    case when p_event_type = 'exam_completed' then 1 else 0 end
  ) on conflict (day, lesson_id, module, route, content_id) do update set
    active_seconds = c.active_seconds + excluded.active_seconds, page_views = c.page_views + excluded.page_views,
    events = c.events + excluded.events, exercises = c.exercises + excluded.exercises,
    correct_answers = c.correct_answers + excluded.correct_answers, incorrect_answers = c.incorrect_answers + excluded.incorrect_answers,
    hanzi_practiced = c.hanzi_practiced + excluded.hanzi_practiced, games_started = c.games_started + excluded.games_started,
    games_completed = c.games_completed + excluded.games_completed, exams_started = c.exams_started + excluded.exams_started,
    exams_completed = c.exams_completed + excluded.exams_completed, updated_at = now();

  if p_event_type <> 'heartbeat' then
    insert into public.analytics_events (session_id, event_type, route, lesson_id, module, content_id, correct)
    values (p_session_id, p_event_type, p_route, p_lesson_id, p_module, p_content_id, p_correct);
  end if;
end;
$$;

create or replace function public.admin_analytics_dashboard(p_days integer default 7)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_since date := (current_timestamp at time zone 'America/Lima')::date - (case when p_days in (1, 7, 30) then p_days else 7 end - 1);
  v_result jsonb;
begin
  select jsonb_build_object(
    'kpis', (select jsonb_build_object(
      'visitors', count(distinct visitor_key), 'activeUsers', count(distinct user_id) filter (where user_id is not null),
      'sessions', coalesce(sum(sessions), 0), 'activeSeconds', coalesce(sum(active_seconds), 0),
      'avgSessionSeconds', case when coalesce(sum(sessions), 0) = 0 then 0 else round(sum(active_seconds)::numeric / sum(sessions)) end,
      'exercises', coalesce(sum(exercises), 0), 'correctAnswers', coalesce(sum(correct_answers), 0),
      'incorrectAnswers', coalesce(sum(incorrect_answers), 0)
    ) from public.analytics_daily where day >= v_since),
    'lessons', coalesce((select jsonb_agg(to_jsonb(x) order by x."activeSeconds" desc) from (
      select lesson_id as id, sum(active_seconds) as "activeSeconds", sum(page_views) as "pageViews",
        sum(exercises) as exercises, sum(correct_answers) as "correctAnswers",
        sum(incorrect_answers) as "incorrectAnswers", sum(hanzi_practiced) as hanzi
      from public.analytics_daily_content where day >= v_since and lesson_id <> '' group by lesson_id
    ) x), '[]'::jsonb),
    'modules', coalesce((select jsonb_agg(to_jsonb(x) order by x."activeSeconds" desc) from (
      select module as id, sum(active_seconds) as "activeSeconds", sum(page_views) as "pageViews", sum(exercises) as exercises
      from public.analytics_daily_content where day >= v_since group by module
      order by sum(active_seconds) desc limit 12
    ) x), '[]'::jsonb),
    'content', coalesce((select jsonb_agg(to_jsonb(x) order by x."activeSeconds" desc, x."pageViews" desc) from (
      select module, route, sum(active_seconds) as "activeSeconds", sum(page_views) as "pageViews", sum(events) as events
      from public.analytics_daily_content where day >= v_since and content_id = '' group by module, route
      order by sum(active_seconds) desc, sum(page_views) desc limit 12
    ) x), '[]'::jsonb),
    'games', coalesce((select jsonb_agg(to_jsonb(x) order by x.started desc) from (
      select content_id as id, sum(games_started) as started, sum(games_completed) as completed
      from public.analytics_daily_content where day >= v_since and content_id <> '' and (games_started > 0 or games_completed > 0)
      group by content_id order by sum(games_started) desc limit 10
    ) x), '[]'::jsonb),
    'hanzi', coalesce((select jsonb_agg(to_jsonb(x) order by x.practiced desc) from (
      select content_id as id, sum(hanzi_practiced) as practiced from public.analytics_daily_content
      where day >= v_since and content_id <> '' and hanzi_practiced > 0 group by content_id order by sum(hanzi_practiced) desc limit 12
    ) x), '[]'::jsonb),
    'exams', coalesce((select jsonb_agg(to_jsonb(x) order by x.started desc) from (
      select content_id as id, sum(exams_started) as started, sum(exams_completed) as completed
      from public.analytics_daily_content where day >= v_since and content_id <> '' and (exams_started > 0 or exams_completed > 0)
      group by content_id order by sum(exams_started) desc limit 10
    ) x), '[]'::jsonb),
    'trend', coalesce((select jsonb_agg(to_jsonb(x) order by x.day) from (
      select day::text as day, count(distinct visitor_key) as visitors, sum(sessions) as sessions,
        sum(active_seconds) as "activeSeconds", sum(exercises) as exercises
      from public.analytics_daily where day >= v_since group by day
    ) x), '[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;

revoke all on function public.record_analytics_activity(uuid, text, uuid, uuid, text, text, text, text, text, integer, boolean) from public, anon, authenticated;
revoke all on function public.admin_analytics_dashboard(integer) from public, anon, authenticated;
grant execute on function public.record_analytics_activity(uuid, text, uuid, uuid, text, text, text, text, text, integer, boolean) to service_role;
grant execute on function public.admin_analytics_dashboard(integer) to service_role;

comment on table public.analytics_daily is 'Métricas diarias por identidad privada; sin datos personales directos.';
comment on table public.analytics_daily_content is 'Agregación diaria por ruta, lección, módulo y contenido.';
comment on function public.admin_analytics_dashboard(integer) is 'Resumen global invocable únicamente con la clave de servicio desde una ruta administrativa autorizada.';
