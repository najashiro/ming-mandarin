-- Supports installations with or without migration 0013.
begin;
create table if not exists public.vocabulary_image_reviews (
  word_id text primary key, status text not null,
  prompt text not null check (char_length(prompt) between 40 and 12000),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz, updated_at timestamptz not null default now()
);
alter table public.vocabulary_image_reviews
  add column if not exists asset_sha256 text,
  add column if not exists prompt_sha256 text,
  add column if not exists revision integer not null default 0;
alter table public.vocabulary_image_reviews drop constraint if exists vocabulary_image_reviews_status_check;
alter table public.vocabulary_image_reviews add constraint vocabulary_image_reviews_status_check
  check (status in ('pending_review', 'approved', 'no_image', 'needs_regeneration'));
update public.vocabulary_image_reviews set status = 'pending_review', reviewed_at = null
  where status = 'approved' and asset_sha256 is null;
alter table public.vocabulary_image_reviews enable row level security;
revoke all on public.vocabulary_image_reviews from public, anon, authenticated;
grant all on public.vocabulary_image_reviews to service_role;
create or replace function public.save_vocabulary_image_review(
  p_word_id text, p_status text, p_prompt text, p_asset_sha256 text,
  p_prompt_sha256 text, p_reviewer uuid, p_expected_revision integer
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_row public.vocabulary_image_reviews;
begin
  if p_expected_revision is null or p_expected_revision < 0
    or p_asset_sha256 !~ '^[a-f0-9]{64}$' or p_prompt_sha256 !~ '^[a-f0-9]{64}$'
    or p_asset_sha256 is null or p_prompt_sha256 is null then
    raise exception 'invalid_image_review';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_word_id, 0));
  select * into v_row from public.vocabulary_image_reviews where word_id = p_word_id for update;
  if coalesce(v_row.revision, 0) <> p_expected_revision then
    return jsonb_build_object('conflict', true);
  end if;
  insert into public.vocabulary_image_reviews as r
    (word_id,status,prompt,asset_sha256,prompt_sha256,reviewed_by,reviewed_at,updated_at,revision)
    values (p_word_id,p_status,p_prompt,p_asset_sha256,p_prompt_sha256,p_reviewer,
      case when p_status in ('approved','no_image') then now() else null end, now(),p_expected_revision+1)
    on conflict (word_id) do update set status=excluded.status,prompt=excluded.prompt,
      asset_sha256=excluded.asset_sha256,prompt_sha256=excluded.prompt_sha256,
      reviewed_by=excluded.reviewed_by,reviewed_at=excluded.reviewed_at,
      updated_at=excluded.updated_at,revision=excluded.revision returning * into v_row;
  return jsonb_build_object('conflict',false,'row',to_jsonb(v_row));
end;
$$;
revoke all on function public.save_vocabulary_image_review(text,text,text,text,text,uuid,integer) from public,anon,authenticated;
grant execute on function public.save_vocabulary_image_review(text,text,text,text,text,uuid,integer) to service_role;
notify pgrst, 'reload schema';
commit;
