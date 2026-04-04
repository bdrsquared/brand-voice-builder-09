import { useEffect } from "react";
import { lazy, Suspense } from "react";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Navbar from "@/components/landing/Navbar";
import HeroSplit from "@/components/landing/HeroSplit";
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
      <HeroSplit />
      
      <Suspense fallback={null}>
        <CaseStudies />
        <ValueProps />

        <div id="light-section-start" className="relative z-10" style={{ backgroundColor: '#E4E5E9' }}>
          <div className="bg-background rounded-b-[40px] sm:rounded-b-[60px] h-[40px] sm:h-[60px]" />
        </div>

        <div id="light-sections" className="relative" style={{ backgroundColor: '#E4E5E9' }}>
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
