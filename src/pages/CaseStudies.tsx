import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Footer from "@/components/landing/Footer";
import DotsBackground from "@/components/landing/DotsBackground";

import caseCarrier from "@/assets/case-carrier.webp";
import casePrettyCovered from "@/assets/case-pretty-covered.webp";
import caseWenodo from "@/assets/case-wenodo.webp";
import casePulsetto from "@/assets/case-pulsetto.webp";
import caseCfoPlaybook from "@/assets/case-cfo-playbook.webp";
import caseUkUsTax from "@/assets/case-uk-us-tax.webp";
import logoPolly from "@/assets/logos/polly.webp";
import logoWenodo from "@/assets/logos/wenodo.webp";
import logoPulsetto from "@/assets/logos/pulsetto.webp";
import logoSoldo from "@/assets/logos/soldo.webp";
import logoCollyerBristow from "@/assets/logos/collyer-bristow.webp";
import logoFntv from "@/assets/logos/fntv.webp";

const caseStudies = [
  {
    title: "Pretty Covered",
    logo: "Polly",
    logoImage: logoPolly,
    description: "How Polly used podcasting to make life insurance feel human and accessible, generating 485 leads in week one.",
    stats: "158K+ impressions · 485 leads",
    image: casePrettyCovered,
    slug: "pretty-covered",
  },
  {
    title: "The CFO Playbook",
    logo: "soldo",
    logoImage: logoSoldo,
    description: "How Soldo turned podcasting into a £2M qualified pipeline and positioned as a thought leader with CFOs.",
    stats: "750K+ downloads · 20X ROI",
    image: caseCfoPlaybook,
    slug: "the-cfo-playbook",
  },
  {
    title: "The Art of Investing",
    logo: "IG",
    logoImage: null,
    description: "How IG cut through market noise with a weekly podcast that generated 103K+ downloads and 82% consumption.",
    stats: "103K+ downloads · 82% retention",
    image: caseUkUsTax,
    slug: "the-art-of-investing",
  },
  {
    title: "No Stress",
    logo: "PULSETTO",
    logoImage: logoPulsetto,
    description: "How Pulsetto reframed their brand from a wellness gadget to a stress resilience platform for high performers.",
    stats: "370K+ views · 66% consumption",
    image: casePulsetto,
    slug: "no-stress",
  },
  {
    title: "Carrier 2.0",
    logo: "FIERCE FNTV",
    logoImage: logoFntv,
    description: "A video podcast helping Carrier leaders navigate the future of logistics and supply chain innovation.",
    stats: "Coming soon",
    image: caseCarrier,
    slug: null as string | null,
  },
  {
    title: "Dig In",
    logo: "wenodo",
    logoImage: logoWenodo,
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
        className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
      >
        {study.image && (
          <img
            src={study.image}
            alt={study.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Gradient overlay — lifts on hover to reveal image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:from-black/90 group-hover:via-black/30 group-hover:to-transparent transition-all duration-500" />

        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-white/[0.15] transition-colors duration-500" />

        {/* Stats pill — top right */}
        {study.stats && study.stats !== "Coming soon" && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-[10px] text-white/70 font-body tracking-wide group-hover:border-white/20 group-hover:bg-black/60 transition-all duration-300">
              {study.stats.split("·")[0].trim()}
            </div>
          </div>
        )}

        {/* Content — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          {/* Client name */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-body mb-2 group-hover:text-white/60 transition-colors duration-300">
            {study.logo}
          </p>

          <h3 className="text-xl sm:text-2xl text-white mb-2 font-heading leading-tight">
            {study.title}
          </h3>

          {/* Description — revealed on hover */}
          <p className="text-white/50 text-sm leading-relaxed font-body line-clamp-2 mb-4 group-hover:text-white/70 transition-colors duration-300">
            {study.description}
          </p>

          {/* Bottom bar */}
          <div className="flex items-center justify-between">
            {study.stats && study.stats !== "Coming soon" ? (
              <div className="flex items-center gap-2">
                {study.stats.split("·").slice(1).map((stat, i) => (
                  <span key={i} className="text-[10px] text-accent/80 font-semibold font-body">
                    {stat.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-white/30 font-body italic">Coming soon</span>
            )}
            <div className="w-9 h-9 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:scale-110">
              <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors duration-300" />
            </div>
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
};

const CaseStudiesPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 px-6 overflow-hidden">
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
