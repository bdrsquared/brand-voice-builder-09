import { lazy, Suspense } from "react";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import useMetaTags from "@/hooks/useMetaTags";
import ValueProps from "@/components/landing/ValueProps";

const Showreel = lazy(() => import("@/components/landing/Showreel"));
const WhyNow = lazy(() => import("@/components/landing/WhyNow"));
const Stats = lazy(() => import("@/components/landing/Stats"));
const ProblemStatement = lazy(() => import("@/components/landing/ProblemStatement"));
const InPractice = lazy(() => import("@/components/landing/InPractice"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const CaseStudies = lazy(() => import("@/components/landing/CaseStudies"));
const Calendly = lazy(() => import("@/components/landing/Calendly"));
const Footer = lazy(() => import("@/components/landing/Footer"));

const Index = () => {
  useMetaTags();
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />
      <Hero />
      
      <Suspense fallback={null}>
        {/* Top shape divider: case study light bg rounds up into black */}
        <div className="relative z-10 bg-background">
          <div className="rounded-t-[40px] sm:rounded-t-[60px] h-[40px] sm:h-[60px]" style={{ backgroundColor: "#E4E5E9" }} />
        </div>

        <div className="relative" style={{ backgroundColor: "#E4E5E9" }}>
          {/* Subtle accent glow */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.18]" style={{ background: "radial-gradient(ellipse at 30% 40%, hsl(145,96%,55%) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, hsl(243,79%,63%) 0%, transparent 50%)" }} />
          <CaseStudies />
        </div>

        {/* Bottom shape divider: case study light bg rounds into black */}
        <div className="relative z-10 bg-background">
          <div className="rounded-b-[40px] sm:rounded-b-[60px] h-[40px] sm:h-[60px]" style={{ backgroundColor: "#E4E5E9" }} />
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

export default Index;
