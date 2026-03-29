import { motion } from "framer-motion";
import { Wand2, ListChecks, Share2, ClipboardList } from "lucide-react";
import process3d from "@/assets/process-3d.webp";

const steps = [
  {
    icon: Wand2,
    title: "Create",
    description:
      "We shape the foundations of the show - sourcing the right host, defining themes, naming the podcast, setting creative direction, and agreeing clear timelines. We incubate the idea properly, so you're ready to launch with confidence, not guesswork.",
  },
  {
    icon: ListChecks,
    title: "Produce",
    description:
      "Every episode is carefully planned and managed end-to-end. We handle scheduling, research, guest sourcing, recording, and production - so your podcast runs smoothly on autopilot.",
  },
  {
    icon: Share2,
    title: "Publish",
    description:
      "One episode becomes content everywhere. Each recording is distributed as video, audio, clips, teasers, reels, blog content, and newsletters - designed to show up consistently across every channel that matters.",
  },
  {
    icon: ClipboardList,
    title: "Report",
    description:
      "Decision-grade reporting that goes beyond downloads. See who's listening, how content is performing, audience trends, and engagement signals - giving your team the insight needed to refine strategy and support growth.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 px-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left column */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 text-text-primary">
              Our process
            </h2>
            <p className="text-base text-text-secondary leading-relaxed max-w-md font-body">
              Our process is designed to take the complexity out of podcasting. We handle everything from idea to insight, so your show runs consistently and delivers real value for the business.
            </p>
          </motion.div>
          <motion.div
            className="-mt-40 -mb-64 lg:-mt-[100px] lg:mb-0 relative z-0 flex items-center justify-center lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={process3d}
              alt="Abstract 3D shapes"
              loading="lazy"
              width={640}
              height={800}
              className="w-[210%] max-w-none -ml-[30%] -mt-[15%] sm:mt-0 sm:w-[150%] sm:-ml-[20%] lg:-ml-[35%] lg:w-[160%]"
            />
          </motion.div>
        </div>

        {/* Right column - cards */}
        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 sm:p-8 hover:border-primary/20 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl text-text-primary">{step.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed font-body">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
