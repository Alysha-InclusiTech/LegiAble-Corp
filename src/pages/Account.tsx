import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useLicense } from "@/hooks/useLicense";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEffect } from "react";

// Placeholder — replace with real Supabase query once form responses are wired up
const weeklyData = {
  week: 1,
  score: 74,
  tips: [
    "Send meeting agendas at least 24 hours in advance so team members can prepare.",
    "Check in 1:1 with any team member who hasn't spoken up in group settings this week.",
    "Review one document your team uses regularly — increase font size and line spacing.",
  ],
};

export default function Account() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { license, active } = useLicense();
  const { isAdmin } = useIsAdmin();
  const [checked, setChecked] = useState<boolean[]>(weeklyData.tips.map(() => false));

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (!user) return null;

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => supabase.auth.signOut().then(() => navigate("/login"))}
          >
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
              <div className="text-sm">
                <span className="text-muted-foreground">Company:</span> {license.company_name}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Plan:</span> {license.plan}
              </div>
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
          <>
            {/* Weekly Accessibility Score */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Week {weeklyData.week} Accessibility Score</h2>
                <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                  Week {weeklyData.week} of 4
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{weeklyData.score}</span>
                <span className="text-muted-foreground mb-1">/ 100</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all"
                  style={{ width: `${weeklyData.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Based on your Inclusion Check responses this week.
              </p>
            </Card>

            {/* This Week's Tips */}
            <Card className="p-6 space-y-4">
              <h2 className="font-semibold">This week's actions</h2>
              <p className="text-sm text-muted-foreground">
                3 steps based on your Week {weeklyData.week} responses. Check them off as you go.
              </p>
              <div className="space-y-3">
                {weeklyData.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <Checkbox
                      id={`tip-${i}`}
                      checked={checked[i]}
                      onCheckedChange={() => toggle(i)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`tip-${i}`}
                      className={`text-sm leading-relaxed cursor-pointer ${
                        checked[i] ? "line-through text-muted-foreground" : "text-gray-800"
                      }`}
                    >
                      {tip}
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            {/* Portals */}
            <Card className="p-6 space-y-3">
              <h2 className="font-semibold">Tools</h2>
              <Button asChild variant="secondary">
                <Link to="/employer">Employer Toolkit</Link>
              </Button>
            </Card>
          </>
        )}

        {isAdmin && (
          <Card className="p-6">
            <Button asChild variant="outline">
              <Link to="/admin">Open admin panel</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
