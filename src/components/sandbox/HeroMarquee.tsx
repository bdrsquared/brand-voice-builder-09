import { motion } from "framer-motion";
import imgBlueCardigan from "@/assets/podcast-studio-blue-cardigan.jpg";
import imgPurpleDenim from "@/assets/podcast-purple-denim.jpg";
import imgPinkCouch from "@/assets/podcast-pink-couch.jpg";
import imgStudioWide from "@/assets/podcast-studio-wide-purple.jpg";
import imgHostSuit from "@/assets/podcast-host-suit-purple.jpg";
import imgConservatory from "@/assets/podcast-conservatory-wide.jpg";
import imgBlueShirt from "@/assets/podcast-blue-shirt-floral.jpg";
import imgRedDress from "@/assets/podcast-red-dress-lounge.jpg";
import imgGreenDress from "@/assets/podcast-green-dress-lounge.jpg";
import imgBoucleDuo from "@/assets/podcast-boucle-chairs-duo.jpg";
import imgSchnauzer from "@/assets/podcast-schnauzer-guest.jpg";
import imgBoschMural from "@/assets/podcast-bosch-mural-yellow.jpg";
import imgDiscoLounge from "@/assets/podcast-disco-yellow-lounge.jpg";
import imgControlRoom from "@/assets/podcast-control-room-multicam.jpg";
import imgGreenLit from "@/assets/podcast-green-lit-guest.jpg";
import imgGreenStudio from "@/assets/podcast-green-studio-wide.jpg";

const images = [
  imgBlueCardigan,
  imgPurpleDenim,
  imgPinkCouch,
  imgStudioWide,
  imgHostSuit,
  imgConservatory,
  imgBlueShirt,
  imgRedDress,
  imgGreenDress,
  imgBoucleDuo,
  imgSchnauzer,
  imgBoschMural,
  imgDiscoLounge,
  imgControlRoom,
  imgGreenLit,
  imgGreenStudio,
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const HeroMarquee = () => {
  const shuffled = shuffle(images);
  const duplicated = [...shuffled, ...shuffled];

  return (
    <motion.div
      className="relative w-full overflow-hidden mt-6 sm:mt-8"
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
      <div className="flex gap-4 sm:gap-5 w-max animate-[marquee_40s_linear_infinite]">
        {duplicated.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 w-[200px] h-[267px] sm:w-[260px] sm:h-[347px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.06)] bg-white/[0.03] backdrop-blur-md"
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
