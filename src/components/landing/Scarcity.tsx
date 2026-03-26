import { motion } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";

const Scarcity = () => {
  return (
    <section className="relative py-20 sm:py-24 px-6 overflow-hidden">
      <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blob-green pointer-events-none opacity-50" />
      <div className="absolute top-[30%] right-[-100px] w-[300px] h-[300px] blob-blue pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium text-sm px-4 py-2 rounded-full mb-8 border border-primary/20">
            <AlertCircle className="w-4 h-4" />
            Limited availability
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6">
            We only take on a handful of clients at a time.
          </h2>

          <p className="text-lg text-muted-foreground font-body mb-10 leading-relaxed max-w-xl mx-auto">
            To deliver the quality and strategic depth our clients expect, we're selective about who we onboard. If you're serious about building a content engine that drives real results — don't wait.
          </p>

          <a
            href="#contact"
            className="group inline-flex items-center gap-2 bg-gradient-green text-primary-foreground font-semibold px-8 py-4 rounded-full text-base transition-all hover:shadow-green"
          >
            Check availability
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Scarcity;
