import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/earworm-logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 flex items-center justify-between h-14 shadow-lg shadow-black/20">
        <img src={logo} alt="Earworm" className="h-5" />
        <div className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold bg-gradient-green text-primary-foreground px-5 py-2.5 rounded-full transition-all hover:shadow-green"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
