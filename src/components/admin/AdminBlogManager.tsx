import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, ArrowLeft, Eye } from "lucide-react";
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

const AdminBlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<string | null>(null); // 'new' or post id
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data as BlogPost[]);
  };

  useEffect(() => {
    fetchPosts();
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

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AdminBlogManager;
