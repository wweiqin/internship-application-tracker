-- Internship Application Tracker database schema

create table if not exists public.applications (
  id bigint generated always as identity primary key,

  user_id uuid not null default auth.uid(),

  company_name varchar(150) not null,
  role_title varchar(150) not null,
  location varchar(150),

  application_status varchar(50) not null default 'Interested'
    check (
      application_status in (
        'Interested',
        'Applied',
        'Online Assessment',
        'Interview',
        'Offer',
        'Rejected',
        'Withdrawn'
      )
    ),

  application_date date,
  deadline date,
  job_link text,

  contact_name varchar(150),
  contact_email varchar(255),
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes improve common filtering queries

create index if not exists applications_user_id_idx
  on public.applications (user_id);

create index if not exists applications_status_idx
  on public.applications (application_status);

create index if not exists applications_deadline_idx
  on public.applications (deadline);

-- Automatically update updated_at whenever a row changes

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists applications_set_updated_at
  on public.applications;

create trigger applications_set_updated_at
before update on public.applications
for each row
execute function public.set_updated_at();

-- Enable Row Level Security

alter table public.applications enable row level security;

-- Remove old policies if this script is run again

drop policy if exists "Users can view own applications"
  on public.applications;

drop policy if exists "Users can create own applications"
  on public.applications;

drop policy if exists "Users can update own applications"
  on public.applications;

drop policy if exists "Users can delete own applications"
  on public.applications;

-- Each signed-in visitor can only access their own rows

create policy "Users can view own applications"
on public.applications
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create own applications"
on public.applications
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own applications"
on public.applications
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own applications"
on public.applications
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- Allow authenticated users to access the table through Supabase's API

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.applications
to authenticated;

grant usage, select
on sequence public.applications_id_seq
to authenticated;