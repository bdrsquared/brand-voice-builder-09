import { motion } from "framer-motion";
import howStrategy from "@/assets/how-strategy.jpg";
import howRecord from "@/assets/how-record.jpg";
import howDistribute from "@/assets/how-distribute.jpg";

const steps = [
  {
    number: "01",
    title: "Strategy & guest mapping",
    description:
      "We help you define the conversations that matter — topics that position you as a leader and guests that are your ideal customers or connectors.",
    image: howStrategy,
  },
  {
    number: "02",
    title: "Record & produce",
    description:
      "Show up and have a great conversation. We handle everything else — production, editing, and post-production to broadcast quality.",
    image: howRecord,
  },
  {
    number: "03",
    title: "Distribute & repurpose",
    description:
      "One recording becomes dozens of content assets. Long-form video, short clips, written content, social posts — all on-brand and ready to publish.",
    image: howDistribute,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-20 px-6">
      {/* Blurred shapes */}
      <div className="absolute top-[-50px] right-[-100px] w-[500px] h-[350px] blob-oblong-blue pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[400px] blob-green pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
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
              className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start p-8 sm:p-10 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className="flex gap-8 sm:gap-10 items-start flex-1 min-w-0">
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
              </div>
              <div className="w-full sm:w-48 md:w-56 shrink-0 rounded-xl overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-32 sm:h-36 object-cover rounded-xl"
                  loading="lazy"
                  width={800}
                  height={512}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
