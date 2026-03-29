import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    quote: "High-quality content that drove 1M+ views and real leads.",
    author: "Marketing Manager, No Stress (Pulsetto)",
  },
  {
    quote: "Great team, standout content, consistent leads.",
    author: "Head of Marketing, B2B SaaS",
  },
  {
    quote: "Exceptional creative that boosted brand and pipeline.",
    author: "Director of Marketing, Fintech",
  },
  {
    quote: "High-quality production with real lead impact.",
    author: "VP Marketing, Enterprise Tech",
  },
];

const TestimonialTicker = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);
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
      style={{
        background: "white",
        fontFamily: "'Geist', sans-serif",
      }}
      animate={{ y: visible ? 0 : -40 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Gradient overlay at 40% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #1CFA76 0%, #6359EA 50%, #1CFA76 100%)",
          opacity: 0.4,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-1.5 text-center overflow-hidden relative" style={{ minHeight: '1.5rem' }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] md:text-xs font-medium leading-tight"
          >
            {/* Desktop: static centered text */}
            <p className="hidden md:block">
              &ldquo;{t.quote}&rdquo; —{" "}
              <span className="opacity-70">{t.author}</span>
            </p>
            {/* Mobile: marquee scrolling text */}
            <div className="md:hidden whitespace-nowrap overflow-hidden">
              <span className="inline-block animate-marquee">
                &ldquo;{t.quote}&rdquo; — <span className="opacity-70">{t.author}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &ldquo;{t.quote}&rdquo; — <span className="opacity-70">{t.author}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TestimonialTicker;
