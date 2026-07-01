-- Job Titles, Roles, App Users tables + RLS + triggers + grants

-- JOB TITLES
CREATE TABLE IF NOT EXISTS public.job_titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  title text NOT NULL,
  code text,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_job_titles_org ON public.job_titles(organization_id);
CREATE INDEX IF NOT EXISTS idx_job_titles_dept ON public.job_titles(department_id);
ALTER TABLE public.job_titles ENABLE ROW LEVEL SECURITY;

-- ROLES
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_system boolean NOT NULL DEFAULT false,
  permissions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_roles_org ON public.roles(organization_id);
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- APP USERS (organization-scoped user records, not auth.users)
CREATE TABLE IF NOT EXISTS public.app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  job_title_id uuid REFERENCES public.job_titles(id) ON DELETE SET NULL,
  role_id uuid REFERENCES public.roles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_app_users_org ON public.app_users(organization_id);
CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES — job_titles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'job_titles' AND policyname = 'Members can view job titles') THEN
    CREATE POLICY "Members can view job titles" ON public.job_titles FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'job_titles' AND policyname = 'Admins can insert job titles') THEN
    CREATE POLICY "Admins can insert job titles" ON public.job_titles FOR INSERT WITH CHECK (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'job_titles' AND policyname = 'Admins can update job titles') THEN
    CREATE POLICY "Admins can update job titles" ON public.job_titles FOR UPDATE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'job_titles' AND policyname = 'Admins can delete job titles') THEN
    CREATE POLICY "Admins can delete job titles" ON public.job_titles FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;
END $$;

-- RLS POLICIES — roles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'roles' AND policyname = 'Members can view roles') THEN
    CREATE POLICY "Members can view roles" ON public.roles FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'roles' AND policyname = 'Admins can insert roles') THEN
    CREATE POLICY "Admins can insert roles" ON public.roles FOR INSERT WITH CHECK (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'roles' AND policyname = 'Admins can update roles') THEN
    CREATE POLICY "Admins can update roles" ON public.roles FOR UPDATE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'roles' AND policyname = 'Admins can delete roles') THEN
    CREATE POLICY "Admins can delete roles" ON public.roles FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;
END $$;

-- RLS POLICIES — app_users
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_users' AND policyname = 'Members can view app users') THEN
    CREATE POLICY "Members can view app users" ON public.app_users FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_users' AND policyname = 'Admins can insert app users') THEN
    CREATE POLICY "Admins can insert app users" ON public.app_users FOR INSERT WITH CHECK (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_users' AND policyname = 'Admins can update app users') THEN
    CREATE POLICY "Admins can update app users" ON public.app_users FOR UPDATE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_users' AND policyname = 'Admins can delete app users') THEN
    CREATE POLICY "Admins can delete app users" ON public.app_users FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;
END $$;

-- TRIGGERS
DROP TRIGGER IF EXISTS set_job_titles_updated_at ON public.job_titles;
CREATE TRIGGER set_job_titles_updated_at BEFORE UPDATE ON public.job_titles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_roles_updated_at ON public.roles;
CREATE TRIGGER set_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_app_users_updated_at ON public.app_users;
CREATE TRIGGER set_app_users_updated_at BEFORE UPDATE ON public.app_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- GRANTS
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_titles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_users TO authenticated;
GRANT SELECT ON public.job_titles TO anon;
GRANT SELECT ON public.roles TO anon;
GRANT SELECT ON public.app_users TO anon;
