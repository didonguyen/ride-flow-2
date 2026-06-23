-- Phase 1 Stop + Option model for the RideFlow Planning page.
-- Adds the 'member' read-only role, 'trip_stops', and 'stop_options' tables.

alter type public.trip_role add value if not exists 'member';

create table if not exists public.trip_stops (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_id uuid not null,
  title text not null check (length(trim(title)) > 0),
  time time,
  description text not null default '',
  note text not null default '',
  location_name text,
  address text,
  lat double precision,
  lng double precision,
  status text not null default 'action_needed'
    check (status in ('action_needed', 'pinned')),
  pinned_option_id uuid,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_stops_day_matches_trip
    foreign key (day_id, trip_id)
    references public.trip_days (id, trip_id)
    on delete cascade
);

create index if not exists trip_stops_day_order_idx
  on public.trip_stops (day_id, sort_order);

create table if not exists public.stop_options (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  stop_id uuid not null,
  name text not null check (length(trim(name)) > 0),
  address text,
  description text,
  image_url text,
  rating numeric(3,2) check (rating is null or (rating >= 0 and rating <= 5)),
  price_level integer check (price_level is null or (price_level >= 0 and price_level <= 4)),
  distance_text text,
  duration_text text,
  google_place_id text,
  google_maps_url text,
  lat double precision,
  lng double precision,
  source text not null check (source in ('ai', 'google_places', 'manual')),
  status text not null default 'candidate'
    check (status in ('candidate', 'pinned', 'backup', 'removed')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stop_options_stop_matches_trip
    foreign key (stop_id, trip_id)
    references public.trip_stops (id, trip_id)
    on delete cascade
);

create unique index if not exists stop_options_one_pinned_per_stop
  on public.stop_options (stop_id)
  where status = 'pinned';

create index if not exists stop_options_stop_order_idx
  on public.stop_options (stop_id, sort_order);

alter table public.trip_stops
  add constraint trip_stops_pinned_option_fk
  foreign key (pinned_option_id) references public.stop_options(id) on delete set null
  not valid;

create trigger trip_stops_touch_updated_at
before update on public.trip_stops
for each row execute function public.touch_updated_at();

create trigger stop_options_touch_updated_at
before update on public.stop_options
for each row execute function public.touch_updated_at();

alter table public.trip_stops enable row level security;
alter table public.stop_options enable row level security;

create policy "trip_stops_read_members"
on public.trip_stops for select
using (
  public.is_trip_member(trip_id, array['owner', 'planner', 'member', 'viewer']::public.trip_role[])
);

create policy "trip_stops_insert_planners"
on public.trip_stops for insert
with check (
  public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);

create policy "trip_stops_update_planners"
on public.trip_stops for update
using (
  public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
)
with check (
  public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);

create policy "trip_stops_delete_planners"
on public.trip_stops for delete
using (
  public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);

create policy "stop_options_read_members"
on public.stop_options for select
using (
  public.is_trip_member(trip_id, array['owner', 'planner', 'member', 'viewer']::public.trip_role[])
);

create policy "stop_options_insert_planners"
on public.stop_options for insert
with check (
  public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);

create policy "stop_options_update_planners"
on public.stop_options for update
using (
  public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
)
with check (
  public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);

create policy "stop_options_delete_planners"
on public.stop_options for delete
using (
  public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);