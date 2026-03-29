import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronRight, ChevronLeft, MonitorPlay, Film, BarChart3, X, Calendar, Layers, Activity, Eye, LogIn } from "lucide-react";
import logo from "@/assets/earworm-logo.png";
import logoDark from "@/assets/earworm-logo-dark.svg";
import podplannerIcon from "@/assets/podplanner-icon.png";
import brightLogo from "@/assets/bright-logo.png";
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
    locationType: "On Location" as const,
  },
  {
    brand: "Pulsetto",
    title: "No Stress",
    description: "How Pulsetto used podcasting to drive awareness and leads through authentic wellness conversations.",
    image: caseNoStress,
    stats: { impressions: "860k", pipeline: "£1.8M" },
    locationType: "On Location" as const,
  },
  {
    brand: "Red Bull",
    title: "Beyond the Ordinary",
    description: "Storytelling at scale — turning athletes' journeys into binge-worthy audio content.",
    image: caseCfoPlaybook,
    stats: { impressions: "2.1M", pipeline: "£3.6M" },
    locationType: "Virtual" as const,
  },
];

const mobileNavLinks = [
  { label: "Our service", href: "#services" },
  { label: "Case studies", href: "#case-studies" },
  { label: "More", href: "#" },
];

type MegaMenu = "services" | "cases" | "podplanner" | null;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<MegaMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<"cases" | "services" | "more" | "podplanner" | null>(null);
  const [isLightSection, setIsLightSection] = useState(false);
  const navLight = isLightSection && !mobileOpen;

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 50);
      
      // Check if navbar is over the light section
      const lightStart = document.getElementById("light-section-start");
      const lightEnd = document.getElementById("light-section-end");
      if (lightStart && lightEnd) {
        const navBottom = 70; // approximate navbar bottom position
        const startTop = lightStart.getBoundingClientRect().top;
        const endBottom = lightEnd.getBoundingClientRect().bottom;
        setIsLightSection(startTop <= navBottom && endBottom >= navBottom);
      }
    };
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
          <div className={`${isLightSection ? "bg-white/70 border-black/10 shadow-black/5" : "bg-white/5 border-white/10 shadow-black/20"} backdrop-blur-xl border rounded-full px-3 sm:px-6 flex items-center justify-between h-14 shadow-lg transition-colors duration-300`}>
            <img src={isLightSection ? logoDark : logo} alt="Earworm" className="h-5 transition-opacity duration-300" />
            <div className="hidden sm:flex items-center gap-8">
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen("services")}
              >
                <button className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${isLightSection ? "text-gray-800 hover:text-gray-950" : "text-white/90 hover:text-white"}`}>
                  Our service
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen === "services" ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen("cases")}
              >
                <button className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${isLightSection ? "text-gray-800 hover:text-gray-950" : "text-white/90 hover:text-white"}`}>
                  Case studies
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen === "cases" ? "rotate-180" : ""}`} />
                </button>
              </div>
              <a
                href="#how-it-works"
                className={`text-sm font-semibold transition-colors duration-300 ${isLightSection ? "text-gray-800 hover:text-gray-950" : "text-white/90 hover:text-white"}`}
                onMouseEnter={() => setMegaOpen(null)}
              >
                How it works
              </a>
            </div>

            {/* Desktop right side */}
            <div className="hidden sm:flex items-center gap-4">
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen("podplanner")}
              >
                <button className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${isLightSection ? "text-gray-800 hover:text-gray-950" : "text-white/90 hover:text-white"}`}>
                  <img src={podplannerIcon} alt="" className="w-3.5 h-3.5" />
                  PodPlanner
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen === "podplanner" ? "rotate-180" : ""}`} />
                </button>
              </div>
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
                  className={`block h-[2px] w-full rounded-full transition-all duration-300 origin-center ${isLightSection ? "bg-gray-900" : "bg-foreground"} ${
                    mobileOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-full rounded-full transition-all duration-300 ${isLightSection ? "bg-gray-900" : "bg-foreground"} ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-full rounded-full transition-all duration-300 origin-center ${isLightSection ? "bg-gray-900" : "bg-foreground"} ${
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
                <div className={`${isLightSection ? 'bg-black/75' : 'bg-black/60'} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30 flex gap-6 transition-colors duration-300`}>
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
                <div className={`${isLightSection ? 'bg-black/75' : 'bg-black/60'} backdrop-blur-xl border border-white/10 rounded-2xl p-6 pb-5 shadow-xl shadow-black/30 transition-colors duration-300`}>
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
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                            {study.title}
                          </h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide border border-white/20 bg-white/[0.08] backdrop-blur-sm text-white/80 whitespace-nowrap">
                            {study.locationType}
                          </span>
                        </div>
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

          {/* PodPlanner mega menu */}
          <AnimatePresence>
            {megaOpen === "podplanner" && (
              <motion.div
                className="absolute top-full left-0 right-0 pt-2"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`${isLightSection ? 'bg-black/75' : 'bg-black/60'} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30 transition-colors duration-300`}>
                  {/* Two-column layout */}
                  <div className="flex gap-6">
                    {/* Left column — description + animated UI */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={podplannerIcon} alt="" className="w-5 h-5" />
                        <h4 className="text-lg font-heading font-semibold text-foreground">PodPlanner</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4 max-w-sm">
                        A project management system for your video podcast.<br />
                        Plan content, track episode status, and see performance in real time.
                      </p>

                      {/* Production Status UI — square, pinned to bottom */}
                      <div className="mt-auto aspect-square rounded-xl bg-white/[0.08] border border-white/15 p-3 overflow-hidden relative flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <ArrowRight className="w-3 h-3 text-white/40 rotate-180" />
                            <span className="text-[10px] font-heading font-semibold text-white/90">Production Status</span>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] text-primary font-bold">+</span>
                          </div>
                        </div>

                        {/* Task list */}
                        <div className="flex-1 flex flex-col gap-1.5">
                          {[
                            { task: "Finalize Research & Outline", done: false, highlight: true },
                            { task: "Record Interview with Jane Doe", done: false },
                            { task: "Mix & Master Final Episode", done: false },
                            { task: "Write Show Notes & Transcript", done: true },
                            { task: "Create Promotional Audiogram", done: false },
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${item.highlight ? "bg-white/[0.12] border border-white/15" : "bg-white/[0.07]"} transition-colors hover:bg-white/[0.12]`}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                            >
                              <div className={`w-3 h-3 rounded-full border-[1.5px] shrink-0 flex items-center justify-center ${item.done ? "border-primary bg-primary/20" : "border-white/25"}`}>
                                {item.done && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                              </div>
                              <span className="text-[8px] text-white/70 font-body truncate">{item.task}</span>
                              <div className="ml-auto flex items-center gap-0.5 shrink-0">
                                <div className="w-1 h-1 rounded-full bg-white/15" />
                                <div className="w-1 h-1 rounded-full bg-white/15" />
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/[0.06]">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3 h-3" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="2" />
                              <circle cx="8" cy="8" r="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="37.7" strokeDashoffset="30" strokeLinecap="round" transform="rotate(-90 8 8)" />
                            </svg>
                            <span className="text-[7px] font-semibold text-white/40 uppercase tracking-wider">Completed 1/5</span>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-primary/[0.06] pointer-events-none rounded-xl" />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-white/10 self-stretch" />

                    {/* Middle column — content schedule */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-heading font-semibold text-foreground">See your content schedule</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4 max-w-sm">
                        View upcoming episodes and read the plan behind each one.
                      </p>

                      {/* Mini schedule table — square, pinned to bottom */}
                      <div className="mt-auto aspect-square rounded-xl bg-white/[0.08] border border-white/15 overflow-hidden flex flex-col">
                        {/* Table header */}
                        <div className="grid grid-cols-[24px_1fr_1fr_60px_16px] gap-1.5 items-center px-3 py-2 border-b border-white/[0.08] text-[8px] font-semibold text-white/30 uppercase tracking-wider">
                          <span></span>
                          <span>Date</span>
                          <span>Title</span>
                          <span>Status</span>
                          <span></span>
                        </div>
                        {/* Table rows */}
                        <div className="flex-1 flex flex-col">
                          {[
                            { date: "May 11, 2027", title: "Ep 1: Bright – TBC", status: "Released", statusColor: "bg-white/10 text-white/60" },
                            { date: "May 25, 2027", title: "Ep 2: Bright – TBC", status: "In Progress", statusColor: "bg-accent/20 text-accent" },
                            { date: "Jun 8, 2027", title: "Ep 3: Bright – TBC", status: "Planned", statusColor: "bg-primary/20 text-primary" },
                            { date: "Jun 22, 2027", title: "Ep 4: Bright – TBC", status: "Planned", statusColor: "bg-primary/20 text-primary" },
                            { date: "Jul 6, 2027", title: "Ep 5: Bright – TBC", status: "Create Plan", statusColor: "bg-white/5 text-white/40 border border-white/10" },
                            { date: "Jul 20, 2027", title: "Ep 6: Bright – TBC", status: "Create Plan", statusColor: "bg-white/5 text-white/40 border border-white/10" },
                          ].map((row, i, arr) => (
                            <motion.div
                              key={i}
                              className={`flex-1 group grid grid-cols-[24px_1fr_1fr_60px_16px] gap-1.5 items-center px-3 hover:bg-white/[0.08] transition-colors cursor-pointer ${i < arr.length - 1 ? "border-b border-white/[0.08]" : ""}`}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                            >
                              <img src={brightLogo} alt="Bright" className="w-4 h-4 rounded object-cover" />
                              <span className="text-[8px] text-white/50 font-body">{row.date}</span>
                              <span className="text-[8px] text-white/80 font-body truncate">{row.title}</span>
                              <span className={`text-[7px] font-semibold px-1.5 py-0.5 rounded-full ${row.statusColor} text-center`}>{row.status}</span>
                              <ArrowRight className="w-2.5 h-2.5 text-white/20 group-hover:text-white/50 transition-colors" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-white/10 self-stretch" />

                    {/* Right column — features */}
                    <div className="flex flex-col justify-center w-72 py-2 pl-2 gap-0">
                      {[
                        {
                          icon: Layers,
                          title: "Plan with clarity",
                          desc: "Map out episodes, guests, and content in one place.",
                        },
                        {
                          icon: Activity,
                          title: "Track progress",
                          desc: "See exactly where each episode is in production.",
                        },
                        {
                          icon: Eye,
                          title: "Measure performance",
                          desc: "Understand what's working across your content.",
                        },
                      ].map((feature, i, arr) => (
                        <div
                          key={feature.title}
                          className={`flex-1 flex flex-col justify-center ${i < arr.length - 1 ? "border-b border-white/10" : ""} ${i > 0 ? "pt-4" : ""} ${i < arr.length - 1 ? "pb-4" : ""}`}
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <feature.icon className="w-5 h-5 text-white/50 shrink-0" />
                            <span className="text-base font-semibold text-foreground">{feature.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed pl-[30px]">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom divider */}
                  <div className="h-px bg-white/10 mt-5 mb-4" />

                  {/* Bottom CTAs */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-body">
                      Manage your podcast workflow from planning to publishing.
                    </p>
                    <div className="flex items-center gap-4 ml-6">
                      <a
                        href="https://app.earworm.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors whitespace-nowrap"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Log in
                      </a>
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:brightness-125 transition-all whitespace-nowrap"
                      >
                        Request a demo
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
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
                        if (link.label === "More") {
                          return (
                            <button
                              key={link.label}
                              className="flex items-center justify-between text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary text-left"
                              onClick={() => setMobileSubMenu("more")}
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
                ) : mobileSubMenu === "cases" ? (
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
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h4 className="text-sm font-heading text-foreground">{study.title}</h4>
                              <span className="inline-flex items-center px-1.5 py-px rounded-full text-[8px] font-semibold tracking-wide border border-white/20 bg-white/[0.08] backdrop-blur-sm text-white/80 whitespace-nowrap">
                                {study.locationType}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug font-body mb-2">{study.description}</p>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-foreground">{study.stats.impressions}</span>
                                <span className="text-[9px] text-muted-foreground">Impressions</span>
                              </div>
                              <div className="w-px h-5 bg-white/10" />
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-foreground">{study.stats.pipeline}</span>
                                <span className="text-[9px] text-muted-foreground">Pipeline generated</span>
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
                ) : mobileSubMenu === "more" ? (
                  <motion.div
                    key="more-submenu"
                    className="flex flex-col h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-5 mt-3">
                      <h3 className="text-lg font-heading text-foreground">More</h3>
                      <button
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileSubMenu(null)}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                      <a
                        href="#how-it-works"
                        className="text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary"
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                      >
                        How it works
                      </a>
                      <button
                        className="flex items-center justify-between text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary text-left w-full"
                        onClick={() => setMobileSubMenu("podplanner")}
                      >
                        <span className="flex items-center gap-2">
                          <img src={podplannerIcon} alt="" className="w-4 h-4" />
                          PodPlanner
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </nav>
                  </motion.div>
                ) : mobileSubMenu === "podplanner" ? (
                  <motion.div
                    key="podplanner-submenu"
                    className="flex flex-col h-full overflow-y-auto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-4 mt-3">
                      <div className="flex items-center gap-2">
                        <img src={podplannerIcon} alt="" className="w-5 h-5" />
                        <h3 className="text-lg font-heading text-foreground">PodPlanner</h3>
                      </div>
                      <button
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileSubMenu("more")}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed font-body mb-5">
                      A project management system for your video podcast. Plan content, track episode status, and see performance in real time.
                    </p>

                    {/* Features */}
                    <div className="flex flex-col gap-4 mb-6">
                      {[
                        {
                          icon: Layers,
                          title: "Plan with clarity",
                          desc: "Map out episodes, guests, and content in one place.",
                        },
                        {
                          icon: Activity,
                          title: "Track progress",
                          desc: "See exactly where each episode is in production.",
                        },
                        {
                          icon: Eye,
                          title: "Measure performance",
                          desc: "Understand what's working across your content.",
                        },
                      ].map((feature) => (
                        <div key={feature.title} className="flex items-start gap-3">
                          <feature.icon className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-sm font-semibold text-foreground block mb-0.5">{feature.title}</span>
                            <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>


                    {/* CTAs */}
                    <div className="flex flex-col gap-3 mt-auto pb-4">
                      <a
                        href="https://app.earworm.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                      >
                        <LogIn className="w-4 h-4" />
                        Log in
                      </a>
                      <a
                        href="#contact"
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-foreground py-3 rounded-xl bg-primary hover:brightness-110 transition-all"
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                      >
                        Request a demo
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                ) : null}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
