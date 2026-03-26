import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section id="contact" className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
            Ready to turn conversations into{" "}
            <span className="text-gradient-green">pipeline?</span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            Let's talk about what a strategic podcast could look like for your
            business. No pitch deck. Just a real conversation about your goals
            and whether this is the right move.
          </p>

          <a
            href="mailto:hello@example.com"
            className="group inline-flex items-center gap-3 bg-gradient-green text-primary-foreground font-semibold px-10 py-5 rounded-full text-lg transition-all hover:shadow-green"
          >
            Book a strategy call
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>

          <p className="mt-6 text-sm text-muted-foreground font-body">
            Free 30-minute call · No commitment · Honest advice
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
