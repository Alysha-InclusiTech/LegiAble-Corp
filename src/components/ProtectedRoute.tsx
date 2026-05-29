import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLicense } from "@/hooks/useLicense";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { active, license, loading: licLoading } = useLicense();

  if (authLoading || licLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!active) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md p-8 text-center space-y-4">
          <h1 className="text-2xl font-semibold">Your access isn't active yet</h1>
          <p className="text-muted-foreground">
            {license
              ? "Your pilot or license is currently inactive. We'll email you once it's enabled."
              : "We haven't set up your company account yet. Please contact us to start your pilot."}
          </p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Sign out
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
