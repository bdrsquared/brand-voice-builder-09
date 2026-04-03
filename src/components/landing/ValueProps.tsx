import { motion } from "framer-motion";
import SectionPill from "./SectionPill";
import { Crown, Target, Layers, TrendingUp } from "lucide-react";
import EngagementScroll from "./EngagementScroll";
import AuthorityPulse from "./AuthorityPulse";
import PipelineBoard from "./PipelineBoard";
import ContentEngine from "./ContentEngine";

const props = [
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
  {
    icon: Crown,
    title: "Build category authority",
    description:
      "Position your brand as the voice of your industry. Every episode is a stage where you lead the conversation, not follow it.",
    color: "green" as const,
  },
];

const iconStyles = {
  green: "bg-primary/10 text-primary",
  blue: "bg-accent/10 text-accent",
};

const ValueProps = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6 overflow-hidden">
      <div className="absolute top-[50px] left-[-200px] w-[400px] h-[500px] blob-oblong-green pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-150px] w-[350px] h-[350px] blob-blue-strong pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionPill variant="dark" className="mb-6">Why podcasting</SectionPill>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
            Plug the power of a{" "}
            <span className="text-gradient-green">video podcast</span>{" "}
            in to your business
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {props.map((prop, i) => (
            <motion.div
              key={prop.title}
              className="group relative p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden min-w-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              {prop.title === "Build category authority" ? (
                <div className="mb-5">
                  <AuthorityPulse />
                </div>
              ) : prop.title === "Reach your exact ICP" ? (
                <div className="mb-5">
                  <EngagementScroll />
                </div>
              ) : prop.title === "Drive actual pipeline" ? (
                <div className="mb-5">
                  <PipelineBoard />
                </div>
              ) : prop.title === "One session, endless content" ? (
                <div className="mb-5">
                  <ContentEngine />
                </div>
              ) : (
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors ${iconStyles[prop.color]}`}>
                  <prop.icon className="w-5 h-5" />
                </div>
              )}
              <h3 className="text-lg sm:text-xl mb-2 text-text-primary">
                {prop.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-body">
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
