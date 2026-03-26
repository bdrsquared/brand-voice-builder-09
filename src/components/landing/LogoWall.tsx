const logos = [
  "Experian",
  "Cisco",
  "IG Group",
  "Infobip",
  "Soldo",
  "The Wow Company",
];

const allLogos = [...logos, ...logos];

const LogoWall = () => {
  return (
    <div className="relative w-full mt-10 overflow-hidden">
      {/* Fade edges left and right */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex gap-12 animate-scroll-left w-max">
        {allLogos.map((name, i) => (
          <span
            key={i}
            className="font-heading text-xl sm:text-2xl font-bold text-muted-foreground/40 whitespace-nowrap tracking-tight shrink-0"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LogoWall;
