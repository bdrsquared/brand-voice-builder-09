import { motion } from "framer-motion";
import {
  MessageCircle,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Zap,
  Shield,
  Check,
  Quote,
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
  };
  problem: {
    label: string;
    headline: string;
    headline_grey_part: string;
    cards: Array<{ title: string; description: string }>;
  };
  shift: {
    label: string;
    headline: string;
    headline_green_phrase: string;
    description: string;
  };
  opportunity: {
    label: string;
    headline: string;
    items: Array<{ stat: string; title: string; description: string; source: string }>;
  };
  model: {
    label: string;
    headline: string;
    headline_secondary: string;
    steps: Array<{ number: string; title: string; description: string; details: string[] }>;
  };
  proof: {
    label: string;
    headline: string;
    metrics: Array<{ value: string; label: string; context: string }>;
    testimonial: { quote: string; author: string; role: string };
  };
  tangible: {
    label: string;
    headline: string;
    items: Array<{ title: string; description: string }>;
  };
  why_earworm: {
    label: string;
    headline: string;
    points: Array<{ title: string; description: string }>;
  };
  qualification: {
    headline: string;
    description: string;
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

const problemIcons = [AlertTriangle, TrendingUp, Shield, Zap];

const AuthorityLandingPage = ({ copy }: { copy: AuthorityCopy }) => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ════════ 1. HERO ════════ */}
      <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-28 px-6">
        <DotsBackground />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/[0.08] via-card/60 to-accent/[0.06] text-foreground font-medium text-sm px-7 py-3 rounded-full mb-6 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_20px_rgba(28,250,118,0.06),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl tracking-widest uppercase text-xs">
              {copy.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 text-text-primary font-heading"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            {highlightPhrase(copy.hero.headline, copy.hero.highlight_phrase)}
          </motion.h1>

          <motion.p
            className="text-center text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed font-body"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            {copy.hero.subheadline}
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <a href="#contact" className="group relative inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 glow-on-hover text-primary-foreground">
              {copy.hero.cta_primary}
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
            <a href="#how-it-works" className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary font-medium px-6 py-4 transition-colors text-sm">
              {copy.hero.cta_secondary}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.p className="text-center text-xs text-text-tertiary font-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            Trusted by teams at <span className="font-semibold text-text-primary">Experian</span>, <span className="font-semibold text-text-primary">Cisco</span>, <span className="font-semibold text-text-primary">IG Group</span>, <span className="font-semibold text-text-primary">Infobip</span> and more
          </motion.p>
          <LogoWall />
        </div>
      </section>

      {/* ════════ 2. PROBLEM — 4 cards ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[300px] blob-oblong-green pointer-events-none" />
        <div className="absolute top-[-80px] left-[-150px] w-[350px] h-[350px] blob-blue pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.problem.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-10 text-text-primary">
              {greyPhrase(copy.problem.headline, copy.problem.headline_grey_part)}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {copy.problem.cards.map((card, i) => {
              const Icon = problemIcons[i % problemIcons.length];
              return (
                <motion.div
                  key={i}
                  className="p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-heading text-text-primary mb-2">{card.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-body">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ 3. THE SHIFT ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[50px] right-[-200px] w-[400px] h-[500px] blob-oblong-green pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.shift.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-6 text-text-primary font-heading">
              {greenGradientPhrase(copy.shift.headline, copy.shift.headline_green_phrase)}
            </h2>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-body">{copy.shift.description}</p>
          </motion.div>
        </div>
      </section>

      {/* ════════ 4. OPPORTUNITY — stat-led cards ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute bottom-[-80px] left-[-120px] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.opportunity.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary">{copy.opportunity.headline}</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {copy.opportunity.items.map((item, i) => (
              <motion.div
                key={i}
                className="relative p-6 sm:p-8 rounded-2xl border border-border bg-card overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <span className="block text-4xl sm:text-5xl font-heading text-gradient-green mb-3">{item.stat}</span>
                <h3 className="text-lg text-text-primary font-heading mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-body mb-3">{item.description}</p>
                <p className="text-xs text-text-tertiary font-body">{item.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 5. THE MODEL — 3 steps (light section) ════════ */}
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
            <span className="inline-flex items-center gap-2 font-medium text-sm mb-4 text-light-text-tertiary">{copy.model.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-2 text-light-text-primary">{copy.model.headline}</h2>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-light-text-tertiary">{copy.model.headline_secondary}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {copy.model.steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-3xl p-8 sm:p-9 border border-black/[0.06] bg-gradient-to-br from-white/80 via-white/60 to-gray-100/80 backdrop-blur-sm flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span className="text-5xl font-heading text-light-text-tertiary/30 mb-4">{step.number}</span>
                <h3 className="text-xl sm:text-2xl text-light-text-primary font-heading font-medium mb-3">{step.title}</h3>
                <p className="text-sm text-light-text-secondary font-body leading-relaxed mb-5">{step.description}</p>
                <ul className="space-y-2 mt-auto">
                  {step.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-light-text-secondary font-body">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: "#E4E5E9" }}>
        <div className="bg-background rounded-t-[40px] sm:rounded-t-[60px] h-[40px] sm:h-[60px]" />
      </div>

      {/* ════════ 6. PROOF ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] blob-green pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.proof.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary">{copy.proof.headline}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {copy.proof.metrics.map((metric, i) => (
              <motion.div
                key={i}
                className="p-6 sm:p-8 rounded-2xl border border-border bg-card text-center"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <span className="block text-4xl sm:text-5xl font-heading text-gradient-green mb-2">{metric.value}</span>
                <p className="text-sm text-text-primary font-heading mb-1">{metric.label}</p>
                <p className="text-xs text-text-tertiary font-body">{metric.context}</p>
              </motion.div>
            ))}
          </div>

          {copy.proof.testimonial && (
            <motion.div
              className="relative p-8 sm:p-10 rounded-2xl border border-border bg-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <blockquote className="text-lg sm:text-xl text-text-primary font-heading leading-relaxed mb-4">
                "{copy.proof.testimonial.quote}"
              </blockquote>
              <p className="text-sm text-text-secondary font-body">
                <span className="text-text-primary font-medium">{copy.proof.testimonial.author}</span> · {copy.proof.testimonial.role}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ════════ 7. WHAT THIS LOOKS LIKE FOR YOU ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute bottom-[-100px] left-[-150px] w-[350px] h-[350px] blob-blue pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.tangible.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary">{copy.tangible.headline}</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {copy.tangible.items.map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-4 items-start p-6 sm:p-8 rounded-2xl border border-border bg-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg text-text-primary font-heading mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary font-body leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 8. WHY EARWORM ════════ */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[50px] right-[-200px] w-[400px] h-[500px] blob-oblong-green pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">{copy.why_earworm.label}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary font-heading">{copy.why_earworm.headline}</h2>
          </motion.div>

          <div className="space-y-5">
            {copy.why_earworm.points.map((point, i) => (
              <motion.div
                key={i}
                className="flex gap-4 items-start p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ChevronRight className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg text-text-primary font-heading font-medium mb-1">{point.title}</h3>
                  <p className="text-sm text-text-secondary font-body leading-relaxed">{point.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 9. SOFT QUALIFICATION ════════ */}
      <section className="relative py-16 sm:py-24 px-6">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <div className="p-8 sm:p-12 rounded-2xl border border-border bg-card">
              <h3 className="text-2xl sm:text-3xl text-text-primary font-heading mb-4">{copy.qualification.headline}</h3>
              <p className="text-base text-text-secondary font-body leading-relaxed max-w-xl mx-auto">{copy.qualification.description}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ 10. CTA ════════ */}
      <Calendly />
      <Footer />
    </div>
  );
};

export default AuthorityLandingPage;
