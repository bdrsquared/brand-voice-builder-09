import { useEffect, useRef } from "react";
import ryanFosterAvatar from "@/assets/ryan-foster-avatar.png";
import oliviaParkAvatar from "@/assets/olivia-park-avatar.png";
import lucasGrantAvatar from "@/assets/lucas-grant-avatar.jpeg";
import jonDoeAvatar from "@/assets/jon-doe-avatar.jpeg";
import miaJohnsonAvatar from "@/assets/mia-johnson-avatar.jpeg";
import alexChenAvatar from "@/assets/alex-chen-avatar.jpeg";
import emmaCarterAvatar from "@/assets/emma-carter-avatar.jpeg";

const notifications = [
  { name: "Jon Doe", action: "liked your video", avatar: "JD", bg: "bg-primary/20 text-primary", image: jonDoeAvatar },
  { name: "Sarah Miles", action: "commented on your post", avatar: "SM", bg: "bg-accent/20 text-accent", image: null },
  { name: "Alex Chen", action: "shared your clip", avatar: "AC", bg: "bg-primary/20 text-primary", image: alexChenAvatar },
  { name: "Emma Carter", action: "followed your page", avatar: "EC", bg: "bg-accent/20 text-accent", image: emmaCarterAvatar },
  { name: "Ryan Foster", action: "liked your video", avatar: "RF", bg: "bg-primary/20 text-primary", image: ryanFosterAvatar },
  { name: "Mia Johnson", action: "commented on your post", avatar: "MJ", bg: "bg-accent/20 text-accent", image: miaJohnsonAvatar },
  { name: "Lucas Grant", action: "shared your clip", avatar: "LG", bg: "bg-primary/20 text-primary", image: lucasGrantAvatar },
  { name: "Olivia Park", action: "followed your page", avatar: "OP", bg: "bg-accent/20 text-accent", image: oliviaParkAvatar },
];

const EngagementScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let offset = 0;
    const speed = 0.3;

    const animate = () => {
      offset += speed;
      const halfHeight = el.scrollHeight / 2;
      if (offset >= halfHeight) offset = 0;
      el.style.transform = `translateY(-${offset}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const doubled = [...notifications, ...notifications];

  return (
    <div className="relative w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5 h-[280px]">
      {/* Top/bottom fade masks */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-card/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card/90 to-transparent z-10 pointer-events-none" />

      <div className="p-4 h-full overflow-hidden">
        <div ref={scrollRef} className="flex flex-col gap-2.5">
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 border border-border/50"
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${item.bg}`}>
                  {item.avatar}
                </div>
              )}
              <p className="text-xs text-foreground/80 font-body leading-tight">
                <span className="font-medium text-foreground">{item.name}</span>{" "}
                {item.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementScroll;
