import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Strategy & guest mapping",
    description:
      "We help you define the conversations that matter — topics that position you as a leader and guests that are your ideal customers or connectors.",
  },
  {
    number: "02",
    title: "Record & produce",
    description:
      "Show up and have a great conversation. We handle everything else — production, editing, and post-production to broadcast quality.",
  },
  {
    number: "03",
    title: "Distribute & repurpose",
    description:
      "One recording becomes dozens of content assets. Long-form video, short clips, written content, social posts — all on-brand and ready to publish.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 px-6">
      {/* Blurred shapes */}
      <div className="absolute top-[-50px] right-[-100px] w-[500px] h-[350px] blob-oblong-blue pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[400px] blob-green pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-6 block">
            ● How it works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Simple process.{" "}
            <span className="text-muted-foreground">Serious output.</span>
          </h2>
        </motion.div>

        <div className="space-y-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex gap-8 sm:gap-10 items-start p-8 sm:p-10 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <span className="text-4xl sm:text-5xl font-bold text-gradient-green shrink-0 font-heading">
                {step.number}
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-body">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
