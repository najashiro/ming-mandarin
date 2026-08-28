create table public.community_admins (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.community_settings (
  key text primary key,
  value integer not null check (value > 0),
  updated_at timestamptz not null default now()
);

insert into public.community_settings (key, value) values
  ('threads_per_10m', 3),
  ('replies_per_10m', 12),
  ('reports_per_hour', 10)
on conflict (key) do nothing;

create table public.community_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_display_name text not null check (char_length(author_display_name) between 2 and 40),
  lesson_id integer not null check (lesson_id > 0),
  section text not null check (section in ('home', 'route', 'pinyin', 'pronunciation', 'vocabulary', 'grammar', 'dialogues', 'listening', 'reading', 'production', 'hanzi', 'practice', 'games', 'exam')),
  concept text check (concept is null or char_length(concept) between 1 and 80),
  skill text check (skill is null or skill in ('vocabulary', 'grammar', 'pronunciation', 'tones', 'pinyin', 'listening', 'reading', 'writing', 'hanzi-recognition', 'stroke-order', 'hanzi-writing', 'communication')),
  route text not null check (char_length(route) between 1 and 300 and route like '/%'),
  title text not null check (char_length(title) between 8 and 160),
  body text not null check (char_length(body) between 12 and 5000),
  content_fingerprint text not null,
  status text not null default 'active' check (status in ('active', 'hidden', 'deleted', 'deleted_by_author')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create table public.community_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.community_threads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_display_name text not null check (char_length(author_display_name) between 2 and 40),
  body text not null check (char_length(body) between 2 and 5000),
  content_fingerprint text not null,
  status text not null default 'active' check (status in ('active', 'hidden', 'deleted', 'deleted_by_author')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_reactions (
  id uuid primary key default gen_random_uuid(),
  reply_id uuid not null references public.community_replies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction_type text not null default 'helpful' check (reaction_type = 'helpful'),
  created_at timestamptz not null default now(),
  unique (user_id, reply_id, reaction_type)
);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('thread', 'reply')),
  target_id uuid not null,
  reason text not null check (reason in ('offensive', 'spam', 'harassment', 'off_topic', 'other')),
  details text check (details is null or char_length(details) <= 1000),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed', 'actioned')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  unique (reporter_user_id, target_type, target_id)
);

create table public.community_moderation_actions (
  id uuid primary key default gen_random_uuid(),
  moderator_user_id uuid not null references public.profiles(id) on delete restrict,
  target_type text not null check (target_type in ('thread', 'reply', 'user')),
  target_id uuid not null,
  action text not null check (action in ('hide', 'restore', 'delete', 'ban', 'unban')),
  reason text check (reason is null or char_length(reason) <= 1000),
  created_at timestamptz not null default now()
);

create table public.community_bans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 1000),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references public.profiles(id) on delete set null,
  check (ends_at is null or ends_at > starts_at)
);

-- Realtime publishes only a sanitized event. Content and private user IDs stay behind the API.
create table public.community_reply_events (
  reply_id uuid primary key references public.community_replies(id) on delete cascade,
  thread_id uuid not null references public.community_threads(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index community_threads_context_idx on public.community_threads(lesson_id, section, concept, status, last_activity_at desc);
create index community_threads_lesson_idx on public.community_threads(lesson_id, status, last_activity_at desc);
create index community_threads_author_idx on public.community_threads(user_id, created_at desc);
create index community_replies_thread_idx on public.community_replies(thread_id, status, created_at);
create index community_replies_author_idx on public.community_replies(user_id, created_at desc);
create index community_reactions_reply_idx on public.community_reactions(reply_id, reaction_type);
create index community_reports_queue_idx on public.community_reports(status, created_at desc);
create index community_reports_target_idx on public.community_reports(target_type, target_id);
create index community_moderation_target_idx on public.community_moderation_actions(target_type, target_id, created_at desc);
create index community_bans_active_idx on public.community_bans(user_id, starts_at, ends_at) where revoked_at is null;
create index community_reply_events_thread_idx on public.community_reply_events(thread_id, created_at desc);

create or replace function public.community_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'moderator')
    or exists (select 1 from public.community_admins a where a.user_id = auth.uid());
$$;

create or replace function public.community_user_can_post(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = target_user)
    and not exists (
      select 1 from public.community_bans b
      where b.user_id = target_user
        and b.revoked_at is null
        and b.starts_at <= now()
        and (b.ends_at is null or b.ends_at > now())
    );
$$;

create or replace function public.community_setting(setting_key text, fallback_value integer)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select s.value from public.community_settings s where s.key = setting_key), fallback_value);
$$;

create or replace function public.community_prepare_thread()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid;
  max_posts integer;
begin
  actor := case when auth.role() = 'service_role' then new.user_id else auth.uid() end;
  if actor is null or not public.community_user_can_post(actor) then
    raise exception 'community_posting_blocked';
  end if;
  new.user_id := actor;
  select p.display_name into new.author_display_name from public.profiles p where p.id = actor;
  if new.author_display_name is null then raise exception 'community_profile_required'; end if;
  new.title := btrim(new.title);
  new.body := btrim(new.body);
  new.content_fingerprint := encode(extensions.digest(lower(new.title) || E'\n' || lower(new.body), 'sha256'), 'hex');
  new.updated_at := now();
  new.last_activity_at := now();
  if auth.role() <> 'service_role' then
    max_posts := public.community_setting('threads_per_10m', 3);
    if (select count(*) from public.community_threads t where t.user_id = actor and t.created_at > now() - interval '10 minutes') >= max_posts then
      raise exception 'community_thread_rate_limit';
    end if;
    if exists (select 1 from public.community_threads t where t.user_id = actor and t.content_fingerprint = new.content_fingerprint and t.created_at > now() - interval '1 hour') then
      raise exception 'community_duplicate_content';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.community_prepare_reply()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid;
  max_posts integer;
begin
  actor := case when auth.role() = 'service_role' then new.user_id else auth.uid() end;
  if actor is null or not public.community_user_can_post(actor) then
    raise exception 'community_posting_blocked';
  end if;
  if not exists (select 1 from public.community_threads t where t.id = new.thread_id and t.status = 'active') then
    raise exception 'community_thread_unavailable';
  end if;
  new.user_id := actor;
  select p.display_name into new.author_display_name from public.profiles p where p.id = actor;
  if new.author_display_name is null then raise exception 'community_profile_required'; end if;
  new.body := btrim(new.body);
  new.content_fingerprint := encode(extensions.digest(lower(new.body), 'sha256'), 'hex');
  new.updated_at := now();
  if auth.role() <> 'service_role' then
    max_posts := public.community_setting('replies_per_10m', 12);
    if (select count(*) from public.community_replies r where r.user_id = actor and r.created_at > now() - interval '10 minutes') >= max_posts then
      raise exception 'community_reply_rate_limit';
    end if;
    if exists (select 1 from public.community_replies r where r.user_id = actor and r.content_fingerprint = new.content_fingerprint and r.created_at > now() - interval '1 hour') then
      raise exception 'community_duplicate_content';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.community_protect_thread_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' and not public.community_is_admin() then
    if auth.uid() <> old.user_id or old.status <> 'active' then raise exception 'community_update_forbidden'; end if;
    new.user_id := old.user_id;
    new.lesson_id := old.lesson_id;
    new.section := old.section;
    new.concept := old.concept;
    new.skill := old.skill;
    new.route := old.route;
    new.author_display_name := old.author_display_name;
    if new.status not in ('active', 'deleted_by_author') then raise exception 'community_status_forbidden'; end if;
  end if;
  new.title := btrim(new.title);
  new.body := btrim(new.body);
  new.content_fingerprint := encode(extensions.digest(lower(new.title) || E'\n' || lower(new.body), 'sha256'), 'hex');
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.community_protect_reply_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' and not public.community_is_admin() then
    if auth.uid() <> old.user_id or old.status <> 'active' then raise exception 'community_update_forbidden'; end if;
    new.user_id := old.user_id;
    new.thread_id := old.thread_id;
    new.author_display_name := old.author_display_name;
    if new.status not in ('active', 'deleted_by_author') then raise exception 'community_status_forbidden'; end if;
  end if;
  new.body := btrim(new.body);
  new.content_fingerprint := encode(extensions.digest(lower(new.body), 'sha256'), 'hex');
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.community_after_reply()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'active' then
    update public.community_threads set last_activity_at = greatest(last_activity_at, new.created_at) where id = new.thread_id;
    if tg_op = 'INSERT' then
      insert into public.community_reply_events (reply_id, thread_id, created_at) values (new.id, new.thread_id, new.created_at) on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.community_sync_display_name()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.display_name is distinct from old.display_name then
    update public.community_threads set author_display_name = new.display_name where user_id = new.id;
    update public.community_replies set author_display_name = new.display_name where user_id = new.id;
  end if;
  return new;
end;
$$;

create trigger community_threads_prepare before insert on public.community_threads for each row execute function public.community_prepare_thread();
create trigger community_threads_protect before update on public.community_threads for each row execute function public.community_protect_thread_update();
create trigger community_replies_prepare before insert on public.community_replies for each row execute function public.community_prepare_reply();
create trigger community_replies_protect before update on public.community_replies for each row execute function public.community_protect_reply_update();
create trigger community_replies_activity after insert or update on public.community_replies for each row execute function public.community_after_reply();
create trigger community_profile_name_sync after update of display_name on public.profiles for each row execute function public.community_sync_display_name();

alter table public.community_admins enable row level security;
alter table public.community_settings enable row level security;
alter table public.community_threads enable row level security;
alter table public.community_replies enable row level security;
alter table public.community_reactions enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_moderation_actions enable row level security;
alter table public.community_bans enable row level security;
alter table public.community_reply_events enable row level security;

create policy community_threads_read on public.community_threads for select to anon, authenticated
  using (status = 'active' or auth.uid() = user_id or public.community_is_admin());
create policy community_threads_insert on public.community_threads for insert to authenticated
  with check (auth.uid() = user_id and public.community_user_can_post(auth.uid()));
create policy community_threads_update on public.community_threads for update to authenticated
  using (auth.uid() = user_id or public.community_is_admin())
  with check (auth.uid() = user_id or public.community_is_admin());

create policy community_replies_read on public.community_replies for select to anon, authenticated
  using ((status = 'active' and exists (select 1 from public.community_threads t where t.id = thread_id and t.status = 'active')) or auth.uid() = user_id or public.community_is_admin());
create policy community_replies_insert on public.community_replies for insert to authenticated
  with check (auth.uid() = user_id and public.community_user_can_post(auth.uid()));
create policy community_replies_update on public.community_replies for update to authenticated
  using (auth.uid() = user_id or public.community_is_admin())
  with check (auth.uid() = user_id or public.community_is_admin());

create policy community_reactions_read_own on public.community_reactions for select to authenticated using (auth.uid() = user_id);
create policy community_reactions_insert_own on public.community_reactions for insert to authenticated with check (auth.uid() = user_id);
create policy community_reactions_delete_own on public.community_reactions for delete to authenticated using (auth.uid() = user_id);

create policy community_reports_read_own on public.community_reports for select to authenticated using (auth.uid() = reporter_user_id or public.community_is_admin());
create policy community_reports_insert_own on public.community_reports for insert to authenticated with check (auth.uid() = reporter_user_id);
create policy community_reports_admin_update on public.community_reports for update to authenticated using (public.community_is_admin()) with check (public.community_is_admin());

create policy community_admins_admin_read on public.community_admins for select to authenticated using (public.community_is_admin());
create policy community_settings_admin_read on public.community_settings for select to authenticated using (public.community_is_admin());
create policy community_settings_admin_update on public.community_settings for update to authenticated using (public.community_is_admin()) with check (public.community_is_admin());
create policy community_actions_admin_all on public.community_moderation_actions for all to authenticated using (public.community_is_admin()) with check (public.community_is_admin());
create policy community_bans_admin_all on public.community_bans for all to authenticated using (public.community_is_admin()) with check (public.community_is_admin());
create policy community_events_read on public.community_reply_events for select to anon, authenticated
  using (exists (select 1 from public.community_threads t where t.id = thread_id and t.status = 'active'));

revoke all on public.community_admins, public.community_settings, public.community_threads, public.community_replies, public.community_reactions, public.community_reports, public.community_moderation_actions, public.community_bans, public.community_reply_events from anon, authenticated;
grant select on public.community_threads, public.community_replies, public.community_reply_events to anon, authenticated;
grant insert, update on public.community_threads, public.community_replies to authenticated;
grant select, insert, delete on public.community_reactions to authenticated;
grant select, insert on public.community_reports to authenticated;
grant select on public.community_admins, public.community_settings, public.community_moderation_actions, public.community_bans to authenticated;
grant update on public.community_settings, public.community_reports to authenticated;
grant insert, update, delete on public.community_moderation_actions, public.community_bans to authenticated;
grant execute on function public.community_is_admin(), public.community_user_can_post(uuid) to anon, authenticated;

alter table public.community_reply_events replica identity full;
do $$
begin
  alter publication supabase_realtime add table public.community_reply_events;
exception when duplicate_object then null;
end $$;

comment on table public.community_threads is 'Preguntas educativas contextuales; solo texto y sin impacto en progreso académico.';
comment on table public.community_reply_events is 'Eventos Realtime sanitizados: no contienen contenido ni identificadores de usuario.';
