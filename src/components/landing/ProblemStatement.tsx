import { motion } from "framer-motion";
import problemVisual from "@/assets/problem-visual.jpg";

const ProblemStatement = () => {
  return (
    <section className="relative py-16 sm:py-20 px-6">
      {/* Blurred shapes */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[300px] blob-oblong-green pointer-events-none" />
      <div className="absolute top-[-80px] left-[-150px] w-[350px] h-[350px] blob-blue pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-accent font-medium text-sm mb-8 block">
            ● The problem
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-10">
            Most B2B content doesn't build{" "}
            <span className="text-muted-foreground">relationships.</span>{" "}
            It builds noise.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 text-muted-foreground text-lg leading-relaxed font-body">
            <p>
              Blog posts get skimmed. Social posts get scrolled past. Your ICP
              is drowning in AI-generated content that all sounds the same.
              None of it creates real connection or trust.
            </p>
            <p>
              Meanwhile, the companies winning their categories are doing
              something different — they're having real conversations with the
              right people, on camera, and turning those conversations into
              content that actually compounds.
            </p>
          </div>

          <motion.div
            className="rounded-2xl overflow-hidden border border-border"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={problemVisual}
              alt="Content noise vs podcast signal"
              className="w-full h-auto object-cover"
              loading="lazy"
              width={1200}
              height={512}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;
