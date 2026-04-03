import { motion } from "framer-motion";
import {
  MessageCircle,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Shield,
  ChevronRight,
} from "lucide-react";
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

type GeneratedImages = Record<string, string> | null;

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

const painIcons = [AlertTriangle, TrendingUp, Shield];

// Consistent colour temperature filter for all images
const imgFilter = "brightness(0.97) saturate(0.9)";

const AuthorityLandingPage = ({ copy, images }: { copy: AuthorityCopy; images?: GeneratedImages }) => {
  const heroImg = images?.hero;
  const problemImg = images?.problem;
  const featureImg = images?.feature;
  const socialImg = images?.social_proof;
  const solutionImg = images?.solution;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ════════ HERO — Full Bleed Background ════════ */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-end sm:items-center">
        {/* Background image */}
        {heroImg && (
          <img
            src={heroImg}
            alt={`${copy.hero.badge} — editorial photography of the industry`}
            className="absolute inset-0 w-full h-full object-cover object-center sm:object-[center_30%]"
            style={{ filter: imgFilter }}
            loading="eager"
          />
        )}
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/45 sm:to-transparent" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 sm:py-28">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/[0.08] text-white font-medium px-5 py-2 rounded-full mb-6 border border-white/[0.12] backdrop-blur-xl tracking-widest uppercase text-xs">
              {copy.hero.badge}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6 text-white font-heading drop-shadow-lg">
              {highlightPhrase(copy.hero.headline, copy.hero.highlight_phrase)}
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-xl mb-8 leading-relaxed font-body">
              {copy.hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a href="#contact" className="group relative inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 glow-on-hover text-primary-foreground">
                {copy.hero.cta_primary}
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium px-6 py-4 transition-colors text-sm">
                {copy.hero.cta_secondary}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo wall — separate from hero */}
      <section className="relative py-10 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <p className="text-xs text-text-tertiary font-body mb-2">
              Trusted by teams at <span className="font-semibold text-text-primary">Experian</span>, <span className="font-semibold text-text-primary">Cisco</span>, <span className="font-semibold text-text-primary">IG Group</span>, <span className="font-semibold text-text-primary">Infobip</span> and more
            </p>
            <LogoWall />
          </motion.div>
        </div>
      </section>

      {/* ════════ PAIN POINTS — Split Screen with Problem Image ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[300px] blob-oblong-green pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image side — problem image */}
            {problemImg && (
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={problemImg}
                    alt={`The content marketing challenge facing ${copy.hero.badge} teams`}
                    className="w-full h-full object-cover"
                    style={{ filter: imgFilter }}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            )}

            {/* Copy side */}
            <motion.div
              className={`order-1 ${problemImg ? "lg:order-2" : "lg:col-span-2"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.pain_points.label}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary font-heading mb-8">{copy.pain_points.headline}</h2>

              <div className="space-y-4">
                {copy.pain_points.items.map((item, i) => {
                  const Icon = painIcons[i % painIcons.length];
                  return (
                    <motion.div
                      key={i}
                      className="flex gap-4 items-start"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading text-text-primary mb-1">{item.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed font-body">{item.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ MID-PAGE IMAGE STRIP ════════ */}
      {socialImg && (
        <section className="relative h-[200px] sm:h-[280px] overflow-hidden">
          <img
            src={socialImg}
            alt={`${copy.hero.badge} professionals in their element`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: imgFilter }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50 sm:bg-black/40" />
          <div className="relative z-10 flex items-center justify-center h-full px-6">
            <motion.p
              className="text-white text-xl sm:text-2xl md:text-3xl font-heading text-center max-w-3xl drop-shadow-lg"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {copy.stats.headline}
            </motion.p>
          </div>
        </section>
      )}

      {/* ════════ HOW IT WORKS — Feature/Solution Image Card ════════ */}
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
            {copy.how_it_works.steps.map((step, i) => {
              // Map steps to images: feature → solution → social_proof
              const stepImages = [featureImg, solutionImg, socialImg];
              const stepImg = stepImages[i];
              return (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-white/80 via-white/60 to-gray-100/80 backdrop-blur-sm flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={stepImg || `https://source.unsplash.com/800x500/?${encodeURIComponent(step.image_query)}`}
                      alt={`${step.title} — ${step.description}`}
                      className="w-full h-full object-cover"
                      style={{ filter: imgFilter }}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <span className="text-4xl font-heading text-light-text-tertiary/30 mb-2">{step.number}</span>
                    <h3 className="text-xl text-light-text-primary font-heading font-medium mb-2">{step.title}</h3>
                    <p className="text-sm text-light-text-secondary font-body leading-relaxed">{step.description}</p>
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

      {/* ════════ STATS — 3 big numbers ════════ */}
      {!socialImg && (
        <section className="relative py-20 sm:py-28 px-6">
          <div className="absolute top-[-50px] left-[-120px] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary font-heading">{copy.stats.headline}</h2>
            </motion.div>
          </div>
        </section>
      )}

      <section className={`relative ${socialImg ? "pt-0" : ""} pb-20 sm:pb-28 px-6`}>
        <div className="absolute top-[-50px] left-[-120px] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
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

      {/* ════════ WHY EARWORM — with solution image ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[50px] right-[-200px] w-[400px] h-[500px] blob-oblong-green pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.differentiators.label}</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary font-heading">{copy.differentiators.headline}</h2>
              </motion.div>

              <div className="space-y-4">
                {copy.differentiators.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-4 items-start p-5 sm:p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
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

            {/* Solution image — lifestyle card */}
            {solutionImg && (
              <motion.div
                className="hidden lg:block sticky top-28"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <img
                    src={solutionImg}
                    alt={`The transformation — ${copy.hero.badge} content strategy in action`}
                    className="w-full h-auto object-cover"
                    style={{ filter: imgFilter }}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            )}
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
