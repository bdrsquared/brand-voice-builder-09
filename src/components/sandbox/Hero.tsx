import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import LogoWall from "./LogoWall";
import ShaderBackground from "./ShaderBackground";
import HeroMarquee from "./HeroMarquee";

interface HeroProps {
  variant?: "classic" | "dots";
}

const Hero = ({ variant = "classic" }: HeroProps) => {

  return (
    <section className="relative px-6 overflow-hidden">
      {/* Animated mesh-shader background fills the hero */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground>
          <></>
        </ShaderBackground>
      </div>

      {/* Centred dark scrim — keeps body copy readable over the bright mesh */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 55%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, transparent 80%)",
        }}
      />

      {/* Bottom fade so the hero blends into the section below */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

      <div className="relative z-10 max-w-6xl mx-auto pt-24 pb-6 sm:pt-28 sm:pb-16">
        <motion.div
          className="text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/[0.12] text-white font-medium px-5 py-2 rounded-full mb-5 border border-white/[0.18] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.25)] backdrop-blur-xl tracking-widest uppercase text-[11px] transition-all duration-300 hover:bg-white/[0.16] hover:border-white/[0.24] cursor-default">
            Content Partner
          </span>
        </motion.div>

        <motion.h1
          className="text-center sm:text-left text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.05] mb-5 text-text-primary max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Strategic video podcast for <span className="italic">forward thinking</span> businesses
        </motion.h1>

        <motion.p
          className="text-center sm:text-left text-base sm:text-lg text-white/85 max-w-2xl mx-auto sm:mx-0 mb-7 leading-relaxed font-body"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.4)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          High-quality video podcasts that build authority, reach the right audience, and turn one conversation into consistent long and short form content.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-start justify-center gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="#contact"
            className={`group relative inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-[15px] transition-all duration-300 ${
              variant === "classic"
                ? "glow-on-hover text-primary-foreground"
                : "text-white bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/[0.14] hover:border-white/[0.2] hover:shadow-[0_4px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.04)]"
            }`}
          >
            Start a conversation
            <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>
          <a
            href="/#how-it-works"
            className="inline-flex items-center gap-2 text-white/75 hover:text-white font-medium px-5 py-3.5 transition-colors text-[15px]"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}
          >
            See how we work
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <HeroMarquee />

        <motion.p
          className="text-center sm:text-left text-[11px] text-white/60 font-body mt-6"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Trusted by teams at{" "}
          <span className="font-semibold text-white">Experian</span>,{" "}
          <span className="font-semibold text-white">Cisco</span>,{" "}
          <span className="font-semibold text-white">IG Group</span>,{" "}
          <span className="font-semibold text-white">Infobip</span> and more
        </motion.p>

        <LogoWall />
      </div>
    </section>
  );
};

export default Hero;
