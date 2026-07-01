-- Add profile fields to organizations table

alter table public.organizations
  add column if not exists legal_name text,
  add column if not exists description text,
  add column if not exists primary_color text default '#000000',
  add column if not exists secondary_color text default '#6b7280',
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists website text,
  add column if not exists country text,
  add column if not exists timezone text default 'UTC',
  add column if not exists language text default 'en',
  add column if not exists currency text default 'USD',
  add column if not exists date_format text default 'MM/DD/YYYY',
  add column if not exists time_format text default '12h',
  add column if not exists address text;

-- Allow organization owners and admins to update their organization
create policy "Admins can update their organization"
  on public.organizations for update
  using (
    id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Allow authenticated users to insert organizations (for first-time setup)
create policy "Authenticated users can create organizations"
  on public.organizations for insert
  with check (auth.uid() is not null);

-- Allow owners/admins to insert organization members
create policy "Admins can add organization members"
  on public.organization_members for insert
  with check (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
    or not exists (
      select 1 from public.organization_members
      where organization_id = organization_members.organization_id
    )
  );
