import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowRight, Check, ChevronDown, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { countryCodes, UK_DEFAULT_INDEX } from "@/lib/country-codes";
import BudgetSelect from "@/components/BudgetSelect";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
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
  const [isLight, setIsLight] = useState(false);
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
    if (codeDropdownOpen && searchInputRef.current) searchInputRef.current.focus();
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
        body: { name: name.trim(), email: email.trim(), phone: fullPhone, message: message.trim(), budget, type: "contact" },
      });
      if (fnError) throw fnError;
      if (data && !data.success) throw new Error(data.error || "Something went wrong");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName(""); setEmail(""); setPhoneNumber(""); setBudget(""); setMessage("");
      setSelectedCode(countryCodes[UK_DEFAULT_INDEX]);
      setSubmitted(false); setError(""); setCodeSearch(""); setCodeDropdownOpen(false);
    }, 300);
  };

  const inputClass = "w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2.5 text-sm text-foreground placeholder:text-white/25 focus:outline-none focus:border-white/[0.2] focus:bg-white/[0.07] transition-all font-body";

  return (
    <div className="fixed bottom-6 right-6 z-[150] hidden md:block">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-16 right-0 w-[340px] rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-2xl shadow-2xl overflow-visible"
          >
            <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
              background: "radial-gradient(ellipse at 20% 0%, hsla(145,80%,55%,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, hsla(243,70%,60%,0.04) 0%, transparent 50%)"
            }} />

            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.12] transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 pointer-events-none" />
            </button>

            <div className="relative z-10 p-6 overflow-visible">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-heading text-foreground mb-1">Message sent</h3>
                    <p className="text-xs text-muted-foreground font-body">
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
                    <h3 className="text-lg font-heading text-foreground mb-0.5">Chat with us</h3>
                    <p className="text-xs text-muted-foreground font-body mb-5">
                      Drop us a line and we'll get back to you.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-white/50 mb-1 uppercase tracking-wider">Name *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} maxLength={200} />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-white/50 mb-1 uppercase tracking-wider">Email *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={inputClass} maxLength={320} />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-white/50 mb-1 uppercase tracking-wider">Phone <span className="text-white/30">(optional)</span></label>
                        <div className="flex gap-2">
                          <div className="relative" ref={dropdownRef}>
                            <button
                              type="button"
                              onClick={() => { setCodeDropdownOpen(!codeDropdownOpen); setCodeSearch(""); }}
                              className="flex items-center gap-1 rounded-xl border border-white/[0.1] bg-white/[0.05] px-2.5 py-2.5 text-sm text-foreground hover:bg-white/[0.07] transition-all whitespace-nowrap shrink-0"
                            >
                              <span className="text-sm">{selectedCode.flag}</span>
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
                                  className="absolute bottom-full left-0 mb-1.5 w-60 max-h-52 rounded-xl border border-white/[0.12] bg-[hsl(var(--card))]/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50"
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
                                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.05] pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-white/25 focus:outline-none focus:border-white/[0.15] transition-all font-body"
                                      />
                                    </div>
                                  </div>
                                  <div className="overflow-y-auto max-h-40 scrollbar-thin">
                                    {filteredCodes.map((c, i) => (
                                      <button
                                        key={`${c.country}-${i}`}
                                        type="button"
                                        onClick={() => { setSelectedCode(c); setCodeDropdownOpen(false); setCodeSearch(""); }}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-white/[0.06] transition-colors ${selectedCode.country === c.country && selectedCode.code === c.code ? "bg-white/[0.04]" : ""}`}
                                      >
                                        <span className="text-sm">{c.flag}</span>
                                        <span className="text-foreground font-medium flex-1 truncate">{c.name}</span>
                                        <span className="text-white/40">{c.code}</span>
                                      </button>
                                    ))}
                                    {filteredCodes.length === 0 && <p className="text-xs text-white/30 text-center py-3">No results</p>}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="7XXX XXX XXX" className={`flex-1 min-w-0 ${inputClass.replace("w-full ", "")}`} />
                        </div>
                      </div>

                      <BudgetSelect value={budget} onChange={setBudget} compact />

                      <div>
                        <label className="block text-[10px] font-semibold text-white/50 mb-1 uppercase tracking-wider">Message *</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" rows={3} className={`${inputClass} resize-none`} maxLength={2000} />
                      </div>
                    </div>

                    {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending…" : "Send message"}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        onClick={() => open ? handleClose() : setOpen(true)}
        className="group relative flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] backdrop-blur-xl px-5 py-3 text-sm font-semibold text-foreground shadow-lg hover:bg-white/[0.12] transition-all cursor-pointer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <MessageCircle className="w-4 h-4" />
        Chat
      </motion.button>
    </div>
  );
};

export default ChatWidget;
