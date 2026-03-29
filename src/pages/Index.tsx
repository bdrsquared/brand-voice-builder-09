import { lazy, Suspense } from "react";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
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
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />
      <Hero />
      
      <Suspense fallback={null}>
        <CaseStudies />
        <ValueProps />

        {/* Rounded divider: dark to light */}
        <div id="light-section-start" className="relative z-10" style={{ backgroundColor: '#E4E5E9' }}>
          <div className="bg-background rounded-b-[40px] sm:rounded-b-[60px] h-[40px] sm:h-[60px]" />
        </div>

        {/* Light mode sections */}
        <div id="light-sections" style={{ backgroundColor: '#E4E5E9' }}>
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
