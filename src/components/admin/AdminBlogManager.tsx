import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, ArrowLeft, Eye, Lightbulb, FileText, ExternalLink, Check, X, RefreshCw, Loader2, Sparkles, CheckSquare, Square } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  author: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type BlogIdea = {
  id: string;
  title: string;
  description: string | null;
  source: string | null;
  source_url: string | null;
  status: string;
  created_at: string;
};

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  author: string;
  published: boolean;
};

type IdeaFormData = {
  title: string;
  description: string;
  source: string;
  source_url: string;
};

const emptyForm: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "",
  author: "Earworm",
  published: false,
};

const emptyIdeaForm: IdeaFormData = {
  title: "",
  description: "",
  source: "",
  source_url: "",
};

const AdminBlogManager = () => {
  const [activeTab, setActiveTab] = useState<"active" | "ideas">("active");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingIdea, setEditingIdea] = useState<string | null>(null);
  const [ideaForm, setIdeaForm] = useState<IdeaFormData>(emptyIdeaForm);
  const [saving, setSaving] = useState(false);
  const [researching, setResearching] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data as BlogPost[]);
  };

  const fetchIdeas = async () => {
    const { data } = await supabase
      .from("blog_ideas")
      .select("*")
      .neq("status", "declined")
      .order("created_at", { ascending: false });
    if (data) setIdeas(data as BlogIdea[]);
  };

  useEffect(() => {
    fetchPosts();
    fetchIdeas();
  }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleEdit = (post: BlogPost) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      cover_image: post.cover_image || "",
      category: post.category || "",
      author: post.author,
      published: post.published,
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);

    if (editing === "new") {
      const { error } = await supabase.from("blog_posts").insert({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content,
        cover_image: form.cover_image || null,
        category: form.category || null,
        author: form.author,
        published: form.published,
      });
      if (error) toast.error(error.message);
      else toast.success("Post created");
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt || null,
          content: form.content,
          cover_image: form.cover_image || null,
          category: form.category || null,
          author: form.author,
          published: form.published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editing!);
      if (error) toast.error(error.message);
      else toast.success("Post updated");
    }

    setSaving(false);
    setEditing(null);
    setForm(emptyForm);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Post deleted");
      fetchPosts();
    }
  };

  const handleSaveIdea = async () => {
    if (!ideaForm.title) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);

    if (editingIdea === "new") {
      const { error } = await supabase.from("blog_ideas").insert({
        title: ideaForm.title,
        description: ideaForm.description || null,
        source: ideaForm.source || null,
        source_url: ideaForm.source_url || null,
      });
      if (error) toast.error(error.message);
      else toast.success("Idea saved");
    } else {
      const { error } = await supabase
        .from("blog_ideas")
        .update({
          title: ideaForm.title,
          description: ideaForm.description || null,
          source: ideaForm.source || null,
          source_url: ideaForm.source_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingIdea!);
      if (error) toast.error(error.message);
      else toast.success("Idea updated");
    }

    setSaving(false);
    setEditingIdea(null);
    setIdeaForm(emptyIdeaForm);
    fetchIdeas();
  };

  const handleDeleteIdea = async (id: string) => {
    if (!confirm("Delete this idea?")) return;
    const { error } = await supabase.from("blog_ideas").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Idea deleted");
      fetchIdeas();
    }
  };

  const handleEditIdea = (idea: BlogIdea) => {
    setEditingIdea(idea.id);
    setIdeaForm({
      title: idea.title,
      description: idea.description || "",
      source: idea.source || "",
      source_url: idea.source_url || "",
    });
  };

  // Research new ideas via Perplexity
  const handleResearch = async () => {
    setResearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("research-podcast-news");
      if (error) {
        toast.error("Research failed: " + error.message);
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`Found ${data.count} new content ideas!`);
        fetchIdeas();
      }
    } catch (e) {
      toast.error("Failed to research ideas");
    }
    setResearching(false);
  };

  // Approve idea - generate blog
  const handleApprove = async (ideaId: string) => {
    setGeneratingId(ideaId);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-from-idea", {
        body: { idea_id: ideaId },
      });
      if (error) {
        toast.error("Generation failed: " + error.message);
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Blog post generated and saved as draft!");
        fetchIdeas();
        fetchPosts();
      }
    } catch (e) {
      toast.error("Failed to generate blog");
    }
    setGeneratingId(null);
  };

  // Decline idea - mark as declined (keeps record to avoid duplicates)
  const handleDecline = async (ideaId: string) => {
    const { error } = await supabase.from("blog_ideas").update({ status: "declined" }).eq("id", ideaId);
    if (error) toast.error(error.message);
    else {
      toast.success("Idea dismissed");
      fetchIdeas();
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === newIdeas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(newIdeas.map((i) => i.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    setBulkProcessing(true);
    const ids = Array.from(selectedIds);
    let success = 0;
    for (const id of ids) {
      try {
        const { data, error } = await supabase.functions.invoke("generate-blog-from-idea", {
          body: { idea_id: id },
        });
        if (!error && !data?.error) success++;
      } catch {}
    }
    toast.success(`${success} blog post(s) generated and published!`);
    setSelectedIds(new Set());
    setBulkProcessing(false);
    fetchIdeas();
    fetchPosts();
  };

  const handleBulkDecline = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await supabase.from("blog_ideas").update({ status: "declined" }).eq("id", id);
    }
    toast.success(`${ids.length} idea(s) declined`);
    setSelectedIds(new Set());
    fetchIdeas();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/20 text-blue-400";
      case "generating": return "bg-amber-500/20 text-amber-400";
      case "approved": return "bg-primary/20 text-primary";
      case "error": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Blog post editor view
  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setEditing(null); setForm(emptyForm); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-lg font-semibold">{editing === "new" ? "New Post" : "Edit Post"}</h2>
        </div>

        <div className="grid gap-4">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  slug: editing === "new" ? generateSlug(title) : f.slug,
                }));
              }}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Strategy, Production"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label>Author</Label>
              <Input
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <div>
            <Label>Cover Image URL</Label>
            <Input
              value={form.cover_image}
              onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))}
              placeholder="https://..."
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <Label>Content (HTML)</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={12}
              className="bg-white/5 border-white/10 font-mono text-xs"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.published}
              onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
            />
            <Label>Published</Label>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? "Saving..." : "Save Post"}
            </Button>
            <Button variant="ghost" onClick={() => { setEditing(null); setForm(emptyForm); }}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Idea editor view
  if (editingIdea) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setEditingIdea(null); setIdeaForm(emptyIdeaForm); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-lg font-semibold">{editingIdea === "new" ? "New Idea" : "Edit Idea"}</h2>
        </div>

        <div className="grid gap-4">
          <div>
            <Label>Title</Label>
            <Input
              value={ideaForm.title}
              onChange={(e) => setIdeaForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Blog idea title..."
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={ideaForm.description}
              onChange={(e) => setIdeaForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="What should this blog cover?"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Source</Label>
              <Input
                value={ideaForm.source}
                onChange={(e) => setIdeaForm((f) => ({ ...f, source: e.target.value }))}
                placeholder="e.g. Competitor blog, Industry news"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label>Source URL</Label>
              <Input
                value={ideaForm.source_url}
                onChange={(e) => setIdeaForm((f) => ({ ...f, source_url: e.target.value }))}
                placeholder="https://..."
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSaveIdea} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? "Saving..." : "Save Idea"}
            </Button>
            <Button variant="ghost" onClick={() => { setEditingIdea(null); setIdeaForm(emptyIdeaForm); }}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const newIdeas = ideas.filter((i) => i.status === "new");
  const processedIdeas = ideas.filter((i) => i.status !== "new");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] w-fit">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "active"
              ? "bg-white/[0.1] text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
          }`}
        >
          <FileText className="w-4 h-4" />
          Active
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.08]">
            {posts.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("ideas")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "ideas"
              ? "bg-white/[0.1] text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Ideas
          {newIdeas.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/20 text-primary">
              {newIdeas.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "active" ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Blog Posts</h2>
            <Button
              size="sm"
              onClick={() => { setEditing("new"); setForm(emptyForm); }}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-1" /> New Post
            </Button>
          </div>

          {posts.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No blog posts yet.</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      <span
                        className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          post.published
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {post.category && `${post.category} · `}
                      {format(parseISO(post.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {post.published && (
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      </a>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Content Ideas</h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleResearch}
                disabled={researching}
                className="border-white/10 hover:bg-white/5"
              >
                {researching ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-1" />
                )}
                {researching ? "Researching..." : "Research Ideas"}
              </Button>
              <Button
                size="sm"
                onClick={() => { setEditingIdea("new"); setIdeaForm(emptyIdeaForm); }}
                className="bg-primary text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Idea
              </Button>
            </div>
          </div>

          {ideas.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Lightbulb className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">No content ideas yet.</p>
              <p className="text-xs text-muted-foreground/60">
                Click "Research Ideas" to find the latest podcast news, or add your own.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* New ideas needing review */}
              {newIdeas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Needs Review ({newIdeas.length})
                    </h3>
                    <button
                      onClick={toggleSelectAll}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {selectedIds.size === newIdeas.length ? "Deselect all" : "Select all"}
                    </button>
                  </div>

                  {/* Bulk action bar */}
                  {selectedIds.size > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/[0.1]">
                      <span className="text-sm font-medium">{selectedIds.size} selected</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          size="sm"
                          onClick={handleBulkApprove}
                          disabled={bulkProcessing}
                          className="bg-primary text-primary-foreground"
                        >
                          {bulkProcessing ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-1" />
                          )}
                          {bulkProcessing ? "Processing..." : "Approve Selected"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleBulkDecline}
                          disabled={bulkProcessing}
                          className="border border-white/10 text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                        >
                          <X className="w-4 h-4 mr-1" /> Decline Selected
                        </Button>
                      </div>
                    </div>
                  )}

                  {newIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className={`rounded-xl border backdrop-blur-xl p-4 space-y-3 transition-colors ${
                        selectedIds.has(idea.id)
                          ? "border-primary/30 bg-primary/[0.04]"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedIds.has(idea.id)}
                          onCheckedChange={() => toggleSelect(idea.id)}
                          className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{idea.title}</h3>
                            {idea.source && (
                              <span className="shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] border border-white/[0.08] text-muted-foreground">
                                {idea.source}
                              </span>
                            )}
                          </div>
                          {idea.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                              {idea.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
                            <span>{format(parseISO(idea.created_at), "MMM d, yyyy")}</span>
                            {idea.source_url && (
                              <a
                                href={idea.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" /> Source
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(idea.id)}
                          disabled={generatingId === idea.id || bulkProcessing}
                          className="bg-primary text-primary-foreground"
                        >
                          {generatingId === idea.id ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-1" />
                          )}
                          {generatingId === idea.id ? "Generating blog..." : "Approve & Generate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDecline(idea.id)}
                          disabled={generatingId === idea.id || bulkProcessing}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4 mr-1" /> Decline
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditIdea(idea)}
                          className="ml-auto"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Processed ideas */}
              {processedIdeas.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Processed ({processedIdeas.length})
                  </h3>
                  {processedIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-4 flex items-center justify-between gap-4 opacity-60"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{idea.title}</h3>
                          <span className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(idea.status)}`}>
                            {idea.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/60">
                          {format(parseISO(idea.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteIdea(idea.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminBlogManager;
