import { useState, useEffect, useCallback, useRef } from "react";
import DemoRequestModal from "@/components/DemoRequestModal";
import ContactModal from "@/components/ContactModal";
import PlayPackModal from "@/components/PlayPackModal";
import PlaybookGateModal from "@/components/PlaybookGateModal";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronRight, ChevronLeft, MonitorPlay, Film, BarChart3, X, MessageCircle, Calendar, Layers, Activity, Eye, LogIn, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getThumbnailUrl } from "@/lib/image-utils";
import logo from "@/assets/earworm-logo.webp";
import logoDark from "@/assets/earworm-logo-dark.svg";
import podplannerIcon from "@/assets/podplanner-icon.webp";
import playbookCover from "@/assets/content-playbook-cover.jpg";
import brightLogo from "@/assets/bright-logo-compressed.webp";
import launchImg from "@/assets/launch-microphone-compressed.webp";
import runScaleImg from "@/assets/run-scale-compressed.webp";
import officeImg from "@/assets/office-compressed.webp";
import casePrettyCovered from "@/assets/case-pretty-covered.jpeg";
import caseNoStress from "@/assets/case-no-stress-thumb.webp";
import caseCfoPlaybook from "@/assets/case-cfo-playbook-thumb.webp";
import caseIgFirefly from "@/assets/case-ig-firefly-thumb.webp";

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
    brand: "Pulsetto",
    title: "No Stress",
    description: "How Pulsetto used podcasting to reframe their brand from a device company to a wellness authority.",
    image: caseNoStress,
    stats: { impressions: "370K+", pipeline: "67K+" },
    locationType: "On Location" as const,
    slug: "no-stress",
  },
  {
    brand: "IG",
    title: "The Art of Investing",
    description: "How IG used podcasting to make complex financial topics accessible and engaging for a broad audience.",
    image: caseIgFirefly,
    stats: { impressions: "103K", pipeline: "2K+" },
    locationType: "On Location" as const,
    slug: "the-art-of-investing",
  },
  {
    brand: "Soldo",
    title: "The CFO Playbook",
    description: "How Soldo used podcasting to position as a thought leader with CFOs and turn content into qualified pipeline.",
    image: caseCfoPlaybook,
    stats: { impressions: "750K+", pipeline: "£2M" },
    locationType: "Virtual" as const,
    slug: "the-cfo-playbook",
  },
];

const mobileNavLinks = [
  { label: "Our service", href: "#services" },
  { label: "Case studies", href: "/case-studies" },
  { label: "More", href: "#" },
];

type MegaMenu = "services" | "cases" | "podplanner" | "more" | null;

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<MegaMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<"cases" | "services" | "more" | "podplanner" | null>(null);
  const [isLightSection, setIsLightSection] = useState(false);
  const [isBottomLight, setIsBottomLight] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [playPackModalOpen, setPlayPackModalOpen] = useState(false);
  const [playbookGateOpen, setPlaybookGateOpen] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [bottomBarTop, setBottomBarTop] = useState<number | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Array<{ title: string; excerpt: string | null; created_at: string; slug: string; cover_image: string | null }>>([]);
  const lastScrollY = useRef(0);
  const navLight = isLightSection && !mobileOpen;

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("title, excerpt, created_at, slug, cover_image")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setRecentBlogs(data); });
  }, []);

  useEffect(() => {
    const handler = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setScrollingDown(currentY > 100 && currentY > lastScrollY.current);
      lastScrollY.current = currentY;
      // Check if navbar is over the light section
      const lightStart = document.getElementById("light-section-start");
      const lightEnd = document.getElementById("light-section-end");
      if (lightStart && lightEnd) {
        const navBottom = 70;
        const startTop = lightStart.getBoundingClientRect().top;
        const endBottom = lightEnd.getBoundingClientRect().bottom;
        setIsLightSection(startTop <= navBottom && endBottom >= navBottom);
        // Check bottom bar position against light section
        const windowH = window.innerHeight;
        setIsBottomLight(startTop <= windowH && endBottom >= windowH - 60);
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Track visual viewport for Chrome mobile (browser bar hide/show)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      // Position from top: visualViewport bottom minus button height (~50px)
      setBottomBarTop(vv.offsetTop + vv.height - 60);
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className={`fixed ${scrolled ? "top-3" : "top-[38px]"} left-0 right-0 px-4 sm:px-6 transition-[top,transform] duration-300 ease-in-out ${mobileOpen ? "z-[70]" : "z-50"} ${scrollingDown && !mobileOpen ? "max-sm:-translate-y-[120%]" : "translate-y-0"}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="max-w-6xl mx-auto relative"
          onMouseLeave={() => setMegaOpen(null)}
        >
          <div className={`${navLight ? "bg-white/70 border-black/10 shadow-black/5" : "bg-white/5 border-white/10 shadow-black/20"} backdrop-blur-xl border rounded-full px-3 sm:px-6 flex items-center justify-between h-14 shadow-lg transition-colors duration-300`}>
            <img src={navLight ? logoDark : logo} alt="Earworm" className="h-5 transition-opacity duration-300 cursor-pointer" onClick={() => navigate("/")} />
            <div className="hidden sm:flex items-center gap-8">
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen("services")}
              >
                <button className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${navLight ? "text-gray-800 hover:text-gray-950" : "text-white/90 hover:text-white"}`}>
                  Our service
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen === "services" ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen("cases")}
              >
                <button className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${navLight ? "text-gray-800 hover:text-gray-950" : "text-white/90 hover:text-white"}`}>
                  Case studies
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen === "cases" ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen("more")}
              >
                <button className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${navLight ? "text-gray-800 hover:text-gray-950" : "text-white/90 hover:text-white"}`}>
                  More +
                </button>
              </div>
            </div>

            {/* Desktop right side */}
            <div className="hidden sm:flex items-center gap-4">
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen("podplanner")}
              >
                <button className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${navLight ? "text-gray-800 hover:text-gray-950" : "text-white/90 hover:text-white"}`}>
                  <img src={podplannerIcon} alt="" className="w-3.5 h-3.5" />
                  PodPlanner
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen === "podplanner" ? "rotate-180" : ""}`} />
                </button>
              </div>
              <button
                onClick={() => setContactModalOpen(true)}
                className={`group relative inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all backdrop-blur-xl overflow-hidden cursor-pointer ${
                  navLight
                    ? "text-gray-900 bg-black/[0.08] border border-black/[0.15] hover:bg-black/[0.12]"
                    : "text-white bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12]"
                }`}
              >
                <span className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent ${navLight ? "via-black/10" : "via-white/20"} to-transparent pointer-events-none`} />
                <span className="relative z-10">Let's talk</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform group-hover:translate-x-0.5" />
              </button>
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
                  className={`block h-[2px] w-full rounded-full transition-all duration-300 origin-center ${navLight ? "bg-gray-900" : "bg-foreground"} ${
                    mobileOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-full rounded-full transition-all duration-300 ${navLight ? "bg-gray-900" : "bg-foreground"} ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-full rounded-full transition-all duration-300 origin-center ${navLight ? "bg-gray-900" : "bg-foreground"} ${
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
                <div className={`${navLight ? 'bg-black/75' : 'bg-black/60'} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30 flex gap-6 transition-colors duration-300`}>
                  <div className="grid grid-cols-2 gap-6 flex-1">
                    {megaMenuItems.map((item) => (
                      <div key={item.title} className="group cursor-pointer">
                        <div className="aspect-square rounded-xl bg-white/5 border border-white/10 mb-3 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                    {servicesList.map((service, i) => {
                      const gradients = [
                        "radial-gradient(ellipse at 10% 80%, hsla(145,80%,55%,0.06) 0%, transparent 55%), radial-gradient(ellipse at 90% 20%, hsla(243,70%,60%,0.04) 0%, transparent 50%)",
                        "radial-gradient(ellipse at 80% 90%, hsla(243,70%,60%,0.06) 0%, transparent 55%), radial-gradient(ellipse at 20% 10%, hsla(35,90%,55%,0.04) 0%, transparent 50%)",
                        "radial-gradient(ellipse at 15% 20%, hsla(35,90%,55%,0.05) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, hsla(145,80%,55%,0.05) 0%, transparent 55%)",
                      ];
                      return (
                        <div
                          key={service.label}
                          className={`group/svc relative flex-1 flex flex-col justify-center rounded-xl px-3 py-3 my-1.5 -mx-3 overflow-hidden transition-all duration-500 hover:bg-white/[0.04] ${i < servicesList.length - 1 ? "border-b border-white/10" : ""}`}
                          style={{ backgroundImage: gradients[i] }}
                        >
                          {/* Shimmer glow on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover/svc:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover/svc:translate-x-full transition-transform duration-1000 ease-in-out" />
                          </div>
                          <div className="absolute inset-0 rounded-xl border border-white/0 group-hover/svc:border-white/[0.08] transition-colors duration-500 pointer-events-none" />
                          <div className="relative z-10">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <service.icon className="w-5 h-5 text-white/50 shrink-0 group-hover/svc:text-primary/70 transition-colors duration-300" />
                              <span className="text-base font-semibold text-foreground">{service.label}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-[30px]">{service.desc}</p>
                          </div>
                        </div>
                      );
                    })}
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
                <div className={`${navLight ? 'bg-black/75' : 'bg-black/60'} backdrop-blur-xl border border-white/10 rounded-2xl p-6 pb-5 shadow-xl shadow-black/30 transition-colors duration-300`}>
                  <div className="grid grid-cols-3 gap-5">
                    {caseStudies.map((study) => (
                      <a key={study.brand} href={study.slug ? `/case-study/${study.slug}` : "#case-studies"} className="group cursor-pointer block" onClick={() => setMegaOpen(null)}>
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
                    <Link
                      to="/case-studies"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:brightness-125 transition-all whitespace-nowrap ml-6"
                    >
                      See more case studies
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
                <div className={`${navLight ? 'bg-black/75' : 'bg-black/60'} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30 transition-colors duration-300`}>
                  {/* Two-column layout */}
                  <div className="flex gap-6">
                    {/* Left column  -  description + animated UI */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={podplannerIcon} alt="" className="w-5 h-5" />
                        <h4 className="text-lg font-heading font-semibold text-foreground">PodPlanner</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4 max-w-sm">
                        We've built a tool for planning and running a video podcast strategy.<br /><br />
                        One dashboard to organise, track, and collaborate.
                      </p>

                      {/* Production Status UI  -  square, pinned to bottom (decorative only) */}
                      <div className="mt-auto aspect-square rounded-xl bg-white/[0.08] border border-white/15 p-3 overflow-hidden relative flex flex-col pointer-events-none select-none">
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
                              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${item.highlight ? "bg-white/[0.12] border border-white/15" : "bg-white/[0.07]"}`}
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

                    {/* Middle column  -  content schedule */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-heading font-semibold text-foreground">See your content schedule</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4 max-w-sm">
                        View upcoming episodes and read the plan behind each one.
                      </p>

                      {/* Mini schedule table  -  square, pinned to bottom (decorative only) */}
                      <div className="mt-auto aspect-square rounded-xl bg-white/[0.08] border border-white/15 overflow-hidden flex flex-col pointer-events-none select-none">
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
                              className={`flex-1 grid grid-cols-[24px_1fr_1fr_60px_16px] gap-1.5 items-center px-3 ${i < arr.length - 1 ? "border-b border-white/[0.08]" : ""}`}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                            >
                              <img src={brightLogo} alt="Bright" className="w-4 h-4 rounded object-cover" />
                              <span className="text-[8px] text-white/50 font-body">{row.date}</span>
                              <span className="text-[8px] text-white/80 font-body truncate">{row.title}</span>
                              <span className={`text-[7px] font-semibold px-1.5 py-0.5 rounded-full ${row.statusColor} text-center`}>{row.status}</span>
                              <ArrowRight className="w-2.5 h-2.5 text-white/20" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-white/10 self-stretch" />

                    {/* Right column  -  features */}
                    <div className="flex flex-col justify-center w-72 py-2 pl-2 gap-0">
                      {[
                        { icon: Layers, title: "Plan with clarity", desc: "Map out episodes, guests, and content in one place." },
                        { icon: Activity, title: "Track progress", desc: "See exactly where each episode is in production." },
                        { icon: Eye, title: "Measure performance", desc: "Understand what's working across your content." },
                      ].map((feature, i, arr) => {
                        const gradients = [
                          "radial-gradient(ellipse at 10% 80%, hsla(145,80%,55%,0.06) 0%, transparent 55%), radial-gradient(ellipse at 90% 20%, hsla(243,70%,60%,0.04) 0%, transparent 50%)",
                          "radial-gradient(ellipse at 80% 90%, hsla(243,70%,60%,0.06) 0%, transparent 55%), radial-gradient(ellipse at 20% 10%, hsla(35,90%,55%,0.04) 0%, transparent 50%)",
                          "radial-gradient(ellipse at 15% 20%, hsla(35,90%,55%,0.05) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, hsla(145,80%,55%,0.05) 0%, transparent 55%)",
                        ];
                        return (
                          <div
                            key={feature.title}
                            className={`group/svc relative flex-1 flex flex-col justify-center rounded-xl px-3 py-3 my-1.5 -mx-3 overflow-hidden transition-all duration-500 hover:bg-white/[0.04] ${i < arr.length - 1 ? "border-b border-white/10" : ""}`}
                            style={{ backgroundImage: gradients[i] }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover/svc:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover/svc:translate-x-full transition-transform duration-1000 ease-in-out" />
                            </div>
                            <div className="absolute inset-0 rounded-xl border border-white/0 group-hover/svc:border-white/[0.08] transition-colors duration-500 pointer-events-none" />
                            <div className="relative z-10">
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <feature.icon className="w-5 h-5 text-white/50 shrink-0 group-hover/svc:text-primary/70 transition-colors duration-300" />
                                <span className="text-base font-semibold text-foreground">{feature.title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed pl-[30px]">{feature.desc}</p>
                            </div>
                          </div>
                        );
                      })}
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
                      <button
                        onClick={() => setDemoModalOpen(true)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:brightness-125 transition-all whitespace-nowrap"
                      >
                        Request a demo
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* More dropdown */}
          <AnimatePresence>
          {megaOpen === "more" && (
              <motion.div
                className="absolute top-full left-0 right-0 pt-2"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`${navLight ? 'bg-black/75' : 'bg-black/60'} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30 transition-colors duration-300`}>
                  <div className="flex gap-6">
                    {/* First column — Content Playbook */}
                    <div className="w-64 shrink-0">
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 px-3">Content Playbook</h4>
                      <div className="px-3">
                        {/* UI card instead of image */}
                        <div className="relative w-full aspect-[4/3] rounded-lg border border-white/10 mb-4 overflow-hidden bg-card">
                          {/* Grid background */}
                          <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,0.04) 19px,rgba(255,255,255,0.04) 20px), repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,0.04) 19px,rgba(255,255,255,0.04) 20px)" }} />
                          {/* Gradient blob */}
                          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#40ABB2]/30 via-[#6359EA]/20 to-[#E040FB]/20 blur-2xl" />
                          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary/10 blur-xl" />
                          {/* Text content */}
                          <div className="relative z-10 flex flex-col justify-end h-full p-4">
                            <span className="text-[9px] font-body uppercase tracking-[0.15em] text-white/40 mb-1">Earworm Report</span>
                            <span className="text-sm font-heading font-bold text-white leading-tight">Content<br />Playbook</span>
                            <span className="text-lg font-heading font-bold bg-gradient-to-r from-[#40ABB2] via-[#6359EA] to-[#E040FB] bg-clip-text text-transparent leading-tight">2026 / 2027</span>
                          </div>
                        </div>
                        <h5 className="text-sm font-heading font-bold text-white mb-2">The Content Playbook for 2026 / 2027</h5>
                        <p className="text-xs text-white/50 font-body leading-relaxed mb-4">Content is changing fast. Our latest report breaks down the trends, data, and strategies shaping B2B content in 2026 — so you can stay ahead.</p>
                        <button
                          onClick={() => { setMegaOpen(null); setPlaybookGateOpen(true); }}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:brightness-125 transition-all cursor-pointer"
                        >
                          Read the report
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-white/10 self-stretch" />

                    {/* Middle column — Recent blogs */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-4 h-4 text-white/50" />
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider">The stuff that's happening</h4>
                      </div>
                      <p className="text-xs text-white/40 mb-3 -mt-2">News from across the industry</p>
                      <div className="flex flex-col gap-1">
                        {recentBlogs.map((blog) => (
                          <a
                            key={blog.slug}
                            href={`/blog/${blog.slug}`}
                            onClick={(e) => { e.preventDefault(); navigate(`/blog/${blog.slug}`); setMegaOpen(null); }}
                            className="group/blog flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-all"
                          >
                            {blog.cover_image ? (
                              <img src={getThumbnailUrl(blog.cover_image, 80, 50) || blog.cover_image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-white/[0.08] border border-white/10 shrink-0 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white/30" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-white/90 group-hover/blog:text-white transition-colors line-clamp-1">{blog.title}</span>
                                <span className="text-[11px] text-white/30 whitespace-nowrap shrink-0">
                                  {new Date(blog.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                </span>
                              </div>
                              {blog.excerpt && (
                                <p className="text-xs text-white/40 line-clamp-1 font-body">{blog.excerpt}</p>
                              )}
                            </div>
                          </a>
                        ))}
                        {recentBlogs.length === 0 && (
                          <p className="text-xs text-white/30 px-3 py-2">No posts yet.</p>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/[0.08]">
                        <a
                          href="/blogs"
                          onClick={(e) => { e.preventDefault(); navigate("/blogs"); setMegaOpen(null); }}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:brightness-125 transition-all px-3"
                        >
                          View all posts
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-white/10 self-stretch" />

                    {/* Right column — Navigation links */}
                    <div className="w-56 shrink-0">
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 px-3">Explore</h4>
                      <div className="flex flex-col gap-1">
                        <a
                          href="/#how-it-works"
                          onClick={() => { setMegaOpen(null); navigate("/#how-it-works"); }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/90 hover:text-white hover:bg-white/[0.06] transition-all"
                        >
                          <Layers className="w-4 h-4 text-white/50" />
                          How we work
                        </a>
                        <button
                          onClick={() => { navigate("/our-story"); setMegaOpen(null); }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/90 hover:text-white hover:bg-white/[0.06] transition-all text-left"
                        >
                          <Activity className="w-4 h-4 text-white/50" />
                          Our story
                        </button>
                        <button
                          onClick={() => { navigate("/blogs"); setMegaOpen(null); }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/90 hover:text-white hover:bg-white/[0.06] transition-all text-left"
                        >
                          <Eye className="w-4 h-4 text-white/50" />
                          Blog
                        </button>
                      </div>
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
                          <motion.button
                            key={link.label}
                            className="text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary text-left"
                            onClick={() => {
                              if (link.href.startsWith("/")) {
                                navigate(link.href);
                              } else {
                                window.location.href = link.href;
                              }
                              setMobileOpen(false);
                              setMobileSubMenu(null);
                            }}
                          >
                            {link.label}
                          </motion.button>
                        );
                      })}
                    </nav>

                    <div className="mt-auto flex flex-col gap-6">
                      {/* Office card */}
                      <motion.div
                        className="block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden cursor-pointer"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.25 }}
                        onClick={() => { navigate("/our-story"); setMobileOpen(false); setMobileSubMenu(null); }}
                      >
                        <div className="aspect-video overflow-hidden">
                          <img src={officeImg} alt="Earworm studio" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h4 className="text-base font-heading text-foreground mb-1.5">It starts in our studio</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed font-body mb-2">A team that lives and breathes content and marketing. We bring that energy into every project we run.</p>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            → Read our story
                          </span>
                        </div>
                      </motion.div>

                      <motion.a
                        href="#contact"
                        className="glow-on-hover group inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full text-base w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                      >
                        Start a conversation
                        <MessageCircle className="w-4 h-4" />
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
                          href={study.slug ? `/case-study/${study.slug}` : "#case-studies"}
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
                        href="/#how-it-works"
                        className="text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary"
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); navigate("/#how-it-works"); }}
                      >
                        How we work
                      </a>
                      <a
                        href="/blogs"
                        className="text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary"
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); navigate("/blogs"); }}
                      >
                        Blog
                      </a>
                      <a
                        href="/content-playbook"
                        className="text-lg font-heading text-foreground py-3 border-b border-white/10 transition-colors hover:text-primary"
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); navigate("/content-playbook"); }}
                      >
                        Content Playbook
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

                    {/* Book a strategy call CTA */}
                    <motion.a
                      href="#contact"
                      className="glow-on-hover group inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full text-base w-full mt-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      onClick={() => { setMobileOpen(false); setMobileSubMenu(null); }}
                    >
                      Start a conversation
                      <MessageCircle className="w-4 h-4" />
                    </motion.a>
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
                      <button
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-foreground py-3 rounded-xl bg-primary hover:brightness-110 transition-all w-full"
                        onClick={() => { setMobileOpen(false); setMobileSubMenu(null); setDemoModalOpen(true); }}
                      >
                        Request a demo
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ) : null}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile bottom CTA bar */}
      <AnimatePresence>
        {scrollingDown && !mobileOpen && (
          <motion.div
            className="fixed left-0 right-0 z-50 sm:hidden"
            style={bottomBarTop !== null ? { top: bottomBarTop } : { bottom: 0 }}
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="px-4 py-2.5">
              <button
                onClick={() => setContactModalOpen(true)}
                className={`flex items-center justify-center gap-2 w-full text-sm font-semibold py-2.5 rounded-full transition-all relative overflow-hidden backdrop-blur-xl border cursor-pointer ${isBottomLight ? 'text-black bg-black/10 border-black/20 shadow-[0_0_12px_rgba(28,250,118,0.15),0_0_4px_rgba(99,89,234,0.15)] before:bg-gradient-to-r before:from-[#1CFA76] before:via-[#6359EA] before:to-[#FFB347]' : 'text-white bg-white/10 border-white/20 shadow-[0_0_12px_rgba(28,250,118,0.15),0_0_4px_rgba(99,89,234,0.15)] hover:shadow-[0_0_18px_rgba(28,250,118,0.25),0_0_8px_rgba(99,89,234,0.25)] before:bg-gradient-to-r before:from-[#1CFA76] before:via-[#6359EA] before:to-[#FFB347]'} before:absolute before:inset-0 before:rounded-full before:p-[1px] before:pointer-events-none before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]`}
              >
                <MessageCircle className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Start a conversation</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <DemoRequestModal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <ContactModal open={contactModalOpen} onClose={() => setContactModalOpen(false)} />
      <PlayPackModal open={playPackModalOpen} onClose={() => setPlayPackModalOpen(false)} />
    </>
  );
};

export default Navbar;
