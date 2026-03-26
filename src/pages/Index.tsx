import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Showreel from "@/components/landing/Showreel";
import ProblemStatement from "@/components/landing/ProblemStatement";
import ValueProps from "@/components/landing/ValueProps";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Showreel />
      <ValueProps />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
