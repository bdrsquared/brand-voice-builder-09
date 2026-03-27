import { useEffect, useRef, useState } from "react";

const topItems = [
  { label: "Full Episode", icon: "▶", accent: true },
  { label: "Short Clip", icon: "🎬", accent: false },
  { label: "Blog Post", icon: "📝", accent: false },
  { label: "Newsletter", icon: "✉", accent: true },
];

const bottomItems = [
  { label: "Social Post", icon: "💬", accent: false },
  { label: "Audiogram", icon: "🎧", accent: true },
  { label: "Quote Card", icon: "❝", accent: false },
  { label: "Thread", icon: "🧵", accent: false },
];

const ContentEngine = () => {
  const [reduced, setReduced] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const topEl = topRef.current;
    const bottomEl = bottomRef.current;
    if (!topEl || !bottomEl) return;

    let offsetTop = 0;
    let offsetBottom = 0;
    let animId: number;

    const animate = () => {
      offsetTop += 0.3;
      offsetBottom += 0.25;

      const halfTop = topEl.scrollWidth / 2;
      const halfBottom = bottomEl.scrollWidth / 2;

      if (offsetTop >= halfTop) offsetTop -= halfTop;
      if (offsetBottom >= halfBottom) offsetBottom -= halfBottom;

      topEl.style.transform = `translateX(-${offsetTop}px)`;
      bottomEl.style.transform = `translateX(-${offsetBottom}px)`;

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [reduced]);

  const tripleTop = [...topItems, ...topItems, ...topItems];
  const tripleBottom = [...bottomItems, ...bottomItems, ...bottomItems];

  return (
    <div
      className="relative w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-accent/5 flex flex-col justify-center gap-3 p-4"
      style={{ height: "280px" }}
    >
      {/* Left/right fade masks */}
      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card/90 to-transparent z-20 pointer-events-none" />

      {/* Top row — scrolls left */}
      <div className="overflow-hidden">
        <div ref={topRef} className="flex gap-2 w-max">
          {tripleTop.map((item, i) => (
            <ContentCard key={`t-${i}`} {...item} />
          ))}
        </div>
      </div>

      {/* Bottom row — scrolls left (slower) */}
      <div className="overflow-hidden">
        <div ref={bottomRef} className="flex gap-2 w-max">
          {tripleBottom.map((item, i) => (
            <ContentCard key={`b-${i}`} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ContentCard = ({ label, icon, accent }: { label: string; icon: string; accent: boolean }) => (
  <div
    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border shrink-0 ${
      accent ? "border-accent/20 bg-accent/5" : "border-border/50 bg-secondary/50"
    }`}
  >
    <span className="text-xs shrink-0">{icon}</span>
    <p className="text-[10px] text-foreground font-medium whitespace-nowrap font-body">{label}</p>
  </div>
);

export default ContentEngine;
