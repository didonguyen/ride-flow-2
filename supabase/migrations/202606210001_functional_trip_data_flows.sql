alter table public.trips
  add column if not exists cover_image_url text,
  add column if not exists cover_image_path text,
  add column if not exists transport text not null default 'Motorcycle';

create table if not exists public.memory_entries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memory_assets (
  id uuid primary key default gen_random_uuid(),
  memory_entry_id uuid not null references public.memory_entries(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  image_url text not null,
  image_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.expense_entries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'VND' check (length(trim(currency)) = 3),
  category text not null check (length(trim(category)) > 0),
  paid_by_member_id uuid not null references public.trip_members(id) on delete cascade,
  expense_date date not null,
  notes text not null default '',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expense_participants (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expense_entries(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  trip_member_id uuid not null references public.trip_members(id) on delete cascade,
  share_amount numeric(12,2) not null check (share_amount >= 0),
  created_at timestamptz not null default now(),
  unique (expense_id, trip_member_id)
);

create index if not exists memory_entries_trip_created_idx
  on public.memory_entries (trip_id, created_at desc);

create index if not exists memory_assets_entry_order_idx
  on public.memory_assets (memory_entry_id, sort_order, created_at);

create index if not exists expense_entries_trip_date_idx
  on public.expense_entries (trip_id, expense_date desc, created_at desc);

create index if not exists expense_participants_expense_idx
  on public.expense_participants (expense_id);

create trigger memory_entries_touch_updated_at
before update on public.memory_entries
for each row execute function public.touch_updated_at();

create trigger expense_entries_touch_updated_at
before update on public.expense_entries
for each row execute function public.touch_updated_at();

alter table public.memory_entries enable row level security;
alter table public.memory_assets enable row level security;
alter table public.expense_entries enable row level security;
alter table public.expense_participants enable row level security;

create policy "memory_entries_read_members"
on public.memory_entries for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "memory_entries_insert_planners"
on public.memory_entries for insert
with check (
  created_by = auth.uid()
  and public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);

create policy "memory_entries_update_planners"
on public.memory_entries for update
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]))
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "memory_entries_delete_planners"
on public.memory_entries for delete
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "memory_assets_read_members"
on public.memory_assets for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "memory_assets_insert_planners"
on public.memory_assets for insert
with check (
  uploaded_by = auth.uid()
  and public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);

create policy "memory_assets_update_planners"
on public.memory_assets for update
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]))
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "memory_assets_delete_planners"
on public.memory_assets for delete
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "expense_entries_read_members"
on public.expense_entries for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "expense_entries_insert_planners"
on public.expense_entries for insert
with check (
  created_by = auth.uid()
  and public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[])
);

create policy "expense_entries_update_planners"
on public.expense_entries for update
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]))
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "expense_entries_delete_planners"
on public.expense_entries for delete
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "expense_participants_read_members"
on public.expense_participants for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "expense_participants_insert_planners"
on public.expense_participants for insert
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "expense_participants_update_planners"
on public.expense_participants for update
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]))
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "expense_participants_delete_planners"
on public.expense_participants for delete
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

insert into storage.buckets (id, name, public)
values ('rideflow-trip-images', 'rideflow-trip-images', false)
on conflict (id) do nothing;

create policy "rideflow_trip_images_read_members"
on storage.objects for select
using (
  bucket_id = 'rideflow-trip-images'
  and (storage.foldername(name))[1] = 'trips'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and public.is_trip_member(((storage.foldername(name))[2])::uuid, array['owner', 'planner', 'viewer']::public.trip_role[])
);

create policy "rideflow_trip_images_insert_planners"
on storage.objects for insert
with check (
  bucket_id = 'rideflow-trip-images'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = 'trips'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and public.is_trip_member(((storage.foldername(name))[2])::uuid, array['owner', 'planner']::public.trip_role[])
);

create policy "rideflow_trip_images_update_planners"
on storage.objects for update
using (
  bucket_id = 'rideflow-trip-images'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = 'trips'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and public.is_trip_member(((storage.foldername(name))[2])::uuid, array['owner', 'planner']::public.trip_role[])
)
with check (
  bucket_id = 'rideflow-trip-images'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = 'trips'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and public.is_trip_member(((storage.foldername(name))[2])::uuid, array['owner', 'planner']::public.trip_role[])
);

create policy "rideflow_trip_images_delete_planners"
on storage.objects for delete
using (
  bucket_id = 'rideflow-trip-images'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = 'trips'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and public.is_trip_member(((storage.foldername(name))[2])::uuid, array['owner', 'planner']::public.trip_role[])
);
