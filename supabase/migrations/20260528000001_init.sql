-- Users (profiles extending auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  credits integer not null default 0,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);
alter table public.users enable row level security;

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'processing', 'completed', 'failed')),
  original_filename text,
  original_file_url text,
  original_duration numeric,
  original_size integer,
  format text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;

-- Stems
create table if not exists public.stems (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('vocals', 'drums', 'bass', 'other', 'instrumental')),
  audio_url text not null,
  duration numeric,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.stems enable row level security;

-- Processing jobs
create table if not exists public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'processing', 'completed', 'failed')),
  original_filename text,
  original_file_url text,
  original_duration numeric,
  original_size integer,
  format text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;

-- Stems
create table if not exists public.stems (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('vocals', 'drums', 'bass', 'other', 'instrumental')),
  audio_url text not null,
  duration numeric,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.stems enable row level security;

-- Processing jobs
create table if not exists public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid,
  mode text not null check (mode in ('separate_vocal', 'split_stem')),
  stem_type text,
  suno_job_id text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  credits_consumed integer not null default 0,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.processing_jobs enable row level security;

-- Billing
create table if not exists public.billing (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_session_id text,
  stripe_payment_intent_id text,
  amount integer,
  credits_purchased integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.billing enable row level security;

-- RLS policies
create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can read own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id);

create policy "Users can read own project stems" on public.stems
  for select using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

create policy "Users can read own processing jobs" on public.processing_jobs
  for select using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name, avatar_url, credits)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    10
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RPC: add credits
create or replace function public.add_credits(user_id uuid, amount integer)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.users
  set credits = credits + amount
  where id = user_id;
end;
$$;

-- RPC: deduct credits
create or replace function public.deduct_credits(user_id uuid, amount integer)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.users
  set credits = credits - amount
  where id = user_id;
end;
$$;
