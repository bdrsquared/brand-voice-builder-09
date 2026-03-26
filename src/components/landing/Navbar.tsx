import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, MonitorPlay, Film, BarChart3 } from "lucide-react";
import logo from "@/assets/earworm-logo.png";
import launchImg from "@/assets/service-launch.png";
import runScaleImg from "@/assets/service-run-scale.png";

const megaMenuItems = [
  {
    title: "Launch",
    description: "We incubate, design, and launch podcasts that help businesses lead conversations",
    image: runScaleImg,
  },
  {
    title: "Run & scale",
    description: "We manage your podcast end-to-end, turning each episode into a consistent, measurable growth channel.",
    image: launchImg,
  },
];

const servicesList = [
  { label: "Strategy & Planning", desc: "Podcast strategy · Episode planning · Research · Guest sourcing", icon: MonitorPlay },
  { label: "Production & Creative", desc: "Video & audio production · Graphic design · Motion graphics", icon: Film },
  { label: "Distribution & Insight", desc: "Publishing & distribution · Analytics & reporting · Audience insights", icon: BarChart3 },
];

const caseStudies = [
  {
    brand: "Mastercard",
    title: "Fortune Favours the Bold",
    description: "How Mastercard used podcasting to position themselves as thought leaders in fintech.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
  },
  {
    brand: "Deloitte",
    title: "The Green Room",
    description: "A flagship podcast series driving Deloitte's sustainability narrative globally.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
  },
  {
    brand: "Red Bull",
    title: "Beyond the Ordinary",
    description: "Storytelling at scale — turning athletes' journeys into binge-worthy audio content.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=400&fit=crop",
  },
];

type MegaMenu = "services" | "cases" | null;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<MegaMenu>(null);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      className="fixed top-3 left-0 right-0 z-50 px-4 sm:px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="max-w-6xl mx-auto relative"
        onMouseLeave={() => setMegaOpen(null)}
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 flex items-center justify-between h-14 shadow-lg shadow-black/20">
          <img src={logo} alt="Earworm" className="h-5" />
          <div className="hidden sm:flex items-center gap-4">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen("services")}
            >
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                Our service
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen === "services" ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen("cases")}
            >
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                Case studies
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen === "cases" ? "rotate-180" : ""}`} />
              </button>
            </div>
            <a
              href="#how-it-works"
              className="text-sm font-semibold text-white/90 hover:text-white transition-colors"
            >
              How it works
            </a>
          </div>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold bg-gradient-green text-primary-foreground px-5 py-2.5 rounded-full transition-all hover:shadow-green"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Services mega menu */}
        <AnimatePresence>
          {megaOpen === "services" && (
            <motion.div
              className="absolute top-full left-0 right-0 pt-2"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30 flex gap-6">
                <div className="grid grid-cols-2 gap-6 flex-1">
                  {megaMenuItems.map((item) => (
                    <div key={item.title} className="group cursor-pointer">
                      <div className="aspect-square rounded-xl bg-white/5 border border-white/10 mb-3 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-body">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="w-px bg-white/10 self-stretch" />
                <div className="flex flex-col justify-between w-72 py-2 pl-2">
                  {servicesList.map((service, i) => (
                    <div key={service.label} className={`flex-1 flex flex-col justify-center ${i < servicesList.length - 1 ? "border-b border-white/10" : ""} ${i > 0 ? "pt-4" : ""} ${i < servicesList.length - 1 ? "pb-4" : ""}`}>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <service.icon className="w-5 h-5 text-white/50 shrink-0" />
                        <span className="text-sm font-semibold text-foreground">{service.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-[30px]">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Case studies mega menu */}
        <AnimatePresence>
          {megaOpen === "cases" && (
            <motion.div
              className="absolute top-full left-0 right-0 pt-2"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pb-5 shadow-xl shadow-black/30">
                <div className="grid grid-cols-3 gap-5">
                  {caseStudies.map((study) => (
                    <a key={study.brand} href="#case-studies" className="group cursor-pointer block">
                      <div className="aspect-[16/10] rounded-xl bg-white/5 border border-white/10 mb-3 overflow-hidden relative">
                        <img
                          src={study.image}
                          alt={study.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">
                        {study.brand}
                      </p>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {study.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2 font-body">
                        {study.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        View case study
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </a>
                  ))}
                </div>
                <div className="h-px bg-white/10 mt-5 mb-4" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-body">
                    We partner with global brands to create podcast-led content that builds authority and drives results.
                  </p>
                  <a
                    href="#case-studies"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:brightness-125 transition-all whitespace-nowrap ml-6"
                  >
                    See more case studies
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
