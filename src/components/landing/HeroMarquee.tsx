import imgBlueCardigan from "@/assets/podcast-studio-blue-cardigan.webp";
import imgPurpleDenim from "@/assets/podcast-purple-denim.webp";
import imgPinkCouch from "@/assets/podcast-pink-couch.webp";
import imgStudioWide from "@/assets/podcast-studio-wide-purple.webp";
import imgHostSuit from "@/assets/podcast-host-suit-purple.webp";
import imgConservatory from "@/assets/podcast-conservatory-wide.webp";
import imgBlueShirt from "@/assets/podcast-blue-shirt-floral.webp";
import imgRedDress from "@/assets/podcast-red-dress-lounge.webp";
import imgGreenDress from "@/assets/podcast-green-dress-lounge.webp";
import imgBoucleDuo from "@/assets/podcast-boucle-chairs-duo.webp";
import imgSchnauzer from "@/assets/podcast-schnauzer-guest.webp";
import imgBoschMural from "@/assets/podcast-bosch-mural-yellow.webp";
import imgDiscoLounge from "@/assets/podcast-disco-yellow-lounge.webp";
import imgControlRoom from "@/assets/podcast-control-room-multicam.webp";
import imgGreenLit from "@/assets/podcast-green-lit-guest.webp";
import imgGreenStudio from "@/assets/podcast-green-studio-wide.webp";

// Deterministic order so the first (LCP-candidate) image is stable & can be preloaded.
const images = [
  imgPinkCouch,
  imgBlueCardigan,
  imgPurpleDenim,
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

export const heroMarqueeFirstImage = images[0];

const HeroMarquee = () => {
  const duplicated = [...images, ...images];

  return (
    <div
      className="relative w-full overflow-hidden mt-6 sm:mt-8"
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
              width={260}
              height={347}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
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
    </div>
  );
};

export default HeroMarquee;
