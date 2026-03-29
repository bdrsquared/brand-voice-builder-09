import { motion } from "framer-motion";
import { useState } from "react";
import { Play } from "lucide-react";
import showreelThumb from "@/assets/showreel-thumb.png";

const Showreel = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-20 sm:py-28 px-6">

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-emerald-600 font-medium text-sm mb-4 block">
            ● Working with businesses worldwide
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Check out our <span className="text-gradient-green sm:inline"><span className="sm:hidden text-gray-500">showreel</span><span className="hidden sm:inline">showreel</span></span>
          </h2>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative" style={{ paddingTop: 'clamp(120%, 120%, 120%)' }}>
            <div className="sm:hidden absolute inset-0">
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
                    className="w-full h-full object-cover object-[70%_center]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-black/40">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
          {/* Desktop: standard 16:9 */}
          <div className="hidden sm:block relative" style={{ paddingTop: '56.25%' }}>
            <div className="absolute inset-0">
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
                    <div className="w-24 h-24 rounded-full bg-black/30 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-black/40">
                      <Play className="w-10 h-10 text-white fill-white ml-1" />
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Showreel;
