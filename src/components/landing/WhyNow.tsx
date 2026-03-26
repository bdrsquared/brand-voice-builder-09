import { motion } from "framer-motion";
import { Clock, TrendingUp, Eye, Zap } from "lucide-react";

const reasons = [
  {
    icon: TrendingUp,
    text: "Content is more competitive and saturated than ever. Standing out requires a different format.",
    gradient: "from-accent/20 to-accent/5",
    borderGlow: "hover:border-accent/30",
    iconGlow: "shadow-[0_0_20px_hsl(243,79%,63%,0.3)]",
  },
  {
    icon: Eye,
    text: "B2B buyers are consuming more video and personality-led content before making purchase decisions.",
    gradient: "from-primary/15 to-primary/5",
    borderGlow: "hover:border-primary/30",
    iconGlow: "shadow-[0_0_20px_hsl(145,96%,55%,0.3)]",
  },
  {
    icon: Zap,
    text: "Brands that show up consistently with valuable content are winning attention, trust, and market share.",
    gradient: "from-accent/15 to-primary/5",
    borderGlow: "hover:border-accent/25",
    iconGlow: "shadow-[0_0_20px_hsl(243,79%,63%,0.25)]",
  },
  {
    icon: Clock,
    text: "Most teams are inconsistent — publishing in bursts then going quiet. That's a gap you can own.",
    gradient: "from-primary/10 to-accent/5",
    borderGlow: "hover:border-primary/25",
    iconGlow: "shadow-[0_0_20px_hsl(145,96%,55%,0.25)]",
  },
];

const WhyNow = () => {
  return (
    <section className="relative py-16 sm:py-20 px-6 overflow-hidden">
      {/* Background depth layers */}
      <div className="absolute top-[-100px] left-[-150px] w-[500px] h-[500px] blob-blue pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-120px] w-[450px] h-[500px] blob-oblong-green pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, hsl(243 79% 63% / 0.06), transparent 70%)' }} />
      <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(145 96% 55% / 0.04), transparent 70%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-accent font-medium text-sm mb-6 block">
            ● Why now
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            <span className="text-gradient-blue">First mover advantage.</span>{" "}
            <span className="text-muted-foreground/70">The brands that start now will own the conversation.</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body mb-12 max-w-2xl leading-relaxed">
            Video podcasting isn't a future trend — it's happening now. The businesses investing today are building an unfair advantage that compounds over time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              className={`group relative flex gap-4 items-start p-6 rounded-xl border border-border/60 backdrop-blur-sm bg-gradient-to-br ${r.gradient} transition-all duration-300 ${r.borderGlow} hover:translate-y-[-2px] hover:shadow-lg hover:shadow-accent/5`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Subtle inner glow on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 30%, hsl(243 79% 63% / 0.05), transparent 60%)' }} />
              
              <div className={`relative w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 ${r.iconGlow} transition-shadow duration-300 group-hover:bg-accent/15`}>
                <r.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="relative text-foreground/85 font-body leading-relaxed">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyNow;
