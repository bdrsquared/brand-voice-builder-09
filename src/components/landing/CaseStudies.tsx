import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
    title: "Carrier 2.0",
    logo: "FIERCE FNTV",
    logoImage: logoFntv,
    description: "A video podcast helping Carrier leaders navigate the future of logistics and supply chain innovation.",
    gradient: "from-rose-500/30 to-orange-400/20",
    image: caseCarrier,
    slug: null as string | null,
  },
  {
    title: "Pretty Covered",
    logo: "Polly",
    logoImage: logoPolly,
    description: "A beauty and insurance brand podcast connecting with Gen Z audiences through authentic conversations.",
    gradient: "from-sky-400/30 to-blue-300/20",
    image: casePrettyCovered,
    slug: "pretty-covered",
  },
  {
    title: "Dig In",
    logo: "wenodo",
    logoImage: logoWenodo,
    description: "A deep-dive podcast exploring the world of food tech and sustainable agriculture ventures.",
    gradient: "from-amber-700/30 to-yellow-600/20",
    image: caseWenodo,
    slug: null as string | null,
  },
  {
    title: "No Stress",
    logo: "PULSETTO",
    logoImage: logoPulsetto,
    description: "A wellness-focused podcast helping busy professionals manage stress through science-backed techniques.",
    gradient: "from-emerald-500/30 to-green-400/20",
    image: casePulsetto,
    slug: null as string | null,
  },
  {
    title: "The CFO Playbook",
    logo: "soldo",
    logoImage: logoSoldo,
    description: "A finance podcast giving CFOs and finance leaders actionable strategies for modern business growth.",
    gradient: "from-slate-400/30 to-gray-300/20",
    image: caseCfoPlaybook,
    slug: null as string | null,
  },
  {
    title: "UK/US Tax Talk",
    logo: "COLLYER BRISTOW",
    logoImage: logoCollyerBristow,
    description: "A cross-border tax podcast simplifying complex UK and US tax regulations for international businesses.",
    gradient: "from-indigo-500/30 to-purple-400/20",
    image: caseUkUsTax,
    slug: null as string | null,
  },
];

const CaseStudyCard = ({ study, index }: { study: typeof caseStudies[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);

  const Wrapper = study.slug ? Link : "div";
  const wrapperProps = study.slug ? { to: `/case-study/${study.slug}` } : {};

  return (
    <Wrapper {...wrapperProps as any}>
      <motion.div
        className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {study.image ? (
          <img src={study.image} alt={study.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} bg-card`} />
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-70"
          }`}
        />

        <div className="absolute top-4 right-4 z-10">
          <div className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 ${hovered ? "bg-primary/80 border-primary/40 scale-110" : ""}`}>
            <Play className={`w-4 h-4 transition-colors duration-300 ${hovered ? "text-primary-foreground fill-primary-foreground" : "text-white fill-white"}`} />
          </div>
        </div>

        <div className="absolute top-5 left-5 z-10">
          {study.logoImage ? (
            <img src={study.logoImage} alt={study.logo} className="h-8 w-auto brightness-0 invert opacity-80" />
          ) : (
            <span className="text-white/70 text-xs tracking-wider uppercase font-heading">
              {study.logo}
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h3 className="text-lg sm:text-xl text-white mb-2 font-heading">
            {study.title}
          </h3>
          <div className="flex items-end justify-between gap-3">
            <p className="text-white/60 text-xs leading-relaxed font-body line-clamp-3">
              {study.description}
            </p>
            <div className={`w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 transition-all duration-300 ${hovered ? "bg-primary/80 border-primary/40" : ""}`}>
              <ArrowUpRight className={`w-4 h-4 transition-colors duration-300 ${hovered ? "text-primary-foreground" : "text-white/70"}`} />
            </div>
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
};

const CaseStudies = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute top-[-100px] left-[-150px] w-[400px] h-[400px] blob-blue pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-120px] w-[350px] h-[450px] blob-oblong-green pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="flex items-start sm:items-center justify-between mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
            Case studies
          </h2>
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-text-secondary bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 hover:bg-white/10 hover:text-text-primary transition-colors"
          >
            View All Work
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.p
          className="text-text-secondary font-body mb-12 text-base"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          We've launched hundreds of shows and measured the impact
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={study.title} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
