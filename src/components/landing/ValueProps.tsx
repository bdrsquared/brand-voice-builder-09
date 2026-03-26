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
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-6 block">
            ● Why podcasting
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            A content channel that{" "}
            <span className="text-gradient-green">actually works</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {props.map((prop, i) => (
            <motion.div
              key={prop.title}
              className="group relative p-8 sm:p-10 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <prop.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">
                {prop.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-body">
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
