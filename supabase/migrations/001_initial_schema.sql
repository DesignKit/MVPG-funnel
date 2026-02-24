-- MVP Gurus Initial Schema
-- Run against your Supabase project via SQL Editor or CLI

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 2. CHAT_SESSIONS
-- ============================================
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_token text not null unique default gen_random_uuid()::text,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_sessions enable row level security;

create policy "Anyone can insert sessions"
  on public.chat_sessions for insert with check (true);

create policy "Users can view own sessions"
  on public.chat_sessions for select using (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.chat_sessions for update using (auth.uid() = user_id);

-- ============================================
-- 3. CHAT_RESPONSES
-- ============================================
create table public.chat_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  question_key text not null
    check (question_key in ('problem', 'target_user', 'mvp_features', 'timeline')),
  question_text text not null,
  answer_text text not null,
  answered_at timestamptz not null default now(),
  unique(session_id, question_key)
);

alter table public.chat_responses enable row level security;

create policy "Session-scoped access for responses"
  on public.chat_responses for all using (
    session_id in (
      select id from public.chat_sessions where user_id = auth.uid()
    )
  );

-- ============================================
-- 4. REGISTRATIONS
-- ============================================
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  idea_description text not null,
  additional_expectations text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

create policy "Anyone can insert registrations"
  on public.registrations for insert with check (true);

create policy "Users can view own registrations"
  on public.registrations for select using (auth.uid() = user_id);

-- ============================================
-- 5. BOOKINGS
-- ============================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references public.registrations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  booking_date date not null,
  booking_time time,
  timezone text default 'UTC',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Anyone can insert bookings"
  on public.bookings for insert with check (true);

create policy "Users can view own bookings"
  on public.bookings for select using (auth.uid() = user_id);

create policy "Users can update own bookings"
  on public.bookings for update using (auth.uid() = user_id);

-- ============================================
-- 6. PROJECT_OUTLINES
-- ============================================
create table public.project_outlines (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  content_markdown text not null,
  content_html text,
  version integer not null default 1,
  generated_by text default 'ai',
  status text not null default 'draft'
    check (status in ('draft', 'reviewed', 'approved', 'finalized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_outlines enable row level security;

create policy "Users can view own outlines"
  on public.project_outlines for select using (auth.uid() = user_id);

-- ============================================
-- 7. INDEXES
-- ============================================
create index idx_chat_sessions_user on public.chat_sessions(user_id);
create index idx_chat_sessions_token on public.chat_sessions(session_token);
create index idx_chat_responses_session on public.chat_responses(session_id);
create index idx_registrations_user on public.registrations(user_id);
create index idx_registrations_session on public.registrations(session_id);
create index idx_bookings_user on public.bookings(user_id);
create index idx_bookings_date on public.bookings(booking_date);
create index idx_project_outlines_registration on public.project_outlines(registration_id);
