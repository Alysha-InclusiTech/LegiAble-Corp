
REVOKE EXECUTE ON FUNCTION public.has_active_license(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_license(uuid) TO service_role;
