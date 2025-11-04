-- enable extension if needed:
create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  date date not null,
  text text not null,
  completed boolean default false,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);