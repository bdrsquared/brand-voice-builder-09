import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { budgetOptions } from "@/lib/country-codes";

interface BudgetSelectProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  light?: boolean;
}

const BudgetSelect = ({ value, onChange, compact = false, light = false }: BudgetSelectProps) => {
  const [open, setOpen] = useState(false);

  const labelSize = compact ? "text-[10px]" : "text-xs";
  const py = compact ? "py-2.5" : "py-3";

  return (
    <div>
      <label className={`block ${labelSize} font-semibold ${light ? "text-gray-500" : "text-white/50"} mb-${compact ? "1" : "1.5"} uppercase tracking-wider`}>
        Budget <span className={light ? "text-gray-400" : "text-white/30"}>(optional)</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between rounded-xl px-${compact ? "3" : "4"} ${py} text-sm transition-all font-body ${
            light
              ? "border border-black/[0.12] bg-black/[0.05] text-gray-900 hover:bg-black/[0.07]"
              : "border border-white/[0.1] bg-white/[0.05] text-foreground hover:bg-white/[0.07]"
          }`}
        >
          <span className={value ? (light ? "text-gray-900" : "text-foreground") : (light ? "text-gray-400" : "text-white/25")}>
            {value || "Select a budget range"}
          </span>
          <ChevronDown className={`w-4 h-4 ${light ? "text-gray-400" : "text-white/40"} transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={`absolute bottom-full left-0 mb-1.5 w-full rounded-xl backdrop-blur-2xl shadow-2xl overflow-hidden z-50 ${
                light
                  ? "border border-black/[0.1] bg-white/95"
                  : "border border-white/[0.12] bg-[hsl(var(--card))]/95"
              }`}
            >
              {budgetOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => { onChange(opt.label); setOpen(false); }}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    light
                      ? `hover:bg-black/[0.04] ${value === opt.label ? "bg-black/[0.03]" : ""}`
                      : `hover:bg-white/[0.06] ${value === opt.label ? "bg-white/[0.04]" : ""}`
                  }`}
                >
                  <span className={`block text-sm font-medium ${light ? "text-gray-900" : "text-foreground"}`}>{opt.label}</span>
                  {opt.description && (
                    <span className={`block text-xs mt-0.5 ${light ? "text-gray-400" : "text-white/40"}`}>{opt.description}</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BudgetSelect;
