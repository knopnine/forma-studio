-- Forma Studio — PostgreSQL Database Schema for Supabase
-- Enables Anonymous & Authenticated cloud session sync with Row Level Security (RLS)

-- 1. USER PROFILES TABLE
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  name text default 'Athlete',
  experience_level text default 'intermediate',
  primary_goal text default 'hypertrophy',
  weekly_target_sessions int default 4,
  preferred_duration int default 30,
  language text default 'en',
  sound_enabled boolean default true,
  haptics_enabled boolean default true,
  equipment jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. WORKOUT LOGS TABLE
create table if not exists public.workout_logs (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_id text,
  title text not null,
  date date not null,
  started_at timestamp with time zone not null,
  completed_at timestamp with time zone not null,
  duration_seconds int not null,
  total_volume_kg numeric not null default 0,
  total_reps int not null default 0,
  exercises_completed_count int not null default 0,
  exercises jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_workout_logs_user_date on public.workout_logs (user_id, date desc);

-- 3. PERSONAL RECORDS TABLE
create table if not exists public.personal_records (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  exercise_id text not null,
  exercise_name text not null,
  metric_type text not null, -- 'max_weight' | 'max_reps'
  record_value numeric not null,
  achieved_at timestamp with time zone not null,
  unique(user_id, exercise_id, metric_type)
);

create index if not exists idx_personal_records_user on public.personal_records (user_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures every device/user (including anonymous sessions) can only see and edit their own data

alter table public.user_profiles enable row level security;
alter table public.workout_logs enable row level security;
alter table public.personal_records enable row level security;

-- Profiles Policies
create policy "Allow individual read access to own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Allow individual insert/update access to own profile"
  on public.user_profiles for all
  using (auth.uid() = id);

-- Workout Logs Policies
create policy "Allow individual read access to own workout logs"
  on public.workout_logs for select
  using (auth.uid() = user_id);

create policy "Allow individual write access to own workout logs"
  on public.workout_logs for all
  using (auth.uid() = user_id);

-- Personal Records Policies
create policy "Allow individual read access to own personal records"
  on public.personal_records for select
  using (auth.uid() = user_id);

create policy "Allow individual write access to own personal records"
  on public.personal_records for all
  using (auth.uid() = user_id);
