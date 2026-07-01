GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

GRANT SELECT ON public.organizations TO anon;
GRANT SELECT ON public.organization_members TO anon;
GRANT SELECT ON public.user_profiles TO anon;

GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_has_members(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.is_org_admin(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.org_has_members(uuid) TO anon;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
