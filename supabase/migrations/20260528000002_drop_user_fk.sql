alter table public.projects alter column user_id drop not null;
alter table public.projects drop constraint if exists projects_user_id_fkey;

alter table public.processing_jobs alter column user_id drop not null;
alter table public.processing_jobs drop constraint if exists processing_jobs_user_id_fkey;

alter table public.billing alter column user_id drop not null;
alter table public.billing drop constraint if exists billing_user_id_fkey;
