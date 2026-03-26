import { motion } from "framer-motion";

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

const Stats = () => {
  return (
    <section className="relative py-24 sm:py-32 px-6">
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
            <motion.div
              key={i}
              className="relative p-8 sm:p-10 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex flex-col justify-between min-h-[340px]"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                {stat.title}
              </h3>

              {/* Stat + description */}
              <div>
                <span className="block text-5xl sm:text-6xl font-bold font-heading text-gradient-green mb-3">
                  {stat.value}
                </span>
                <p className="text-muted-foreground font-body leading-relaxed text-sm">
                  {stat.label}
                </p>
              </div>

              {/* Source */}
              <div>
                <div className="w-8 h-px bg-white/20 mb-3" />
                <p className="text-xs text-muted-foreground/50 font-body">
                  {stat.source}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
