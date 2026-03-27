import { useEffect, useRef, useState } from "react";

const contentItems = [
  { type: "video", label: "Full Episode", icon: "▶", accent: true },
  { type: "clip", label: "Short Clip", icon: "🎬", accent: false },
  { type: "blog", label: "Blog Post", icon: "📝", accent: false },
  { type: "email", label: "Newsletter", icon: "✉", accent: true },
  { type: "social", label: "Social Post", icon: "💬", accent: false },
  { type: "audio", label: "Audiogram", icon: "🎧", accent: true },
  { type: "quote", label: "Quote Card", icon: "❝", accent: false },
  { type: "thread", label: "Twitter Thread", icon: "🧵", accent: false },
];

const doubled = [...contentItems, ...contentItems];

const ContentEngine = () => {
  const [reduced, setReduced] = useState(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;
    if (!leftEl || !rightEl) return;

    let offsetLeft = 0;
    let offsetRight = 0;
    let animId: number;
    const speedLeft = 0.25;
    const speedRight = 0.2;

    const animate = () => {
      offsetLeft += speedLeft;
      offsetRight += speedRight;

      const halfLeft = leftEl.scrollHeight / 2;
      const halfRight = rightEl.scrollHeight / 2;

      if (offsetLeft >= halfLeft) offsetLeft = 0;
      if (offsetRight >= halfRight) offsetRight = 0;

      leftEl.style.transform = `translateY(-${offsetLeft}px)`;
      rightEl.style.transform = `translateY(${offsetRight - halfRight}px)`;

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [reduced]);

  return (
    <div
      className="relative w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-accent/5"
      style={{ height: "280px" }}
    >
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-card/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card/90 to-transparent z-20 pointer-events-none" />

      <div className="flex h-full gap-2 p-3">
        {/* Left column — scrolls up */}
        <div className="flex-1 overflow-hidden relative">
          <div ref={leftRef} className="flex flex-col gap-2">
            {doubled.filter((_, i) => i % 2 === 0).map((item, i) => (
              <ContentCard key={`l-${i}`} {...item} />
            ))}
          </div>
        </div>

        {/* Right column — scrolls down */}
        <div className="flex-1 overflow-hidden relative">
          <div ref={rightRef} className="flex flex-col gap-2">
            {doubled.filter((_, i) => i % 2 === 1).map((item, i) => (
              <ContentCard key={`r-${i}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentCard = ({ label, icon, accent }: { label: string; icon: string; accent: boolean; type: string }) => (
  <div
    className={`flex items-center gap-2 p-2 rounded-lg border ${
      accent ? "border-accent/20 bg-accent/5" : "border-border/50 bg-secondary/50"
    }`}
  >
    <span className="text-xs shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-foreground font-medium truncate font-body">{label}</p>
      <div className="flex gap-1 mt-1">
        <div className={`h-[3px] rounded-full ${accent ? "bg-accent/20" : "bg-muted-foreground/15"} w-3/4`} />
        <div className={`h-[3px] rounded-full ${accent ? "bg-accent/10" : "bg-muted-foreground/10"} w-1/4`} />
      </div>
    </div>
  </div>
);

export default ContentEngine;
