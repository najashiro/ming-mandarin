-- Evita que la actualización interna de actividad de una respuesta pase por
-- las reglas de edición del autor de la pregunta. También limita las columnas
-- que un alumno autenticado puede modificar directamente.

drop trigger if exists community_threads_protect on public.community_threads;
create trigger community_threads_protect
before update of title, body, status on public.community_threads
for each row execute function public.community_protect_thread_update();

drop trigger if exists community_replies_protect on public.community_replies;
create trigger community_replies_protect
before update of body, status on public.community_replies
for each row execute function public.community_protect_reply_update();

revoke update on public.community_threads, public.community_replies from authenticated;
grant update (title, body, status) on public.community_threads to authenticated;
grant update (body, status) on public.community_replies to authenticated;

comment on trigger community_threads_protect on public.community_threads is
  'Protege solo los campos editables por el autor; last_activity_at se mantiene internamente al recibir respuestas.';
