import { motion } from "framer-motion";
import spotHandshake from "@/assets/spot-handshake.png";
import spotWarmth from "@/assets/spot-warmth.png";
import spotOutreach from "@/assets/spot-outreach.png";
import spotSpeed from "@/assets/spot-speed.png";

const outcomes = [
  {
    image: spotHandshake,
    title: "Build real relationships with prospects",
    description: "Invite your ideal customers as guests. By the time the episode wraps, you've built a genuine connection — not a cold lead.",
  },
  {
    image: spotWarmth,
    title: "Warm leads before sales conversations",
    description: "Prospects who've watched your content arrive educated, aligned, and ready to talk. No more starting from zero.",
  },
  {
    image: spotOutreach,
    title: "Give sales teams a reason to reach out",
    description: "\"Hey, I'd love to have you on our podcast\" is the most effective outreach message in B2B. It opens doors that cold emails can't.",
  },
  {
    image: spotSpeed,
    title: "Shorten sales cycles, increase trust",
    description: "When prospects already know your voice, your thinking, and your values — the sale happens faster and with less friction.",
  },
];

const PipelineImpact = () => {
  return (
    <section className="relative py-24 sm:py-32 px-6 overflow-hidden">
      <div className="absolute top-[-60px] right-[-180px] w-[450px] h-[350px] blob-oblong-green pointer-events-none" />
      <div className="absolute bottom-[-120px] left-[-100px] w-[350px] h-[350px] blob-blue-strong pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-6 block">
            ● Commercial impact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Content that drives{" "}
            <span className="text-gradient-green">real pipeline</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {outcomes.map((o, i) => (
            <motion.div
              key={o.title}
              className="p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <o.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{o.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-body">{o.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineImpact;
