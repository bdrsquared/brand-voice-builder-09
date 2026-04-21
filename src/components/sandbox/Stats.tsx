import { motion } from "framer-motion";

const stats = [
  {
    title: "Buyers are listening",
    value: "74%",
    label: "B2B decision-makers listen to podcasts weekly.",
    source: "Source: Edison Research",
    gradient: "radial-gradient(ellipse at 20% 80%, hsl(145 96% 55% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(243 79% 63% / 0.10) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(320 60% 50% / 0.06) 0%, transparent 60%)",
  },
  {
    title: "Build brand authority",
    value: "65%",
    label: "Podcast guests say it led to new business or speaking invites.",
    source: "Source: Podchaser Pro",
    gradient: "radial-gradient(ellipse at 70% 90%, hsl(243 79% 63% / 0.14) 0%, transparent 50%), radial-gradient(ellipse at 10% 30%, hsl(145 96% 55% / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 90% 10%, hsl(320 60% 50% / 0.08) 0%, transparent 55%)",
  },
  {
    title: "Turn episodes into content",
    value: "10-20x",
    label: "Video Podcasts generate 10-20x more reusable content than blog posts.",
    source: "Internal agency data / industry benchmarks",
    gradient: "radial-gradient(ellipse at 80% 70%, hsl(320 60% 50% / 0.10) 0%, transparent 50%), radial-gradient(ellipse at 20% 20%, hsl(243 79% 63% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, hsl(145 96% 55% / 0.08) 0%, transparent 55%)",
  },
];

const Stats = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] blob-green pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-120px] w-[350px] h-[300px] blob-oblong-blue pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl leading-tight max-w-2xl text-text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Why brands are investing in monthly podcast content
          </motion.h2>
          <motion.p
            className="text-sm text-text-secondary font-body leading-relaxed max-w-sm lg:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The best video podcasts don't just build awareness – they open doors, build trust, and can power your whole content strategy.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="relative p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col justify-between min-h-[320px] overflow-hidden"
              style={{ background: `${stat.gradient}, hsl(0 0% 5%)` }}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <h3 className="relative z-10 text-lg sm:text-xl leading-snug text-text-primary">
                {stat.title}
              </h3>

              <div className="relative z-10">
                <span className="block text-5xl sm:text-6xl font-heading text-gradient-green mb-3">
                  {stat.value}
                </span>
                <p className="text-text-secondary font-body leading-relaxed text-sm">
                  {stat.label}
                </p>
              </div>

              <div className="relative z-10">
                <div className="w-8 h-px bg-white/20 mb-3" />
                <p className="text-xs text-text-tertiary font-body">
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
