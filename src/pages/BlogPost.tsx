import { useEffect, useState } from "react";
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

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">Share</span>
              {(() => {
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(post.title);
                return (
                  <>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.12] transition-colors" aria-label="Share on LinkedIn">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.12] transition-colors" aria-label="Share on X">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href={`https://www.instagram.com/`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.12] transition-colors" aria-label="Share on Instagram">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <a href={`https://wa.me/?text=${title}%20${url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.12] transition-colors" aria-label="Share on WhatsApp">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </>
                );
              })()}
            </div>
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
