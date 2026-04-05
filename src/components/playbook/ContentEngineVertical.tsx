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
  { label: "LinkedIn Post", icon: "💼", accent: true },
  { label: "Carousel", icon: "🖼", accent: false },
  { label: "Thread", icon: "🧵", accent: false },
];

const speeds = [0.3, -0.25];
const columns = [col1, col2];

const ContentEngineVertical = () => {
  const [reduced, setReduced] = useState(false);
  const refs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const els = refs.map(r => r.current);
    if (els.some(e => !e)) return;

    const offsets = [0, 0];
    let animId: number;

    const animate = () => {
      els.forEach((el, i) => {
        if (!el) return;
        offsets[i] += speeds[i];
        const half = el.scrollHeight / 2;
        if (offsets[i] >= half) offsets[i] -= half;
        if (offsets[i] <= 0) offsets[i] += half;
        el.style.transform = `translateY(${-offsets[i]}px)`;
      });
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [reduced]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ mask: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMask: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
      <div className="flex gap-3 h-full justify-center px-2">
        {columns.map((items, ci) => {
          const tripled = [...items, ...items, ...items];
          return (
            <div key={ci} className="overflow-hidden flex-shrink-0 w-[150px]">
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
    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shrink-0 backdrop-blur-sm ${
      accent ? "border-white/[0.12] bg-white/[0.06]" : "border-white/[0.06] bg-white/[0.03]"
    }`}
  >
    <span className="text-sm shrink-0">{icon}</span>
    <p className="text-xs text-text-primary font-medium whitespace-nowrap font-body">{label}</p>
  </div>
);

export default ContentEngineVertical;
