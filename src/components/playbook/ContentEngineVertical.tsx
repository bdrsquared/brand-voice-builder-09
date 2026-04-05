import { useEffect, useRef, useState } from "react";

const col1 = [
  { label: "Full Episode", icon: "▶", accent: true },
  { label: "Blog Post", icon: "📝", accent: false },
  { label: "Newsletter", icon: "✉", accent: true },
  { label: "Social Post", icon: "💬", accent: false },
  { label: "Case Study", icon: "📊", accent: true },
  { label: "YouTube Short", icon: "📱", accent: false },
];

const col2 = [
  { label: "Short Clip", icon: "🎬", accent: false },
  { label: "Audiogram", icon: "🎧", accent: true },
  { label: "Quote Card", icon: "❝", accent: false },
  { label: "Carousel", icon: "🖼", accent: false },
  { label: "LinkedIn Post", icon: "💼", accent: true },
  { label: "Thread", icon: "🧵", accent: false },
];

const col3 = [
  { label: "Sales One-Pager", icon: "📄", accent: true },
  { label: "Reel", icon: "🎞", accent: false },
  { label: "Infographic", icon: "📈", accent: true },
  { label: "Podcast Clip", icon: "🎙", accent: false },
  { label: "Email Sequence", icon: "📨", accent: true },
  { label: "Thumbnail", icon: "🖼", accent: false },
];

const speeds = [0.25, 0.35, 0.2];
const columns = [col1, col2, col3];

const ContentEngineVertical = () => {
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
        const dir = i % 2 === 0 ? 1 : -1;
        offsets[i] += speeds[i] * dir;
        const half = el.scrollHeight / 2;
        if (dir > 0 && offsets[i] >= half) offsets[i] -= half;
        if (dir < 0 && offsets[i] <= -half) offsets[i] += half;
        el.style.transform = `translateY(${-offsets[i]}px)`;
      });
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [reduced]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Vertical fade edges */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-card to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent z-20 pointer-events-none" />
      {/* Horizontal fade edges */}
      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent z-20 pointer-events-none" />

      <div className="flex gap-3 h-full justify-center px-2">
        {columns.map((items, ci) => {
          const tripled = [...items, ...items, ...items];
          return (
            <div key={ci} className="overflow-hidden flex-shrink-0 w-[140px]">
              <div ref={refs[ci]} className="flex flex-col gap-3">
                {tripled.map((item, i) => (
                  <ContentCardV key={`c${ci}-${i}`} {...item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ContentCardV = ({ label, icon, accent }: { label: string; icon: string; accent: boolean }) => (
  <div
    className={`flex items-center gap-2 px-3 py-3 rounded-xl border shrink-0 ${
      accent ? "border-accent/20 bg-accent/5" : "border-border/50 bg-white/[0.03]"
    }`}
  >
    <span className="text-sm shrink-0">{icon}</span>
    <p className="text-xs text-text-primary font-medium whitespace-nowrap font-body">{label}</p>
  </div>
);

export default ContentEngineVertical;
