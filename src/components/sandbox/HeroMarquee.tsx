import { motion } from "framer-motion";
import caseIgHero from "@/assets/case-ig-hero.webp";
import caseNoStressHero from "@/assets/case-nostress-hero.webp";
import caseIgBtsStudio from "@/assets/case-ig-bts-studio.webp";
import caseNostressBtsWide from "@/assets/case-nostress-bts-wide.webp";
import caseCfoPlaybook from "@/assets/case-cfo-playbook-thumb.webp";
import caseIgFirefly from "@/assets/case-ig-firefly-thumb.webp";
import caseIgBtsControl from "@/assets/case-ig-bts-control.webp";
import caseNoStressThumb from "@/assets/case-no-stress-thumb.webp";

const images = [
  caseIgHero,
  caseNoStressHero,
  caseIgBtsStudio,
  caseNostressBtsWide,
  caseCfoPlaybook,
  caseIgFirefly,
  caseIgBtsControl,
  caseNoStressThumb,
];

const HeroMarquee = () => {
  const duplicated = [...images, ...images];

  return (
    <motion.div
      className="relative w-full overflow-hidden mt-12 sm:mt-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div className="flex gap-4 sm:gap-6 w-max animate-[marquee_40s_linear_infinite]">
        {duplicated.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 w-[260px] h-[160px] sm:w-[320px] sm:h-[200px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.06)] bg-white/[0.03] backdrop-blur-md"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </motion.div>
  );
};

export default HeroMarquee;
