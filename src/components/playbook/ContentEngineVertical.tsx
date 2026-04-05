import { useEffect, useRef, useState } from "react";
import { Play, Scissors, FileText, Mail, MessageSquare, BarChart3, Smartphone, Headphones, Quote, Briefcase, Image, AtSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const col1: { label: string; Icon: LucideIcon }[] = [
  { label: "Full Episode", Icon: Play },
  { label: "Blog Post", Icon: FileText },
  { label: "Newsletter", Icon: Mail },
  { label: "Social Post", Icon: MessageSquare },
  { label: "Case Study", Icon: BarChart3 },
  { label: "YouTube Short", Icon: Smartphone },
];

const col2: { label: string; Icon: LucideIcon }[] = [
  { label: "Short Clip", Icon: Scissors },
  { label: "Audiogram", Icon: Headphones },
  { label: "Quote Card", Icon: Quote },
  { label: "LinkedIn Post", Icon: Briefcase },
  { label: "Carousel", Icon: Image },
  { label: "Thread", Icon: AtSign },
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
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        mask: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        WebkitMask: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <div className="flex gap-3 h-full justify-center px-2">
        {columns.map((items, ci) => {
          const tripled = [...items, ...items, ...items];
          return (
            <div key={ci} className="overflow-hidden flex-shrink-0 w-[150px]">
              <div ref={refs[ci]} className="flex flex-col gap-3">
                {tripled.map((item, i) => (
                  <ContentCardV key={`c${ci}-${i}`} label={item.label} Icon={item.Icon} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ContentCardV = ({ label, Icon }: { label: string; Icon: LucideIcon }) => (
  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm shrink-0">
    <Icon className="w-4 h-4 text-white/60 shrink-0" strokeWidth={1.5} />
    <p className="text-xs text-text-primary font-medium whitespace-nowrap font-body">{label}</p>
  </div>
);

export default ContentEngineVertical;
