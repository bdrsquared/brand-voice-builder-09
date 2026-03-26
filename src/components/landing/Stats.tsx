import { motion } from "framer-motion";

const stats = [
  { value: "91%", label: "of B2B marketers use video as a marketing tool", source: "Wyzowl" },
  { value: "80%", label: "of buyers prefer learning about a product through video", source: "Demand Gen" },
  { value: "7+", label: "touchpoints needed before a prospect engages with sales", source: "Forrester" },
  { value: "10x", label: "more content output from a single podcast recording", source: "" },
];

const Stats = () => {
  return (
    <section className="relative py-16 sm:py-20 px-6 overflow-hidden">
      <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] blob-green pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center p-6 rounded-xl border border-border bg-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="text-4xl sm:text-5xl font-bold font-heading text-gradient-green block mb-3">
                {stat.value}
              </span>
              <p className="text-sm text-muted-foreground font-body leading-snug">
                {stat.label}
              </p>
              {stat.source && (
                <p className="text-xs text-muted-foreground/50 mt-2 font-body">{stat.source}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
