-- Foundation v1.0 — FROZEN
-- Identity: auth.users → user_profiles → organization_members
-- Structure: organizations → branches → departments → job_titles
-- RBAC: roles + permissions + role_permissions (normalized)
-- All tables org-scoped, RLS via SECURITY DEFINER helpers
-- No soft delete in v1.0 (columns reserved but not used by app)

GRANT USAGE ON SCHEMA public TO authenticated;

-- BRANCHES
CREATE TABLE IF NOT EXISTS public.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  address text,
  city text,
  country text,
  phone text,
  email text,
  is_headquarters boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_branches_org ON public.branches(organization_id);
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- EMPLOYMENT TYPES
CREATE TABLE IF NOT EXISTS public.employment_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_employment_types_org ON public.employment_types(organization_id);
ALTER TABLE public.employment_types ENABLE ROW LEVEL SECURITY;

-- DEPARTMENTS — add branch_id
ALTER TABLE public.departments
  ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_departments_branch ON public.departments(branch_id);

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

-- ROLES (normalized, no permissions array)
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_system boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_roles_org ON public.roles(organization_id);
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- PERMISSIONS (catalog)
CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  module text NOT NULL,
  category text NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions(module);
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- ROLE_PERMISSIONS (junction)
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role_id, permission_id)
);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_perm ON public.role_permissions(permission_id);
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- EXTEND organization_members
ALTER TABLE public.organization_members
  ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS job_title_id uuid,
  ADD COLUMN IF NOT EXISTS role_id uuid,
  ADD COLUMN IF NOT EXISTS employment_type_id uuid REFERENCES public.employment_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS employment_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS employee_number text,
  ADD COLUMN IF NOT EXISTS hired_at timestamptz;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'organization_members_job_title_id_fkey') THEN
    ALTER TABLE public.organization_members ADD CONSTRAINT organization_members_job_title_id_fkey FOREIGN KEY (job_title_id) REFERENCES public.job_titles(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'organization_members_role_id_fkey') THEN
    ALTER TABLE public.organization_members ADD CONSTRAINT organization_members_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'organization_members_org_employee_number_unique') THEN
    ALTER TABLE public.organization_members ADD CONSTRAINT organization_members_org_employee_number_unique UNIQUE (organization_id, employee_number);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'organization_members_employment_status_check') THEN
    ALTER TABLE public.organization_members ADD CONSTRAINT organization_members_employment_status_check CHECK (employment_status IN ('active', 'inactive', 'on_leave', 'terminated'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_org_members_branch ON public.organization_members(branch_id);
CREATE INDEX IF NOT EXISTS idx_org_members_dept ON public.organization_members(department_id);
CREATE INDEX IF NOT EXISTS idx_org_members_job_title ON public.organization_members(job_title_id);
CREATE INDEX IF NOT EXISTS idx_org_members_role ON public.organization_members(role_id);
CREATE INDEX IF NOT EXISTS idx_org_members_emp_type ON public.organization_members(employment_type_id);
CREATE INDEX IF NOT EXISTS idx_org_members_status ON public.organization_members(employment_status);

-- RLS POLICIES
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='branches' AND policyname='Members can view branches') THEN
    CREATE POLICY "Members can view branches" ON public.branches FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='branches' AND policyname='Admins can insert branches') THEN
    CREATE POLICY "Admins can insert branches" ON public.branches FOR INSERT WITH CHECK (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='branches' AND policyname='Admins can update branches') THEN
    CREATE POLICY "Admins can update branches" ON public.branches FOR UPDATE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='branches' AND policyname='Admins can delete branches') THEN
    CREATE POLICY "Admins can delete branches" ON public.branches FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='employment_types' AND policyname='Members can view employment types') THEN
    CREATE POLICY "Members can view employment types" ON public.employment_types FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='employment_types' AND policyname='Admins can insert employment types') THEN
    CREATE POLICY "Admins can insert employment types" ON public.employment_types FOR INSERT WITH CHECK (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='employment_types' AND policyname='Admins can update employment types') THEN
    CREATE POLICY "Admins can update employment types" ON public.employment_types FOR UPDATE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='employment_types' AND policyname='Admins can delete employment types') THEN
    CREATE POLICY "Admins can delete employment types" ON public.employment_types FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='departments' AND policyname='Members can view departments') THEN
    CREATE POLICY "Members can view departments" ON public.departments FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='departments' AND policyname='Admins can insert departments') THEN
    CREATE POLICY "Admins can insert departments" ON public.departments FOR INSERT WITH CHECK (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='departments' AND policyname='Admins can update departments') THEN
    CREATE POLICY "Admins can update departments" ON public.departments FOR UPDATE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='departments' AND policyname='Admins can delete departments') THEN
    CREATE POLICY "Admins can delete departments" ON public.departments FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_titles' AND policyname='Members can view job titles') THEN
    CREATE POLICY "Members can view job titles" ON public.job_titles FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_titles' AND policyname='Admins can insert job titles') THEN
    CREATE POLICY "Admins can insert job titles" ON public.job_titles FOR INSERT WITH CHECK (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_titles' AND policyname='Admins can update job titles') THEN
    CREATE POLICY "Admins can update job titles" ON public.job_titles FOR UPDATE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_titles' AND policyname='Admins can delete job titles') THEN
    CREATE POLICY "Admins can delete job titles" ON public.job_titles FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='roles' AND policyname='Members can view roles') THEN
    CREATE POLICY "Members can view roles" ON public.roles FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='roles' AND policyname='Admins can insert roles') THEN
    CREATE POLICY "Admins can insert roles" ON public.roles FOR INSERT WITH CHECK (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='roles' AND policyname='Admins can update roles') THEN
    CREATE POLICY "Admins can update roles" ON public.roles FOR UPDATE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='roles' AND policyname='Admins can delete roles') THEN
    CREATE POLICY "Admins can delete roles" ON public.roles FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='permissions' AND policyname='Authenticated can view permissions') THEN
    CREATE POLICY "Authenticated can view permissions" ON public.permissions FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='role_permissions' AND policyname='Members can view role permissions') THEN
    CREATE POLICY "Members can view role permissions" ON public.role_permissions FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.roles r WHERE r.id = role_id AND public.is_org_member(r.organization_id))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='role_permissions' AND policyname='Admins can manage role permissions') THEN
    CREATE POLICY "Admins can manage role permissions" ON public.role_permissions FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.roles r WHERE r.id = role_id AND public.is_org_admin(r.organization_id))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='role_permissions' AND policyname='Admins can delete role permissions') THEN
    CREATE POLICY "Admins can delete role permissions" ON public.role_permissions FOR DELETE USING (
      EXISTS (SELECT 1 FROM public.roles r WHERE r.id = role_id AND public.is_org_admin(r.organization_id))
    );
  END IF;
END $$;

-- TRIGGERS
DROP TRIGGER IF EXISTS set_branches_updated_at ON public.branches;
CREATE TRIGGER set_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_employment_types_updated_at ON public.employment_types;
CREATE TRIGGER set_employment_types_updated_at BEFORE UPDATE ON public.employment_types FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_departments_updated_at ON public.departments;
CREATE TRIGGER set_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_job_titles_updated_at ON public.job_titles;
CREATE TRIGGER set_job_titles_updated_at BEFORE UPDATE ON public.job_titles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_roles_updated_at ON public.roles;
CREATE TRIGGER set_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- GRANTS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branches TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employment_types TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_titles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roles TO authenticated;
GRANT SELECT ON public.permissions TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.role_permissions TO authenticated;
GRANT SELECT ON public.branches TO anon;
GRANT SELECT ON public.employment_types TO anon;
GRANT SELECT ON public.departments TO anon;
GRANT SELECT ON public.job_titles TO anon;
GRANT SELECT ON public.roles TO anon;
GRANT SELECT ON public.permissions TO anon;
GRANT SELECT ON public.role_permissions TO anon;

-- SEED: PERMISSION CATALOG
INSERT INTO public.permissions (key, module, category, label, description) VALUES
  ('org.view', 'System', 'Organization', 'View Organization', 'View organization profile and settings'),
  ('org.edit', 'System', 'Organization', 'Edit Organization', 'Edit organization profile and settings'),
  ('users.view', 'System', 'Users', 'View Users', 'View user list and profiles'),
  ('users.create', 'System', 'Users', 'Create Users', 'Invite and create new users'),
  ('users.edit', 'System', 'Users', 'Edit Users', 'Edit user profiles and assignments'),
  ('users.deactivate', 'System', 'Users', 'Deactivate Users', 'Deactivate user accounts'),
  ('departments.view', 'System', 'Departments', 'View Departments', 'View department list'),
  ('departments.manage', 'System', 'Departments', 'Manage Departments', 'Create, edit, and delete departments'),
  ('branches.view', 'System', 'Branches', 'View Branches', 'View branch and office locations'),
  ('branches.manage', 'System', 'Branches', 'Manage Branches', 'Create, edit, and delete branches'),
  ('job_titles.view', 'System', 'Job Titles', 'View Job Titles', 'View job title catalog'),
  ('job_titles.manage', 'System', 'Job Titles', 'Manage Job Titles', 'Create, edit, and delete job titles'),
  ('employment_types.view', 'System', 'Employment Types', 'View Employment Types', 'View employment type catalog'),
  ('employment_types.manage', 'System', 'Employment Types', 'Manage Employment Types', 'Create, edit, and delete employment types'),
  ('roles.view', 'System', 'Roles', 'View Roles', 'View role definitions'),
  ('roles.manage', 'System', 'Roles', 'Manage Roles', 'Create, edit, and delete roles'),
  ('permissions.assign', 'System', 'Permissions', 'Assign Permissions', 'Assign permissions to roles'),
  ('system.settings', 'System', 'Settings', 'System Settings', 'Manage system-wide settings')
ON CONFLICT (key) DO NOTHING;
