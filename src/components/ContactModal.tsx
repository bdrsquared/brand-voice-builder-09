import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check, ChevronDown, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { countryCodes, UK_DEFAULT_INDEX } from "@/lib/country-codes";
import BudgetSelect from "@/components/BudgetSelect";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactModal = ({ open, onClose }: ContactModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCode, setSelectedCode] = useState(countryCodes[UK_DEFAULT_INDEX]);
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCodes = useMemo(() => {
    if (!codeSearch.trim()) return countryCodes;
    const q = codeSearch.toLowerCase();
    return countryCodes.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.includes(q) || c.country.toLowerCase().includes(q)
    );
  }, [codeSearch]);

  useEffect(() => {
    if (codeDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [codeDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCodeDropdownOpen(false);
        setCodeSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullPhone = phoneNumber.trim() ? `${selectedCode.code} ${phoneNumber.trim()}` : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (!message.trim()) { setError("Please enter a message."); return; }

    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("send-demo-request", {
        body: { name: name.trim(), email: email.trim(), phone: fullPhone, message: message.trim(), budget, type: "contact", source_page: window.location.pathname },
      });

      if (fnError) throw fnError;
      if (data && !data.success) throw new Error(data.error || "Something went wrong");

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName("");
      setEmail("");
      setPhoneNumber("");
      setBudget("");
      setMessage("");
      setSelectedCode(countryCodes[UK_DEFAULT_INDEX]);
      setSubmitted(false);
      setError("");
      setCodeSearch("");
      setCodeDropdownOpen(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-2xl shadow-2xl overflow-visible"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse at 20% 0%, hsla(145,80%,55%,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, hsla(243,70%,60%,0.04) 0%, transparent 50%)"
              }} />

              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.12] transition-all cursor-pointer"
              >
                <X className="w-4 h-4 pointer-events-none" />
              </button>

              <div className="relative z-10 p-8 overflow-visible">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                        <Check className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-heading text-foreground mb-2">Message sent</h3>
                      <p className="text-sm text-muted-foreground font-body">
                        Thanks {name.split(" ")[0]}, we'll get back to you shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                    >
                      <h3 className="text-xl font-heading text-foreground mb-1">Start a conversation</h3>
                      <p className="text-sm text-muted-foreground font-body mb-6">
                        If we're the right partner for you, we'll be in touch.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Name *</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder:text-white/25 focus:outline-none focus:border-white/[0.2] focus:bg-white/[0.07] transition-all font-body"
                            maxLength={200}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email *</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder:text-white/25 focus:outline-none focus:border-white/[0.2] focus:bg-white/[0.07] transition-all font-body"
                            maxLength={320}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Phone <span className="text-white/30">(optional)</span></label>
                          <div className="flex gap-2">
                            <div className="relative" ref={dropdownRef}>
                              <button
                                type="button"
                                onClick={() => { setCodeDropdownOpen(!codeDropdownOpen); setCodeSearch(""); }}
                                className="flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-3 text-sm text-foreground hover:bg-white/[0.07] transition-all whitespace-nowrap shrink-0"
                              >
                                <span>{selectedCode.flag}</span>
                                <span className="text-white/70 text-xs">{selectedCode.code}</span>
                                <ChevronDown className="w-3 h-3 text-white/40" />
                              </button>

                              <AnimatePresence>
                                {codeDropdownOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute bottom-full left-0 mb-1.5 w-64 max-h-60 rounded-xl border border-white/[0.12] bg-[hsl(var(--card))]/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50"
                                  >
                                    <div className="p-2 border-b border-white/[0.08]">
                                      <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                                        <input
                                          ref={searchInputRef}
                                          type="text"
                                          value={codeSearch}
                                          onChange={(e) => setCodeSearch(e.target.value)}
                                          placeholder="Search country..."
                                          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.05] pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-white/25 focus:outline-none focus:border-white/[0.15] transition-all font-body"
                                        />
                                      </div>
                                    </div>
                                    <div className="overflow-y-auto max-h-44 scrollbar-thin">
                                      {filteredCodes.map((c, i) => (
                                        <button
                                          key={`${c.country}-${i}`}
                                          type="button"
                                          onClick={() => {
                                            setSelectedCode(c);
                                            setCodeDropdownOpen(false);
                                            setCodeSearch("");
                                          }}
                                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs hover:bg-white/[0.06] transition-colors ${
                                            selectedCode.country === c.country && selectedCode.code === c.code ? "bg-white/[0.04]" : ""
                                          }`}
                                        >
                                          <span className="text-base">{c.flag}</span>
                                          <span className="text-foreground font-medium flex-1 truncate">{c.name}</span>
                                          <span className="text-white/40">{c.code}</span>
                                        </button>
                                      ))}
                                      {filteredCodes.length === 0 && (
                                        <p className="text-xs text-white/30 text-center py-4">No results</p>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="7XXX XXX XXX"
                              className="flex-1 min-w-0 rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder:text-white/25 focus:outline-none focus:border-white/[0.2] focus:bg-white/[0.07] transition-all font-body"
                            />
                          </div>
                        </div>

                        <BudgetSelect value={budget} onChange={setBudget} />

                        <div>
                          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Message *</label>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="How can we help?"
                            rows={3}
                            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder:text-white/25 focus:outline-none focus:border-white/[0.2] focus:bg-white/[0.07] transition-all font-body resize-none"
                            maxLength={2000}
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="text-xs text-red-400 mt-3">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Sending…" : "Send message"}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
