import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ArrowRight,
  Megaphone,
  Target,
  TrendingDown,
  Clock,
  EyeOff,
  Users,
  Check,
  ChevronRight,
} from "lucide-react";
import DotsBackground from "@/components/landing/DotsBackground";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Calendly from "@/components/landing/Calendly";

const iconMap: Record<string, any> = {
  megaphone: Megaphone,
  target: Target,
  "trending-down": TrendingDown,
  clock: Clock,
  "eye-off": EyeOff,
  users: Users,
};

const Pill = ({ children, variant = "dark" }: { children: React.ReactNode; variant?: "light" | "dark" }) => (
  <span
    className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide ${
      variant === "dark"
        ? "bg-white/10 backdrop-blur-sm border border-white/15 text-white/90"
        : "bg-black/[0.05] border border-black/[0.08] text-light-text-secondary"
    }`}
  >
    {children}
  </span>
);

type GeneratedCopy = {
  hero: {
    badge: string;
    headline: string;
    highlight_word: string;
    subheadline: string;
    cta_primary: string;
    cta_secondary: string;
  };
  pain_points: {
    section_title: string;
    section_subtitle: string;
    items: Array<{ title: string; description: string; icon: string }>;
  };
  solution: {
    section_title: string;
    section_subtitle: string;
    bento_cards: Array<{ title: string; description: string; tag: string; size: string }>;
  };
  stats: {
    items: Array<{ value: string; label: string; context: string }>;
  };
  objection_handling: {
    section_title: string;
    items: Array<{ objection: string; response: string }>;
  };
  cta_section: {
    headline: string;
    subheadline: string;
    cta_text: string;
  };
};

const ICPLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [icpName, setIcpName] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      const { data, error } = await (supabase
        .from("icp_landing_pages" as any)
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single() as any);

      if (error || !data || !data.generated_copy) {
        setNotFound(true);
      } else {
        setCopy(data.generated_copy as GeneratedCopy);
        setIcpName(data.icp_name);
      }
      setLoading(false);
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (notFound || !copy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-heading mb-4">Page not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const highlightHeadline = (headline: string, highlightWord: string) => {
    if (!highlightWord) return headline;
    const idx = headline.toLowerCase().indexOf(highlightWord.toLowerCase());
    if (idx === -1) return headline;
    const before = headline.slice(0, idx);
    const match = headline.slice(idx, idx + highlightWord.length);
    const after = headline.slice(idx + highlightWord.length);
    return (
      <>
        {before}
        <span className="italic text-primary">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-28 px-6">
        <DotsBackground />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/[0.08] via-card/60 to-accent/[0.06] text-foreground font-medium text-sm px-7 py-3 rounded-full mb-6 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_20px_rgba(28,250,118,0.06),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl tracking-widest uppercase text-xs">
              {copy.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 text-text-primary font-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {highlightHeadline(copy.hero.headline, copy.hero.highlight_word)}
          </motion.h1>

          <motion.p
            className="text-center text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {copy.hero.subheadline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 glow-on-hover text-primary-foreground"
            >
              {copy.hero.cta_primary}
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
            <a
              href="#solution"
              className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary font-medium px-6 py-4 transition-colors text-sm"
            >
              {copy.hero.cta_secondary}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 text-text-primary font-heading">
              {copy.pain_points.section_title}
            </h2>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl font-body">
              {copy.pain_points.section_subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {copy.pain_points.items.map((item, i) => {
              const Icon = iconMap[item.icon] || Target;
              return (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-3xl p-8 sm:p-9 min-h-[220px] flex flex-col justify-between border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl text-text-primary font-heading font-medium mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-text-secondary font-body leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SOLUTION BENTO ── */}
      <section id="solution" className="relative py-20 sm:py-28 px-6">
        {/* Light background with brand gradients */}
        <div className="absolute inset-0" style={{ backgroundColor: "#E4E5E9" }} />
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 15% 40%, rgba(28, 250, 118, 0.25), transparent 70%), radial-gradient(ellipse 70% 40% at 55% 55%, rgba(99, 89, 234, 0.2), transparent 70%), radial-gradient(ellipse 70% 40% at 85% 35%, rgba(255, 179, 71, 0.2), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 font-medium text-sm mb-4 text-light-text-tertiary">
              ● The solution
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-2 text-light-text-primary font-heading">
              {copy.solution.section_title}
            </h2>
            <p className="text-base sm:text-lg text-light-text-secondary max-w-2xl font-body">
              {copy.solution.section_subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {copy.solution.bento_cards.map((card, i) => {
              const isLarge = card.size === "large" || i === 0;
              return (
                <motion.div
                  key={i}
                  className={`relative overflow-hidden rounded-3xl p-8 sm:p-9 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between border border-black/[0.06] bg-gradient-to-br from-white/80 via-white/60 to-gray-100/80 backdrop-blur-sm ${
                    isLarge ? "sm:col-span-2" : ""
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {i === 0 && (
                    <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#1CFA76]/15 to-transparent rounded-br-full pointer-events-none" />
                  )}
                  {i === 1 && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFB347]/15 to-transparent rounded-bl-full pointer-events-none" />
                  )}
                  {i === 2 && (
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#6359EA]/10 to-transparent rounded-tr-full pointer-events-none" />
                  )}

                  <div className="flex flex-wrap gap-2.5">
                    <Pill variant="light">{card.tag}</Pill>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl text-light-text-primary font-heading font-medium mb-3">
                      {card.title}
                    </h3>
                    <p className="text-sm sm:text-base text-light-text-secondary font-body leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {copy.stats.items.map((stat, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                <p className="text-4xl sm:text-5xl font-heading font-semibold text-primary mb-2 relative z-10">
                  {stat.value}
                </p>
                <p className="text-base text-text-primary font-medium mb-1 relative z-10">
                  {stat.label}
                </p>
                <p className="text-sm text-text-tertiary font-body relative z-10">
                  {stat.context}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBJECTION HANDLING ── */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 text-text-primary font-heading">
              {copy.objection_handling.section_title}
            </h2>
          </motion.div>

          <div className="space-y-5">
            {copy.objection_handling.items.map((item, i) => (
              <motion.div
                key={i}
                className="rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-9"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <ChevronRight className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-lg text-text-primary font-heading font-medium mb-2">
                      "{item.objection}"
                    </p>
                    <p className="text-sm sm:text-base text-text-secondary font-body leading-relaxed">
                      {item.response}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA + CALENDLY ── */}
      <Calendly />

      <Footer />
    </div>
  );
};

export default ICPLandingPage;
