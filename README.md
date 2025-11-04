# Todo Timetable

Simple React app combining a task list with a calendar. Tasks persist to Supabase (Postgres) for cross-device sync.

## Features
- Add tasks with a date
- Grouped task list by date
- Calendar (timetable) view
- Supabase integration (CRUD + optional realtime)
- Local-first UI with optimistic updates

## Quick start

1. Install
```
npm install
```

2. Configure environment (do NOT commit)
Create `.env` in the project root:
```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

3. Start dev server
```
npm run dev
```

## Database (Supabase) — minimal schema

Run in Supabase SQL editor:
```sql
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
```

For quick development allow anon access (dev only):
```sql
alter table public.tasks enable row level security;

create policy "anon_select"  on public.tasks for select  using (true);
create policy "anon_insert"  on public.tasks for insert  with check (true);
create policy "anon_update"  on public.tasks for update  using (true) with check (true);
create policy "anon_delete"  on public.tasks for delete  using (true);
```

## Important
- Do not commit `.env` or secret keys. Regenerate keys if accidentally published.
- If Supabase access fails, check RLS policies and browser console for errors.

## Project layout
- src/
  - components/TaskInput.jsx
  - components/TaskList.jsx
  - components/Timetable.jsx
  - lib/supabaseClient.js
  - App.jsx

## Contributing
- Create a branch, make changes, open a PR.

