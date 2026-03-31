import { useMemo } from "react";

const BRAND_COLORS = [
  "28, 250, 118",   // #1CFA76
  "99, 89, 234",    // #6359EA
  "64, 171, 178",   // #40ABB2
];

const generateDots = (count: number) => {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = (-0.5 + Math.random() * 3).toFixed(2);
    const y = (-0.5 + Math.random() * 3).toFixed(2);
    const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
    shadows.push(`${x}em ${y}em 7px rgba(${color}, 0.9)`);
  }
  return shadows.join(", ");
};

const DotsBackground = () => {
  const layers = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        textShadow: generateDots(40),
        animationDuration: `${44 - i}s`,
        animationDelay: `-${27 + i * 5 - (i > 1 ? 6 : 0)}s`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes dots-move {
          from { transform: rotate(0deg) scale(12) translateX(-20px); }
          to   { transform: rotate(360deg) scale(18) translateX(20px); }
        }
        .dots-layer {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 3em;
          height: 3em;
          font-size: 52px;
          color: transparent;
          mix-blend-mode: screen;
          animation-name: dots-move;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        .dots-layer::before {
          content: '.';
        }
      `}</style>
      {layers.map((l, i) => (
        <div
          key={i}
          className="dots-layer"
          style={{
            textShadow: l.textShadow,
            animationDuration: l.animationDuration,
            animationDelay: l.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default DotsBackground;
