-- RideFlow functional test data. No trip budget or budget currency is seeded.

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'an@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"An Nguyen"}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'binh@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Binh Tran"}'::jsonb
  )
on conflict (id) do update
set email = excluded.email,
    updated_at = now();

insert into public.profiles (id, email, display_name)
values
  ('11111111-1111-4111-8111-111111111111', 'an@example.com', 'An Nguyen'),
  ('22222222-2222-4222-8222-222222222222', 'binh@example.com', 'Binh Tran')
on conflict (id) do update
set email = excluded.email,
    display_name = excluded.display_name;

insert into public.trips (
  id,
  name,
  destination,
  start_date,
  end_date,
  owner_id,
  cover_image_url,
  cover_image_path,
  transport
)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Nam Cat Tien Weekend Ride',
  'Nam Cat Tien National Park',
  '2026-07-10',
  '2026-07-12',
  '11111111-1111-4111-8111-111111111111',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  'trips/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/covers/seed-cover.jpg',
  'Motorcycle'
)
on conflict (id) do update
set name = excluded.name,
    destination = excluded.destination,
    start_date = excluded.start_date,
    end_date = excluded.end_date,
    cover_image_url = excluded.cover_image_url,
    cover_image_path = excluded.cover_image_path,
    transport = excluded.transport;

insert into public.trip_members (
  id,
  trip_id,
  user_id,
  invited_email,
  role,
  invite_status,
  accepted_at
)
values
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'an@example.com',
    'owner',
    'accepted',
    now()
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    'binh@example.com',
    'planner',
    'accepted',
    now()
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    null,
    'chi@example.com',
    'viewer',
    'pending',
    null
  )
on conflict (id) do update
set role = excluded.role,
    invite_status = excluded.invite_status,
    accepted_at = excluded.accepted_at,
    user_id = excluded.user_id,
    invited_email = excluded.invited_email;

insert into public.trip_days (id, trip_id, date, day_index)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '2026-07-10', 1),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '2026-07-11', 2),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '2026-07-12', 3)
on conflict (id) do update
set date = excluded.date,
    day_index = excluded.day_index;

alter table public.timeline_items disable trigger timeline_items_set_updated_by;

insert into public.timeline_items (
  id,
  trip_id,
  trip_day_id,
  start_time,
  duration_minutes,
  title,
  notes,
  place_source,
  place_name,
  place_address,
  updated_by
)
values
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
    '07:30',
    150,
    'Ride to Dau Giay coffee stop',
    'Meet at the garage, check fuel, then ride out together.',
    'manual',
    'Dau Giay Coffee Stop',
    'Dau Giay, Dong Nai',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
    '08:00',
    210,
    'Forest trail and crocodile lake',
    'Bring water, camera, and light rain gear.',
    'manual',
    'Crocodile Lake Trail',
    'Nam Cat Tien National Park',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd3',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    '10:00',
    120,
    'Slow breakfast and return ride',
    'Pack memories, check bikes, return before evening traffic.',
    'manual',
    'Riverside Breakfast',
    'Tan Phu, Dong Nai',
    '11111111-1111-4111-8111-111111111111'
  )
on conflict (id) do update
set trip_day_id = excluded.trip_day_id,
    start_time = excluded.start_time,
    duration_minutes = excluded.duration_minutes,
    title = excluded.title,
    notes = excluded.notes,
    place_source = excluded.place_source,
    place_name = excluded.place_name,
    place_address = excluded.place_address,
    updated_by = excluded.updated_by;

alter table public.timeline_items enable trigger timeline_items_set_updated_by;

insert into public.memory_entries (id, trip_id, created_by, title, content)
values
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'First forest morning',
    'Mist on the river, bikes lined up outside the lodge, and everyone still half asleep.'
  ),
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    'Trail snapshots',
    'A loose collection of small moments from the main hiking day.'
  )
on conflict (id) do update
set title = excluded.title,
    content = excluded.content;

insert into public.memory_assets (
  id,
  memory_entry_id,
  trip_id,
  uploaded_by,
  image_url,
  image_path,
  alt_text,
  sort_order
)
values
  (
    'ffffffff-ffff-4fff-8fff-fffffffffff1',
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    'trips/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/memories/forest-morning-1.jpg',
    'Forest road at sunrise',
    0
  ),
  (
    'ffffffff-ffff-4fff-8fff-fffffffffff2',
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    'trips/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/memories/forest-morning-2.jpg',
    'Tall trees along the trail',
    1
  ),
  (
    'ffffffff-ffff-4fff-8fff-fffffffffff3',
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    'trips/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/memories/trail-snapshot-1.jpg',
    'Trail memory photo',
    0
  )
on conflict (id) do update
set image_url = excluded.image_url,
    image_path = excluded.image_path,
    alt_text = excluded.alt_text,
    sort_order = excluded.sort_order;

insert into public.expense_entries (
  id,
  trip_id,
  title,
  amount,
  currency,
  category,
  paid_by_member_id,
  expense_date,
  notes,
  created_by
)
values
  (
    '99999999-9999-4999-8999-999999999991',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Fuel refill',
    680000,
    'VND',
    'fuel',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '2026-07-10',
    'Shared highway fuel stop.',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    '99999999-9999-4999-8999-999999999992',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Lodge dinner',
    920000,
    'VND',
    'food',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '2026-07-11',
    'Dinner after the trail day.',
    '22222222-2222-4222-8222-222222222222'
  )
on conflict (id) do update
set title = excluded.title,
    amount = excluded.amount,
    currency = excluded.currency,
    category = excluded.category,
    paid_by_member_id = excluded.paid_by_member_id,
    expense_date = excluded.expense_date,
    notes = excluded.notes;

insert into public.expense_participants (
  expense_id,
  trip_id,
  trip_member_id,
  share_amount
)
values
  ('99999999-9999-4999-8999-999999999991', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 340000),
  ('99999999-9999-4999-8999-999999999991', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 340000),
  ('99999999-9999-4999-8999-999999999992', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 460000),
  ('99999999-9999-4999-8999-999999999992', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 460000)
on conflict (expense_id, trip_member_id) do update
set share_amount = excluded.share_amount;