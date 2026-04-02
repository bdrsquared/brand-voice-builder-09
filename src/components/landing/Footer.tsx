import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import logo from "@/assets/earworm-logo.webp";

const Footer = () => {
  return (
    <footer>
      {/* Rounded section divider */}
      <div className="relative z-10" style={{ backgroundColor: 'hsl(0,0%,8%)' }}>
        <div className="bg-background rounded-b-[40px] sm:rounded-b-[60px] h-[40px] sm:h-[60px]" />
      </div>

      <div className="relative bg-[hsl(0,0%,8%)] text-white pt-16 pb-8 px-6 overflow-hidden">
        {/* Subtle branded gradient overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ background: 'radial-gradient(ellipse at 20% 80%, hsl(145,80%,55%) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(250,80%,65%) 0%, transparent 50%)' }} />

        <div className="relative max-w-6xl mx-auto">
          {/* Main grid with dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 mb-14">
            {/* Column 1 — Logo & addresses */}
            <div className="text-center md:text-left px-8 py-4">
              <img src={logo} alt="Earworm" className="h-5 mb-6 brightness-0 invert mx-auto md:mx-0" />
              <p className="text-sm text-white/60 font-body leading-relaxed mb-8 max-w-xs mx-auto md:mx-0">
                We turn video podcasts into consistent, high-quality content that builds authority and drives pipeline.
              </p>

              <div className="space-y-6 text-sm text-white/50 font-body">
                <div>
                  <p className="text-white/80 font-medium mb-1">Bristol</p>
                  <p>Earworm Agency Limited</p>
                  <p>Studio D &amp; B,</p>
                  <p>25–27 Stokes Croft,</p>
                  <p>Bristol, BS1 3PY</p>
                </div>
                <div>
                  <p className="text-white/80 font-medium mb-1">New York</p>
                  <p>Earworm Agency</p>
                  <p>99 Wall Street #2421</p>
                  <p>New York, NY 10005</p>
                </div>
              </div>
            </div>

            {/* Column 2 — Quick links */}
            <div className="text-center md:text-left px-8 py-4 border-t md:border-t-0 md:border-l border-white/[0.06]">
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Quick Links</h4>
              <ul className="space-y-3 text-sm font-body">
                {[
                  { label: "Our Story", to: "/our-story" },
                  { label: "Case Studies", to: "/case-studies" },
                  { label: "Blog", to: "/blogs" },
                  { label: "Book a Call", to: "/book-a-call" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Legal & social */}
            <div className="text-center md:text-left px-8 py-4 border-t md:border-t-0 md:border-l border-white/[0.06]">
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Legal</h4>
              <ul className="space-y-3 text-sm font-body mb-8">
                {[
                  { label: "Privacy Policy", to: "/privacy-policy" },
                  { label: "Cookies Policy", to: "/cookies-policy" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <a
                href="https://www.linkedin.com/company/earworm-podcast-agency"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.15] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/[0.08] pt-6 text-center">
            <p className="text-xs text-white/30 font-body">
              © Earworm Agency Limited, registered company no. 14843820. VAT registration no. 449 7546 43
            </p>
            <Link to="/admin/login" className="text-[10px] text-white/10 hover:text-white/30 transition-colors font-body mt-2 inline-block">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
