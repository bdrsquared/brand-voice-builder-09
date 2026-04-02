import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import DotsBackground from "@/components/landing/DotsBackground";
import useMetaTags from "@/hooks/useMetaTags";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center relative overflow-hidden px-4 min-h-[70vh]">
        <DotsBackground />
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

        <div className="text-center max-w-2xl mx-auto relative z-10">
          {/* Big 404 */}
          <p className="text-[10rem] sm:text-[14rem] font-display font-bold leading-none tracking-tighter text-white/[0.04] select-none">
            404
          </p>

          {/* Main message */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold -mt-16 sm:-mt-24 mb-4">
            Oops, you might be lost?
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* CTA */}
          <Link to="/">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium gap-2 bg-[#1CFA76] hover:bg-[#1CFA76]/90 text-black"
            >
              <Home className="w-5 h-5" />
              Back to safety
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
