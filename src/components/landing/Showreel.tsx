import { motion } from "framer-motion";
import { useState } from "react";
import { Play } from "lucide-react";
import showreelThumb from "@/assets/showreel-thumb.png";

const Showreel = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute top-[-50px] right-[-150px] w-[400px] h-[300px] blob-oblong-blue pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-100px] w-[350px] h-[350px] blob-green pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Outer glassmorphic box with ticker-matching gradient */}
        <div
          className="relative rounded-3xl border border-white/20 backdrop-blur-md overflow-hidden p-8 sm:p-12"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 15% 20%, rgba(28,250,118,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 70% at 85% 15%, rgba(99,89,234,0.07) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 60% 80%, rgba(255,179,71,0.06) 0%, transparent 50%),
              radial-gradient(ellipse 40% 40% at 30% 70%, rgba(99,89,234,0.05) 0%, transparent 45%),
              radial-gradient(ellipse 70% 50% at 90% 60%, rgba(28,250,118,0.06) 0%, transparent 50%),
              radial-gradient(ellipse 45% 45% at 50% 30%, rgba(255,179,71,0.05) 0%, transparent 45%),
              linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%)
            `,
            boxShadow: "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 block">
              ● Working with businesses worldwide
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Check out our <span className="text-gradient-green">showreel</span>
            </h2>
          </motion.div>

          <motion.div
            className="relative rounded-2xl overflow-hidden border border-black/10 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ padding: "56.25% 0 0 0", position: "relative" }}
          >
            {playing ? (
              <iframe
                src="https://player.vimeo.com/video/1103156714?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&autoplay=1"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                title="Showreel"
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="absolute top-0 left-0 w-full h-full group cursor-pointer"
              >
                <img
                  src={showreelThumb}
                  alt="Showreel thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                  </div>
                </div>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Showreel;
