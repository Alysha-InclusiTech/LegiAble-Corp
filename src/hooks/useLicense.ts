import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type License = {
  is_active: boolean;
  plan: "pilot" | "license";
  company_name: string;
  expires_at: string | null;
} | null;

export function useLicense() {
  const { user, loading: authLoading } = useAuth();
  const [license, setLicense] = useState<License>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLicense(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from("licenses")
      .select("is_active, plan, company_name, expires_at")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setLicense(data as License);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const active =
    !!license?.is_active &&
    (!license?.expires_at || new Date(license.expires_at) > new Date());

  return { license, active, loading: loading || authLoading };
}
