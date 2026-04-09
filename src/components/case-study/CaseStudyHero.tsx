import { motion } from "framer-motion";
import type { CaseStudyData } from "@/pages/CaseStudy";

const CaseStudyHero = ({ data }: { data: CaseStudyData }) => {
  return (
    <section className="relative min-h-screen flex items-end pb-16 sm:pb-24">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={data.heroImage}
          alt={data.showName}
          className="w-full h-full object-cover sm:object-center"
          style={{ objectPosition: data.heroObjectPosition || "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Client badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] mb-6">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{data.clientName}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text-primary mb-4">
            {data.showName}
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-4 leading-relaxed font-body">
            {data.tagline}
          </p>

          {data.subtitle && (
            <p className="text-sm sm:text-base text-primary/80 max-w-xl mb-12 leading-relaxed font-body italic">
              {data.subtitle}
            </p>
          )}
          {!data.subtitle && <div className="mb-12" />}
        </motion.div>

        {/* Stats card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-3 rounded-2xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.1] overflow-hidden"
        >
          {data.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-4 sm:px-12 py-5 sm:py-8 ${i < data.stats.length - 1 ? "border-r border-white/[0.08]" : ""}`}
            >
              <p className="text-2xl sm:text-4xl md:text-5xl text-text-primary mb-1 font-heading">{stat.value}</p>
              <p className="text-[10px] sm:text-sm text-text-tertiary font-body uppercase tracking-wider leading-tight">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudyHero;
