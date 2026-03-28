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
      <Showreel />
      <WhyNow />
      <InPractice />
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
