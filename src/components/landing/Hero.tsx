import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import LogoWall from "./LogoWall";
import DotsBackground from "./DotsBackground";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-28 px-6">
      {/* Animated dots background */}
      <DotsBackground />
      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/[0.08] via-card/60 to-accent/[0.06] text-foreground font-medium text-sm px-7 py-3 rounded-full mb-6 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_20px_rgba(28,250,118,0.06),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl tracking-widest uppercase text-xs transition-all duration-300 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_30px_rgba(28,250,118,0.1),0_4px_16px_rgba(0,0,0,0.5)] hover:border-white/[0.12] cursor-default">
            Content Partner
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 text-text-primary"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Turn video podcasting into a{" "}
          <span className="italic bg-gradient-to-r from-[#1CFA76] via-[#6359EA] to-[#40ABB2] bg-clip-text text-transparent opacity-90">content engine</span> that
          drives growth
        </motion.h1>

        <motion.p
          className="text-center text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed font-body"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We help businesses create high-quality video podcasts that build
          authority, reach the right audience, and turn one conversation into
          consistent long and short form content.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-base text-white bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-white/[0.14] hover:border-white/[0.25] hover:shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          >
            Book a strategy call
            <Calendar className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>
          <a
            href="/#how-it-works"
            className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary font-medium px-6 py-4 transition-colors text-sm"
          >
            See how we work
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.p
          className="text-center text-xs text-text-tertiary font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Trusted by teams at{" "}
          <span className="font-semibold text-text-primary">Experian</span>,{" "}
          <span className="font-semibold text-text-primary">Cisco</span>,{" "}
          <span className="font-semibold text-text-primary">IG Group</span>,{" "}
          <span className="font-semibold text-text-primary">Infobip</span> and
          more
        </motion.p>

        <LogoWall />
      </div>
    </section>
  );
};

export default Hero;
