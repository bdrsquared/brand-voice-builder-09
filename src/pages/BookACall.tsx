import Navbar from "@/components/landing/Navbar";
import Calendly from "@/components/landing/Calendly";
import Footer from "@/components/landing/Footer";
import useMetaTags from "@/hooks/useMetaTags";

const BookACall = () => {
  useMetaTags();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <Calendly />
      </div>
      <Footer />
    </div>
  );
};

export default BookACall;
