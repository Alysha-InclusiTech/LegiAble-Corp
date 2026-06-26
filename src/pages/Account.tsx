import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useLicense } from "@/hooks/useLicense";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { LayoutDashboard, Briefcase, Settings, LogOut, ShieldCheck } from "lucide-react";

type InclusionCheck = {
  score: number;
  tips: string[];
  created_at: string;
};

export default function Account() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { license, active } = useLicense();
  const { isAdmin } = useIsAdmin();
  const [latestCheck, setLatestCheck] = useState<InclusionCheck | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("inclusion_checks")
      .select("score, tips, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          const tips = Array.isArray(data.tips) ? (data.tips as string[]) : [];
          setLatestCheck({ score: data.score, tips, created_at: data.created_at });
          setChecked(tips.map(() => false));
        }
      });
  }, [user]);

  if (!user) return null;

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const tips = latestCheck?.tips ?? [];
  const completedCount = checked.filter(Boolean).length;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rawName = user.email?.split("@")[0] ?? "there";
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-8 px-4 shrink-0">
        <div className="mb-10 px-2">
          <span className="text-lg font-bold tracking-tight text-gray-900">LegiAble</span>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">by InclusiTech</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium cursor-default">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </div>
          <Link
            to="/employer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Employer Toolkit
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex flex-col gap-1 mt-4">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium transition-colors w-full text-left">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate("/login"))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Greeting */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello, {firstName}</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {active
                ? latestCheck
                  ? `Last check: ${new Date(latestCheck.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} — keep going!`
                  : "Complete the Inclusion Check to see your score."
                : "Your pilot isn't active yet. Contact us to get started."}
            </p>
          </div>
          <span className="text-sm text-gray-400 mt-1">{today}</span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-5 bg-white border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Latest check</p>
            <p className="text-4xl font-bold text-gray-900">
              {latestCheck
                ? new Date(latestCheck.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                : "—"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {latestCheck ? new Date(latestCheck.created_at).getFullYear() : "No check yet"}
            </p>
          </Card>
          <Card className="p-5 bg-white border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Inclusion score</p>
            <p className="text-4xl font-bold text-gray-900">{latestCheck?.score ?? "—"}</p>
            <p className="text-sm text-gray-400 mt-1">out of 100</p>
          </Card>
          <Card className="p-5 bg-white border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Actions done</p>
            <p className="text-4xl font-bold text-gray-900">{completedCount}</p>
            <p className="text-sm text-gray-400 mt-1">of {tips.length} this week</p>
          </Card>
          <Card className="p-5 bg-white border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
              {active ? "Pilot expires" : "Status"}
            </p>
            {license?.expires_at ? (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {new Date(license.expires_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(license.expires_at).getFullYear()}
                </p>
              </>
            ) : (
              <>
                <p className={`text-2xl font-bold mt-1 ${active ? "text-gray-900" : "text-destructive"}`}>
                  {active ? "Active" : "Inactive"}
                </p>
                <p className="text-sm text-gray-400 mt-1">{license?.plan ?? "No license"}</p>
              </>
            )}
          </Card>
        </div>

        {/* Score + tips */}
        {active && (
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-1">Inclusion Score</h2>
              <p className="text-xs text-muted-foreground mb-5">
                {latestCheck
                  ? `Last check · ${new Date(latestCheck.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                  : "Complete the Inclusion Check to see your score"}
              </p>
              {latestCheck ? (
                <>
                  <div className="flex items-end gap-3 mb-4">
                    <span className="text-5xl font-bold text-gray-900">{latestCheck.score}</span>
                    <span className="text-gray-400 mb-1">/ 100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${latestCheck.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">No data yet — take the Inclusion Check in the Employer Toolkit.</p>
              )}
            </Card>

            <Card className="p-6 bg-white border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-1">This week's actions</h2>
              <p className="text-xs text-muted-foreground mb-5">
                {tips.length === 0
                  ? "No actions yet"
                  : completedCount === tips.length
                  ? "All done — great work this week!"
                  : `${tips.length - completedCount} remaining`}
              </p>
              {tips.length === 0 ? (
                <p className="text-sm text-gray-400">Complete the Inclusion Check to get personalised actions.</p>
              ) : (
                <div className="space-y-3">
                  {tips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
                    >
                      <Checkbox
                        id={`tip-${i}`}
                        checked={checked[i] ?? false}
                        onCheckedChange={() => toggle(i)}
                        className="mt-0.5 rounded-full border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                      />
                      <label
                        htmlFor={`tip-${i}`}
                        className={`text-sm leading-relaxed cursor-pointer ${
                          checked[i] ? "line-through text-gray-400" : "text-gray-700"
                        }`}
                      >
                        {tip}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Inactive state */}
        {!active && license && (
          <Card className="p-6 bg-white border-gray-100">
            <h2 className="font-semibold mb-3">Pilot status</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Company:</span> {license.company_name}</div>
              <div><span className="text-muted-foreground">Plan:</span> {license.plan}</div>
              <div>
                <span className="text-muted-foreground">Status:</span>{" "}
                <span className="text-destructive font-medium">Inactive — contact us to renew</span>
              </div>
            </div>
          </Card>
        )}

      </main>
    </div>
  );
}
