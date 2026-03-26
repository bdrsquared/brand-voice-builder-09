import { motion } from "framer-motion";
import { Crown, Target, Layers, TrendingUp } from "lucide-react";

const props = [
  {
    icon: Crown,
    title: "Build category authority",
    description:
      "Position your brand as the voice of your industry. Every episode is a stage where you lead the conversation, not follow it.",
  },
  {
    icon: Target,
    title: "Reach your exact ICP",
    description:
      "Your guests are your prospects. Invite the right people, build real relationships, and create content that speaks directly to the buyers you want.",
  },
  {
    icon: Layers,
    title: "One session, endless content",
    description:
      "A single recording becomes long-form video, short clips, audiograms, blog posts, social content, and newsletter material. Record once, distribute everywhere.",
  },
  {
    icon: TrendingUp,
    title: "Drive actual pipeline",
    description:
      "This isn't vanity metrics. Podcasting creates warm relationships with prospects, builds trust at scale, and gives your sales team a reason to follow up.",
  },
];

const ValueProps = () => {
  return (
    <section className="py-24 sm:py-32 px-6 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-sm tracking-widest uppercase text-primary mb-6 block">
            Why podcasting
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            A content channel that{" "}
            <span className="text-gradient-gold">actually works</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {props.map((prop, i) => (
            <motion.div
              key={prop.title}
              className="group relative p-8 sm:p-10 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                <prop.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">
                {prop.title}
              </h3>
              <p className="text-secondary-foreground leading-relaxed">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
