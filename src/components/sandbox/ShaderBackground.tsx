import type React from "react";
import { useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

/**
 * Animated mesh-gradient shader background with hover-driven intensity.
 * Earworm palette: deep black base, primary green, accent purple, brand-orange.
 * SVG filters add subtle glass + grain.
 */
export function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleEnter = () => setIsActive(true);
    const handleLeave = () => setIsActive(false);

    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("mouseleave", handleLeave);
    return () => {
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {/* SVG filter defs for glass + grain */}
      <svg className="absolute inset-0 w-0 h-0" aria-hidden>
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="1" seed="1" />
            <feDisplacementMap in="SourceGraphic" scale="6" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <filter id="grain-effect" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0.06 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Background mesh gradient — base layer */}
      <MeshGradient
        colors={["#080a0c", "#15d668", "#4a42c0", "#080a0c", "#1a1d22"]}
        speed={isActive ? 0.5 : 0.25}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Secondary mesh — overlay for richness */}
      <MeshGradient
        colors={["#000000", "#15d668", "#4a42c0", "#000000"]}
        speed={isActive ? 0.35 : 0.15}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          mixBlendMode: "screen",
          opacity: 0.4,
          filter: "url(#glass-effect)",
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{ filter: "url(#grain-effect)" }}
      />

      {/* Vignette to keep text readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

export default ShaderBackground;
