import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DemoRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const DemoRequestModal = ({ open, onClose }: DemoRequestModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }

    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("send-demo-request", {
        body: { name: name.trim(), email: email.trim(), phone: phone.trim() },
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
      setPhone("");
      setSubmitted(false);
      setError("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse at 20% 0%, hsla(145,80%,55%,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, hsla(243,70%,60%,0.04) 0%, transparent 50%)"
              }} />

              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.12] transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 p-8">
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
                      <h3 className="text-xl font-heading text-foreground mb-2">We'll be in touch</h3>
                      <p className="text-sm text-muted-foreground font-body">
                        Thanks {name.split(" ")[0]}, one of our team will reach out shortly.
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
                      <h3 className="text-xl font-heading text-foreground mb-1">Request a demo</h3>
                      <p className="text-sm text-muted-foreground font-body mb-6">
                        Tell us a bit about yourself and we'll set up a call.
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
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+44 7XXX XXX XXX"
                            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder:text-white/25 focus:outline-none focus:border-white/[0.2] focus:bg-white/[0.07] transition-all font-body"
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
                        {loading ? "Sending…" : "Submit request"}
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

export default DemoRequestModal;
