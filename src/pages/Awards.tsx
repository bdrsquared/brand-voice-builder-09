import { motion } from "framer-motion";
import { Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionPill from "@/components/landing/SectionPill";
import useMetaTags from "@/hooks/useMetaTags";
import awardBadge from "@/assets/uk-startup-awards-badge.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const Awards = () => {
  useMetaTags({
    title: "Awards | Earworm – Award-Winning Podcast Agency",
    description:
      "Earworm is an award-winning podcast-led content agency. See our accolades including UK StartUp Awards 2026 Finalist.",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ background: "radial-gradient(ellipse at 30% 40%, hsl(var(--primary)) 0%, transparent 55%)" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <SectionPill>
              <Trophy className="w-3.5 h-3.5" />
              Awards &amp; Recognition
            </SectionPill>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold mt-8 mb-6 tracking-tight"
          >
            Award-winning agency
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="font-body text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Recognition from the people who matter. We're proud to be named
            among the best marketing &amp; advertising startups in the&nbsp;UK.
          </motion.p>
        </div>
      </section>

      {/* ── Featured Award ── */}
      <section className="px-6 pb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          className="max-w-5xl mx-auto rounded-3xl border border-white/[0.06] bg-card/40 backdrop-blur-md overflow-hidden"
        >
          <div className="grid md:grid-cols-[320px_1fr] items-center gap-0">
            {/* Badge */}
            <div className="flex items-center justify-center p-10 md:p-14 bg-gradient-to-br from-primary/[0.06] to-transparent">
              <img
                src={awardBadge}
                alt="UK StartUp Awards 2026 – South West Finalist badge"
                className="w-48 md:w-56 drop-shadow-xl"
              />
            </div>

            {/* Copy */}
            <div className="p-8 md:p-12 lg:p-16">
              <span className="inline-block font-body text-xs font-medium uppercase tracking-widest text-primary mb-4">
                2026 · UK StartUp Awards
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-4 tracking-tight leading-snug">
                Earworm named finalist — Marketing &amp; Advertising StartUp of
                the Year
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-3">
                The UK StartUp Awards judges have named Earworm a finalist for
                Marketing &amp; Advertising StartUp of the Year in the South
                West. This is a massive credit to the work everyone puts in
                every day.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                If we win the regional final, we head to the national stage at
                Ideas Fest in September.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
              >
                Work with an award-winning team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Awards;
