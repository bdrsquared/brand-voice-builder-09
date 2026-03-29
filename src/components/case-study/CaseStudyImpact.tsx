import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { CaseStudyData } from "@/pages/CaseStudy";

const CaseStudyImpact = ({ data }: { data: CaseStudyData }) => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[300px] blob-oblong-green pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary mb-4">
            What this <span className="text-gradient-green">delivered</span>
          </h2>
          <p className="text-base text-text-secondary font-body max-w-xl">
            Measurable outcomes that connected brand-building to commercial results.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {data.impacts.map((impact, i) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-500"
              style={{
                backgroundImage: [
                  "radial-gradient(ellipse at 15% 85%, hsla(145,80%,55%,0.06) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, hsla(243,70%,60%,0.04) 0%, transparent 50%)",
                  "radial-gradient(ellipse at 80% 90%, hsla(145,80%,55%,0.05) 0%, transparent 50%), radial-gradient(ellipse at 20% 10%, hsla(35,90%,55%,0.04) 0%, transparent 55%)",
                  "radial-gradient(ellipse at 10% 20%, hsla(243,70%,60%,0.06) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, hsla(145,80%,55%,0.04) 0%, transparent 50%)",
                  "radial-gradient(ellipse at 85% 15%, hsla(35,90%,55%,0.05) 0%, transparent 50%), radial-gradient(ellipse at 15% 85%, hsla(243,70%,60%,0.05) 0%, transparent 55%)",
                ][i % 4],
              }}
            >
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-text-primary mb-2">{impact.title}</h3>
                  <p className="text-sm text-text-secondary font-body leading-relaxed">{impact.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyImpact;
