import { motion } from "framer-motion";

const stats = [
  { value: "80%", label: "of B2B buyers prefer learning about a product through video content", source: "Demand Gen Report" },
  { value: "7+", label: "touchpoints needed before a prospect is ready to engage with sales", source: "Forrester Research" },
  { value: "10x", label: "more content assets generated from a single podcast recording session", source: "" },
];

const Stats = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] blob-green pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-120px] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="group relative p-10 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/[0.04] hover:to-primary/[0.08] hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_50px_-12px_hsl(145,96%,55%,0.12)] overflow-hidden"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Subtle corner glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] group-hover:bg-primary/[0.06] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl transition-all duration-500 pointer-events-none" />

              <span className="relative block text-6xl sm:text-7xl font-bold font-heading text-gradient-green mb-5">
                {stat.value}
              </span>
              <p className="relative text-base text-foreground/70 font-body leading-relaxed mb-4">
                {stat.label}
              </p>
              {stat.source && (
                <p className="relative text-xs text-muted-foreground/40 font-body">{stat.source}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
