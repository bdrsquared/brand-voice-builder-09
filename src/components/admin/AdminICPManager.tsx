import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Users,
  Loader2,
  Trash2,
  Search,
  Sparkles,
  ExternalLink,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

type ICPPage = {
  id: string;
  icp_name: string;
  icp_description: string | null;
  research_data: any;
  generated_copy: any;
  slug: string | null;
  status: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const AdminICPManager = () => {
  const [pages, setPages] = useState<ICPPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newICP, setNewICP] = useState({ icp_name: "", icp_description: "" });
  const [creating, setCreating] = useState(false);
  const [researching, setResearching] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleResearch = async (page: ICPPage) => {
    setResearching(page.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await supabase.functions.invoke("research-icp", {
        body: {
          icp_id: page.id,
          icp_name: page.icp_name,
          icp_description: page.icp_description,
        },
      });

      if (response.error) {
        toast.error("Research failed: " + (response.error.message || "Unknown error"));
        return;
      }

      const data = response.data;
      if (data?.error) {
        toast.error("Research failed: " + data.error);
        return;
      }

      toast.success("Research complete — data saved");
      fetchPages();
    } catch (err: any) {
      toast.error("Research failed: " + (err.message || "Unknown error"));
    } finally {
      setResearching(null);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await (supabase
      .from("icp_landing_pages" as any)
      .select("*")
      .order("created_at", { ascending: false }) as any);
    if (!error && data) setPages(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newICP.icp_name.trim()) {
      toast.error("ICP name is required");
      return;
    }
    setCreating(true);

    const slug = newICP.icp_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error } = await (supabase
      .from("icp_landing_pages" as any)
      .insert({
        icp_name: newICP.icp_name.trim(),
        icp_description: newICP.icp_description.trim() || null,
        slug,
      }) as any);

    if (error) {
      toast.error("Failed to create ICP page");
      console.error(error);
    } else {
      toast.success("ICP page created");
      setNewICP({ icp_name: "", icp_description: "" });
      setShowCreate(false);
      fetchPages();
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await (supabase
      .from("icp_landing_pages" as any)
      .delete()
      .eq("id", id) as any);

    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("ICP page deleted");
      setPages((prev) => prev.filter((p) => p.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
    setDeleting(null);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "researched":
        return "bg-blue-500/20 text-blue-400 border-0";
      case "generated":
        return "bg-green-500/20 text-green-400 border-0";
      case "published":
        return "bg-primary/20 text-primary border-0";
      default:
        return "bg-muted/50 text-muted-foreground border-0";
    }
  };

  if (loading) {
    return (
      <p className="text-center py-12 text-muted-foreground text-sm">
        Loading ICP pages...
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Create targeted landing pages for specific ICPs using AI research.
        </p>
        <Button
          size="sm"
          onClick={() => setShowCreate(!showCreate)}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New ICP Page
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              ICP Name *
            </label>
            <Input
              value={newICP.icp_name}
              onChange={(e) =>
                setNewICP((p) => ({ ...p, icp_name: e.target.value }))
              }
              placeholder="e.g. B2B SaaS Founders, DTC E-commerce Brands"
              className="bg-background/50 border-border text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Description (optional context for research)
            </label>
            <Textarea
              value={newICP.icp_description}
              onChange={(e) =>
                setNewICP((p) => ({ ...p, icp_description: e.target.value }))
              }
              placeholder="Add context about this ICP — industry, company size, pain points, etc."
              className="bg-background/50 border-border text-sm min-h-[80px]"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreate(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={creating || !newICP.icp_name.trim()}
              className="text-xs"
            >
              {creating ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5 mr-1.5" />
              )}
              Create
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {pages.length === 0 && !showCreate ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No ICP pages yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === page.id ? null : page.id)
                }
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-sm">{page.icp_name}</span>
                  <Badge className={`text-[10px] ${statusColor(page.status)}`}>
                    {page.status}
                  </Badge>
                  {page.slug && (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-border font-mono"
                    >
                      /{page.slug}
                    </Badge>
                  )}
                </div>
                {expandedId === page.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Expanded */}
              {expandedId === page.id && (
                <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-4">
                  {page.icp_description && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                        Description
                      </p>
                      <p className="text-sm text-foreground/80">
                        {page.icp_description}
                      </p>
                    </div>
                  )}

                  {/* Research data preview */}
                  {page.research_data && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                        Research Data
                      </p>
                      <pre className="text-xs bg-background/50 rounded-lg p-3 overflow-auto max-h-48 text-foreground/70">
                        {JSON.stringify(page.research_data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Generated copy preview */}
                  {page.generated_copy && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                        Generated Copy
                      </p>
                      <pre className="text-xs bg-background/50 rounded-lg p-3 overflow-auto max-h-48 text-foreground/70">
                        {JSON.stringify(page.generated_copy, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 justify-between">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      disabled={deleting === page.id}
                      className="text-xs"
                    >
                      {deleting === page.id ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      Delete
                    </Button>

                    <div className="flex gap-2">
                      {(page.status === "draft" || !page.research_data) && (
                        <Button
                          size="sm"
                          disabled={researching === page.id}
                          onClick={() => handleResearch(page)}
                          className="text-xs"
                        >
                          {researching === page.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          ) : (
                            <Search className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          Research ICP
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground/50">
                    Created {new Date(page.created_at).toLocaleDateString()} ·
                    Updated {new Date(page.updated_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminICPManager;
