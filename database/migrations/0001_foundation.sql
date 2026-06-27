-- Zivo OS Foundation Schema
-- Multi-tenant base tables with Row Level Security

-- =============================================================================
-- ORGANIZATIONS
-- =============================================================================
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_organizations_slug on public.organizations (slug);

alter table public.organizations enable row level security;

-- Users can see organizations they belong to
create policy "Members can view their organization"
  on public.organizations for select
  using (
    id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

-- =============================================================================
-- ORGANIZATION MEMBERS
-- =============================================================================
create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index idx_org_members_org on public.organization_members (organization_id);
create index idx_org_members_user on public.organization_members (user_id);

alter table public.organization_members enable row level security;

-- Users can see memberships within their organizations
create policy "Members can view organization memberships"
  on public.organization_members for select
  using (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

-- Users can see their own memberships
create policy "Users can view own memberships"
  on public.organization_members for select
  using (user_id = auth.uid());

-- =============================================================================
-- USER PROFILES
-- =============================================================================
create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- Users can read profiles of people in their organizations
create policy "Organization members can view profiles"
  on public.user_profiles for select
  using (
    id in (
      select om2.user_id from public.organization_members om1
      join public.organization_members om2 on om1.organization_id = om2.organization_id
      where om1.user_id = auth.uid()
    )
  );

-- Users can read and update their own profile
create policy "Users can view own profile"
  on public.user_profiles for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.user_profiles for update
  using (id = auth.uid());

-- =============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- UPDATED_AT TRIGGER
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

create trigger set_organization_members_updated_at
  before update on public.organization_members
  for each row execute function public.set_updated_at();

create trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();
