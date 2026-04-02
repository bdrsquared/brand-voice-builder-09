import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Redirect = {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  created_at: string;
};

const AdminRedirectsManager = () => {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("/");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTo, setEditTo] = useState("");

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    const { data, error } = await supabase
      .from("redirects")
      .select("*")
      .order("from_path");
    if (!error && data) setRedirects(data as Redirect[]);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newFrom.trim()) return;
    const fromPath = newFrom.startsWith("/") ? newFrom.trim() : `/${newFrom.trim()}`;
    setAdding(true);
    const { error } = await supabase
      .from("redirects")
      .insert({ from_path: fromPath, to_path: newTo.trim() || "/" });
    if (error) {
      toast.error(error.message.includes("duplicate") ? "This path already has a redirect" : "Failed to add redirect");
    } else {
      toast.success("Redirect added");
      setNewFrom("");
      setNewTo("/");
      fetchRedirects();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("redirects").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setRedirects((prev) => prev.filter((r) => r.id !== id));
      toast.success("Redirect deleted");
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from("redirects")
      .update({ to_path: editTo.trim() || "/" })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success("Redirect updated");
      setEditingId(null);
      fetchRedirects();
    }
  };

  if (loading) {
    return <p className="text-center py-12 text-muted-foreground text-sm">Loading redirects...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          {redirects.length} redirect{redirects.length !== 1 ? "s" : ""} configured
        </p>
      </div>

      {/* Add new redirect */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Add New Redirect</p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">From Path</label>
            <Input
              value={newFrom}
              onChange={(e) => setNewFrom(e.target.value)}
              placeholder="/old-page/"
              className="bg-background/50 border-border text-sm"
            />
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block self-center" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">To Path</label>
            <Input
              value={newTo}
              onChange={(e) => setNewTo(e.target.value)}
              placeholder="/"
              className="bg-background/50 border-border text-sm"
            />
          </div>
          <Button size="sm" onClick={handleAdd} disabled={adding || !newFrom.trim()} className="text-xs shrink-0">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            {adding ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>

      {/* Redirects list */}
      <div className="space-y-1.5">
        {redirects.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Badge variant="outline" className="text-[10px] border-border font-mono shrink-0">
                {r.status_code}
              </Badge>
              <span className="text-sm font-mono text-muted-foreground truncate">{r.from_path}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              {editingId === r.id ? (
                <div className="flex items-center gap-1.5">
                  <Input
                    value={editTo}
                    onChange={(e) => setEditTo(e.target.value)}
                    className="bg-background/50 border-border text-sm h-8 w-32"
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(r.id)}
                  />
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => handleUpdate(r.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <span
                  className="text-sm font-mono text-foreground truncate cursor-pointer hover:underline"
                  onClick={() => { setEditingId(r.id); setEditTo(r.to_path); }}
                >
                  {r.to_path}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(r.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRedirectsManager;
