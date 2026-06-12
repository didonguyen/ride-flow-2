create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.trip_role as enum ('owner', 'planner', 'viewer');
create type public.invite_status as enum ('pending', 'accepted');
create type public.place_source as enum ('seed', 'osm', 'manual', 'google');
create type public.ai_draft_status as enum ('pending', 'completed', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  destination text not null check (length(trim(destination)) > 0),
  start_date date not null,
  end_date date not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_valid_date_range check (end_date >= start_date)
);

create table public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  invited_email citext not null default '',
  role public.trip_role not null,
  invite_status public.invite_status not null default 'pending',
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  constraint trip_members_user_or_pending check (
    (invite_status = 'pending' and user_id is null)
    or (invite_status = 'accepted' and user_id is not null)
  )
);

create unique index trip_members_unique_email_per_trip
  on public.trip_members (trip_id, invited_email);

create unique index trip_members_unique_user_per_trip
  on public.trip_members (trip_id, user_id)
  where user_id is not null;

create table public.trip_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  date date not null,
  day_index integer not null check (day_index > 0),
  unique (id, trip_id),
  unique (trip_id, date),
  unique (trip_id, day_index)
);

create table public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  trip_day_id uuid not null,
  start_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  title text not null check (length(trim(title)) > 0),
  notes text not null default '',
  place_source public.place_source,
  place_source_id text,
  place_name text,
  place_address text,
  place_lat double precision,
  place_lng double precision,
  place_external_url text,
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint timeline_items_trip_day_matches_trip
    foreign key (trip_day_id, trip_id)
    references public.trip_days (id, trip_id)
    on delete cascade
);

create table public.ai_draft_runs (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  requested_by uuid not null references public.profiles(id),
  prompt text not null default '',
  status public.ai_draft_status not null default 'pending',
  validated_summary jsonb,
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_touch_updated_at
before update on public.trips
for each row execute function public.touch_updated_at();

create trigger timeline_items_touch_updated_at
before update on public.timeline_items
for each row execute function public.touch_updated_at();

create or replace function public.is_trip_member(
  target_trip_id uuid,
  allowed_roles public.trip_role[]
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.trip_members tm
      where tm.trip_id = target_trip_id
        and tm.user_id = auth.uid()
        and tm.invite_status = 'accepted'
        and tm.role = any(allowed_roles)
    )
    or (
      'owner'::public.trip_role = any(allowed_roles)
      and exists (
        select 1
        from public.trips t
        where t.id = target_trip_id
          and t.owner_id = auth.uid()
      )
    );
$$;

create or replace function public.accept_trip_invite(target_trip_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email citext;
begin
  current_email := nullif(auth.jwt() ->> 'email', '')::citext;

  if current_email is null then
    raise exception 'auth_email_required';
  end if;

  update public.trip_members
  set user_id = auth.uid(),
      invite_status = 'accepted',
      accepted_at = now()
  where trip_id = target_trip_id
    and invited_email = current_email
    and invite_status = 'pending'
    and user_id is null;

  if not found then
    raise exception 'invite_not_found';
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_days enable row level security;
alter table public.timeline_items enable row level security;
alter table public.ai_draft_runs enable row level security;

create policy "profiles_read_own"
on public.profiles for select
using (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles for insert
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "trips_read_members"
on public.trips for select
using (public.is_trip_member(id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "trips_insert_owner"
on public.trips for insert
with check (owner_id = auth.uid());

create policy "trips_update_owner"
on public.trips for update
using (public.is_trip_member(id, array['owner']::public.trip_role[]))
with check (public.is_trip_member(id, array['owner']::public.trip_role[]));

create policy "trips_delete_owner"
on public.trips for delete
using (public.is_trip_member(id, array['owner']::public.trip_role[]));

create policy "trip_members_read_trip_members"
on public.trip_members for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "trip_members_insert_owner"
on public.trip_members for insert
with check (public.is_trip_member(trip_id, array['owner']::public.trip_role[]));

create policy "trip_members_update_owner"
on public.trip_members for update
using (public.is_trip_member(trip_id, array['owner']::public.trip_role[]))
with check (public.is_trip_member(trip_id, array['owner']::public.trip_role[]));

create policy "trip_members_delete_owner"
on public.trip_members for delete
using (public.is_trip_member(trip_id, array['owner']::public.trip_role[]));

create policy "trip_days_read_members"
on public.trip_days for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "trip_days_insert_owner"
on public.trip_days for insert
with check (public.is_trip_member(trip_id, array['owner']::public.trip_role[]));

create policy "timeline_items_read_members"
on public.timeline_items for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "timeline_items_insert_planners"
on public.timeline_items for insert
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "timeline_items_update_planners"
on public.timeline_items for update
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]))
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "timeline_items_delete_planners"
on public.timeline_items for delete
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "ai_draft_runs_read_planners"
on public.ai_draft_runs for select
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "ai_draft_runs_insert_planners"
on public.ai_draft_runs for insert
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));
