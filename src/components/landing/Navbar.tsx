import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, MonitorPlay, Film, BarChart3 } from "lucide-react";
import logo from "@/assets/earworm-logo.png";

const megaMenuItems = [
  {
    title: "Strategy & Planning",
    description: "Podcast strategy · Episode planning · Research · Guest sourcing",
    icon: MonitorPlay,
  },
  {
    title: "Production & Creative",
    description: "Video & audio production · Graphic design · Motion graphics",
    icon: Film,
  },
  {
    title: "Distribution & Insight",
    description: "Publishing & distribution · Analytics & reporting · Audience insights",
    icon: BarChart3,
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

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
        className="max-w-5xl mx-auto relative"
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 flex items-center justify-between h-14 shadow-lg shadow-black/20">
          <img src={logo} alt="Earworm" className="h-5" />
          <div className="hidden sm:flex items-center gap-4">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
            >
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                Our service
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
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

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 pt-2"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl shadow-black/30 grid grid-cols-2 gap-8">
                {megaMenuItems.map((item) => (
                  <div key={item.title} className="group cursor-pointer">
                    <div className="aspect-video rounded-xl bg-white/5 border border-white/10 mb-4 overflow-hidden" />
                    <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed font-body">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
