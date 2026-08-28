begin;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'community-a@example.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Alumno A"}', now(), now()),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'community-b@example.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Alumno B"}', now(), now()),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'community-admin@example.invalid', '', now(), '{"provider":"email","providers":["email"],"role":"admin"}', '{"full_name":"Moderador"}', now(), now());

update public.profiles set display_name = case id
  when '10000000-0000-4000-8000-000000000001' then 'Alumno A'
  when '10000000-0000-4000-8000-000000000002' then 'Alumno B'
  else 'Moderador' end
where id in ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{}}', true);
insert into public.community_threads (id,user_id,author_display_name,lesson_id,section,concept,skill,route,title,body,content_fingerprint)
values ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Alumno A',1,'grammar','很','grammar','/lesson/1/grammar','¿Por qué usamos 很 con 好?','Quiero comprender su función en la oración.','trigger-replaces-this');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{}}', true);
insert into public.community_replies (id,thread_id,user_id,author_display_name,body,content_fingerprint)
values ('30000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','Alumno B','很 conecta normalmente el sujeto con el adjetivo.','trigger-replaces-this');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{}}', true);
update public.community_threads set title = 'Edición prohibida' where id = '20000000-0000-4000-8000-000000000001';
reset role;

do $$ begin
  if (select title from public.community_threads where id='20000000-0000-4000-8000-000000000001') = 'Edición prohibida' then raise exception 'RLS permitió editar contenido ajeno'; end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{}}', true);
insert into public.community_reactions (reply_id,user_id,reaction_type) values ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','helpful');
do $$ begin
  begin
    insert into public.community_reactions (reply_id,user_id,reaction_type) values ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','helpful');
    raise exception 'La reacción duplicada fue aceptada';
  exception when unique_violation then null; end;
end $$;
insert into public.community_reports (reporter_user_id,target_type,target_id,reason) values ('10000000-0000-4000-8000-000000000002','thread','20000000-0000-4000-8000-000000000001','off_topic');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{}}', true);
do $$ begin
  if (select count(*) from public.community_reports) <> 0 then raise exception 'Un alumno leyó reportes ajenos'; end if;
end $$;
reset role;

insert into public.community_bans (user_id,reason,created_by) values ('10000000-0000-4000-8000-000000000002','Prueba transaccional','10000000-0000-4000-8000-000000000003');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{}}', true);
do $$ begin
  begin
    insert into public.community_threads (user_id,author_display_name,lesson_id,section,route,title,body,content_fingerprint)
    values ('10000000-0000-4000-8000-000000000002','Alumno B',1,'grammar','/lesson/1/grammar','Pregunta bloqueada válida','Este texto no debe poder publicarse.','x');
    raise exception 'El usuario bloqueado pudo publicar';
  exception when others then
    if sqlerrm = 'El usuario bloqueado pudo publicar' then raise; end if;
  end;
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated","app_metadata":{"role":"admin"}}', true);
update public.community_threads set status='hidden' where id='20000000-0000-4000-8000-000000000001';
reset role;

do $$ begin
  if (select status from public.community_threads where id='20000000-0000-4000-8000-000000000001') <> 'hidden' then raise exception 'El admin no pudo moderar'; end if;
end $$;

rollback;
