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
  ChevronRight,
  Crown,
  Layers,
  TrendingUp,
  Video,
  Scissors,
  Share2,
  Library,
  Mic,
  BarChart3,
  Sparkles,
} from "lucide-react";
import DotsBackground from "@/components/landing/DotsBackground";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Calendly from "@/components/landing/Calendly";
import LogoWall from "@/components/landing/LogoWall";

// ── Icon map for dynamic rendering ──
const iconMap: Record<string, any> = {
  megaphone: Megaphone,
  target: Target,
  "trending-down": TrendingDown,
  clock: Clock,
  "eye-off": EyeOff,
  users: Users,
  crown: Crown,
  layers: Layers,
  "trending-up": TrendingUp,
  video: Video,
  scissors: Scissors,
  share: Share2,
  library: Library,
  mic: Mic,
  chart: BarChart3,
  sparkles: Sparkles,
};

const vpIconStyles = {
  green: "bg-primary/10 text-primary",
  blue: "bg-accent/10 text-accent",
};

// ── Pill component ──
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

// ── Gradient backgrounds for stat cards ──
const statGradients = [
  "radial-gradient(ellipse at 20% 80%, hsl(145 96% 55% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(243 79% 63% / 0.10) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(320 60% 50% / 0.06) 0%, transparent 60%)",
  "radial-gradient(ellipse at 70% 90%, hsl(243 79% 63% / 0.14) 0%, transparent 50%), radial-gradient(ellipse at 10% 30%, hsl(145 96% 55% / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 90% 10%, hsl(320 60% 50% / 0.08) 0%, transparent 55%)",
  "radial-gradient(ellipse at 80% 70%, hsl(320 60% 50% / 0.10) 0%, transparent 50%), radial-gradient(ellipse at 20% 20%, hsl(243 79% 63% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, hsl(145 96% 55% / 0.08) 0%, transparent 55%)",
];

// ── Types ──
type GeneratedCopy = {
  hero: {
    badge: string;
    headline: string;
    highlight_phrase: string;
    subheadline: string;
    cta_primary: string;
    cta_secondary: string;
  };
  problem: {
    label: string;
    headline: string;
    headline_grey_part: string;
    paragraphs: string[];
  };
  value_props: {
    label: string;
    headline: string;
    headline_green_phrase: string;
    items: Array<{
      title: string;
      description: string;
      icon_color: string;
    }>;
  };
  bento: {
    label: string;
    headline: string;
    headline_secondary: string;
    cards: Array<{
      title: string;
      description: string;
      pills: string[];
      size: string;
      variant: string;
    }>;
  };
  stats: {
    headline: string;
    headline_aside: string;
    items: Array<{
      title: string;
      value: string;
      label: string;
      source: string;
    }>;
  };
  objections: {
    label: string;
    headline: string;
    items: Array<{
      objection: string;
      response: string;
    }>;
  };
  cta_section: {
    headline: string;
    headline_green_phrase: string;
    subheadline: string;
    cta_text: string;
  };
};

// ── Helper: highlight a phrase in green italic ──
const highlightPhrase = (text: string, phrase: string) => {
  if (!phrase) return text;
  const idx = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="italic text-primary">{text.slice(idx, idx + phrase.length)}</span>
      {text.slice(idx + phrase.length)}
    </>
  );
};

const greenGradientPhrase = (text: string, phrase: string) => {
  if (!phrase) return text;
  const idx = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-gradient-green">{text.slice(idx, idx + phrase.length)}</span>
      {text.slice(idx + phrase.length)}
    </>
  );
};

const greyPhrase = (text: string, greyPart: string) => {
  if (!greyPart) return text;
  const idx = text.toLowerCase().indexOf(greyPart.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-text-secondary">{text.slice(idx, idx + greyPart.length)}</span>
      {text.slice(idx + greyPart.length)}
    </>
  );
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

  if (loading) return <div className="min-h-screen bg-background" />;

  if (notFound || !copy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-heading mb-4">Page not found</h1>
          <Link to="/" className="text-primary hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  const vpIcons = [Target, Layers, TrendingUp, Crown];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-28 px-6">
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
            {highlightPhrase(copy.hero.headline, copy.hero.highlight_phrase)}
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
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary font-medium px-6 py-4 transition-colors text-sm"
            >
              {copy.hero.cta_secondary}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.p
            className="text-center text-xs text-text-tertiary font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Trusted by teams at{" "}
            <span className="font-semibold text-text-primary">Experian</span>,{" "}
            <span className="font-semibold text-text-primary">Cisco</span>,{" "}
            <span className="font-semibold text-text-primary">IG Group</span>,{" "}
            <span className="font-semibold text-text-primary">Infobip</span> and more
          </motion.p>

          <LogoWall />
        </div>
      </section>

      {/* ════════════════════ PROBLEM STATEMENT ════════════════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[300px] blob-oblong-green pointer-events-none" />
        <div className="absolute top-[-80px] left-[-150px] w-[350px] h-[350px] blob-blue pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">
              {copy.problem.label}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-8 text-text-primary">
              {greyPhrase(copy.problem.headline, copy.problem.headline_grey_part)}
            </h2>
            <div className="grid sm:grid-cols-2 gap-8 text-text-secondary text-base leading-relaxed font-body">
              {copy.problem.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ VALUE PROPS ════════════════════ */}
      <section className="relative py-20 sm:py-28 px-6 overflow-hidden">
        <div className="absolute top-[50px] left-[-200px] w-[400px] h-[500px] blob-oblong-green pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-150px] w-[350px] h-[350px] blob-blue-strong pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">
              {copy.value_props.label}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
              {greenGradientPhrase(copy.value_props.headline, copy.value_props.headline_green_phrase)}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {copy.value_props.items.map((prop, i) => {
              const Icon = vpIcons[i % vpIcons.length];
              const color = prop.icon_color === "green" ? "green" : "blue";
              return (
                <motion.div
                  key={i}
                  className="group relative p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden min-w-0"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors ${vpIconStyles[color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl mb-2 text-text-primary">{prop.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-body">{prop.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ BENTO GRID (light section) ════════════════════ */}
      <div className="relative z-10" style={{ backgroundColor: "#E4E5E9" }}>
        <div className="bg-background rounded-b-[40px] sm:rounded-b-[60px] h-[40px] sm:h-[60px]" />
      </div>

      <section id="how-it-works" className="relative py-20 sm:py-28 px-6" style={{ backgroundColor: "#E4E5E9" }}>
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
              {copy.bento.label}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-2 text-light-text-primary">
              {copy.bento.headline}
            </h2>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-light-text-tertiary">
              {copy.bento.headline_secondary}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {copy.bento.cards.map((card, i) => {
              const isLarge = card.size === "large" || i === 0;
              const isDark = card.variant === "dark" || i === 0;

              if (isDark) {
                return (
                  <motion.div
                    key={i}
                    className={`relative overflow-hidden rounded-3xl min-h-[340px] sm:min-h-[380px] flex flex-col justify-end bg-card border border-white/[0.06] ${
                      isLarge ? "sm:col-span-2" : ""
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6359EA]/20 via-transparent to-[#1CFA76]/10 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                      }}
                    />
                    <div className="relative z-10 p-8 sm:p-10">
                      <h3 className="text-2xl sm:text-3xl text-white font-heading font-medium mb-3">{card.title}</h3>
                      <p className="text-sm sm:text-base text-white/70 font-body max-w-lg leading-relaxed">{card.description}</p>
                      <div className="flex flex-wrap gap-2.5 mt-5">
                        {card.pills.map((pill, j) => (
                          <Pill key={j} variant="dark">{pill}</Pill>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              }

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
                  {i === 1 && <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#FFB347]/15 to-transparent rounded-bl-full pointer-events-none" />}
                  {i === 2 && <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#6359EA]/10 to-transparent rounded-tr-full pointer-events-none" />}
                  {i === 3 && <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-[#1CFA76]/10 to-transparent rounded-br-full pointer-events-none" />}
                  {i === 4 && <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#40ABB2]/10 to-transparent rounded-tl-full pointer-events-none" />}

                  <div className="flex flex-wrap gap-2.5">
                    {card.pills.map((pill, j) => (
                      <Pill key={j} variant="light">{pill}</Pill>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl text-light-text-primary font-heading font-medium mb-3">{card.title}</h3>
                    <p className="text-sm sm:text-base text-light-text-secondary font-body leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: "#E4E5E9" }}>
        <div className="bg-background rounded-t-[40px] sm:rounded-t-[60px] h-[40px] sm:h-[60px]" />
      </div>

      {/* ════════════════════ STATS ════════════════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] blob-green pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-120px] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl leading-tight max-w-2xl text-text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {copy.stats.headline}
            </motion.h2>
            <motion.p
              className="text-sm text-text-secondary font-body leading-relaxed max-w-sm lg:text-right"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {copy.stats.headline_aside}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {copy.stats.items.map((stat, i) => (
              <motion.div
                key={i}
                className="relative p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col justify-between min-h-[320px] overflow-hidden"
                style={{ background: `${statGradients[i % statGradients.length]}, hsl(0 0% 5%)` }}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <h3 className="relative z-10 text-lg sm:text-xl leading-snug text-text-primary">{stat.title}</h3>
                <div className="relative z-10">
                  <span className="block text-5xl sm:text-6xl font-heading text-gradient-green mb-3">{stat.value}</span>
                  <p className="text-text-secondary font-body leading-relaxed text-sm">{stat.label}</p>
                </div>
                <div className="relative z-10">
                  <div className="w-8 h-px bg-white/20 mb-3" />
                  <p className="text-xs text-text-tertiary font-body">{stat.source}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ OBJECTIONS ════════════════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">
              {copy.objections.label}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary font-heading">
              {copy.objections.headline}
            </h2>
          </motion.div>

          <div className="space-y-5">
            {copy.objections.items.map((item, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 sm:p-8"
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
                    <p className="text-lg text-text-primary font-heading font-medium mb-2">"{item.objection}"</p>
                    <p className="text-sm sm:text-base text-text-secondary font-body leading-relaxed">{item.response}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA + CALENDLY ════════════════════ */}
      <Calendly />

      <Footer />
    </div>
  );
};

export default ICPLandingPage;
