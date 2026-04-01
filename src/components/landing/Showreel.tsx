import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState, useRef } from "react";
import { Play } from "lucide-react";
import showreelThumb from "@/assets/showreel-thumb.webp";

const ScrollRevealText = ({ text, gradient, scrollProgress, startAt, endAt }: {
  text: string;
  gradient?: boolean;
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
        const charProgress = Math.min(1, Math.max(0, (progress * text.length - i) / 1.5));
        const isSpace = char === " ";
        return (
          <span
            key={i}
            className={isSpace ? "" : "inline-block"}
            style={{
              opacity: 0.12 + charProgress * 0.88,
              transform: `translateY(${(1 - charProgress) * 14}px)`,
              ...(gradient && charProgress > 0.5
                ? {
                    background: "linear-gradient(135deg, #6359EA 0%, #1CFA76 50%, #FFB347 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }
                : gradient
                ? { color: "rgba(115,115,115,0.3)" }
                : {}),
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
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [0.65, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], [40, 16]);
  const y = useTransform(scrollYProgress, [0, 0.4], [80, 0]);

  const subOpacity = useTransform(scrollYProgress, [0.18, 0.25], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.18, 0.25], [15, 0]);
  const lineScaleX = useTransform(scrollYProgress, [0.15, 0.22], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 px-6 pb-0">

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-left sm:text-center mb-12 sm:mb-16">
          <motion.span
            className="inline-flex items-center gap-2 font-medium text-sm mb-6 text-light-text-tertiary"
            style={{ opacity: useTransform(scrollYProgress, [0.02, 0.08], [0, 1]) }}
          >
            ● Working with businesses worldwide
          </motion.span>

          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-medium leading-[0.95] tracking-tight">
            <span className="text-light-text-primary">
              <ScrollRevealText text="Check out our" scrollProgress={scrollYProgress} startAt={0.03} endAt={0.15} />
            </span>
            <br className="hidden sm:block" />
            <ScrollRevealText text="showreel" gradient scrollProgress={scrollYProgress} startAt={0.1} endAt={0.2} />
          </h2>

          <motion.div
            className="mx-auto mt-6 sm:mt-8 h-[2px] rounded-full origin-left"
            style={{
              background: "linear-gradient(90deg, #6359EA, #1CFA76, #FFB347)",
              maxWidth: "200px",
              scaleX: lineScaleX,
              opacity: lineScaleX,
            }}
          />

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
