import { useEffect, useRef } from "react";

const logos = [
  "Experian",
  "Cisco",
  "IG Group",
  "Infobip",
  "Soldo",
  "The Wow Company",
];

// Duplicate for seamless loop
const allLogos = [...logos, ...logos];

const LogoWall = () => {
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // CSS animation handles the scroll
  }, []);

  return (
    <div className="relative w-full mt-10 h-[200px] overflow-hidden">
      {/* Fade edges top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div className="flex justify-center gap-16">
        {/* Column 1 - scrolls up */}
        <div className="overflow-hidden h-[200px]">
          <div
            ref={col1Ref}
            className="flex flex-col gap-6 animate-scroll-up"
          >
            {allLogos.map((name, i) => (
              <div
                key={`col1-${i}`}
                className="flex items-center justify-center px-6 py-3"
              >
                <span className="font-heading text-xl sm:text-2xl font-bold text-muted-foreground/50 whitespace-nowrap tracking-tight">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - scrolls down */}
        <div className="overflow-hidden h-[200px] hidden sm:block">
          <div
            ref={col2Ref}
            className="flex flex-col gap-6 animate-scroll-down"
          >
            {[...allLogos].reverse().map((name, i) => (
              <div
                key={`col2-${i}`}
                className="flex items-center justify-center px-6 py-3"
              >
                <span className="font-heading text-xl sm:text-2xl font-bold text-muted-foreground/50 whitespace-nowrap tracking-tight">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 - scrolls up */}
        <div className="overflow-hidden h-[200px] hidden md:block">
          <div className="flex flex-col gap-6 animate-scroll-up" style={{ animationDelay: "-3s" }}>
            {allLogos.map((name, i) => (
              <div
                key={`col3-${i}`}
                className="flex items-center justify-center px-6 py-3"
              >
                <span className="font-heading text-xl sm:text-2xl font-bold text-muted-foreground/50 whitespace-nowrap tracking-tight">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoWall;
