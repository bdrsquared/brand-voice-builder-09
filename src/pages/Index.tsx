import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Showreel from "@/components/landing/Showreel";
import WhyNow from "@/components/landing/WhyNow";
import Stats from "@/components/landing/Stats";
import ProblemStatement from "@/components/landing/ProblemStatement";
import ValueProps from "@/components/landing/ValueProps";
import InPractice from "@/components/landing/InPractice";
import HowItWorks from "@/components/landing/HowItWorks";

import Testimonials from "@/components/landing/Testimonials";
import WhoIsFor from "@/components/landing/WhoIsFor";
import CaseStudies from "@/components/landing/CaseStudies";
import Calendly from "@/components/landing/Calendly";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />
      <Hero />
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
      <CaseStudies />
      <Calendly />
      <Footer />
    </div>
  );
};

export default Index;
