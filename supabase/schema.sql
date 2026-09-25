-- Roy landing page: waitlist signups
-- Run this in the Supabase project's SQL editor (Database > SQL Editor > New query).

create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'hero', -- 'hero' or 'footer' — which form on the page was used
  user_agent text,
  created_at timestamptz not null default now()
);

-- One signup per email.
create unique index if not exists signups_email_key on public.signups (lower(email));

-- Row Level Security: the anon key (used from the server-side API route) may only
-- INSERT, never read, update, or delete. Browse/export leads from the Supabase
-- table editor (or the SQL editor) using your own logged-in dashboard access,
-- which bypasses RLS.
alter table public.signups enable row level security;

create policy "Allow anonymous inserts" on public.signups
  for insert
  to anon
  with check (true);
