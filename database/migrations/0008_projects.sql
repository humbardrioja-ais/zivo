-- Projects Module — MVP (Project Model v1.0)
-- New module tables only. Foundation v1.0 is NOT modified.
-- References frozen tables (organizations, organization_members) via FK.
-- RLS via existing is_org_member / is_org_admin helpers. Idempotent.

-- =============================================================================
-- PROJECTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'archived')),
  lead_id uuid REFERENCES public.organization_members(id) ON DELETE SET NULL,
  start_date date,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PROJECT MEMBERS (project ↔ organization_member)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member', 'viewer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, member_id)
);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_member ON public.project_members(member_id);
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PROJECT AREAS (formerly Workstreams)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.project_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_project_areas_project ON public.project_areas(project_id);
ALTER TABLE public.project_areas ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS — projects are org-scoped; members/areas inherit via parent project
-- =============================================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Members can view projects') THEN
    CREATE POLICY "Members can view projects" ON public.projects FOR SELECT USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Members can insert projects') THEN
    CREATE POLICY "Members can insert projects" ON public.projects FOR INSERT WITH CHECK (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Members can update projects') THEN
    CREATE POLICY "Members can update projects" ON public.projects FOR UPDATE USING (public.is_org_member(organization_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Admins can delete projects') THEN
    CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (public.is_org_admin(organization_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_members' AND policyname='Members can view project members') THEN
    CREATE POLICY "Members can view project members" ON public.project_members FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.is_org_member(p.organization_id))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_members' AND policyname='Members can manage project members') THEN
    CREATE POLICY "Members can manage project members" ON public.project_members FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.is_org_member(p.organization_id))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_members' AND policyname='Members can remove project members') THEN
    CREATE POLICY "Members can remove project members" ON public.project_members FOR DELETE USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.is_org_member(p.organization_id))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_areas' AND policyname='Members can view project areas') THEN
    CREATE POLICY "Members can view project areas" ON public.project_areas FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.is_org_member(p.organization_id))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_areas' AND policyname='Members can insert project areas') THEN
    CREATE POLICY "Members can insert project areas" ON public.project_areas FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.is_org_member(p.organization_id))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_areas' AND policyname='Members can update project areas') THEN
    CREATE POLICY "Members can update project areas" ON public.project_areas FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.is_org_member(p.organization_id))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_areas' AND policyname='Members can delete project areas') THEN
    CREATE POLICY "Members can delete project areas" ON public.project_areas FOR DELETE USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.is_org_member(p.organization_id))
    );
  END IF;
END $$;

-- =============================================================================
-- TRIGGERS
-- =============================================================================
DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_project_areas_updated_at ON public.project_areas;
CREATE TRIGGER set_project_areas_updated_at BEFORE UPDATE ON public.project_areas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- GRANTS
-- =============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_areas TO authenticated;
GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.project_members TO anon;
GRANT SELECT ON public.project_areas TO anon;
