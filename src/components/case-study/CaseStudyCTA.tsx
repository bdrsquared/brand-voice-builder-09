import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CaseStudyCTA = () => {
  return (
    <section className="relative py-24 sm:py-32 px-6">
      <div className="absolute top-[30%] left-[20%] w-[500px] h-[400px] blob-green-strong pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-100px] w-[400px] h-[300px] blob-oblong-blue pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-8 text-text-primary">
            Build something like this for{" "}
            <span className="text-gradient-green">your brand</span>
          </h2>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            Let's talk about what a strategic video podcast could look like for
            your business. No pitch deck. Just a real conversation about your
            goals.
          </p>

          <a
            href="/#contact"
            className="group inline-flex items-center gap-3 glow-on-hover font-semibold px-10 py-5 rounded-full text-lg transition-all"
          >
            Book a strategy call
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>

          <p className="mt-6 text-sm text-text-tertiary font-body">
            Free 30-minute call · No commitment · Honest advice
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudyCTA;
