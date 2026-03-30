import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Footer from "@/components/landing/Footer";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format, parseISO } from "date-fns";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  author: string;
  created_at: string;
};

const useMetaTags = (post: Post | null) => {
  useEffect(() => {
    if (!post) return;

    const siteUrl = window.location.origin;
    const ogImage = post.cover_image || `${siteUrl}/og-image.png`;
    const description = post.excerpt || `Read "${post.title}" on the Earworm blog.`;

    document.title = `${post.title} | Earworm`;

    const setMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? "name" : "property";
      let el = document.querySelector(`meta[${attr}="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description, true);
    setMeta("og:title", post.title);
    setMeta("og:description", description);
    setMeta("og:image", ogImage);
    setMeta("og:url", `${siteUrl}/blog/${post.slug}`);
    setMeta("og:type", "article");
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", post.title, true);
    setMeta("twitter:description", description, true);
    setMeta("twitter:image", ogImage, true);

    return () => {
      document.title = "Earworm";
    };
  }, [post]);
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (data) setPost(data as Post);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  useMetaTags(post);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TestimonialTicker />
        <Navbar />
        <div className="pt-40 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <TestimonialTicker />
        <Navbar />
        <div className="pt-40 text-center px-6">
          <h1 className="text-3xl font-heading mb-4">Post not found</h1>
          <Link to="/blogs" className="text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />

      <article className="pt-32 sm:pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link to="/blogs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] text-foreground/80">
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-muted-foreground font-body">
              <Calendar className="w-3.5 h-3.5" />
              {format(parseISO(post.created_at), "MMMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground font-body">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading mb-6">{post.title}</h1>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground font-body mb-8 leading-relaxed">{post.excerpt}</p>
          )}

          {post.cover_image && (
            <div className="rounded-2xl overflow-hidden border border-border mb-10">
              <img src={post.cover_image} alt={post.title} className="w-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none font-body
              prose-headings:font-heading prose-headings:text-foreground prose-headings:tracking-tight prose-headings:font-bold
              prose-h2:!text-2xl sm:prose-h2:!text-3xl prose-h2:!mt-14 prose-h2:!mb-6 prose-h2:!leading-tight
              prose-h3:!text-xl sm:prose-h3:!text-2xl prose-h3:!mt-10 prose-h3:!mb-5 prose-h3:!leading-tight
              prose-h4:!text-lg prose-h4:!mt-8 prose-h4:!mb-4 prose-h4:font-semibold
              prose-p:text-muted-foreground prose-p:leading-[1.75] prose-p:!text-base prose-p:!mb-5
              prose-li:text-muted-foreground prose-li:leading-[1.75] prose-li:!text-base
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground
              prose-img:rounded-xl prose-img:border prose-img:border-border"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/<br\s*\/?>/gi, '') }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
