import { motion } from "framer-motion";
import type { CaseStudyData } from "@/pages/CaseStudy";

const CaseStudyBTS = ({ data }: { data: CaseStudyData }) => {
  if (!data.btsImages.length) return null;

  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute top-[-50px] left-[15%] w-[400px] h-[300px] blob-oblong-amber pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary mb-4">
            Behind the <span className="text-gradient-green">scenes</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.btsImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-2xl overflow-hidden border border-white/[0.08] ${
                i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/5]"
              }`}
            >
              <img
                src={img}
                alt="Behind the scenes"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyBTS;
