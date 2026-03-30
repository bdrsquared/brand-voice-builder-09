import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { CaseStudyData } from "@/pages/CaseStudy";

const CaseStudyEpisodes = ({ data }: { data: CaseStudyData }) => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="absolute bottom-[-80px] left-[-10%] w-[450px] h-[350px] blob-oblong-blue pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary mb-4">
            Watch the <span className="text-gradient-green">content</span>
          </h2>
          <p className="text-base text-text-secondary font-body max-w-xl">
            Featured episodes from the series.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {data.episodes.map((ep, i) => (
            <motion.div
              key={ep.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group flex items-center gap-5 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 pr-6 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-400 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0">
                <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg text-text-primary group-hover:text-primary transition-colors duration-300 truncate">
                  {ep.title}
                </h3>
                <p className="text-sm text-text-tertiary font-body">{ep.guest}</p>
              </div>

              {/* Duration */}
              {ep.duration && (
                <span className="hidden sm:block text-sm text-text-tertiary font-body shrink-0">
                  {ep.duration}
                </span>
              )}

              {/* Play icon  -  always visible */}
              <div className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center shrink-0 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
                <Play className="w-4 h-4 text-text-tertiary group-hover:text-primary transition-colors duration-300 fill-current" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyEpisodes;
