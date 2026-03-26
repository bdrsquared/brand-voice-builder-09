import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import LogoWall from "./LogoWall";
import ovalBg from "@/assets/oval.png";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-6 overflow-hidden">
      {/* Large oval background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none opacity-40">
        <img src={ovalBg} alt="" className="w-full h-full object-contain" />
      </div>
      {/* Blurred shapes */}
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] blob-green-strong pointer-events-none" />
      <div className="absolute top-[50px] right-[-200px] w-[400px] h-[600px] blob-oblong-blue pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[40%] w-[300px] h-[300px] blob-blue pointer-events-none" />
      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium text-sm px-4 py-1.5 rounded-full mb-8 border border-primary/20">
            <Play className="w-3 h-3 fill-current" />
            Video Podcasting for B2B
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Turn video podcasting into a{" "}
          <span className="text-gradient-green">content engine</span> that
          drives pipeline
        </motion.h1>

        <motion.p
          className="text-center text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed font-body"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We help businesses create high-quality video podcasts that build
          authority, reach the right audience, and turn one conversation into
          consistent long and short form content.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 bg-gradient-green text-primary-foreground font-semibold px-8 py-4 rounded-full text-base transition-all hover:shadow-green"
          >
            Book a strategy call
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-6 py-4 transition-colors"
          >
            See how it works
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.p
          className="text-center text-sm text-muted-foreground font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Trusted by teams at{" "}
          <span className="font-semibold text-foreground">Experian</span>,{" "}
          <span className="font-semibold text-foreground">Cisco</span>,{" "}
          <span className="font-semibold text-foreground">IG Group</span>,{" "}
          <span className="font-semibold text-foreground">Infobip</span> and
          more
        </motion.p>

        <LogoWall />
      </div>
    </section>
  );
};

export default Hero;
