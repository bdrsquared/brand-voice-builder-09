import { useEffect, useState } from "react";

const stages = ["Lead", "In Progress", "Closed"];

const deals = [
  { name: "Acme Ltd", value: "£25k", avatar: "AL", col: 0 },
  { name: "John Smith", value: "£18k", avatar: "JS", col: 1 },
  { name: "Nova Corp", value: "£42k", avatar: "NC", col: 2 },
];

const movingDeal = { name: "Bright Co", value: "£31k", avatar: "BC" };

const PipelineBoard = () => {
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, [reduced]);

  // phase 0: col 0, phase 1: col 1, phase 2: col 2, phase 3: fade out & reset
  const movingCol = phase >= 3 ? 0 : phase;
  const movingOpacity = phase === 3 ? 0 : 1;

  return (
    <div
      className="relative w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5"
      style={{ height: "280px" }}
    >
      <div className="flex h-full">
        {stages.map((stage, si) => (
          <div key={stage} className="flex-1 flex flex-col border-r last:border-r-0 border-border/30">
            {/* Column header */}
            <div className="px-3 py-2.5 border-b border-border/30">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider font-body">
                {stage}
              </p>
            </div>

            {/* Cards */}
            <div className="flex-1 p-2 flex flex-col gap-2 relative">
              {/* Static deals */}
              {deals
                .filter((d) => d.col === si)
                .map((deal) => (
                  <DealCard key={deal.name} {...deal} />
                ))}

              {/* Moving deal */}
              {movingCol === si && (
                <div
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: movingOpacity }}
                >
                  <DealCard {...movingDeal} highlight />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Subtle top/bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
    </div>
  );
};

const DealCard = ({
  name,
  value,
  avatar,
  highlight,
}: {
  name: string;
  value: string;
  avatar: string;
  highlight?: boolean;
}) => (
  <div
    className={`flex items-center gap-2 p-2 rounded-lg border ${
      highlight
        ? "border-primary/30 bg-primary/5 shadow-[0_0_12px_-4px_hsl(145,96%,55%,0.2)]"
        : "border-border/50 bg-secondary/50"
    }`}
  >
    <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[8px] font-medium shrink-0 font-body">
      {avatar}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-foreground font-medium leading-tight truncate font-body">{name}</p>
      <p className="text-[9px] text-muted-foreground font-body">{value}</p>
    </div>
  </div>
);

export default PipelineBoard;
