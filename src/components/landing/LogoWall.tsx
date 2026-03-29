import logoBnvt from "@/assets/logos/bnvt.webp";
import logoCollyerBristow from "@/assets/logos/collyer-bristow.webp";
import logoWenodo from "@/assets/logos/wenodo.webp";
import logoPulsetto from "@/assets/logos/pulsetto.webp";
import logoSoldo from "@/assets/logos/soldo.webp";
import logoPolly from "@/assets/logos/polly.webp";
import logoKpmg from "@/assets/logos/kpmg.webp";
import logoIgGroup from "@/assets/logos/ig-group.webp";
import logoCisco from "@/assets/logos/cisco.webp";

const logos = [
  { src: logoBnvt, alt: "BNVT" },
  { src: logoCollyerBristow, alt: "Collyer Bristow" },
  { src: logoWenodo, alt: "Wenodo" },
  { src: logoPulsetto, alt: "Pulsetto" },
  { src: logoSoldo, alt: "Soldo" },
  { src: logoPolly, alt: "Polly" },
  { src: logoKpmg, alt: "KPMG" },
  { src: logoIgGroup, alt: "IG Group" },
  { src: logoCisco, alt: "Cisco" },
];

const allLogos = [...logos, ...logos];

const LogoWall = () => {
  return (
    <div className="relative max-w-3xl mx-auto mt-10 overflow-hidden">
      {/* Fade edges */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-16 animate-scroll-left w-max">
        {allLogos.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className="h-12 sm:h-12 w-auto opacity-50 shrink-0"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default LogoWall;
