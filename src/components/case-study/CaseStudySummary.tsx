import { motion } from "framer-motion";
import type { CaseStudyData } from "@/pages/CaseStudy";

const CaseStudySummary = ({ data }: { data: CaseStudyData }) => {
  const sections = [
    { label: "The challenge", text: data.summary.challenge },
    { label: "The solution", text: data.summary.solution },
    { label: "The result", text: data.summary.result },
  ];

  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute bottom-[-60px] right-[-8%] w-[350px] h-[280px] blob-oblong-blue pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
            Overview
          </h2>
        </motion.div>

        <div className="flex flex-col gap-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-12"
            >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider shrink-0 sm:w-32 pt-1 font-body">
                {section.label}
              </span>
              <p className="text-base sm:text-lg text-text-secondary font-body leading-relaxed flex-1">
                {section.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudySummary;
