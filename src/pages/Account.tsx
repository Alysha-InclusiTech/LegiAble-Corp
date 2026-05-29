import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLicense } from "@/hooks/useLicense";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEffect } from "react";

export default function Account() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { license, active } = useLicense();
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Your account</h1>
          <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => navigate("/login"))}>
            Sign out
          </Button>
        </header>

        <Card className="p-6 space-y-2">
          <div className="text-sm text-muted-foreground">Signed in as</div>
          <div className="font-medium">{user.email}</div>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="font-semibold">Pilot status</h2>
          {license ? (
            <>
              <div className="text-sm"><span className="text-muted-foreground">Company:</span> {license.company_name}</div>
              <div className="text-sm"><span className="text-muted-foreground">Plan:</span> {license.plan}</div>
              <div className="text-sm">
                <span className="text-muted-foreground">Status:</span>{" "}
                <span className={active ? "text-primary font-medium" : "text-destructive font-medium"}>
                  {active ? "Active" : "Inactive"}
                </span>
              </div>
              {license.expires_at && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Expires:</span>{" "}
                  {new Date(license.expires_at).toLocaleDateString()}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No license on file yet. Contact us to start your pilot.
            </p>
          )}
        </Card>

        {active && (
          <Card className="p-6 space-y-3">
            <h2 className="font-semibold">Portals</h2>
            <div className="flex gap-3">
              <Button asChild><Link to="/employee">Employee Reader</Link></Button>
              <Button asChild variant="secondary"><Link to="/employer">Employer Toolkit</Link></Button>
            </div>
          </Card>
        )}

        {isAdmin && (
          <Card className="p-6">
            <Button asChild variant="outline"><Link to="/admin">Open admin panel</Link></Button>
          </Card>
        )}
      </div>
    </div>
  );
}
