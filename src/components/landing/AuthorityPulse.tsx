import { useEffect, useRef, useState } from "react";

const AuthorityPulse = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="relative w-full rounded-2xl border border-white/[0.08] overflow-hidden shadow-lg shadow-black/20 flex items-end justify-center gap-3 px-8 pb-8 pt-16 h-[280px]" style={{ background: "linear-gradient(135deg, #111113 0%, #0d0d0f 50%, #101012 100%)" }}>
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-primary/10 blur-[60px] pointer-events-none" />

      {/* Left podium */}
      <div className="relative flex flex-col items-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-text-tertiary/40" />
        <div className="w-20 rounded-t-lg bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.08] h-[80px]">
           <div className="w-full h-full rounded-t-lg bg-gradient-to-br from-white/10 to-transparent" />
         </div>
         <span className="text-[9px] text-text-tertiary font-body tracking-wide uppercase">2nd</span>
      </div>

      {/* Centre podium (tallest) */}
      <div className="relative flex flex-col items-center gap-2 z-10">
        {/* Star */}
        <div className={`relative ${!reduced ? "animate-[authority-float_4s_ease-in-out_infinite]" : ""}`}>
          {/* Glow */}
          <div className={`absolute inset-0 w-10 h-10 -top-1 -left-1 rounded-full bg-primary/30 blur-md ${!reduced ? "animate-[authority-glow_3s_ease-in-out_infinite]" : ""}`} />
          {/* Star shape via layered CSS */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="relative z-10 drop-shadow-[0_0_8px_hsl(145,96%,55%,0.4)]">
            <defs>
              <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(145, 96%, 65%)" />
                <stop offset="50%" stopColor="hsl(145, 96%, 55%)" />
                <stop offset="100%" stopColor="hsl(160, 90%, 45%)" />
              </linearGradient>
              <linearGradient id="starHighlight" x1="30%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M16 2 L19.5 11.5 L29 12.5 L22 19 L24 29 L16 24 L8 29 L10 19 L3 12.5 L12.5 11.5 Z" fill="url(#starGrad)" />
            <path d="M16 2 L19.5 11.5 L29 12.5 L22 19 L24 29 L16 24 L8 29 L10 19 L3 12.5 L12.5 11.5 Z" fill="url(#starHighlight)" />
          </svg>
          {/* Shimmer sweep */}
          {!reduced && (
            <div className="absolute inset-0 overflow-hidden rounded-full z-20">
              <div className="absolute -left-full top-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[authority-shimmer_4s_ease-in-out_infinite] skew-x-12" />
            </div>
          )}
        </div>

        <div className="w-24 rounded-t-lg bg-gradient-to-b from-primary/25 to-primary/10 border border-primary/20 h-[120px]">
           <div className="w-full h-full rounded-t-lg bg-gradient-to-br from-white/10 to-transparent" />
         </div>
         <span className="text-[9px] text-primary font-body tracking-wide uppercase font-medium">1st</span>
      </div>

      {/* Right podium */}
      <div className="relative flex flex-col items-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-text-tertiary/40" />
        <div className="w-20 rounded-t-lg bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.08] h-[60px]">
           <div className="w-full h-full rounded-t-lg bg-gradient-to-br from-white/10 to-transparent" />
         </div>
         <span className="text-[9px] text-text-tertiary font-body tracking-wide uppercase">3rd</span>
      </div>
    </div>
  );
};

export default AuthorityPulse;
