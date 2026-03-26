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
          <div className="relative inline-block mb-12">
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
            <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Ready to turn conversations into{" "}
              <span className="text-gradient-gold">pipeline?</span>
            </h2>
          </div>

          <p className="text-lg sm:text-xl text-secondary-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Let's talk about what a strategic podcast could look like for your
            business. No pitch deck. Just a real conversation about your goals
            and whether this is the right move.
          </p>

          <a
            href="mailto:hello@example.com"
            className="group inline-flex items-center gap-3 bg-gradient-gold text-primary-foreground font-semibold px-10 py-5 rounded-lg text-lg transition-all hover:opacity-90 hover:shadow-glow"
          >
            Book a strategy call
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>

          <p className="mt-6 text-sm text-muted-foreground">
            Free 30-minute call · No commitment · Honest advice
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
