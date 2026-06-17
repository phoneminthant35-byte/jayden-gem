-- Run this in your Supabase SQL editor

create table if not exists scripts (
  id bigint generated always as identity primary key,
  topic text,
  content text,
  created_at timestamptz default now()
);

create table if not exists ideas (
  id bigint generated always as identity primary key,
  title text,
  created_at timestamptz default now()
);

create table if not exists analytics (
  id bigint generated always as identity primary key,
  stats text,
  analysis text,
  created_at timestamptz default now()
);

create table if not exists crew_chat (
  id bigint generated always as identity primary key,
  role text,
  text text,
  member text,
  created_at timestamptz default now()
);

create table if not exists calendar_posts (
  id bigint generated always as identity primary key,
  day text,
  topic text,
  note text,
  created_at timestamptz default now()
);

create table if not exists brand_bible (
  id bigint generated always as identity primary key,
  content text,
  created_at timestamptz default now()
);

-- Allow public read/write (RLS off for now)
alter table scripts enable row level security;
alter table ideas enable row level security;
alter table analytics enable row level security;
alter table crew_chat enable row level security;
alter table calendar_posts enable row level security;
alter table brand_bible enable row level security;

create policy "public all" on scripts for all using (true) with check (true);
create policy "public all" on ideas for all using (true) with check (true);
create policy "public all" on analytics for all using (true) with check (true);
create policy "public all" on crew_chat for all using (true) with check (true);
create policy "public all" on calendar_posts for all using (true) with check (true);
create policy "public all" on brand_bible for all using (true) with check (true);
