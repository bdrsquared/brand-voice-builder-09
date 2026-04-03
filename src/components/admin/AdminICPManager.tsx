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
  ImageIcon,
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
  page_style: string;
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
  const [generatingImages, setGeneratingImages] = useState<string | null>(null);

  const handleGenerateImages = async (page: ICPPage) => {
    if (!page.research_data) {
      toast.error("Research this ICP first");
      return;
    }
    setGeneratingImages(page.id);
    try {
      const response = await supabase.functions.invoke("generate-icp-images", {
        body: {
          icp_id: page.id,
          icp_name: page.icp_name,
          research_data: page.research_data.content || page.research_data,
        },
      });

      if (response.error) {
        toast.error("Image generation failed: " + (response.error.message || "Unknown error"));
        return;
      }

      const data = response.data;
      if (data?.error) {
        toast.error("Image generation failed: " + data.error);
        return;
      }

      toast.success(`Generated ${data.count} images successfully!`);
      fetchPages();
    } catch (err: any) {
      toast.error("Image generation failed: " + (err.message || "Unknown error"));
    } finally {
      setGeneratingImages(null);
    }
  };

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

  const handleGenerateCopy = async (page: ICPPage) => {
    if (!page.research_data) {
      toast.error("Research this ICP first");
      return;
    }
    setGenerating(page.id);
    try {
      const response = await supabase.functions.invoke("generate-icp-copy", {
        body: {
          icp_id: page.id,
          icp_name: page.icp_name,
          research_data: page.research_data.content || page.research_data,
          page_style: page.page_style || "original",
        },
      });

      if (response.error) {
        toast.error("Generation failed: " + (response.error.message || "Unknown error"));
        return;
      }

      const data = response.data;
      if (data?.error) {
        toast.error("Generation failed: " + data.error);
        return;
      }

      toast.success("Landing page copy generated!");
      fetchPages();
    } catch (err: any) {
      toast.error("Generation failed: " + (err.message || "Unknown error"));
    } finally {
      setGenerating(null);
    }
  };

  const handleTogglePublish = async (page: ICPPage) => {
    setToggling(page.id);
    const newPublished = !page.published;
    const { error } = await (supabase
      .from("icp_landing_pages" as any)
      .update({
        published: newPublished,
        status: newPublished ? "published" : "generated",
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", page.id) as any);

    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(newPublished ? "Page published!" : "Page unpublished");
      fetchPages();
    }
    setToggling(null);
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

                  {/* Page Style Selector */}
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                      Page Style
                    </p>
                    <div className="flex gap-2">
                      {[
                        { value: "original", label: "Original", desc: "Brand voice, opinionated" },
                        { value: "authority", label: "Authority", desc: "Data-led, professional" },
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={async () => {
                            const { error } = await (supabase
                              .from("icp_landing_pages" as any)
                              .update({ page_style: style.value, updated_at: new Date().toISOString() } as any)
                              .eq("id", page.id) as any);
                            if (!error) {
                              setPages((prev) => prev.map((p) => p.id === page.id ? { ...p, page_style: style.value } : p));
                              toast.success(`Style set to ${style.label}`);
                            }
                          }}
                          className={`flex-1 px-4 py-3 rounded-xl border text-left transition-all ${
                            (page.page_style || "original") === style.value
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                          }`}
                        >
                          <span className="text-sm font-medium block">{style.label}</span>
                          <span className="text-[10px] opacity-70">{style.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Research data preview */}
                  {page.research_data && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          Research Data
                        </p>
                        <div className="flex gap-2">
                          {page.research_data.total_citations > 0 && (
                            <Badge variant="outline" className="text-[10px] border-border">
                              {page.research_data.total_citations} citations
                            </Badge>
                          )}
                          {page.research_data.sources_scraped > 0 && (
                            <Badge className="text-[10px] bg-blue-500/20 text-blue-400 border-0">
                              {page.research_data.sources_scraped} deep-scraped
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Perplexity analysis */}
                      <div className="text-xs bg-background/50 rounded-lg p-3 overflow-auto max-h-64 text-foreground/80 whitespace-pre-wrap leading-relaxed">
                        {page.research_data.perplexity_analysis || page.research_data.content || JSON.stringify(page.research_data, null, 2)}
                      </div>

                      {/* Deep sources summary */}
                      {page.research_data.deep_sources?.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                            Deep-scraped sources
                          </p>
                          <div className="space-y-1.5">
                            {page.research_data.deep_sources.map((src: any, i: number) => (
                              <div key={i} className="text-xs bg-background/30 rounded-lg p-2.5 border border-white/5">
                                <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                  {src.title}
                                </a>
                                {src.summary && (
                                  <p className="text-foreground/60 mt-1 leading-relaxed">{src.summary}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generated images preview */}
                  {page.research_data?.generated_images && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                        Generated Images
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(page.research_data.generated_images as Record<string, string>).map(([section, url]) => (
                          <div key={section} className="space-y-1">
                            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border">
                              <img src={url} alt={section} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center capitalize">{section.replace("_", " ")}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                  <div className="flex items-center gap-2 justify-between flex-wrap">
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

                    <div className="flex gap-2 flex-wrap">
                      {/* Research button */}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={researching === page.id}
                        onClick={() => handleResearch(page)}
                        className="text-xs"
                      >
                        {researching === page.id ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        {page.research_data ? "Re-research" : "Research ICP"}
                      </Button>

                      {/* Generate images button */}
                      {page.research_data && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={generatingImages === page.id}
                          onClick={() => handleGenerateImages(page)}
                          className="text-xs"
                        >
                          {generatingImages === page.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          {page.research_data?.generated_images ? "Regenerate Images" : "Generate Images"}
                        </Button>
                      )}

                      {/* Generate copy button - requires images */}
                      {page.research_data?.generated_images && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={generating === page.id}
                          onClick={() => handleGenerateCopy(page)}
                          className="text-xs"
                        >
                          {generating === page.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          {page.generated_copy ? "Regenerate Page" : "Generate Page"}
                        </Button>
                      )}

                      {/* Publish toggle */}
                      {page.generated_copy && (
                        <Button
                          size="sm"
                          variant={page.published ? "outline" : "default"}
                          disabled={toggling === page.id}
                          onClick={() => handleTogglePublish(page)}
                          className="text-xs"
                        >
                          {toggling === page.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          ) : page.published ? (
                            <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                          ) : (
                            <Globe className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          {page.published ? "Unpublish" : "Publish"}
                        </Button>
                      )}

                      {/* Preview link */}
                      {page.published && page.slug && (
                        <a
                          href={`/for/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="ghost" className="text-xs">
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            Preview
                          </Button>
                        </a>
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
