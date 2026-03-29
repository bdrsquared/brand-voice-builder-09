import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem("cookie-consent", accepted ? "accepted" : "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-[100] hidden sm:block max-w-xs rounded-2xl border border-white/10 bg-card/90 backdrop-blur-xl p-5 shadow-2xl"
        >
          <p className="text-sm font-semibold text-foreground mb-1">
            Let's talk cookies 🍪
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Not the edible kind — just the ones that help us run the site properly and see what's working.
          </p>
          <Link
            to="/cookies"
            className="inline-block text-[11px] text-primary hover:underline mb-4"
          >
            Read our cookie policy →
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChoice(true)}
              className="flex-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              I accept
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="flex-1 rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:border-white/20"
            >
              No thanks
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
