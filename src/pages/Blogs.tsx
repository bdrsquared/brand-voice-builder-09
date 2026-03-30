import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Footer from "@/components/landing/Footer";
import { ArrowRight, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  author: string;
  created_at: string;
};

const Blogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, category, author, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob-green absolute w-[500px] h-[500px] -top-40 -left-40" />
          <div className="blob-blue absolute w-[400px] h-[400px] -top-20 right-0" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10 bg-white/[0.06] backdrop-blur-sm text-muted-foreground mb-6">
            Insights & Ideas
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading mb-6">
            The Earworm <span className="text-gradient-green">Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Strategies, stories, and insights on building authority through video podcasting.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card animate-pulse h-[380px]" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* Thumbnail */}
                  <div className="w-28 sm:w-40 shrink-0">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <span className="text-2xl font-heading text-muted-foreground/30">E</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {post.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20">
                          {post.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(parseISO(post.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-heading font-medium mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground font-body line-clamp-1 hidden sm:block">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:flex items-center pr-5 shrink-0">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
