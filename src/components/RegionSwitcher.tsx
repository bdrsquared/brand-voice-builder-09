import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, type Locale } from "@/contexts/LocaleContext";

const LABELS: Record<Locale, { flag: string; code: string; name: string }> = {
  "en-GB": { flag: "🇬🇧", code: "UK", name: "United Kingdom" },
  "en-US": { flag: "🇺🇸", code: "US", name: "United States" },
};

interface Props {
  light?: boolean;
}

const RegionSwitcher = ({ light = false }: Props) => {
  const { locale, toggleLocalePath } = useLocale();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const current = LABELS[locale];

  const switchTo = (target: Locale) => {
    setOpen(false);
    if (target === locale) return;
    navigate(toggleLocalePath(pathname, target));
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-300 ${
          light ? "text-gray-800 hover:text-gray-950" : "text-white/80 hover:text-white"
        }`}
        aria-label="Switch region"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="hidden md:inline">{current.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full pt-3 z-50"
          >
            <div
              className={`min-w-[180px] rounded-2xl border backdrop-blur-xl shadow-lg overflow-hidden ${
                light
                  ? "bg-white/70 border-black/10 shadow-black/5"
                  : "bg-white/5 border-white/10 shadow-black/20"
              }`}
            >
              {(Object.keys(LABELS) as Locale[]).map((key) => {
                const item = LABELS[key];
                const active = key === locale;
                return (
                  <button
                    key={key}
                    onClick={() => switchTo(key)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors ${
                      light
                        ? active
                          ? "bg-black/[0.08] text-gray-950"
                          : "text-gray-700 hover:bg-black/[0.05] hover:text-gray-950"
                        : active
                          ? "bg-white/10 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <span className="text-base leading-none">{item.flag}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegionSwitcher;
