import { motion } from "framer-motion";
import {
  MessageCircle,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Zap,
  Shield,
  Check,
  ChevronRight,
} from "lucide-react";
import DotsBackground from "@/components/landing/DotsBackground";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Calendly from "@/components/landing/Calendly";
import LogoWall from "@/components/landing/LogoWall";

// ── Types ──
export type AuthorityCopy = {
  style: "authority";
  hero: {
    badge: string;
    headline: string;
    highlight_phrase: string;
    subheadline: string;
    cta_primary: string;
    cta_secondary: string;
    image_query: string;
  };
  pain_points: {
    label: string;
    headline: string;
    items: Array<{ title: string; description: string }>;
  };
  how_it_works: {
    label: string;
    headline: string;
    steps: Array<{ number: string; title: string; description: string; image_query: string }>;
  };
  stats: {
    headline: string;
    items: Array<{ value: string; label: string; source: string }>;
  };
  differentiators: {
    label: string;
    headline: string;
    items: Array<{ title: string; description: string }>;
  };
  cta_section: {
    headline: string;
    headline_green_phrase: string;
    subheadline: string;
    cta_text: string;
  };
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

const unsplashImage = (query: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${query}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// Use curated Unsplash source for keyword-based images
const unsplashSearch = (keywords: string, w = 800, h = 600) =>
  `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(keywords)}`;

const painIcons = [AlertTriangle, TrendingUp, Shield];

type GeneratedImages = Record<string, string> | null;

const AuthorityLandingPage = ({ copy, images }: { copy: AuthorityCopy; images?: GeneratedImages }) => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-20 px-6">
        <DotsBackground />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/[0.08] via-card/60 to-accent/[0.06] text-foreground font-medium px-7 py-3 rounded-full mb-6 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_20px_rgba(28,250,118,0.06),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl tracking-widest uppercase text-xs">
                {copy.hero.badge}
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6 text-text-primary font-heading">
                {highlightPhrase(copy.hero.headline, copy.hero.highlight_phrase)}
              </h1>

              <p className="text-base sm:text-lg text-text-secondary max-w-xl mb-8 leading-relaxed font-body">
                {copy.hero.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href="#contact" className="group relative inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 glow-on-hover text-primary-foreground">
                  {copy.hero.cta_primary}
                  <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a href="#how-it-works" className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary font-medium px-6 py-4 transition-colors text-sm">
                  {copy.hero.cta_secondary}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl aspect-[4/3]">
                <img
                  src={images?.hero || unsplashSearch(copy.hero.image_query)}
                  alt={copy.hero.badge}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
            </motion.div>
          </div>

          <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <p className="text-xs text-text-tertiary font-body mb-2">
              Trusted by teams at <span className="font-semibold text-text-primary">Experian</span>, <span className="font-semibold text-text-primary">Cisco</span>, <span className="font-semibold text-text-primary">IG Group</span>, <span className="font-semibold text-text-primary">Infobip</span> and more
            </p>
            <LogoWall />
          </motion.div>
        </div>
      </section>

      {/* ════════ PAIN POINTS — 3 short cards ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[300px] blob-oblong-green pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.pain_points.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary font-heading">{copy.pain_points.headline}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {copy.pain_points.items.map((item, i) => {
              const Icon = painIcons[i % painIcons.length];
              return (
                <motion.div
                  key={i}
                  className="p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-heading text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-body">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS — 3 visual steps (light section) ════════ */}
      <div className="relative z-10" style={{ backgroundColor: "#E4E5E9" }}>
        <div className="bg-background rounded-b-[40px] sm:rounded-b-[60px] h-[40px] sm:h-[60px]" />
      </div>

      <section id="how-it-works" className="relative py-20 sm:py-28 px-6" style={{ backgroundColor: "#E4E5E9" }}>
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 70% 40% at 15% 40%, rgba(28, 250, 118, 0.25), transparent 70%), radial-gradient(ellipse 70% 40% at 55% 55%, rgba(99, 89, 234, 0.2), transparent 70%), radial-gradient(ellipse 70% 40% at 85% 35%, rgba(255, 179, 71, 0.2), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 font-medium text-sm mb-4 text-light-text-tertiary">{copy.how_it_works.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-light-text-primary font-heading">{copy.how_it_works.headline}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {copy.how_it_works.steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-white/80 via-white/60 to-gray-100/80 backdrop-blur-sm flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={images?.[i === 0 ? "feature" : i === 1 ? "social_proof" : "solution"] || unsplashSearch(step.image_query)}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <span className="text-4xl font-heading text-light-text-tertiary/30 mb-2">{step.number}</span>
                  <h3 className="text-xl text-light-text-primary font-heading font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-light-text-secondary font-body leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: "#E4E5E9" }}>
        <div className="bg-background rounded-t-[40px] sm:rounded-t-[60px] h-[40px] sm:h-[60px]" />
      </div>

      {/* ════════ STATS — 3 big numbers ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[-50px] left-[-120px] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary font-heading">{copy.stats.headline}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {copy.stats.items.map((item, i) => (
              <motion.div
                key={i}
                className="relative p-8 sm:p-10 rounded-2xl border border-border bg-card text-center overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className="block text-5xl sm:text-6xl font-heading text-gradient-green mb-3">{item.value}</span>
                <p className="text-sm text-text-primary font-heading mb-1">{item.label}</p>
                <p className="text-xs text-text-tertiary font-body">{item.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WHY EARWORM — 4 short differentiators ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[50px] right-[-200px] w-[400px] h-[500px] blob-oblong-green pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.differentiators.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary font-heading">{copy.differentiators.headline}</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {copy.differentiators.items.map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-4 items-start p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg text-text-primary font-heading font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary font-body leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <Calendly />
      <Footer />
    </div>
  );
};

export default AuthorityLandingPage;
