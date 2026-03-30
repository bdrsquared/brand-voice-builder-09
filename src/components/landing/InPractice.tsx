import { motion } from "framer-motion";
import { Video, Scissors, Share2, Library, Calendar, Mic, BarChart3, Sparkles } from "lucide-react";
import microphoneImg from "@/assets/earworm-microphone.png";
import booksImg from "@/assets/earworm-books.png";

const InPractice = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 font-medium text-sm mb-4 text-light-text-tertiary">
            ● What this looks like in practice
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-2 text-light-text-primary">
            A repeatable system.
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-light-text-tertiary">
            Not ad hoc content.
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 - Large span */}
          <motion.div
            className="sm:col-span-2 relative overflow-hidden rounded-2xl min-h-[280px] flex flex-col justify-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Background image */}
            <img src={microphoneImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            {/* CSS grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="absolute top-[-60px] right-6 flex gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white/80" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-white/80" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl text-white font-heading font-medium mb-2">
                Record once, distribute everywhere
              </h3>
              <p className="text-sm text-white/70 font-body max-w-md leading-relaxed">
                Every month, you sit down for a conversation. We turn it into a full content engine that keeps your brand visible and top of mind.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/15 text-white/90">Fully managed</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/15 text-white/90">Monthly sessions</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/15 text-white/90">All platforms</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Tall */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 sm:p-8 min-h-[280px] flex flex-col justify-between border border-black/[0.08] bg-white/60 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="w-11 h-11 rounded-xl bg-black/[0.06] backdrop-blur-sm border border-black/[0.08] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-light-text-secondary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl text-light-text-primary font-heading font-medium mb-2">
                Short-form clips
              </h3>
              <p className="text-sm text-light-text-secondary font-body leading-relaxed">
                Dozens of clips cut for social and paid channels from every session.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/[0.06] border border-black/[0.08] text-light-text-secondary">Reels</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/[0.06] border border-black/[0.08] text-light-text-secondary">Shorts</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/[0.06] border border-black/[0.08] text-light-text-secondary">TikTok</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 sm:p-8 min-h-[220px] flex flex-col justify-between border border-black/[0.08] bg-white/60 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <div className="w-11 h-11 rounded-xl bg-black/[0.06] backdrop-blur-sm border border-black/[0.08] flex items-center justify-center">
              <Share2 className="w-5 h-5 text-light-text-secondary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl text-light-text-primary font-heading font-medium mb-2">
                Multi-platform distribution
              </h3>
              <p className="text-sm text-light-text-secondary font-body leading-relaxed">
                LinkedIn, YouTube, Spotify, Apple — everywhere your audience lives.
              </p>
            </div>
          </motion.div>

          {/* Card 4 - Accent with books background */}
          <motion.div
            className="relative overflow-hidden rounded-2xl min-h-[220px] flex flex-col justify-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <img src={booksImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-white/10" />
            <div className="relative z-10 p-6 sm:p-8">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-4">
                <Library className="w-5 h-5 text-white/80" />
              </div>
              <h3 className="text-lg sm:text-xl text-white font-heading font-medium mb-2">
                Growing content library
              </h3>
              <p className="text-sm text-white/70 font-body leading-relaxed">
                An ever-expanding asset library that compounds in value and works 24/7.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/15 text-white/90">Evergreen</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/15 text-white/90">Searchable</span>
              </div>
            </div>
          </motion.div>

          {/* Card 5 */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 sm:p-8 min-h-[220px] flex flex-col justify-between border border-black/[0.08] bg-white/60 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-black/[0.06] backdrop-blur-sm border border-black/[0.08] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-light-text-secondary" />
              </div>
              <div className="w-11 h-11 rounded-xl bg-black/[0.06] backdrop-blur-sm border border-black/[0.08] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-light-text-secondary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl text-light-text-primary font-heading font-medium mb-2">
                Long-form episodes
              </h3>
              <p className="text-sm text-light-text-secondary font-body leading-relaxed">
                Full podcast episodes published and optimised across all major platforms.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">Video</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">Audio</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InPractice;
