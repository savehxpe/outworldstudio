alter table public.users add column if not exists tier text not null default 'free';
alter table public.users add column if not exists stripe_subscription_id text;
alter table public.users add column if not exists trial_ends_at timestamptz;
alter table public.users add column if not exists subscription_status text;
alter table public.users add column if not exists monthly_credits integer not null default 0;
alter table public.users add column if not exists credits_last_refreshed_at timestamptz;

alter table public.billing add column if not exists tier text;
alter table public.billing add column if not exists stripe_subscription_id text;

create policy "Users can read own billing" on public.billing
  for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name, avatar_url, credits, tier, monthly_credits)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    10,
    'free',
    0
  );
  return new;
end;
$$;
