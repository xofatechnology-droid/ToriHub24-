-- ============================================================
-- NEWS PLATFORM — SUPABASE SCHEMA
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- PROFILES (extends auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'admin');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- TAGS ----------
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

-- ---------- POSTS ----------
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  youtube_url text,
  audio_url text,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  is_breaking boolean not null default false,
  seo_title text,
  seo_description text,
  og_image text,
  views integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_published_idx on public.posts (status, published_at desc);
create index if not exists posts_category_idx on public.posts (category_id);

-- ---------- POST_TAGS (many-to-many) ----------
create table if not exists public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ---------- MEDIA LIBRARY ----------
create table if not exists public.media (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  filename text not null,
  file_type text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- SITE SETTINGS (single row) ----------
create table if not exists public.site_settings (
  id int primary key default 1,
  site_name text not null default 'The Wire Desk',
  tagline text default 'Reporting, without the noise.',
  logo_url text,
  favicon_url text,
  adsense_client_id text,
  adsense_header_slot text,
  adsense_sidebar_slot text,
  adsense_in_article_slot text,
  social_twitter text,
  social_facebook text,
  social_instagram text,
  social_youtube text,
  footer_text text default 'All rights reserved.',
  constraint single_row check (id = 1)
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------- NEWSLETTER SUBSCRIBERS ----------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- updated_at trigger for posts
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute procedure public.set_updated_at();

-- Atomic view counter, callable from the public (anon) role
create or replace function public.increment_post_views(post_id uuid)
returns void as $$
  update public.posts set views = views + 1 where id = post_id;
$$ language sql security definer;

grant execute on function public.increment_post_views(uuid) to anon, authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Helper: is the current user an editor/admin (any authenticated profile)?
create or replace function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid()
  );
$$ language sql security definer stable;

-- PROFILES: staff can read all profiles; users can update their own
create policy "profiles are readable by staff" on public.profiles
  for select using (public.is_staff());
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id);

-- CATEGORIES: public read, staff write
create policy "categories public read" on public.categories
  for select using (true);
create policy "categories staff write" on public.categories
  for all using (public.is_staff()) with check (public.is_staff());

-- TAGS: public read, staff write
create policy "tags public read" on public.tags
  for select using (true);
create policy "tags staff write" on public.tags
  for all using (public.is_staff()) with check (public.is_staff());

-- POSTS: public can read published posts; staff can read/write everything
create policy "posts public read published" on public.posts
  for select using (status = 'published' or public.is_staff());
create policy "posts staff write" on public.posts
  for insert with check (public.is_staff());
create policy "posts staff update" on public.posts
  for update using (public.is_staff());
create policy "posts staff delete" on public.posts
  for delete using (public.is_staff());

-- POST_TAGS: public read, staff write
create policy "post_tags public read" on public.post_tags
  for select using (true);
create policy "post_tags staff write" on public.post_tags
  for all using (public.is_staff()) with check (public.is_staff());

-- MEDIA: staff only
create policy "media staff read" on public.media
  for select using (public.is_staff());
create policy "media staff write" on public.media
  for all using (public.is_staff()) with check (public.is_staff());

-- SITE_SETTINGS: public read, staff write
create policy "settings public read" on public.site_settings
  for select using (true);
create policy "settings staff write" on public.site_settings
  for update using (public.is_staff());

-- NEWSLETTER: anyone can insert (subscribe), only staff can read the list
create policy "newsletter public insert" on public.newsletter_subscribers
  for insert with check (true);
create policy "newsletter staff read" on public.newsletter_subscribers
  for select using (public.is_staff());

-- ============================================================
-- STORAGE BUCKET for media uploads (run once)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media bucket public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media bucket staff upload"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "media bucket staff delete"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
