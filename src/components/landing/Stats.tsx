import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";

const stats = [
  {
    title: "Buyers are listening",
    value: "74%",
    label: "B2B decision-makers listen to podcasts weekly.",
    source: "Source: Edison Research",
  },
  {
    title: "Build brand authority",
    value: "65%",
    label: "Podcast guests say it led to new business or speaking invites.",
    source: "Source: Podchaser Pro",
  },
  {
    title: "Turn episodes into content",
    value: "10-20x",
    label: "Video Podcasts generate 10-20x more reusable content than blog posts.",
    source: "Internal agency data / industry benchmarks",
  },
];

const GlowCard = ({ stat, i }: { stat: typeof stats[0]; i: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative p-8 sm:p-10 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex flex-col justify-between min-h-[340px] overflow-hidden group"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
    >
      {/* Gradient glow that follows the mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(34, 28, 67, 0.6), transparent 60%)`,
        }}
      />
      {/* Border glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, hsl(var(--primary) / 0.3), transparent 60%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
          borderRadius: "1rem",
        }}
      />

      {/* Title */}
      <h3 className="relative z-10 text-xl sm:text-2xl font-bold leading-snug">
        {stat.title}
      </h3>

      {/* Stat + description */}
      <div className="relative z-10">
        <span className="block text-5xl sm:text-6xl font-bold font-heading text-gradient-green mb-3">
          {stat.value}
        </span>
        <p className="text-muted-foreground font-body leading-relaxed text-sm">
          {stat.label}
        </p>
      </div>

      {/* Source */}
      <div className="relative z-10">
        <div className="w-8 h-px bg-white/20 mb-3" />
        <p className="text-xs text-muted-foreground/50 font-body">
          {stat.source}
        </p>
      </div>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <section className="relative py-16 sm:py-20 px-6">
      <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] blob-green pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-120px] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-14">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Why brands are investing in monthly podcast content
          </motion.h2>
          <motion.p
            className="text-muted-foreground font-body leading-relaxed max-w-sm lg:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The best video podcasts don't just build awareness – they open doors, build trust, and can power your whole content strategy.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <GlowCard key={i} stat={stat} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
