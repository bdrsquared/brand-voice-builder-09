import { useEffect } from "react";
import { motion } from "framer-motion";

const Calendly = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="book" className="relative py-24 sm:py-32 px-6 overflow-hidden">
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] blob-green pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Book a <span className="text-gradient-green">strategy call</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/team-earworm/30-minute-consultation-clone"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Calendly;
