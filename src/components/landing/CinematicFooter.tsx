import { useEffect, useRef, forwardRef, type ReactNode, type ElementType } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Linkedin, ArrowUp } from "lucide-react";
import logo from "@/assets/earworm-logo.webp";
import { cn } from "@/lib/utils";

// ----------------- Magnetic Button (no GSAP) -----------------
type MagneticProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  href?: string;
  to?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

const MagneticButton = forwardRef<HTMLElement, MagneticProps>(
  ({ children, className, as: Component = "button", ...props }, _ref) => {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      };
      const onLeave = () => {
        el.style.transform = "translate(0, 0)";
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => (ref.current = node)}
        className={cn(
          "inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// ----------------- Marquee row -----------------
const MARQUEE_ITEMS = [
  "Video Podcasts",
  "Pipeline Growth",
  "Authority Building",
  "Endless Content",
  "ICP Conversations",
  "Story-Led Brands",
];

const MarqueeStrip = () => (
  <div className="flex gap-12 pr-12 shrink-0">
    {MARQUEE_ITEMS.map((item, i) => (
      <span
        key={i}
        className="flex items-center gap-12 text-white/40 font-body text-sm tracking-widest uppercase whitespace-nowrap"
      >
        {item}
        <span className="text-primary">✦</span>
      </span>
    ))}
  </div>
);

// ----------------- Cinematic Footer (Desktop only) -----------------
const CinematicFooter = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end end"],
  });

  const giantTextY = useTransform(scrollYProgress, [0, 1], ["10vh", "0vh"]);
  const giantTextScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const giantTextOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const headingOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0.2, 0.7], [50, 0]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      ref={wrapperRef}
      className="relative bg-brand-surface text-white overflow-hidden min-h-[700px]"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        }}
      />

      {/* Aurora glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none animate-cinematic-breathe"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(145 95% 55% / 0.18) 0%, hsl(247 78% 64% / 0.18) 40%, transparent 70%)",
        }}
      />

      {/* Giant background text */}
      <motion.div
        style={{ y: giantTextY, scale: giantTextScale, opacity: giantTextOpacity }}
        className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none"
      >
        <span
          className="font-heading font-black leading-[0.75] tracking-tighter text-transparent"
          style={{
            fontSize: "26vw",
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          earworm
        </span>
      </motion.div>

      {/* Marquee */}
      <div className="relative pt-16 pb-10 overflow-hidden border-b border-white/[0.06]">
        <div className="flex animate-cinematic-marquee w-max">
          <MarqueeStrip />
          <MarqueeStrip />
          <MarqueeStrip />
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-8 pt-24 pb-16 z-10">
        <motion.div
          style={{ opacity: headingOpacity, y: headingY }}
          className="grid grid-cols-12 gap-8 items-end mb-20"
        >
          {/* Left — heading + CTA */}
          <div className="col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6 font-body">
              ✦ Ready when you are
            </p>
            <h2
              className="text-6xl xl:text-7xl leading-[0.95] mb-10 tracking-tight"
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(255,255,255,0.08))",
              }}
            >
              Let&apos;s build your <em className="italic font-light">content engine</em>
            </h2>

            <MagneticButton as={Link} to="/contact">
              <span className="group inline-flex items-center gap-4 pl-8 pr-3 py-3 rounded-full border border-white/[0.12] bg-white/[0.04] backdrop-blur-xl hover:border-white/30 hover:bg-white/[0.08] transition-colors duration-500">
                <span className="text-base font-medium tracking-wide">Start a conversation</span>
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </span>
            </MagneticButton>
          </div>

          {/* Right — quick links */}
          <div className="col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-5 font-body">
                Explore
              </h4>
              <ul className="space-y-3 font-body">
                {[
                  { label: "Our Story", to: "/about-earworm" },
                  { label: "Case Studies", to: "/case-studies" },
                  { label: "Blog", to: "/blogs" },
                  { label: "Careers", to: "/careers" },
                  { label: "Book a Call", to: "/book-a-call" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                    >
                      <span className="w-0 h-px bg-white transition-all duration-300 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-5 font-body">
                Studios
              </h4>
              <div className="space-y-5 text-sm text-white/50 font-body">
                <div>
                  <p className="text-white/85 font-medium mb-1">Bristol</p>
                  <p>Studio D &amp; B,</p>
                  <p>25–27 Stokes Croft, BS1 3PY</p>
                </div>
                <div>
                  <p className="text-white/85 font-medium mb-1">New York</p>
                  <p>99 Wall Street #2421</p>
                  <p>NY 10005</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-8 border-t border-white/[0.08] relative z-10">
          <div className="flex items-center gap-6">
            <img src={logo} alt="Earworm" className="h-5 brightness-0 invert" />
            <p className="text-xs text-white/30 font-body">
              © Earworm Agency Limited · Co. no. 14843820 · VAT 449 7546 43
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/privacy-policy"
              className="text-xs text-white/40 hover:text-white/80 transition-colors font-body"
            >
              Privacy
            </Link>
            <Link
              to="/cookies"
              className="text-xs text-white/40 hover:text-white/80 transition-colors font-body"
            >
              Cookies
            </Link>
            <a
              href="https://www.linkedin.com/company/earworm-podcast-agency"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white hover:border-white/30 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white hover:border-white/30 transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicFooter;
