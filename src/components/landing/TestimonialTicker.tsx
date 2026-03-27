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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[index];

  return (
    <div className="fixed top-0 left-0 right-0 z-[80] bg-primary text-black">
      <div className="max-w-7xl mx-auto px-4 py-2.5 text-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="text-xs sm:text-sm font-medium leading-snug"
          >
            "{t.quote}" —{" "}
            <span className="opacity-70">{t.author}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestimonialTicker;
