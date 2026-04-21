import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import SectionPill from "./SectionPill";
import { useState, useRef } from "react";
import { Play } from "lucide-react";
import showreelThumb from "@/assets/showreel-thumb.webp";

const ScrollRevealText = ({ text, scrollProgress, startAt, endAt }: {
  text: string;
  scrollProgress: any;
  startAt: number;
  endAt: number;
}) => {
  const [progress, setProgress] = useState(0);
  const mapped = useTransform(scrollProgress, [startAt, endAt], [0, 1]);
  useMotionValueEvent(mapped, "change", (v: number) => setProgress(v));

  return (
    <>
      {text.split("").map((char, i) => {
        const isSpace = char === " ";
        const normalizedIndex = text.length > 1 ? i / (text.length - 1) : 0;
        const charStart = normalizedIndex * 0.58;
        const charProgress = Math.min(1, Math.max(0, (progress - charStart) / 0.42));
        return (
          <span
            key={i}
            style={{
              opacity: 0.12 + charProgress * 0.88,
              display: "inline-block",
              transform: isSpace ? undefined : `translateY(${(1 - charProgress) * 14}px)`,
            }}
          >
            {isSpace ? "\u00A0" : char}
          </span>
        );
      })}
    </>
  );
};

const Showreel = () => {
  const [playing, setPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [0.65, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], [40, 16]);
  const y = useTransform(scrollYProgress, [0, 0.4], [80, 0]);

  const subOpacity = useTransform(scrollYProgress, [0.18, 0.25], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.18, 0.25], [15, 0]);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-28 px-4 sm:px-6 pb-0">

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="relative text-left sm:text-center mb-14 sm:mb-16">
          {/* Brand gradient blobs behind the title */}
          <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden>
            <div className="absolute top-1/2 left-1/2 -translate-x-[70%] -translate-y-[60%] w-[280px] h-[280px] sm:w-[450px] sm:h-[400px] rounded-full bg-accent opacity-[0.22] sm:opacity-[0.18] blur-[80px] sm:blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-[30%] -translate-y-[40%] w-[260px] h-[260px] sm:w-[400px] sm:h-[350px] rounded-full bg-primary opacity-[0.18] sm:opacity-[0.15] blur-[80px] sm:blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 translate-x-[10%] -translate-y-[50%] w-[240px] h-[240px] sm:w-[350px] sm:h-[300px] rounded-full bg-brand-orange opacity-[0.18] sm:opacity-[0.15] blur-[80px] sm:blur-[100px]" />
          </div>

          <motion.span
            className="mb-5 sm:mb-6"
            style={{ opacity: useTransform(scrollYProgress, [0.02, 0.08], [0, 1]) }}
          >
            <SectionPill variant="light" className="mb-[25px]">Working with businesses worldwide</SectionPill>
          </motion.span>

          <h2 className="text-[11vw] sm:text-5xl md:text-7xl lg:text-8xl font-heading font-medium leading-[0.95] tracking-tight text-light-text-primary">
            <ScrollRevealText text="Check out our" scrollProgress={scrollYProgress} startAt={0.03} endAt={0.19} />
            <br />
            <ScrollRevealText text="showreel" scrollProgress={scrollYProgress} startAt={0.1} endAt={0.26} />
          </h2>

          <motion.p
            className="mt-5 sm:mt-6 text-base sm:text-lg text-light-text-secondary max-w-xl sm:mx-auto"
            style={{ opacity: subOpacity, y: subY }}
          >
            World-class creative, built for brands that take content seriously.
          </motion.p>
        </div>

        <motion.div
          className="relative overflow-hidden will-change-transform"
          style={{ scale, opacity, y, borderRadius, boxShadow: "0 25px 60px -15px rgba(0,0,0,0.3)" }}
        >
          {/* Mobile: portrait | Desktop: 16:9 */}
          <div className="relative aspect-[3/4] sm:aspect-video">
            {playing ? (
              <iframe
                src="https://player.vimeo.com/video/1103156714?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&autoplay=1"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                title="Showreel"
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="absolute top-0 left-0 w-full h-full group cursor-pointer"
              >
                <img
                  src={showreelThumb}
                  alt="Showreel thumbnail"
                  loading="lazy"
                  className="w-full h-full object-cover object-[70%_center] sm:object-center"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/30 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-black/40">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                  </div>
                </div>
              </button>
            )}
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default Showreel;
