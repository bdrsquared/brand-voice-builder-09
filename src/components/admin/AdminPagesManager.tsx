import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, ChevronDown, ChevronUp, Globe, FileText, Image } from "lucide-react";
import { toast } from "sonner";

type PageMeta = {
  id: string;
  page_path: string;
  page_name: string;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  updated_at: string;
};

const AdminPagesManager = () => {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<PageMeta>>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from("page_metadata")
      .select("*")
      .order("page_name");
    if (!error && data) setPages(data as PageMeta[]);
    setLoading(false);
  };

  const getEdit = (id: string, field: keyof PageMeta) => {
    const page = pages.find((p) => p.id === id);
    if (edits[id]?.[field] !== undefined) return edits[id][field] as string;
    return (page?.[field] as string) || "";
  };

  const setEdit = (id: string, field: keyof PageMeta, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const hasChanges = (id: string) => {
    if (!edits[id]) return false;
    const page = pages.find((p) => p.id === id);
    if (!page) return false;
    return Object.entries(edits[id]).some(
      ([key, val]) => (page[key as keyof PageMeta] || "") !== val
    );
  };

  const handleSave = async (id: string) => {
    if (!edits[id]) return;
    setSaving(id);
    const { error } = await supabase
      .from("page_metadata")
      .update({
        ...edits[id],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Page metadata saved");
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      fetchPages();
    }
    setSaving(null);
  };

  if (loading) {
    return <p className="text-center py-12 text-muted-foreground text-sm">Loading pages...</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Manage SEO metadata and Open Graph tags for each page.
        </p>
      </div>

      <div className="space-y-2">
        {pages.map((page) => (
          <div
            key={page.id}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
          >
            {/* Header row */}
            <button
              onClick={() => setExpandedId(expandedId === page.id ? null : page.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm">{page.page_name}</span>
                <Badge variant="outline" className="text-[10px] border-border font-mono">
                  {page.page_path}
                </Badge>
                {hasChanges(page.id) && (
                  <Badge className="text-[10px] bg-primary/20 text-primary border-0">
                    Unsaved
                  </Badge>
                )}
              </div>
              {expandedId === page.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>

            {/* Expanded editor */}
            {expandedId === page.id && (
              <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-5">
                {/* Meta section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" /> Meta Tags
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Title <span className="text-muted-foreground/50">(&lt;60 chars)</span>
                      </label>
                      <Input
                        value={getEdit(page.id, "meta_title")}
                        onChange={(e) => setEdit(page.id, "meta_title", e.target.value)}
                        placeholder="Page title for search engines"
                        className="bg-background/50 border-border text-sm"
                        maxLength={60}
                      />
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5 text-right">
                        {getEdit(page.id, "meta_title").length}/60
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Description <span className="text-muted-foreground/50">(&lt;160 chars)</span>
                      </label>
                      <Textarea
                        value={getEdit(page.id, "meta_description")}
                        onChange={(e) => setEdit(page.id, "meta_description", e.target.value)}
                        placeholder="Brief description for search results"
                        className="bg-background/50 border-border text-sm min-h-[60px]"
                        maxLength={160}
                      />
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5 text-right">
                        {getEdit(page.id, "meta_description").length}/160
                      </p>
                    </div>
                  </div>
                </div>

                {/* OG section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    <Image className="w-3.5 h-3.5" /> Open Graph
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">OG Title</label>
                      <Input
                        value={getEdit(page.id, "og_title")}
                        onChange={(e) => setEdit(page.id, "og_title", e.target.value)}
                        placeholder="Title shown when shared on social media"
                        className="bg-background/50 border-border text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">OG Description</label>
                      <Textarea
                        value={getEdit(page.id, "og_description")}
                        onChange={(e) => setEdit(page.id, "og_description", e.target.value)}
                        placeholder="Description shown when shared on social media"
                        className="bg-background/50 border-border text-sm min-h-[60px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">OG Image URL</label>
                      <Input
                        value={getEdit(page.id, "og_image")}
                        onChange={(e) => setEdit(page.id, "og_image", e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="bg-background/50 border-border text-sm"
                      />
                      {getEdit(page.id, "og_image") && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-border w-48">
                          <img
                            src={getEdit(page.id, "og_image")}
                            alt="OG preview"
                            className="w-full h-auto object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => handleSave(page.id)}
                    disabled={!hasChanges(page.id) || saving === page.id}
                    className="text-xs"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    {saving === page.id ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPagesManager;
