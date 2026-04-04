import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import LogoWall from "./LogoWall";
import DotsBackground from "./DotsBackground";
import heroImage from "@/assets/hero-podcast-mic.png";

const HeroSplit = () => {
  return (
    <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-20 px-6">
      <DotsBackground />
      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/[0.08] via-card/60 to-accent/[0.06] text-foreground font-medium text-xs px-7 py-3 rounded-full mb-6 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_20px_rgba(28,250,118,0.06),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl tracking-widest uppercase transition-all duration-300 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_30px_rgba(28,250,118,0.1),0_4px_16px_rgba(0,0,0,0.5)] hover:border-white/[0.12] cursor-default">
              Content Partner
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-[1.05] mb-6 text-text-primary">
              Turn video podcasting into a{" "}
              <span className="italic text-white">content engine</span> that drives{" "}
              <span className="text-white">growth</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-xl mb-8 leading-relaxed font-body">
              We help businesses create high-quality video podcasts that build
              authority, reach the right audience, and turn one conversation into
              consistent long and short form content.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 text-white bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/[0.14] hover:border-white/[0.2] hover:shadow-[0_4px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.04)]"
              >
                Start a conversation
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="/#how-it-works"
                className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary font-medium px-6 py-4 transition-colors text-sm"
              >
                See how we work
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs text-text-tertiary font-body">
              Trusted by teams at{" "}
              <span className="font-semibold text-text-primary">Experian</span>,{" "}
              <span className="font-semibold text-text-primary">Cisco</span>,{" "}
              <span className="font-semibold text-text-primary">IG Group</span>,{" "}
              <span className="font-semibold text-text-primary">Infobip</span> and
              more
            </p>
          </motion.div>

          {/* Right column - Image with notch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Image container with notch cutout */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={heroImage}
                  alt="Professional podcast microphone"
                  className="w-full h-auto object-cover aspect-[5/6]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>

            </div>
          </motion.div>
        </div>

        <LogoWall />
      </div>
    </section>
  );
};

export default HeroSplit;
