import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import DotsBackground from "@/components/landing/DotsBackground";
import Footer from "@/components/landing/Footer";
import useMetaTags from "@/hooks/useMetaTags";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const ThankYou = () => {
  useMetaTags();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "ads_conversion_SUBMIT_LEAD_FORM_1");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <TestimonialTicker />
      <Navbar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <DotsBackground />
      </div>

      <section className="relative min-h-[80vh] flex items-center justify-center pt-28 pb-24 px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl mx-auto text-center"
        >
          <div className="mx-auto mb-8 w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center backdrop-blur-sm">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-4">
            Thank you
          </h1>

          <p className="text-lg text-muted-foreground font-body leading-relaxed mb-3">
            We've received your inquiry and appreciate you reaching out.
          </p>
          <p className="text-muted-foreground font-body leading-relaxed mb-10">
            If it looks like a good fit, one of our team will be in touch shortly to explore how we can help.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] text-sm font-medium text-foreground hover:bg-white/[0.06] backdrop-blur-sm transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              Back to home
            </Link>
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-all"
            >
              See our work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;
