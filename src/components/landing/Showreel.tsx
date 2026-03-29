import { motion } from "framer-motion";
import { useState } from "react";
import { Play } from "lucide-react";
import showreelThumb from "@/assets/showreel-thumb.png";

const Showreel = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-20 sm:py-28 px-6">

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Outer glassmorphic box with ticker-matching gradient */}
        <div
          className="relative rounded-3xl border border-white/20 backdrop-blur-md overflow-hidden p-8 sm:p-12"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,179,71,0.15) 25%, rgba(255,255,255,0.9) 40%, rgba(99,89,234,0.12) 60%, rgba(255,255,255,0.88) 75%, rgba(28,250,118,0.12) 100%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
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
