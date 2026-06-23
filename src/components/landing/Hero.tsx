import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import LogoWall from "./LogoWall";
import { heroMarqueeFirstImage } from "./HeroMarquee";


const ShaderBackground = lazy(() => import("./ShaderBackground"));
const HeroMarquee = lazy(() => import("./HeroMarquee"));
const MotionHero = lazy(() => import("./HeroMotion"));

interface HeroProps {
  variant?: "classic" | "dots";
}

const Hero = ({ variant = "classic" }: HeroProps) => {
  const [isMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  // On mobile, delay-mount the marquee so the LCP text paints first.
  const [showMarquee, setShowMarquee] = useState(!isMobile);
  useEffect(() => {
    if (!isMobile || showMarquee) return;
    const id = window.setTimeout(() => setShowMarquee(true), 400);
    return () => window.clearTimeout(id);
  }, [isMobile, showMarquee]);

  return (
    <section className="relative px-6 overflow-hidden">
      {/* Preload first marquee image so the browser fetches it immediately, not after JS executes */}
      <link rel="preload" as="image" href={heroMarqueeFirstImage} fetchPriority="high" />

      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <div
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 30% 30%, #15d668 0%, transparent 55%), radial-gradient(ellipse 70% 55% at 75% 70%, #4a42c0 0%, transparent 55%), linear-gradient(180deg, #0a1410 0%, #0b0f1a 100%)",
            }}
          />
        ) : (
          <Suspense fallback={null}>
            <ShaderBackground>
              <></>
            </ShaderBackground>
          </Suspense>
        )}
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 55%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, transparent 80%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

      <div className="relative z-10 max-w-6xl mx-auto pt-36 pb-6 sm:pt-44 sm:pb-16">
        {isMobile ? (
          // Mobile: plain HTML, no framer-motion — protects LCP.
          <>
            <div className="text-center">
              <span className="inline-flex items-center gap-2 bg-white/[0.12] text-white font-medium px-5 py-2 rounded-full mb-5 border border-white/[0.18] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.25)] backdrop-blur-xl tracking-widest uppercase text-[11px]">
                Content Partner
              </span>
            </div>
            <h1 className="text-center text-[2.25rem] leading-[1.05] mb-5 text-text-primary max-w-5xl mx-auto">
              Strategic video podcasts for <span className="italic">forward thinking</span> businesses
            </h1>
            <p
              className="text-center text-base text-white/85 max-w-2xl mx-auto mb-7 leading-relaxed font-body"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.4)" }}
            >
              A complete video content system designed for growth
            </p>
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
              <a
                href="#contact"
                className={`group relative inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-[15px] transition-all duration-300 ${
                  variant === "classic"
                    ? "glow-on-hover text-primary-foreground"
                    : "text-white bg-white/[0.08] backdrop-blur-xl border border-white/[0.12]"
                }`}
              >
                Start a conversation
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="/#how-it-works"
                className="inline-flex items-center gap-2 text-white/75 hover:text-white font-medium px-5 py-3.5 transition-colors text-[15px]"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}
              >
                See how we work
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {showMarquee && (
              <Suspense fallback={null}>
                <HeroMarquee />
              </Suspense>
            )}

            <p
              className="text-center text-[11px] text-white/60 font-body mt-6"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}
            >
              Trusted by teams at{" "}
              <span className="font-semibold text-white">Experian</span>,{" "}
              <span className="font-semibold text-white">Cisco</span>,{" "}
              <span className="font-semibold text-white">IG Group</span>,{" "}
              <span className="font-semibold text-white">Infobip</span> and more
            </p>

            <LogoWall />
          </>
        ) : (
          <Suspense fallback={null}>
            <MotionHero variant={variant} />
          </Suspense>
        )}
      </div>
    </section>
  );
};

export default Hero;
