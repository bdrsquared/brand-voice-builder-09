import { motion } from "framer-motion";
import { Crown, Target, Layers, TrendingUp } from "lucide-react";
import EngagementScroll from "./EngagementScroll";
import AuthorityPulse from "./AuthorityPulse";
import PipelineBoard from "./PipelineBoard";
import ContentEngine from "./ContentEngine";

const props = [
  {
    icon: Crown,
    title: "Build category authority",
    description:
      "Position your brand as the voice of your industry. Every episode is a stage where you lead the conversation, not follow it.",
    color: "green" as const,
  },
  {
    icon: Target,
    title: "Reach your exact ICP",
    description:
      "Your guests are your prospects. Invite the right people, build real relationships, and create content that speaks directly to the buyers you want.",
    color: "blue" as const,
  },
  {
    icon: Layers,
    title: "One session, endless content",
    description:
      "A single recording becomes long-form video, short clips, audiograms, blog posts, social content, and newsletter material. Record once, distribute everywhere.",
    color: "blue" as const,
  },
  {
    icon: TrendingUp,
    title: "Drive actual pipeline",
    description:
      "This isn't vanity metrics. Podcasting creates warm relationships with prospects, builds trust at scale, and gives your sales team a reason to follow up.",
    color: "green" as const,
  },
];

const iconStyles = {
  green: "bg-primary/10 text-primary",
  blue: "bg-accent/10 text-accent",
};

const ValueProps = () => {
  return (
    <section className="relative py-16 sm:py-20 px-6">
      {/* Blurred shapes */}
      <div className="absolute top-[50px] left-[-200px] w-[400px] h-[500px] blob-oblong-green pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-150px] w-[350px] h-[350px] blob-blue-strong pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
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
              className="group relative p-8 sm:p-10 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {prop.title === "Build category authority" ? (
                <div className="mb-6">
                  <AuthorityPulse />
                </div>
              ) : prop.title === "Reach your exact ICP" ? (
                <div className="mb-6">
                  <EngagementScroll />
                </div>
              ) : prop.title === "Drive actual pipeline" ? (
                <div className="mb-6">
                  <PipelineBoard />
                </div>
              ) : prop.title === "One session, endless content" ? (
                <div className="mb-6">
                  <ContentEngine />
                </div>
              ) : (
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-colors ${iconStyles[prop.color]}`}>
                  <prop.icon className="w-5 h-5" />
                </div>
              )}
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
