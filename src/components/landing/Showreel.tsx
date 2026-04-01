import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { Play } from "lucide-react";
import showreelThumb from "@/assets/showreel-thumb.webp";

const AnimatedWord = ({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) => (
  <motion.span
    className={`inline-block ${className}`}
    initial={{ opacity: 0, y: 60, rotateX: 40, scale: 0.85 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.span>
);

const Showreel = () => {
  const [playing, setPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [0.65, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], [40, 16]);
  const y = useTransform(scrollYProgress, [0, 0.4], [80, 0]);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 px-6 pb-0">

      <div className="relative z-10 max-w-6xl mx-auto">
        <div ref={headingRef} className="text-left sm:text-center mb-12 sm:mb-16" style={{ perspective: "800px" }}>
          <motion.span
            className="inline-flex items-center gap-2 font-medium text-sm mb-6 text-light-text-tertiary"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            ● Working with businesses worldwide
          </motion.span>

          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-medium leading-[0.95] tracking-tight">
            <AnimatedWord delay={0.1} className="text-light-text-primary mr-[0.25em]">Check</AnimatedWord>
            <AnimatedWord delay={0.17} className="text-light-text-primary mr-[0.25em]">out</AnimatedWord>
            <AnimatedWord delay={0.24} className="text-light-text-primary mr-[0.25em]">our</AnimatedWord>
            <br className="hidden sm:block" />
            <AnimatedWord delay={0.35}>
              <span
                className="relative"
                style={{
                  background: "linear-gradient(135deg, #6359EA 0%, #1CFA76 50%, #FFB347 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                showreel
              </span>
            </AnimatedWord>
          </h2>

          {/* Animated gradient line */}
          <motion.div
            className="mx-auto sm:mx-auto mt-6 sm:mt-8 h-[2px] rounded-full origin-left"
            style={{
              background: "linear-gradient(90deg, #6359EA, #1CFA76, #FFB347)",
              maxWidth: "200px",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            className="mt-5 sm:mt-6 text-base sm:text-lg text-light-text-secondary max-w-xl sm:mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            World-class creative, built for brands that take content seriously.
          </motion.p>
        </div>

        <motion.div
          className="relative rounded-2xl overflow-hidden border border-black/10 shadow-lg will-change-transform"
          style={{ scale, opacity }}
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
