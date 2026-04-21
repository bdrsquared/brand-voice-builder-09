import { useEffect } from "react";
import { lazy, Suspense } from "react";
import TestimonialTicker from "@/components/sandbox/TestimonialTicker";
import Navbar from "@/components/sandbox/Navbar";
import Hero from "@/components/sandbox/Hero";
import ValueProps from "@/components/sandbox/ValueProps";

const Showreel = lazy(() => import("@/components/sandbox/Showreel"));
const WhyNow = lazy(() => import("@/components/sandbox/WhyNow"));
const Stats = lazy(() => import("@/components/sandbox/Stats"));
const ProblemStatement = lazy(() => import("@/components/sandbox/ProblemStatement"));
const InPractice = lazy(() => import("@/components/sandbox/InPractice"));
const HowItWorks = lazy(() => import("@/components/sandbox/HowItWorks"));
const Testimonials = lazy(() => import("@/components/sandbox/Testimonials"));
const CaseStudies = lazy(() => import("@/components/sandbox/CaseStudies"));
const Calendly = lazy(() => import("@/components/sandbox/Calendly"));
const Footer = lazy(() => import("@/components/sandbox/Footer"));

const Sandbox = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />
      <Hero />

      <Suspense fallback={null}>
        {/* Top shape divider: case study bg rounds up into black */}
        <div className="relative z-10 bg-background">
          <div className="rounded-t-[40px] sm:rounded-t-[60px] h-[40px] sm:h-[60px]" style={{ backgroundColor: "hsl(220, 12%, 7%)" }} />
        </div>

        <div className="relative" style={{ backgroundColor: "hsl(220, 12%, 7%)" }}>
          {/* Subtle accent glow */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ background: "radial-gradient(ellipse at 30% 40%, hsl(145,96%,55%) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, hsl(243,79%,63%) 0%, transparent 50%)" }} />
          <CaseStudies />
        </div>

        {/* Bottom shape divider: case study bg rounds into black */}
        <div className="relative z-10 bg-background">
          <div className="rounded-b-[40px] sm:rounded-b-[60px] h-[40px] sm:h-[60px]" style={{ backgroundColor: "hsl(220, 12%, 7%)" }} />
        </div>

        <ValueProps />

        {/* Rounded divider: dark to light */}
        <div id="light-section-start" className="relative z-10" style={{ backgroundColor: '#E4E5E9' }}>
          <div className="bg-background rounded-b-[40px] sm:rounded-b-[60px] h-[40px] sm:h-[60px]" />
        </div>

        {/* Light mode sections */}
        <div id="light-sections" className="relative" style={{ backgroundColor: '#E4E5E9' }}>
          {/* Tricolour gradient bleeding across all light sections */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse 70% 40% at 15% 40%, rgba(28, 250, 118, 0.25), transparent 70%), radial-gradient(ellipse 70% 40% at 55% 55%, rgba(99, 89, 234, 0.2), transparent 70%), radial-gradient(ellipse 70% 40% at 85% 35%, rgba(255, 179, 71, 0.2), transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <Showreel />
          <WhyNow />
          <InPractice />
        </div>

        {/* Rounded divider: light to dark */}
        <div id="light-section-end" className="relative z-10" style={{ backgroundColor: '#E4E5E9' }}>
          <div className="bg-background rounded-t-[40px] sm:rounded-t-[60px] h-[40px] sm:h-[60px]" />
        </div>

        <Stats />
        <ProblemStatement />
        <HowItWorks />

        <Testimonials />
        <Calendly />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Sandbox;
