import { useEffect, useRef, useState } from "react";

const row1 = [
  { label: "Full Episode", icon: "▶", accent: true },
  { label: "Short Clip", icon: "🎬", accent: false },
  { label: "Blog Post", icon: "📝", accent: false },
  { label: "Newsletter", icon: "✉", accent: true },
];

const row2 = [
  { label: "Social Post", icon: "💬", accent: false },
  { label: "Audiogram", icon: "🎧", accent: true },
  { label: "Quote Card", icon: "❝", accent: false },
  { label: "Thread", icon: "🧵", accent: false },
];

const row3 = [
  { label: "LinkedIn Post", icon: "💼", accent: true },
  { label: "YouTube Short", icon: "📱", accent: false },
  { label: "Carousel", icon: "🖼", accent: false },
  { label: "Case Study", icon: "📊", accent: true },
];

const speeds = [0.3, 0.25, 0.35];

const ContentEngine = () => {
  const [reduced, setReduced] = useState(false);
  const refs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const els = refs.map(r => r.current);
    if (els.some(e => !e)) return;

    const offsets = [0, 0, 0];
    let animId: number;

    const animate = () => {
      els.forEach((el, i) => {
        if (!el) return;
        offsets[i] += speeds[i];
        const half = el.scrollWidth / 2;
        if (offsets[i] >= half) offsets[i] -= half;
        el.style.transform = `translateX(-${offsets[i]}px)`;
      });
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [reduced]);

  const rows = [row1, row2, row3];

  return (
    <div
      className="relative w-full rounded-2xl border border-white/[0.08] overflow-hidden shadow-lg shadow-black/20 flex flex-col justify-center gap-2.5 py-4 h-[280px]"
      style={{ background: "linear-gradient(135deg, rgba(17,17,19,0.7) 0%, rgba(13,13,15,0.8) 50%, rgba(16,16,18,0.7) 100%)", backdropFilter: "blur(20px)" }}
    >
      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#111113]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#101012]/80 to-transparent z-20 pointer-events-none" />

      {rows.map((items, ri) => {
        const tripled = [...items, ...items, ...items];
        return (
          <div key={ri} className="overflow-hidden px-3">
            <div ref={refs[ri]} className="flex gap-2 w-max">
              {tripled.map((item, i) => (
                <ContentCard key={`r${ri}-${i}`} {...item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ContentCard = ({ label, icon, accent }: { label: string; icon: string; accent: boolean }) => (
  <div
    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border shrink-0 ${
      accent ? "border-accent/20 bg-accent/10" : "border-white/[0.06] bg-white/[0.05]"
    }`}
  >
    <span className="text-xs shrink-0">{icon}</span>
    <p className="text-[10px] text-text-primary font-medium whitespace-nowrap font-body">{label}</p>
  </div>
);

export default ContentEngine;
