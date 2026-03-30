import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Footer from "@/components/landing/Footer";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
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
          {/* Back link + Share */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/blogs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
            </Link>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }
              }}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Share this article"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>

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
            className="max-w-none font-body text-foreground
              [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:font-heading [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:leading-tight
              [&_h3]:mt-10 [&_h3]:mb-5 [&_h3]:font-heading [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:leading-tight
              [&_h4]:mt-8 [&_h4]:mb-4 [&_h4]:font-heading [&_h4]:text-lg [&_h4]:font-semibold
              [&_p]:mb-5 [&_p]:text-base [&_p]:leading-[1.75] [&_p]:text-muted-foreground
              [&_ul]:my-6 [&_ol]:my-6 [&_li]:mb-2 [&_li]:text-base [&_li]:leading-[1.75] [&_li]:text-muted-foreground
              [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline
              [&_strong]:text-foreground
              [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground
              [&_img]:rounded-xl [&_img]:border [&_img]:border-border"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/<br\s*\/?>/gi, '') }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
