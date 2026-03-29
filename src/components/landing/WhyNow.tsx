import { motion } from "framer-motion";
import { Clock, TrendingUp, Eye, Zap } from "lucide-react";

const reasons = [
  {
    icon: TrendingUp,
    text: "Content is more competitive and saturated than ever. Standing out requires a different format.",
  },
  {
    icon: Eye,
    text: "B2B buyers are consuming more video and personality-led content before making purchase decisions.",
  },
  {
    icon: Zap,
    text: "Brands that show up consistently with valuable content are winning attention, trust, and market share.",
  },
  {
    icon: Clock,
    text: "Most teams are inconsistent — publishing in bursts then going quiet. That's a gap you can own.",
  },
];

const WhyNow = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-emerald-600 font-medium text-sm mb-4 block">
            ● Why now
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-gray-900">
            First mover advantage.{" "}
            <span className="text-gray-400">The brands that start now will own the conversation.</span>
          </h2>
          <p className="text-base text-gray-500 font-body mb-12 max-w-2xl leading-relaxed">
            Video podcasting isn't a future trend — it's happening now. The businesses investing today are building an unfair advantage that compounds over time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              className="flex gap-4 items-start p-6 sm:p-8 rounded-2xl border border-gray-200 bg-gray-50/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <r.icon className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-sm text-gray-700 font-body leading-relaxed">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyNow;
