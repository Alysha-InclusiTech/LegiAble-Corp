import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";

type Row = {
  id: string;
  user_id: string;
  company_name: string;
  plan: "pilot" | "license";
  is_active: boolean;
  expires_at: string | null;
  notes: string | null;
};

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  // create form
  const [newUserId, setNewUserId] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newPlan, setNewPlan] = useState<"pilot" | "license">("pilot");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
    if (!adminLoading && user && !isAdmin) navigate("/account");
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("licenses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const toggle = async (row: Row) => {
    const { error } = await supabase
      .from("licenses")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  const updateExpiry = async (row: Row, value: string) => {
    const { error } = await supabase
      .from("licenses")
      .update({ expires_at: value || null })
      .eq("id", row.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  const createLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("licenses").insert({
      user_id: newUserId.trim(),
      company_name: newCompany.trim(),
      plan: newPlan,
      is_active: false,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewUserId(""); setNewCompany("");
      load();
    }
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete license for ${row.company_name}?`)) return;
    const { error } = await supabase.from("licenses").delete().eq("id", row.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin — licenses</h1>
          <Button variant="outline" onClick={() => navigate("/account")}>Back</Button>
        </header>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Create license</h2>
          <p className="text-xs text-muted-foreground">
            Customer must sign up at <code>/login</code> first. Copy their user UUID from Cloud → Users.
          </p>
          <form onSubmit={createLicense} className="grid md:grid-cols-4 gap-3 items-end">
            <div className="space-y-1">
              <Label>User ID (UUID)</Label>
              <Input value={newUserId} onChange={(e) => setNewUserId(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Company</Label>
              <Input value={newCompany} onChange={(e) => setNewCompany(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Plan</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={newPlan} onChange={(e) => setNewPlan(e.target.value as any)}>
                <option value="pilot">pilot</option>
                <option value="license">license</option>
              </select>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">All licenses</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No licenses yet.</p>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="border rounded-lg p-4 grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center">
                  <div>
                    <div className="font-medium">{row.company_name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{row.user_id}</div>
                  </div>
                  <div className="text-sm">{row.plan}</div>
                  <Input
                    type="date"
                    className="w-40"
                    value={row.expires_at ? row.expires_at.slice(0, 10) : ""}
                    onChange={(e) => updateExpiry(row, e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Switch checked={row.is_active} onCheckedChange={() => toggle(row)} />
                    <span className="text-sm">{row.is_active ? "Active" : "Inactive"}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(row)}>Delete</Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
