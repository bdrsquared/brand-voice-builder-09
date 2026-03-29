import { motion } from "framer-motion";
import type { CaseStudyData } from "@/pages/CaseStudy";

const CaseStudyApproach = ({ data }: { data: CaseStudyData }) => {
  const icons = ["01", "02", "03", "04"];

  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute top-[30%] right-[-5%] w-[350px] h-[280px] blob-oblong-green pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-8%] w-[300px] h-[250px] blob-blue pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary mb-4">
            How it was <span className="text-gradient-green">built</span>
          </h2>
          <p className="text-base text-text-secondary font-body max-w-xl">
            A structured approach designed to deliver quality and consistency.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.approach.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-500"
              style={{
                backgroundImage: [
                  "radial-gradient(ellipse at 20% 80%, hsla(145,80%,55%,0.07) 0%, transparent 60%)",
                  "radial-gradient(ellipse at 80% 20%, hsla(243,70%,60%,0.07) 0%, transparent 60%)",
                  "radial-gradient(ellipse at 20% 20%, hsla(35,90%,55%,0.06) 0%, transparent 60%)",
                  "radial-gradient(ellipse at 80% 80%, hsla(145,80%,55%,0.05) 0%, transparent 55%), radial-gradient(ellipse at 20% 20%, hsla(243,70%,60%,0.04) 0%, transparent 50%)",
                ][i % 4],
              }}
            >
              <span className="text-4xl sm:text-5xl font-heading text-white/[0.06] absolute top-4 right-5">
                {icons[i]}
              </span>
              <h3 className="text-lg sm:text-xl text-text-primary mb-3">{item.title}</h3>
              <p className="text-sm text-text-secondary font-body leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyApproach;
