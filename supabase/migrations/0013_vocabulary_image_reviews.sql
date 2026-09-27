-- Revisión editorial privada de imágenes. Solo las rutas administrativas del
-- servidor, autenticadas y respaldadas por service_role, pueden leer o escribir.

create table public.vocabulary_image_reviews (
  word_id text primary key,
  status text not null check (status in ('pending_review', 'approved', 'no_image')),
  prompt text not null check (char_length(prompt) between 40 and 12000),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index vocabulary_image_reviews_status_idx on public.vocabulary_image_reviews(status, updated_at desc);

alter table public.vocabulary_image_reviews enable row level security;
revoke all on public.vocabulary_image_reviews from public, anon, authenticated;
grant all on public.vocabulary_image_reviews to service_role;

comment on table public.vocabulary_image_reviews is 'Decisiones editoriales privadas para publicar, corregir u ocultar imágenes de vocabulario.';
