import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Footer from "@/components/landing/Footer";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
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

const POSTS_PER_PAGE = 8;

const Blogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  const categories = useMemo(() => {
    const cats = posts.map((p) => p.category).filter(Boolean) as string[];
    return [...new Set(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    return result;
  }, [posts, searchQuery, activeCategory]);

  const featuredPost = posts[0];
  const mainPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);
  const totalPages = Math.ceil(mainPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = mainPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 px-6 relative">
        {/* Gradient background blurs - brand colours */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] -top-60 -left-40 rounded-full bg-[#6359EA]/[0.08] blur-[120px]" />
          <div className="absolute w-[500px] h-[500px] -top-40 right-[-100px] rounded-full bg-[#FFB347]/[0.06] blur-[100px]" />
          <div className="absolute w-[300px] h-[300px] top-20 left-1/2 -translate-x-1/2 rounded-full bg-[#1CFA76]/[0.04] blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading mb-3 leading-[0.95]">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                  Insights that
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#6359EA] via-[#1CFA76] to-[#FFB347] bg-clip-text text-transparent">
                  actually matter
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-body max-w-md">
                What's happening in podcasting, content and the stuff nobody's talking about yet.
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all font-body"
              />
            </div>
          </div>

          {/* Featured post */}
          {!searchQuery && !activeCategory && featuredPost && !loading && (
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group block relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.16] transition-all duration-500 mb-10"
            >
              {/* Gradient border glow on hover */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#6359EA]/20 via-[#1CFA76]/10 to-[#FFB347]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />

              <div className="relative grid md:grid-cols-2 bg-background">
                <div className="aspect-[16/10] md:aspect-auto md:h-full overflow-hidden">
                  {featuredPost.cover_image ? (
                    <img
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[280px] bg-white/[0.02] flex items-center justify-center">
                      <span className="text-6xl font-heading text-white/[0.04]">E</span>
                    </div>
                  )}
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/[0.08] backdrop-blur-md border border-white/[0.1] text-foreground/80">
                      Featured
                    </span>
                    {featuredPost.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-white/[0.04] border border-white/[0.08] text-muted-foreground">
                        {featuredPost.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-medium mb-3 text-foreground group-hover:text-foreground/80 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="text-sm sm:text-base text-muted-foreground font-body line-clamp-3 mb-5">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(parseISO(featuredPost.created_at), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-md ${
                  !activeCategory
                    ? "bg-foreground text-background"
                    : "bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.08]"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-md ${
                    activeCategory === cat
                      ? "bg-foreground text-background"
                      : "bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.08]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse h-[320px]" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg font-body">
                {searchQuery ? `No results for "${searchQuery}"` : "No blog posts yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
              {/* Articles grid */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {paginatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.14] transition-all duration-300 hover:bg-white/[0.04]"
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                            <span className="text-3xl font-heading text-white/[0.04]">E</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-muted-foreground">
                              {post.category}
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground/40">
                            {format(parseISO(post.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-heading font-medium mb-2 text-foreground group-hover:text-foreground/80 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-xs sm:text-sm text-muted-foreground/70 font-body line-clamp-2 mt-auto">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10">
                    <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                            page === currentPage
                              ? "bg-foreground text-background"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.08]"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block space-y-8">
                {/* Recent posts */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5">
                  <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-foreground/40" />
                    Recent
                  </h3>
                  <div className="space-y-4">
                    {recentPosts.map((post, i) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group flex gap-3 items-start"
                      >
                        <span className="text-2xl font-heading font-bold text-white/[0.06] leading-none mt-0.5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h4>
                          <span className="text-[11px] text-muted-foreground/40 mt-1 block">
                            {format(parseISO(post.created_at), "MMM d")}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5">
                  <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4">
                    Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const count = posts.filter((p) => p.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all backdrop-blur-md ${
                            activeCategory === cat
                              ? "bg-foreground text-background"
                              : "bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.08]"
                          }`}
                        >
                          {cat} <span className="opacity-40 ml-1">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
