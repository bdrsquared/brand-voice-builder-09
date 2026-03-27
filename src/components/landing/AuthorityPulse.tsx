import { useEffect, useRef, useState } from "react";

const AuthorityPulse = () => {
  const [reduced, setReduced] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5 flex items-center justify-center"
      style={{ height: "280px" }}
    >
      {/* Pulsing rings */}
      {!reduced && (
        <>
          <div className="absolute w-32 h-32 rounded-full border border-primary/10 animate-[authority-ring_4s_ease-out_infinite]" />
          <div className="absolute w-52 h-52 rounded-full border border-primary/5 animate-[authority-ring_4s_ease-out_1s_infinite]" />
          <div className="absolute w-72 h-72 rounded-full border border-primary/[0.03] animate-[authority-ring_4s_ease-out_2s_infinite]" />
        </>
      )}

      {/* Central brand node */}
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_-5px_hsl(145,96%,55%,0.2)]">
        <div className="w-3 h-3 rounded-full bg-primary" />
      </div>

      {/* Floating label top-right */}
      <div
        className={`absolute top-12 right-8 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/50 ${!reduced ? "animate-[authority-float_6s_ease-in-out_infinite]" : ""}`}
      >
        <p className="text-[10px] text-foreground/70 font-body">Thought Leader</p>
      </div>

      {/* Floating label bottom-left */}
      <div
        className={`absolute bottom-14 left-8 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/50 ${!reduced ? "animate-[authority-float_6s_ease-in-out_2s_infinite]" : ""}`}
      >
        <p className="text-[10px] text-foreground/70 font-body">Category Voice</p>
      </div>

      {/* Small orbiting dot */}
      {!reduced && (
        <div className="absolute w-48 h-48 animate-[authority-orbit_12s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent/40" />
        </div>
      )}
    </div>
  );
};

export default AuthorityPulse;
