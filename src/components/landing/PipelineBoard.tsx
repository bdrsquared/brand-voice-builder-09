import { useEffect, useState } from "react";

const stages = ["Lead", "In Progress", "Closed"];

const deals = [
  { name: "Acme Ltd", value: "£25k", avatar: "AL", col: 0 },
  { name: "John Smith", value: "£18k", avatar: "JS", col: 1 },
  { name: "Nova Corp", value: "£42k", avatar: "NC", col: 2 },
];

const movingDeal = { name: "Bright Co", value: "£31k", avatar: "BC" };

// Phases: 0=show in col0, 1=fade out col0, 2=show in col1, 3=fade out col1, 4=show in col2 (win!), 5=fade out col2 & reset
const PHASE_COUNT = 6;
const PHASE_TIMING = [2500, 600, 2500, 600, 3000, 600]; // ms per phase

const PipelineBoard = () => {
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timeout = setTimeout(() => {
      setPhase((p) => (p + 1) % PHASE_COUNT);
    }, PHASE_TIMING[phase]);
    return () => clearTimeout(timeout);
  }, [reduced, phase]);

  // Map phase to column and visibility
  const getMovingState = () => {
    switch (phase) {
      case 0: return { col: 0, opacity: 1, won: false };
      case 1: return { col: 0, opacity: 0, won: false };
      case 2: return { col: 1, opacity: 1, won: false };
      case 3: return { col: 1, opacity: 0, won: false };
      case 4: return { col: 2, opacity: 1, won: true };
      case 5: return { col: 2, opacity: 0, won: false };
      default: return { col: 0, opacity: 0, won: false };
    }
  };

  const { col: movingCol, opacity: movingOpacity, won } = getMovingState();

  return (
    <div
      className="relative w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5"
      style={{ height: "280px" }}
    >
      <div className="flex h-full">
        {stages.map((stage, si) => (
          <div key={stage} className="flex-1 flex flex-col border-r last:border-r-0 border-border/30">
            <div className="px-3 py-2.5 border-b border-border/30">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider font-body">
                {stage}
              </p>
            </div>

            <div className="flex-1 p-2 flex flex-col gap-2 relative">
              {deals
                .filter((d) => d.col === si)
                .map((deal) => (
                  <DealCard key={deal.name} {...deal} />
                ))}

              {movingCol === si && (
                <div
                  className="transition-opacity duration-500 ease-in-out relative"
                  style={{ opacity: movingOpacity }}
                >
                  <DealCard {...movingDeal} highlight />
                  {/* Win star */}
                  {won && (
                    <div className="absolute -top-2 -right-1 animate-[star-pop_0.5s_ease-out_forwards] text-sm">
                      ⭐
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

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
