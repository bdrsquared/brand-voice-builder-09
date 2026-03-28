import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronRight, ChevronLeft, MonitorPlay, Film, BarChart3, X, Calendar } from "lucide-react";
import logo from "@/assets/earworm-logo.png";
import launchImg from "@/assets/service-launch.webp";
import runScaleImg from "@/assets/service-run-scale.webp";
import casePrettyCovered from "@/assets/case-pretty-covered.jpeg";
import caseNoStress from "@/assets/case-no-stress.jpeg";
import caseCfoPlaybook from "@/assets/case-cfo-playbook.jpeg";

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
    brand: "Polly",
    title: "Pretty Covered",
    description: "How Polly used podcasting to connect with Gen Z audiences through authentic conversations.",
    image: casePrettyCovered,
    stats: { impressions: "1.2M", pipeline: "500+" },
  },
  {
    brand: "Deloitte",
    title: "The Green Room",
    description: "A flagship podcast series driving Deloitte's sustainability narrative globally.",
    image: caseNoStress,
    stats: { impressions: "860k", pipeline: "£1.8M" },
  },
  {
    brand: "Red Bull",
    title: "Beyond the Ordinary",
    description: "Storytelling at scale — turning athletes' journeys into binge-worthy audio content.",
    image: caseCfoPlaybook,
    stats: { impressions: "2.1M", pipeline: "£3.6M" },
  },
];

const mobileNavLinks = [
  { label: "Our service", href: "#services" },
  { label: "Case studies", href: "#case-studies" },
  { label: "How it works", href: "#how-it-works" },
];

type MegaMenu = "services" | "cases" | null;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<MegaMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<"cases" | "services" | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className={`fixed ${scrolled ? "top-3" : "top-[38px]"} left-0 right-0 px-4 sm:px-6 transition-[top] duration-300 ease-in-out ${mobileOpen ? "z-[70]" : "z-50"}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="max-w-6xl mx-auto relative"
          onMouseLeave={() => setMegaOpen(null)}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-3 sm:px-6 flex items-center justify-between h-14 shadow-lg shadow-black/20">
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

            {/* Desktop right side */}
            <div className="hidden sm:flex items-center gap-4">
              <a
                href="https://app.earworm.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors"
              >
                Client portal
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-sm font-semibold bg-gradient-green text-primary-foreground px-5 py-2.5 rounded-full transition-all hover:shadow-green"
              >
                Book a call
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Mobile burger */}
            <button
              className="sm:hidden relative w-10 h-10 flex items-center justify-center"
              onClick={() => { setMobileOpen(!mobileOpen); if (mobileOpen) setMobileSubMenu(null); }}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Menu</span>
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-[2px] w-full bg-foreground rounded-full transition-all duration-300 origin-center ${
                    mobileOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-full bg-foreground rounded-full transition-all duration-300 ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-full bg-foreground rounded-full transition-all duration-300 origin-center ${
                    mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
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
                        <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed font-body">
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
                          <span className="text-base font-semibold text-foreground">{service.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-[30px]">{service.desc}</p>
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
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                          {study.brand}
                        </p>
                        <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {study.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2 font-body">
                          {study.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          View case study
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </a>
                    ))}
                  </div>
                  <div className="h-px bg-white/10 mt-5 mb-4" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-body">
                      We partner with global brands to create podcast-led content that builds authority and drives results.
                    </p>
                    <a
                      href="#case-studies"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:brightness-125 transition-all whitespace-nowrap ml-6"
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

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full px-6 pt-24 pb-12 overflow-hidden">
              <AnimatePresence mode="wait">
                {mobileSubMenu === null ? (
                  <motion.div
                    key="main-menu"
                    className="flex flex-col h-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <nav className="flex flex-col gap-2">
                      {mobileNavLinks.map((link, i) => {
                        if (link.label === "Case studies") {
                          return (
                            <button
                              key={link.label}
                              className="flex items-center justify-between text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary text-left"
                              onClick={() => setMobileSubMenu("cases")}
                            >
                              {link.label}
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                          );
                        }
                        if (link.label === "Our service") {
                          return (
                            <button
                              key={link.label}
                              className="flex items-center justify-between text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary text-left"
                              onClick={() => setMobileSubMenu("services")}
                            >
                              {link.label}
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                          );
                        }
                        return (
                          <motion.a
                            key={link.label}
                            href={link.href}
                            className="text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary"
                            onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                          >
                            {link.label}
                          </motion.a>
                        );
                      })}
                    </nav>

                    <div className="mt-auto flex flex-col gap-6">
                      {/* Featured case study card */}
                      <motion.a
                        href="#case-studies"
                        className="block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.3 }}
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                      >
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={casePrettyCovered} alt="Pretty Covered" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">Featured case study</p>
                          <h4 className="text-base font-heading text-foreground mb-1.5">Pretty Covered</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3 font-body">
                            How Polly used podcasting to connect with Gen Z audiences through authentic conversations.
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">124k</span>
                              <span className="text-[10px] text-muted-foreground">Listeners</span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">500+</span>
                              <span className="text-[10px] text-muted-foreground">Leads generated</span>
                            </div>
                          </div>
                        </div>
                      </motion.a>

                      <motion.a
                        href="#contact"
                        className="glow-on-hover group inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full text-base w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                      >
                        Book a strategy call
                        <Calendar className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </motion.div>
                ) : mobileSubMenu === "services" ? (
                  <motion.div
                    key="services-submenu"
                    className="flex flex-col h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-5 mt-3">
                      <h3 className="text-lg font-heading text-foreground">Our service</h3>
                      <button
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileSubMenu(null)}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto flex-1 pb-4">
                      {/* Service packages */}
                      {megaMenuItems.map((item) => (
                        <a
                          key={item.title}
                          href="#services"
                          className="block rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shrink-0"
                          onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                        >
                          <div className="aspect-video overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <h4 className="text-sm font-heading text-foreground mb-0.5">{item.title}</h4>
                            <p className="text-[11px] text-muted-foreground leading-snug font-body">{item.description}</p>
                          </div>
                        </a>
                      ))}

                      {/* Services list */}
                      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3">
                        {servicesList.map((service, i) => (
                          <div key={service.label} className={`flex flex-col py-3 ${i < servicesList.length - 1 ? "border-b border-white/10" : ""}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <service.icon className="w-4 h-4 text-white/50 shrink-0" />
                              <span className="text-sm font-semibold text-foreground">{service.label}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug pl-6">{service.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cases-submenu"
                    className="flex flex-col h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-5 mt-3">
                      <h3 className="text-lg font-heading text-foreground">Case studies</h3>
                      <button
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileSubMenu(null)}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto flex-1 pb-4">
                      {caseStudies.map((study) => (
                        <a
                          key={study.brand}
                          href="#case-studies"
                          className="block rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shrink-0"
                          onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                        >
                          <div className="aspect-video overflow-hidden">
                            <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-0.5">{study.brand}</p>
                            <h4 className="text-sm font-heading text-foreground mb-0.5">{study.title}</h4>
                            <p className="text-[11px] text-muted-foreground leading-snug font-body mb-2">{study.description}</p>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-foreground">{study.stats.impressions}</span>
                                <span className="text-[9px] text-muted-foreground">Impressions</span>
                              </div>
                              <div className="w-px h-5 bg-white/10" />
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-foreground">{study.stats.pipeline}</span>
                                <span className="text-[9px] text-muted-foreground">Leads generated</span>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                              See case study <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
