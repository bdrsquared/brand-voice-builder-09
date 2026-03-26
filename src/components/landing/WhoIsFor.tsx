import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forItems = [
  "B2B and enterprise companies serious about category leadership",
  "Marketing leaders who want a consistent, scalable content engine",
  "Founders and executives ready to be the voice of their brand",
  "Teams who understand content is a long-term investment, not a quick fix",
];

const notForItems = [
  "Companies looking for one-off content projects",
  "Teams without a clear ICP or business goal for their content",
  "Brands that want to outsource without any involvement",
];

const WhoIsFor = () => {
  return (
    <section className="relative py-16 sm:py-20 px-6">
      <div className="absolute top-[-80px] left-[-120px] w-[350px] h-[350px] blob-blue pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-100px] w-[300px] h-[400px] blob-oblong-green pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-accent font-medium text-sm mb-6 block">
            ● Who this is for
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-12">
            We're selective about who we work with.{" "}
            <span className="text-muted-foreground">Here's why.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          <motion.div
            className="p-8 rounded-2xl border border-primary/20 bg-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-primary">This is for you if…</h3>
            <ul className="space-y-4">
              {forItems.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80 font-body leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="p-8 rounded-2xl border border-border bg-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-muted-foreground">This isn't for you if…</h3>
            <ul className="space-y-4">
              {notForItems.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground font-body leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsFor;
