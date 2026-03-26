import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Showreel from "@/components/landing/Showreel";
import WhyNow from "@/components/landing/WhyNow";
import Stats from "@/components/landing/Stats";
import ProblemStatement from "@/components/landing/ProblemStatement";
import ValueProps from "@/components/landing/ValueProps";
import InPractice from "@/components/landing/InPractice";
import HowItWorks from "@/components/landing/HowItWorks";
import PipelineImpact from "@/components/landing/PipelineImpact";
import Testimonials from "@/components/landing/Testimonials";
import WhoIsFor from "@/components/landing/WhoIsFor";

import CTA from "@/components/landing/CTA";
import Calendly from "@/components/landing/Calendly";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Showreel />
      <WhyNow />
      <Stats />
      <ProblemStatement />
      <ValueProps />
      <InPractice />
      <HowItWorks />
      <PipelineImpact />
      <Testimonials />
      <WhoIsFor />
      
      <CTA />
      <Calendly />
      <Footer />
    </div>
  );
};

export default Index;
