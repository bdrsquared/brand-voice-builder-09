import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    quote: "Working with Earworm helped us generate over 1M+ views and impressions across channels, directly contributing to new sales opportunities.",
    author: "Marketing Manager, No Stress (Pulsetto)",
  },
  {
    quote: "Earworm turned our podcast into a consistent pipeline driver, helping us start meaningful conversations with the right prospects.",
    author: "Head of Marketing, B2B SaaS Company",
  },
  {
    quote: "The quality and consistency of content has significantly increased our brand visibility and positioned us as a leader in our space.",
    author: "Director of Marketing, Fintech Company",
  },
  {
    quote: "What started as a content initiative quickly became a core part of our growth strategy, supporting both brand and demand generation.",
    author: "VP Marketing, Enterprise Tech Company",
  },
];

const TestimonialTicker = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY < 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const t = testimonials[index];

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[80] text-black"
      style={{ backgroundColor: "#4DF290", fontFamily: "'Geist', sans-serif" }}
      animate={{ y: visible ? 0 : -40 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-1.5 text-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] md:text-xs font-medium leading-tight whitespace-nowrap md:whitespace-normal overflow-x-auto md:overflow-visible scrollbar-hide"
          >
            &ldquo;{t.quote}&rdquo; —{" "}
            <span className="opacity-70">{t.author}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TestimonialTicker;
