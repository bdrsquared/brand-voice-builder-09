import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Footer from "@/components/landing/Footer";
import DotsBackground from "@/components/landing/DotsBackground";
import useMetaTags from "@/hooks/useMetaTags";

import caseCarrier from "@/assets/case-carrier.webp";
import casePrettyCovered from "@/assets/case-pretty-covered.webp";
import caseWenodo from "@/assets/case-wenodo.webp";
import casePulsetto from "@/assets/case-pulsetto.webp";
import caseCfoPlaybook from "@/assets/case-cfo-playbook.webp";
import caseUkUsTax from "@/assets/case-ig-hero.webp";

const caseStudies = [
  {
    title: "Pretty Covered",
    logo: "Polly",
    description: "How Polly used podcasting to make life insurance feel human and accessible, generating 485 leads in week one.",
    stats: "158K+ impressions · 485 leads",
    image: casePrettyCovered,
    slug: "pretty-covered",
  },
  {
    title: "The CFO Playbook",
    logo: "Soldo",
    description: "How Soldo turned podcasting into a £2M qualified pipeline and positioned as a thought leader with CFOs.",
    stats: "750K+ downloads · 20X ROI",
    image: caseCfoPlaybook,
    slug: "the-cfo-playbook",
  },
  {
    title: "The Art of Investing",
    logo: "IG",
    description: "How IG cut through market noise with a weekly podcast that generated 103K+ downloads and 82% consumption.",
    stats: "Strong growth · High retention",
    image: caseUkUsTax,
    slug: "the-art-of-investing",
  },
  {
    title: "No Stress",
    logo: "Pulsetto",
    description: "How Pulsetto reframed their brand from a wellness gadget to a stress resilience platform for high performers.",
    stats: "370K+ views · 66% consumption",
    image: casePulsetto,
    slug: "no-stress",
  },
  {
    title: "Carrier 2.0",
    logo: "Fierce FNTV",
    description: "A video podcast helping Carrier leaders navigate the future of logistics and supply chain innovation.",
    stats: "Coming soon",
    image: caseCarrier,
    slug: null as string | null,
  },
  {
    title: "Dig In",
    logo: "Wenodo",
    description: "A deep-dive podcast exploring the world of food tech and sustainable agriculture ventures.",
    stats: "Coming soon",
    image: caseWenodo,
    slug: null as string | null,
  },
];

const CaseStudyCard = ({ study, index }: { study: typeof caseStudies[0]; index: number }) => {
  const Wrapper = study.slug ? Link : "div";
  const wrapperProps = study.slug ? { to: `/case-study/${study.slug}` } : {};

  return (
    <Wrapper {...wrapperProps as any}>
      <motion.div
        className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden cursor-pointer hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
      >
        <div className="aspect-[4/3] overflow-hidden">
          {study.image && (
            <img
              src={study.image}
              alt={study.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">{study.logo}</p>
          <h3 className="text-base font-heading text-foreground mb-1">{study.title}</h3>
          <p className="text-xs text-muted-foreground leading-snug font-body mb-3 line-clamp-2">{study.description}</p>

          {study.stats && study.stats !== "Coming soon" ? (
            <div className="flex items-center gap-3 mb-3">
              {study.stats.split("·").map((stat, i, arr) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">{stat.trim().split(" ").slice(0, -1).join(" ") || stat.trim()}</span>
                    <span className="text-[9px] text-muted-foreground">{stat.trim().split(" ").pop()}</span>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-5 bg-white/10" />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground italic mb-3">Coming soon</p>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:brightness-125 transition-all">
            {study.slug ? "See case study" : "Coming soon"} <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </Wrapper>
  );
};

const CaseStudiesPage = () => {
  useMetaTags();
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 px-6">
        <DotsBackground />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-text-primary mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            The work that{" "}
            <span className="text-gradient-green italic">speaks for itself</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-body leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Real brands. Real results. See how we've helped companies turn podcasting into a growth channel.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="relative px-6 pb-20 sm:pb-28">
        <div className="absolute top-[20%] right-[-200px] w-[600px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsla(145,96%,55%,0.10) 0%, hsla(243,79%,63%,0.08) 50%, transparent 80%)", filter: "blur(140px)" }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.map((study, i) => (
              <CaseStudyCard key={study.title} study={study} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
